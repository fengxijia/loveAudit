from __future__ import annotations

import logging
import os
from pathlib import Path
from typing import AsyncGenerator, Dict, Optional

import openai

logger = logging.getLogger(__name__)

PROMPTS_DIR = Path(__file__).parent.parent / "prompts"

API_KEY = os.getenv("API_KEY", "")
API_ENDPOINT = os.getenv("API_ENDPOINT", "")
MODEL = os.getenv("MODEL", "gemini-2.0-flash")


def load_prompt(name: str) -> str:
    prompt_file = PROMPTS_DIR / f"{name}.txt"
    if prompt_file.exists():
        return prompt_file.read_text(encoding="utf-8")
    return ""


class LLMService:
    def __init__(self):
        if not API_KEY:
            raise ValueError("API_KEY environment variable is not set")
        self.client = openai.OpenAI(
            api_key=API_KEY,
            base_url=API_ENDPOINT if API_ENDPOINT else None,
        )
        self.model = MODEL

    async def stream_analysis(
        self,
        answers: Dict[str, dict],
        user_personality: Optional[str],
        partner_personality: Optional[str],
        freeform_text: str,
        tags_summary: Dict[str, float],
        risk_score: float,
        verdict: str,
    ) -> AsyncGenerator[str, None]:
        system_prompt = load_prompt("analysis_system")
        user_prompt = self._build_prompt(
            answers, user_personality, partner_personality,
            freeform_text, tags_summary, risk_score, verdict,
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
        risk_score: float,
        verdict: str,
    ) -> str:
        parts = []
        parts.append("## 用户答题数据\n")

        for qid, answer in sorted(answers.items(), key=lambda x: int(x[0])):
            parts.append(f"题目{qid}: 选择={answer.get('value', 'N/A')}")

        parts.append(f"\n## 性格类型")
        parts.append(f"用户: {user_personality or '未知'}")
        parts.append(f"伴侣: {partner_personality or '未知'}")

        if freeform_text:
            parts.append(f"\n## 用户补充说明\n{freeform_text}")

        parts.append(f"\n## 心理标签汇总")
        for tag, score in sorted(tags_summary.items(), key=lambda x: -x[1]):
            parts.append(f"- {tag}: {score}")

        parts.append(f"\n## 初步评估")
        parts.append(f"风险分数: {risk_score}/100")
        parts.append(f"初步判定: {verdict}")

        parts.append("\n请根据以上数据生成完整的分析报告。")
        return "\n".join(parts)


_llm_service: Optional[LLMService] = None


def get_llm_service() -> LLMService:
    global _llm_service
    if _llm_service is None:
        _llm_service = LLMService()
    return _llm_service
