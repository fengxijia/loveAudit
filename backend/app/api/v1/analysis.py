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


def _fallback_warning_block(
    warnings: list[dict],
    result_type: str,
) -> Optional[str]:
    if warnings:
        return warnings[0]["message"]
    if result_type == "high_risk":
        return "这段关系已经出现较明显的风险信号，建议优先关注安全与边界，而不是继续解释对方的动机。"
    return None


def _fallback_narrative(
    visible_scores: Dict[str, float],
    result_type: str,
    result_label: str,
    warnings: list[dict],
    llm_unavailable_reason: Optional[str] = None,
) -> dict:
    score_pairs = sorted(visible_scores.items(), key=lambda item: item[1])
    weakest_dimension, weakest_score = score_pairs[0]
    strongest_dimension, strongest_score = score_pairs[-1]

    dimension_labels = {
        "safety": "安全",
        "compatibility": "适配",
        "repair": "修复",
    }

    result_summaries = {
        "angel_couple": "整体指标稳定，关系基础较完整，短期内没有明显高风险信号。",
        "grinding_growth": "这段关系并非没有问题，但仍存在继续磨合和修复的空间。",
        "reality_gap": "关系里的落差更多来自现实协作与长期安排，而不只是情绪波动。",
        "high_drain": "这段关系的主要问题不是单次争执，而是持续消耗和修复乏力。",
        "boundary_imbalance": "当前最需要处理的，是边界不清与关系权重失衡的问题。",
        "high_risk": "系统已经识别到较明显的风险信号，应优先处理安全与边界问题。",
    }

    weakest_guidance = {
        "safety": "先确认相处中是否存在反复越界、控制、羞辱或让你持续不安的情形。",
        "compatibility": "重点回看你们在现实安排、价值排序和长期规划上是否真的一致。",
        "repair": "重点观察冲突发生后能不能被收住，还是总在重复旧问题。",
    }

    summary = result_summaries.get(result_type, "系统已根据作答完成结构化判断。")
    if llm_unavailable_reason:
        summary = f"{summary} 当前结果已自动切换为基础结构化报告。"

    insights = [
        f"当前结果判定为“{result_label}”，三项核心指标中，{dimension_labels[strongest_dimension]}相对较强（{strongest_score}/100），说明这部分暂时是关系中的支撑点。",
        f"{dimension_labels[weakest_dimension]}是当前最弱的一项（{weakest_score}/100），{weakest_guidance[weakest_dimension]}",
    ]
    if warnings:
        insights.append(f"系统还识别到额外风险提示：{warnings[0]['message']}")
    else:
        insights.append("当前没有触发额外硬警告，判断重点更多在长期适配和修复能力上。")

    reframes = [
        {
            "myth": "只要还有感情，问题就可以以后再说",
            "truth": "长期关系能否走下去，往往取决于安全、边界、修复和现实协作是否能稳定成立。",
        },
        {
            "myth": "只看一次争执就能判断关系好坏",
            "truth": "更关键的是这些问题是不是反复出现，以及出现后能不能被真正修复。",
        },
    ]

    advice = [
        "先围绕最低分维度复盘一次，把最具体的不舒服场景写下来，而不是只讨论感受对错。",
        "如果存在边界、控制或羞辱问题，优先把规则和底线说清，再谈如何继续投入。",
        "这份结果已经可以用于沟通和复盘；如果后续模型服务可用，再补一版更细的文字分析即可。",
    ]

    persona_tags = ["结构化结果", "基础报告"]
    if llm_unavailable_reason:
        persona_tags.append("自动降级")

    return {
        "scores": visible_scores,
        "resultType": result_type,
        "resultLabel": result_label,
        "riskTier": "high" if result_type == "high_risk" else ("medium" if result_type in {"boundary_imbalance", "high_drain"} else "low"),
        "warnings": warnings,
        "summaryLine": summary,
        "insights": insights,
        "reframe": reframes,
        "advice": advice,
        "personaTags": persona_tags,
        "warningBlock": _fallback_warning_block(warnings, result_type),
    }


class AnswerValue(BaseModel):
    value: str
    order: int = 0
    questionText: str = ""
    selectedLabel: str = ""


class StreamAnalysisRequest(BaseModel):
    answers: Dict[str, AnswerValue]
    assessmentMode: Optional[str] = None
    userPersonality: Optional[str] = None
    partnerPersonality: Optional[str] = None
    freeformText: str = ""


async def analysis_event_generator(
    answers_dict: Dict[str, dict],
    assessment_mode: Optional[str],
    user_personality: Optional[str],
    partner_personality: Optional[str],
    freeform_text: str,
):
    # ── Check for insufficient data ──
    meaningful = count_meaningful_answers(answers_dict)
    if meaningful < MIN_MEANINGFUL_ANSWERS:
        insufficient_result = {
            "scores": {"safety": 0, "compatibility": 0, "repair": 0},
            "resultType": "insufficient_data",
            "resultLabel": "信息不足",
            "riskTier": "low",
            "warnings": [],
            "summaryLine": f"当前仅有 {meaningful} 道有效作答，暂时不足以生成稳定结论。",
            "insights": [
                "当前提交的信息量偏少，系统无法判断你们关系中的主要模式。",
                "风险、适配和修复能力都需要基于更完整的作答才能分析。",
                "如果你对这段关系确实有疑问，建议补充更多有效答案后再查看结果。",
            ],
            "reframe": [
                {
                    "myth": "少量作答也能得到可靠结论",
                    "truth": "关系评估依赖足够的行为和感受信息，样本过少时结果容易失真。",
                },
            ],
            "advice": [
                "重新作答一次，尽量减少跳题和空题。",
                "如果你对某些问题长期“不确定”，那本身也值得进一步留意和讨论。",
            ],
            "personaTags": ["信息不足", "建议补充作答"],
            "warningBlock": None,
        }
        yield {
            "event": "start",
            "data": json.dumps({
                "status": "started",
                "scores": insufficient_result["scores"],
                "resultType": "insufficient_data",
                "resultLabel": "信息不足",
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
        fallback_result = _fallback_narrative(
            visible_scores, result_type, result_label, warnings, str(e)
        )
        yield {
            "event": "complete",
            "data": json.dumps({"status": "complete", "result": fallback_result}),
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
            answers_dict, assessment_mode, user_personality, partner_personality,
            freeform_text, adjusted_tags, scores, result_type, result_label, risk_tier,
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

        if not buffer.strip():
            fallback_result = _fallback_narrative(
                visible_scores, result_type, result_label, warnings, "llm_unavailable"
            )
            yield {
                "event": "complete",
                "data": json.dumps({"status": "complete", "result": fallback_result}),
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
        fallback_result = _fallback_narrative(
            visible_scores, result_type, result_label, warnings, str(e)
        )
        yield {
            "event": "complete",
            "data": json.dumps({"status": "complete", "result": fallback_result}),
        }


@router.post("/analysis/stream")
async def stream_analysis(request: StreamAnalysisRequest):
    # Look up tags server-side — never trust frontend-provided tags
    answers_dict = {}
    for qid, answer in request.answers.items():
        tags = lookup_tags(int(qid), answer.value)
        answers_dict[qid] = {
            "value": answer.value,
            "order": answer.order,
            "tags": tags,
            "questionText": answer.questionText,
            "selectedLabel": answer.selectedLabel,
        }

    return EventSourceResponse(
        analysis_event_generator(
            answers_dict,
            request.assessmentMode,
            request.userPersonality,
            request.partnerPersonality,
            request.freeformText,
        )
    )
