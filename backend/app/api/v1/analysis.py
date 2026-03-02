import json
from typing import Dict, Optional

from fastapi import APIRouter
from pydantic import BaseModel
from sse_starlette.sse import EventSourceResponse

from app.services.llm_service import get_llm_service
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


class StreamAnalysisRequest(BaseModel):
    answers: Dict[str, AnswerValue]
    userPersonality: Optional[str] = None
    partnerPersonality: Optional[str] = None
    freeformText: str = ""


async def analysis_event_generator(
    answers_dict: Dict[str, dict],
    user_personality: Optional[str],
    partner_personality: Optional[str],
    freeform_text: str,
):
    # Compute scores
    tags = aggregate_tags(answers_dict)
    adjustments = get_personality_weight_adjustments(user_personality, partner_personality)
    adjusted_tags = apply_adjustments(tags, adjustments)
    risk_score = compute_risk_score(adjusted_tags)
    verdict = determine_verdict(risk_score)

    llm_service = get_llm_service()

    try:
        yield {
            "event": "start",
            "data": json.dumps({"status": "started", "riskScore": risk_score, "verdict": verdict}),
        }

        buffer = ""
        async for chunk in llm_service.stream_analysis(
            answers_dict, user_personality, partner_personality,
            freeform_text, adjusted_tags, risk_score, verdict,
        ):
            buffer += chunk
            yield {
                "event": "chunk",
                "data": json.dumps({"content": chunk}),
            }

        # Try to parse complete response as JSON
        try:
            result = json.loads(buffer)
            yield {
                "event": "complete",
                "data": json.dumps({"status": "complete", "result": result}),
            }
        except json.JSONDecodeError:
            yield {
                "event": "complete",
                "data": json.dumps({"status": "complete", "text": buffer}),
            }

    except Exception as e:
        yield {
            "event": "error",
            "data": json.dumps({"error": str(e)}),
        }


@router.post("/analysis/stream")
async def stream_analysis(request: StreamAnalysisRequest):
    answers_dict = {k: v.model_dump() for k, v in request.answers.items()}

    return EventSourceResponse(
        analysis_event_generator(
            answers_dict,
            request.userPersonality,
            request.partnerPersonality,
            request.freeformText,
        )
    )
