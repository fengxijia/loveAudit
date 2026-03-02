from typing import Dict, Optional

from fastapi import APIRouter
from pydantic import BaseModel

from app.services.scoring_service import (
    aggregate_tags,
    apply_adjustments,
    compute_risk_score,
    determine_verdict,
    get_personality_weight_adjustments,
)

router = APIRouter()


class AnswerValue(BaseModel):
    value: str
    tags: Dict[str, float] = {}


class SubmitRequest(BaseModel):
    answers: Dict[str, AnswerValue]
    userPersonality: Optional[str] = None
    partnerPersonality: Optional[str] = None
    freeformText: str = ""


@router.post("/assessment/submit")
async def submit_assessment(request: SubmitRequest):
    answers_dict = {k: v.model_dump() for k, v in request.answers.items()}

    tags = aggregate_tags(answers_dict)

    adjustments = get_personality_weight_adjustments(
        request.userPersonality, request.partnerPersonality
    )
    adjusted_tags = apply_adjustments(tags, adjustments)

    risk_score = compute_risk_score(adjusted_tags)
    verdict = determine_verdict(risk_score)

    return {
        "riskScore": risk_score,
        "verdict": verdict,
        "tagsSummary": adjusted_tags,
    }
