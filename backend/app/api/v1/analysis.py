import json
import logging
import time
from typing import Dict, Optional

from fastapi import APIRouter

logger = logging.getLogger(__name__)
from pydantic import BaseModel
from sse_starlette.sse import EventSourceResponse

from app.data.questions_data import lookup_tags
from app.services.llm_service import get_llm_service
from app.services.scoring_service import (
    MIN_MEANINGFUL_ANSWERS,
    aggregate_tags,
    apply_adjustments,
    compute_dimension_scores,
    count_meaningful_answers,
    detect_warnings,
    determine_result_type,
    get_personality_weight_adjustments,
)

router = APIRouter()


class AnswerValue(BaseModel):
    value: str
    questionText: str = ""
    selectedLabel: str = ""


class StreamAnalysisRequest(BaseModel):
    answers: Dict[str, AnswerValue]
    userPersonality: Optional[str] = None
    partnerPersonality: Optional[str] = None
    freeformText: str = ""
    locale: str = "zh"


async def analysis_event_generator(
    answers_dict: Dict[str, dict],
    user_personality: Optional[str],
    partner_personality: Optional[str],
    freeform_text: str,
    locale: str = "zh",
):
    # ── Check for insufficient data ──
    meaningful = count_meaningful_answers(answers_dict)
    if meaningful < MIN_MEANINGFUL_ANSWERS:
        if locale == "en":
            insufficient_result = {
                "scores": {"safety": 0, "compatibility": 0, "repair": 0},
                "resultType": "insufficient_data",
                "resultLabel": "I Have No Idea 🤡",
                "riskTier": "low",
                "warnings": [],
                "summaryLine": f"You only answered {meaningful} questions seriously — I really can't work with that.",
                "insights": [
                    "You skipped most questions, so the system has almost no data about your relationship.",
                    "It's like asking a doctor to diagnose you through a wall — I need real data to analyze.",
                    "But hey, you clicked in, which means something is on your mind, right?",
                ],
                "reframe": [
                    {
                        "myth": "Clicking random answers should still give results",
                        "truth": "Garbage in, garbage out. AI isn't fortune-telling — it needs your real experiences to provide meaningful analysis",
                    },
                ],
                "advice": [
                    "Take 3 minutes to redo it properly, without skipping — your relationship deserves your honest answers",
                    "If you didn't answer because you're 'not sure', that's a signal worth paying attention to",
                ],
                "personaTags": ["Mystery Player", "Quantum Love", "Schrodinger's Partner"],
                "warningBlock": None,
            }
        else:
            insufficient_result = {
                "scores": {"safety": 0, "compatibility": 0, "repair": 0},
                "resultType": "insufficient_data",
                "resultLabel": "我不知道 🤡",
                "riskTier": "low",
                "warnings": [],
                "summaryLine": f"你只认真回答了 {meaningful} 道题，我实在编不下去了。",
                "insights": [
                    "你跳过了大部分问题，系统几乎没拿到关于你们关系的信息。",
                    "这就像让医生隔着墙诊脉——我再厉害也得有数据才能分析。",
                    "不过你愿意点进来，说明心里还是有疑问的，对吧？",
                ],
                "reframe": [
                    {
                        "myth": "随便选选也能测出结果",
                        "truth": "垃圾进，垃圾出。AI 不是算命，需要你的真实经历才能给出有意义的分析",
                    },
                ],
                "advice": [
                    "认真花 3 分钟重新做一遍，这次别跳过——你的关系值得你认真对待",
                    "如果你不想回答是因为'不确定'，那也是一种信号，值得留意",
                ],
                "personaTags": ["神秘选手", "量子态恋爱", "薛定谔的伴侣"],
                "warningBlock": None,
            }
        yield {
            "event": "start",
            "data": json.dumps({
                "status": "started",
                "scores": insufficient_result["scores"],
                "resultType": "insufficient_data",
                "resultLabel": insufficient_result["resultLabel"],
                "riskTier": "low",
                "warnings": [],
            }),
        }
        yield {
            "event": "complete",
            "data": json.dumps({"status": "complete", "result": insufficient_result}),
        }
        return

    # ── Compute scores ──
    tags = aggregate_tags(answers_dict)
    adjustments = get_personality_weight_adjustments(user_personality, partner_personality)
    adjusted_tags = apply_adjustments(tags, adjustments)
    scores = compute_dimension_scores(adjusted_tags)
    warnings = detect_warnings(adjusted_tags)
    result_type, result_label, risk_tier = determine_result_type(scores, adjusted_tags)

    # Translate result label for English locale
    if locale == "en":
        EN_LABELS = {
            "high_risk": "High Risk",
            "boundary_imbalance": "Boundary Imbalance",
            "high_drain": "High Drain",
            "reality_gap": "Reality Gap",
            "angel_couple": "Angel Couple",
            "grinding_growth": "Growing Through It",
        }
        result_label = EN_LABELS.get(result_type, result_label)

    # Visible scores (exclude hidden drain)
    visible_scores = {
        "safety": scores["safety"],
        "compatibility": scores["compatibility"],
        "repair": scores["repair"],
    }

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
            "data": json.dumps({
                "status": "started",
                "scores": visible_scores,
                "resultType": result_type,
                "resultLabel": result_label,
                "riskTier": risk_tier,
                "warnings": warnings,
            }),
        }

        buffer = ""
        deadline = time.monotonic() + 90
        timed_out = False

        async for chunk in llm_service.stream_analysis(
            answers_dict, user_personality, partner_personality,
            freeform_text, adjusted_tags, scores, result_type, result_label, risk_tier,
            locale=locale,
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
        stripped = buffer.strip()
        if stripped.startswith("```"):
            first_newline = stripped.find("\n")
            if first_newline != -1:
                stripped = stripped[first_newline + 1:]
            if stripped.endswith("```"):
                stripped = stripped[:-3].strip()

        try:
            llm_result = json.loads(stripped)
        except json.JSONDecodeError:
            llm_result = {}

        # Merge backend-computed fields with LLM-generated narrative
        merged = {
            "scores": visible_scores,
            "resultType": result_type,
            "resultLabel": result_label,
            "riskTier": risk_tier,
            "warnings": warnings,
            # LLM fields (with fallbacks)
            "summaryLine": llm_result.get("summaryLine", ""),
            "insights": llm_result.get("insights", []),
            "reframe": llm_result.get("reframe", []),
            "advice": llm_result.get("advice", []),
            "personaTags": llm_result.get("personaTags", []),
            "warningBlock": llm_result.get("warningBlock"),
        }

        yield {
            "event": "complete",
            "data": json.dumps({"status": "complete", "result": merged}),
        }

    except Exception as e:
        logger.error("SSE generator error: %s", e, exc_info=True)
        yield {
            "event": "error",
            "data": json.dumps({"error": str(e)}),
        }


@router.post("/analysis/stream")
async def stream_analysis(request: StreamAnalysisRequest):
    # Look up tags server-side — never trust frontend-provided tags
    answers_dict = {}
    for qid, answer in request.answers.items():
        tags = lookup_tags(int(qid), answer.value)
        answers_dict[qid] = {
            "value": answer.value,
            "tags": tags,
            "questionText": answer.questionText,
            "selectedLabel": answer.selectedLabel,
        }

    return EventSourceResponse(
        analysis_event_generator(
            answers_dict,
            request.userPersonality,
            request.partnerPersonality,
            request.freeformText,
            locale=request.locale,
        )
    )
