from typing import Dict, Optional

from fastapi import APIRouter
from pydantic import BaseModel

from app.data.questions_data import lookup_tags
from app.services.scoring_service import (
    aggregate_tags,
    apply_adjustments,
    compute_dimension_scores,
    detect_warnings,
    determine_result_type,
    get_personality_weight_adjustments,
)

router = APIRouter()


class AnswerValue(BaseModel):
    value: str


class SubmitRequest(BaseModel):
    answers: Dict[str, AnswerValue]
    userPersonality: Optional[str] = None
    partnerPersonality: Optional[str] = None
    freeformText: str = ""


@router.post("/assessment/submit")
async def submit_assessment(request: SubmitRequest):
    # Look up tags server-side — never trust frontend-provided tags
    answers_dict = {}
    for qid, answer in request.answers.items():
        tags = lookup_tags(int(qid), answer.value)
        answers_dict[qid] = {"value": answer.value, "tags": tags}

    tags = aggregate_tags(answers_dict)
    adjustments = get_personality_weight_adjustments(
        request.userPersonality, request.partnerPersonality
    )
    adjusted_tags = apply_adjustments(tags, adjustments)
    scores = compute_dimension_scores(adjusted_tags)
    warnings = detect_warnings(adjusted_tags)
    result_type, result_label, risk_tier = determine_result_type(scores, adjusted_tags)

    return {
        "scores": {
            "safety": scores["safety"],
            "compatibility": scores["compatibility"],
            "repair": scores["repair"],
        },
        "resultType": result_type,
        "resultLabel": result_label,
        "riskTier": risk_tier,
        "warnings": warnings,
        "tagsSummary": adjusted_tags,
    }
