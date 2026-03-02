import json
import uuid
from pathlib import Path
from typing import Any, Dict, List, Optional, Union

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.services.llm_service import get_llm_service
from app.services.scoring_service import ScoringService

router = APIRouter()

# Load questions data for validation
QUESTIONS_FILE = Path(__file__).parent.parent.parent / "data" / "questions.json"


def load_questions_data() -> Dict[str, Any]:
    """Load questions from JSON file."""
    with open(QUESTIONS_FILE, encoding="utf-8") as f:
        return json.load(f)


class AnswerValue(BaseModel):
    """A single answer value."""

    value: Union[str, int, List[str]]
    followUp: Optional[str] = None


class SubmitAnswersRequest(BaseModel):
    """Request body for submitting answers."""

    answers: Dict[str, AnswerValue] = Field(
        ..., description="Map of question ID to answer value"
    )


class DimensionScoreResponse(BaseModel):
    """Score for a single dimension."""

    dimension_id: str
    name: str
    name_en: str
    score: float
    weight: int
    insight: Optional[str] = None


class AssessmentResultResponse(BaseModel):
    """Complete assessment result."""

    id: str
    total_score: float
    dimension_scores: List[DimensionScoreResponse]
    overall_assessment: str
    strengths: List[str]
    areas_of_attention: List[str]
    recommendations: List[str]
    closing_message: str
    completion_rate: float


class ValidateAnswerRequest(BaseModel):
    """Request to validate a single answer."""

    question_id: int
    answer: AnswerValue


class ValidateAnswerResponse(BaseModel):
    """Response for answer validation."""

    valid: bool
    message: Optional[str] = None


@router.post("/assessment/submit", response_model=AssessmentResultResponse)
async def submit_assessment(request: SubmitAnswersRequest):
    """Submit all answers and get assessment results."""
    data = load_questions_data()
    questions = data["questions"]
    dimensions = data["dimensions"]

    # Convert string keys to int for answers
    answers = {int(k): v.model_dump() for k, v in request.answers.items()}

    # Validate minimum answers
    required_questions = [q for q in questions if q.get("required", True)]
    answered_required = sum(1 for q in required_questions if q["id"] in answers)

    if answered_required < len(required_questions) * 0.7:
        raise HTTPException(
            status_code=400,
            detail=f"至少需要回答 {int(len(required_questions) * 0.7)} 个必答问题",
        )

    # Calculate preliminary scores
    scoring_service = ScoringService(dimensions)
    preliminary_result = scoring_service.calculate_preliminary_scores(answers, questions)

    # Get LLM analysis
    llm_service = get_llm_service()
    try:
        llm_analysis = await llm_service.analyze_assessment(answers, questions, dimensions)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"分析服务出错: {str(e)}")

    # Extract scores from LLM response
    if "error" in llm_analysis:
        # Fallback to preliminary scores if LLM fails
        llm_scores = {
            dim_id: score.raw_score
            for dim_id, score in preliminary_result.dimension_scores.items()
        }
        llm_analysis = {
            "scores": llm_scores,
            "overall_assessment": "基于您的回答，我们进行了初步分析。",
            "strengths": ["感谢您认真完成问卷"],
            "areas_of_attention": [],
            "recommendations": ["建议稍后重试以获得更详细的分析"],
            "dimension_insights": {},
            "closing_message": "祝您和伴侣幸福美满！",
        }
    else:
        llm_scores = llm_analysis.get("scores", {})

    # Update scores with LLM analysis
    final_result = scoring_service.update_scores_from_llm(preliminary_result, llm_scores)

    # Build response
    dimension_scores = []
    for dim_id, dim_info in dimensions.items():
        if dim_id == "warmup":
            continue

        score_data = final_result.dimension_scores.get(dim_id)
        insight = llm_analysis.get("dimension_insights", {}).get(dim_id, "")

        dimension_scores.append(
            DimensionScoreResponse(
                dimension_id=dim_id,
                name=dim_info["name"],
                name_en=dim_info["name_en"],
                score=score_data.raw_score if score_data else 0,
                weight=dim_info["weight"],
                insight=insight,
            )
        )

    return AssessmentResultResponse(
        id=str(uuid.uuid4()),
        total_score=llm_analysis.get("total_score", final_result.total_score),
        dimension_scores=dimension_scores,
        overall_assessment=llm_analysis.get("overall_assessment", ""),
        strengths=llm_analysis.get("strengths", []),
        areas_of_attention=llm_analysis.get("areas_of_attention", []),
        recommendations=llm_analysis.get("recommendations", []),
        closing_message=llm_analysis.get("closing_message", ""),
        completion_rate=final_result.completion_rate,
    )


@router.post("/assessment/validate", response_model=ValidateAnswerResponse)
async def validate_answer(request: ValidateAnswerRequest):
    """Validate a single answer before submission."""
    data = load_questions_data()
    questions = data["questions"]

    question = next((q for q in questions if q["id"] == request.question_id), None)
    if not question:
        raise HTTPException(status_code=404, detail="问题不存在")

    answer = request.answer
    q_type = question.get("type", "text")
    min_length = question.get("minLength", 0)

    # Validate based on question type
    if q_type == "text":
        value = str(answer.value) if answer.value else ""
        if len(value) < min_length:
            return ValidateAnswerResponse(
                valid=False,
                message=f"回答至少需要 {min_length} 个字符",
            )

    elif q_type == "choice":
        options = question.get("options", [])
        valid_values = [opt["value"] for opt in options]
        if answer.value not in valid_values:
            return ValidateAnswerResponse(
                valid=False,
                message="请选择一个有效的选项",
            )

    elif q_type == "multiChoice":
        if not isinstance(answer.value, list):
            return ValidateAnswerResponse(
                valid=False,
                message="请选择一个或多个选项",
            )
        max_selections = question.get("maxSelections", 10)
        if len(answer.value) > max_selections:
            return ValidateAnswerResponse(
                valid=False,
                message=f"最多只能选择 {max_selections} 个选项",
            )

    elif q_type == "scale":
        scale_range = question.get("scaleRange", [1, 5])
        try:
            value = int(answer.value)
            if not (scale_range[0] <= value <= scale_range[1]):
                return ValidateAnswerResponse(
                    valid=False,
                    message=f"请选择 {scale_range[0]} 到 {scale_range[1]} 之间的值",
                )
        except (ValueError, TypeError):
            return ValidateAnswerResponse(
                valid=False,
                message="请选择一个有效的数值",
            )

    return ValidateAnswerResponse(valid=True)
