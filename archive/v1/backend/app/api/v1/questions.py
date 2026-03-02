import json
from pathlib import Path
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

# Load questions data
QUESTIONS_FILE = Path(__file__).parent.parent.parent / "data" / "questions.json"


def load_questions() -> Dict[str, Any]:
    """Load questions from JSON file."""
    try:
        with open(QUESTIONS_FILE, encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Questions data not found")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Invalid questions data format")


class Dimension(BaseModel):
    id: str
    name: str
    name_en: str
    description: str
    weight: int


class QuestionOption(BaseModel):
    value: str
    label: str


class FollowUp(BaseModel):
    condition: str
    question: str
    placeholder: Optional[str] = None


class ScaleLabels(BaseModel):
    left: str
    center: str
    right: str


class Question(BaseModel):
    id: int
    dimension: str
    type: str
    question: str
    placeholder: Optional[str] = None
    hint: Optional[str] = None
    required: bool = True
    minLength: Optional[int] = None
    options: Optional[List[QuestionOption]] = None
    followUp: Optional[FollowUp] = None
    scaleLabels: Optional[ScaleLabels] = None
    scaleRange: Optional[List[int]] = None
    maxSelections: Optional[int] = None


class Phase(BaseModel):
    name: str
    questions: List[int]
    title: str


class Metadata(BaseModel):
    totalQuestions: int
    estimatedTime: str
    phases: List[Phase]


class QuestionsResponse(BaseModel):
    dimensions: Dict[str, Dimension]
    questions: List[Question]
    metadata: Metadata


class QuestionResponse(BaseModel):
    question: Question
    dimension: Dimension


@router.get("/questions", response_model=QuestionsResponse)
async def get_all_questions():
    """Get all assessment questions with dimensions and metadata."""
    data = load_questions()
    return QuestionsResponse(**data)


@router.get("/questions/{question_id}", response_model=QuestionResponse)
async def get_question(question_id: int):
    """Get a specific question by ID."""
    data = load_questions()
    questions = data["questions"]
    dimensions = data["dimensions"]

    question = next((q for q in questions if q["id"] == question_id), None)
    if not question:
        raise HTTPException(status_code=404, detail=f"Question {question_id} not found")

    dimension = dimensions.get(question["dimension"])
    if not dimension:
        raise HTTPException(status_code=500, detail="Dimension not found for question")

    return QuestionResponse(
        question=Question(**question),
        dimension=Dimension(**dimension),
    )


@router.get("/dimensions", response_model=Dict[str, Dimension])
async def get_dimensions():
    """Get all evaluation dimensions."""
    data = load_questions()
    return {k: Dimension(**v) for k, v in data["dimensions"].items()}
