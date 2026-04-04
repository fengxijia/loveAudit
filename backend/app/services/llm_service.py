from __future__ import annotations

import logging
from pathlib import Path
from typing import AsyncGenerator, Dict, Optional

import openai

from app.config import get_settings

logger = logging.getLogger(__name__)

PROMPTS_DIR = Path(__file__).parent.parent / "prompts"


def load_prompt(name: str) -> str:
    prompt_file = PROMPTS_DIR / f"{name}.txt"
    if prompt_file.exists():
        return prompt_file.read_text(encoding="utf-8")
    return ""


class LLMService:
    def __init__(self):
        settings = get_settings()
        if not settings.api_key:
            raise ValueError("API_KEY environment variable is not set")
        self.client = openai.OpenAI(
            api_key=settings.api_key,
            base_url=settings.api_endpoint if settings.api_endpoint else None,
        )
        self.model = settings.model

    async def stream_analysis(
        self,
        answers: Dict[str, dict],
        user_personality: Optional[str],
        partner_personality: Optional[str],
        freeform_text: str,
        tags_summary: Dict[str, float],
        scores: Dict[str, float],
        result_type: str,
        result_label: str,
        risk_tier: str,
    ) -> AsyncGenerator[str, None]:
        system_prompt = load_prompt("analysis_system")
        user_prompt = self._build_prompt(
            answers, user_personality, partner_personality,
            freeform_text, tags_summary, scores, result_type, result_label, risk_tier,
        )

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.7,
            stream=True,
            timeout=60,
        )

        try:
            for chunk in response:
                if chunk.choices and chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
        except Exception as e:
            logger.error("Error during LLM streaming: %s", e, exc_info=True)
            raise

    def _build_prompt(
        self,
        answers: Dict[str, dict],
        user_personality: Optional[str],
        partner_personality: Optional[str],
        freeform_text: str,
        tags_summary: Dict[str, float],
        scores: Dict[str, float],
        result_type: str,
        result_label: str,
        risk_tier: str,
    ) -> str:
        parts: list[str] = []

        # ── Full question text + user selection ──
        parts.append("## 用户完整答题记录\n")
        for qid, answer in sorted(answers.items(), key=lambda x: int(x[0])):
            q_text = answer.get("questionText", f"题目{qid}")
            selected = answer.get("selectedLabel", answer.get("value", "N/A"))
            parts.append(f"**{q_text}**")
            parts.append(f"用户选择：{selected}\n")

        # ── Personality types ──
        parts.append("## 性格类型")
        parts.append(f"用户: {user_personality or '未知'}")
        parts.append(f"伴侣: {partner_personality or '未知'}")

        # ── Freeform text ──
        if freeform_text:
            parts.append(f"\n## 用户补充说明\n{freeform_text}")

        # ── Tag summary ──
        parts.append("\n## 心理标签汇总")
        for tag, score in sorted(tags_summary.items(), key=lambda x: -x[1]):
            parts.append(f"- {tag}: {score}")

        # ── Backend pre-computed results ──
        parts.append("\n## 系统预评估")
        parts.append(f"关系类型: {result_label} ({result_type})")
        parts.append(f"风险等级: {risk_tier}")
        parts.append(f"安全指数: {scores.get('safety', 50)}/100")
        parts.append(f"适配指数: {scores.get('compatibility', 50)}/100")
        parts.append(f"修复指数: {scores.get('repair', 50)}/100")
        parts.append(f"消耗程度: {scores.get('drain', 30)}/100")

        parts.append("\n请根据以上数据，紧扣用户的具体回答，生成分析报告。"
                     "insights 部分必须引用用户的实际选择来分析，不要泛泛而谈。")
        return "\n".join(parts)


_llm_service: Optional[LLMService] = None


def get_llm_service() -> LLMService:
    global _llm_service
    if _llm_service is None:
        _llm_service = LLMService()
    return _llm_service
