import json
from pathlib import Path
from typing import Any, Dict, List, Optional, Union

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from sse_starlette.sse import EventSourceResponse

from app.services.llm_service import get_llm_service

router = APIRouter()

# Load questions data
QUESTIONS_FILE = Path(__file__).parent.parent.parent / "data" / "questions.json"


def load_questions_data() -> Dict[str, Any]:
    """Load questions from JSON file."""
    with open(QUESTIONS_FILE, encoding="utf-8") as f:
        return json.load(f)


class AnswerValue(BaseModel):
    """A single answer value."""

    value: Union[str, int, List[str]]
    followUp: Optional[str] = None


class StreamAnalysisRequest(BaseModel):
    """Request body for streaming analysis."""

    answers: Dict[str, AnswerValue] = Field(
        ..., description="Map of question ID to answer value"
    )


class StreamInsightRequest(BaseModel):
    """Request body for streaming dimension insight."""

    dimension: str
    answers: Dict[str, AnswerValue]
    score: float


async def analysis_event_generator(answers: Dict[int, dict]):
    """Generate SSE events for analysis stream."""
    data = load_questions_data()
    questions = data["questions"]
    dimensions = data["dimensions"]

    llm_service = get_llm_service()

    try:
        # Send start event
        yield {
            "event": "start",
            "data": json.dumps({"status": "started", "message": "开始分析您的回答..."})
        }

        # Stream analysis
        buffer = ""
        async for chunk in llm_service.stream_analysis(answers, questions, dimensions):
            buffer += chunk
            yield {
                "event": "chunk",
                "data": json.dumps({"content": chunk})
            }

        # Try to parse complete response as JSON
        try:
            result = json.loads(buffer)
            yield {
                "event": "complete",
                "data": json.dumps({"status": "complete", "result": result})
            }
        except json.JSONDecodeError:
            # If not valid JSON, send as text
            yield {
                "event": "complete",
                "data": json.dumps({"status": "complete", "text": buffer})
            }

    except Exception as e:
        yield {
            "event": "error",
            "data": json.dumps({"error": str(e)})
        }


async def insight_event_generator(
    dimension: str,
    answers: Dict[int, dict],
    score: float,
):
    """Generate SSE events for dimension insight stream."""
    data = load_questions_data()
    questions = data["questions"]

    llm_service = get_llm_service()

    try:
        yield {
            "event": "start",
            "data": json.dumps({"status": "started", "dimension": dimension})
        }

        async for chunk in llm_service.stream_insight(dimension, answers, questions, score):
            yield {
                "event": "chunk",
                "data": json.dumps({"content": chunk})
            }

        yield {
            "event": "complete",
            "data": json.dumps({"status": "complete"})
        }

    except Exception as e:
        yield {
            "event": "error",
            "data": json.dumps({"error": str(e)})
        }


@router.post("/analysis/stream")
async def stream_analysis(request: StreamAnalysisRequest):
    """Stream the full analysis using Server-Sent Events."""
    # Convert string keys to int for answers
    answers = {int(k): v.model_dump() for k, v in request.answers.items()}

    # Validate minimum answers
    data = load_questions_data()
    questions = data["questions"]
    required_questions = [q for q in questions if q.get("required", True)]
    answered_required = sum(1 for q in required_questions if q["id"] in answers)

    if answered_required < len(required_questions) * 0.5:
        raise HTTPException(
            status_code=400,
            detail="回答数量不足，无法进行分析",
        )

    return EventSourceResponse(analysis_event_generator(answers))


@router.post("/analysis/insight/stream")
async def stream_insight(request: StreamInsightRequest):
    """Stream insight for a specific dimension."""
    valid_dimensions = ["affection", "foundation", "conflict", "capability", "background"]

    if request.dimension not in valid_dimensions:
        raise HTTPException(
            status_code=400,
            detail=f"无效的维度。有效维度: {', '.join(valid_dimensions)}",
        )

    # Convert string keys to int for answers
    answers = {int(k): v.model_dump() for k, v in request.answers.items()}

    return EventSourceResponse(
        insight_event_generator(request.dimension, answers, request.score)
    )
