from __future__ import annotations

import json
import os
from pathlib import Path
from typing import AsyncGenerator, Dict, List, Optional

import openai

# Load prompt templates
PROMPTS_DIR = Path(__file__).parent.parent / "prompts"

# API configuration from environment variables (OpenAI-compatible)
API_KEY = os.getenv("API_KEY", "")
API_ENDPOINT = os.getenv("API_ENDPOINT", "")
MODEL = os.getenv("MODEL", "gemini-2.0-flash")


def load_prompt(name: str) -> str:
    """Load a prompt template by name."""
    prompt_file = PROMPTS_DIR / f"{name}.txt"
    if prompt_file.exists():
        return prompt_file.read_text(encoding="utf-8")
    return ""


class LLMService:
    """Service for interacting with LLM API (OpenAI-compatible)."""

    def __init__(self):
        if not API_KEY:
            raise ValueError("API_KEY environment variable is not set")
        self.client = openai.OpenAI(
            api_key=API_KEY,
            base_url=API_ENDPOINT if API_ENDPOINT else None,
        )
        self.model = MODEL

    async def analyze_assessment(
        self,
        answers: Dict[int, dict],
        questions: List[dict],
        dimensions: Dict[str, dict],
    ) -> dict:
        """Analyze assessment answers and return scores and insights."""
        system_prompt = load_prompt("analysis_system")
        user_prompt = self._build_analysis_prompt(answers, questions, dimensions)

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                temperature=0.7,
                response_format={"type": "json_object"},
            )
            return json.loads(response.choices[0].message.content)
        except json.JSONDecodeError:
            return {"error": "Failed to parse LLM response", "raw": response.choices[0].message.content}
        except Exception as e:
            return {"error": str(e)}

    async def stream_analysis(
        self,
        answers: Dict[int, dict],
        questions: List[dict],
        dimensions: Dict[str, dict],
    ) -> AsyncGenerator[str, None]:
        """Stream analysis results using SSE."""
        system_prompt = load_prompt("analysis_system")
        user_prompt = self._build_analysis_prompt(answers, questions, dimensions)

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.7,
            stream=True,
        )

        for chunk in response:
            if chunk.choices and chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content

    async def generate_insight(
        self,
        dimension: str,
        answers: Dict[int, dict],
        questions: List[dict],
        score: float,
    ) -> str:
        """Generate insight for a specific dimension."""
        system_prompt = load_prompt("insight_system")
        user_prompt = self._build_insight_prompt(dimension, answers, questions, score)

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.7,
        )

        return response.choices[0].message.content

    async def stream_insight(
        self,
        dimension: str,
        answers: Dict[int, dict],
        questions: List[dict],
        score: float,
    ) -> AsyncGenerator[str, None]:
        """Stream insight generation for a dimension."""
        system_prompt = load_prompt("insight_system")
        user_prompt = self._build_insight_prompt(dimension, answers, questions, score)

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.7,
            stream=True,
        )

        for chunk in response:
            if chunk.choices and chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content

    def _build_analysis_prompt(
        self,
        answers: Dict[int, dict],
        questions: List[dict],
        dimensions: Dict[str, dict],
    ) -> str:
        """Build the analysis prompt with user answers."""
        prompt_parts = ["以下是用户对婚姻评估问卷的回答：\n\n"]

        # Group answers by dimension
        dimension_answers: Dict[str, list] = {}
        for q in questions:
            qid = q["id"]
            if qid in answers:
                dim = q["dimension"]
                if dim not in dimension_answers:
                    dimension_answers[dim] = []
                dimension_answers[dim].append({
                    "question": q["question"],
                    "answer": answers[qid],
                })

        # Format answers by dimension
        for dim_id, dim_info in dimensions.items():
            if dim_id in dimension_answers:
                prompt_parts.append(f"## {dim_info['name']} ({dim_info['name_en']})\n")
                prompt_parts.append(f"权重: {dim_info['weight']}分\n\n")

                for qa in dimension_answers[dim_id]:
                    prompt_parts.append(f"**问题**: {qa['question']}\n")
                    answer_data = qa["answer"]
                    if isinstance(answer_data, dict):
                        if "value" in answer_data:
                            prompt_parts.append(f"**回答**: {answer_data['value']}\n")
                        if "followUp" in answer_data:
                            prompt_parts.append(f"**补充说明**: {answer_data['followUp']}\n")
                    else:
                        prompt_parts.append(f"**回答**: {answer_data}\n")
                    prompt_parts.append("\n")

        prompt_parts.append("\n请根据以上回答，为每个维度评分并给出整体分析。")
        return "".join(prompt_parts)

    def _build_insight_prompt(
        self,
        dimension: str,
        answers: Dict[int, dict],
        questions: List[dict],
        score: float,
    ) -> str:
        """Build prompt for generating dimension-specific insight."""
        # Filter questions for this dimension
        dim_questions = [q for q in questions if q["dimension"] == dimension]

        prompt_parts = [f"维度: {dimension}\n当前评分: {score}/100\n\n相关问答:\n\n"]

        for q in dim_questions:
            qid = q["id"]
            if qid in answers:
                prompt_parts.append(f"问: {q['question']}\n")
                answer_data = answers[qid]
                if isinstance(answer_data, dict):
                    if "value" in answer_data:
                        prompt_parts.append(f"答: {answer_data['value']}\n")
                    if "followUp" in answer_data:
                        prompt_parts.append(f"补充: {answer_data['followUp']}\n")
                else:
                    prompt_parts.append(f"答: {answer_data}\n")
                prompt_parts.append("\n")

        prompt_parts.append("请为这个维度生成温和、有建设性的洞察和建议。")
        return "".join(prompt_parts)


# Singleton instance
_llm_service: Optional[LLMService] = None


def get_llm_service() -> LLMService:
    """Get or create the LLM service instance."""
    global _llm_service
    if _llm_service is None:
        _llm_service = LLMService()
    return _llm_service
