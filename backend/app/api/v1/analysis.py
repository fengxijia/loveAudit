import json
import logging
import time
from typing import Dict, Optional

from fastapi import APIRouter

logger = logging.getLogger(__name__)
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

    try:
        llm_service = get_llm_service()
    except Exception as e:
        logger.error("LLM service init failed: %s", e, exc_info=True)
        yield {
            "event": "error",
            "data": json.dumps({"error": f"LLM 服务初始化失败: {e}"}),
        }
        return

    try:
        yield {
            "event": "start",
            "data": json.dumps({"status": "started", "riskScore": risk_score, "verdict": verdict}),
        }

        buffer = ""
        deadline = time.monotonic() + 90
        timed_out = False

        async for chunk in llm_service.stream_analysis(
            answers_dict, user_personality, partner_personality,
            freeform_text, adjusted_tags, risk_score, verdict,
        ):
            if time.monotonic() > deadline:
                timed_out = True
                break
            buffer += chunk
            yield {
                "event": "chunk",
                "data": json.dumps({"content": chunk}),
            }

        if timed_out:
            logger.warning("LLM streaming timed out after 90s (buffer length=%d)", len(buffer))
            if buffer:
                yield {
                    "event": "complete",
                    "data": json.dumps({"status": "complete", "text": buffer}),
                }
            else:
                yield {
                    "event": "error",
                    "data": json.dumps({"error": "分析超时，请稍后重试"}),
                }
            return

        # Try to parse complete response as JSON
        # Strip markdown code fences if present (e.g. ```json ... ```)
        stripped = buffer.strip()
        if stripped.startswith("```"):
            first_newline = stripped.find("\n")
            if first_newline != -1:
                stripped = stripped[first_newline + 1:]
            if stripped.endswith("```"):
                stripped = stripped[:-3].strip()

        try:
            result = json.loads(stripped)
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
        logger.error("SSE generator error: %s", e, exc_info=True)
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
