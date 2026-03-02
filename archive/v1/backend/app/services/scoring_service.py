from dataclasses import dataclass
from typing import Dict, List


@dataclass
class DimensionScore:
    """Score for a single dimension."""

    dimension_id: str
    raw_score: float  # 0-100
    weighted_score: float
    weight: int
    answer_quality: float  # 0-1, based on answer detail/length


@dataclass
class AssessmentResult:
    """Complete assessment result."""

    total_score: float
    dimension_scores: Dict[str, DimensionScore]
    answer_quality_average: float
    completion_rate: float


class ScoringService:
    """Service for calculating assessment scores."""

    def __init__(self, dimensions: Dict[str, dict]):
        self.dimensions = dimensions

    def calculate_preliminary_scores(
        self,
        answers: Dict[int, dict],
        questions: List[dict],
    ) -> AssessmentResult:
        """
        Calculate preliminary scores based on answer quality.
        The final scores will be adjusted by LLM analysis.
        """
        # Group answers by dimension
        dimension_answers: Dict[str, list] = {}
        dimension_questions: Dict[str, list] = {}

        for q in questions:
            dim = q["dimension"]
            if dim not in dimension_answers:
                dimension_answers[dim] = []
                dimension_questions[dim] = []
            dimension_questions[dim].append(q)
            if q["id"] in answers:
                dimension_answers[dim].append(answers[q["id"]])

        # Calculate scores per dimension
        dimension_scores: Dict[str, DimensionScore] = {}
        total_weighted = 0.0
        total_weight = 0
        total_quality = 0.0
        quality_count = 0

        for dim_id, dim_info in self.dimensions.items():
            if dim_id == "warmup":
                continue  # Skip warmup dimension

            weight = dim_info["weight"]
            answers_list = dimension_answers.get(dim_id, [])
            questions_list = dimension_questions.get(dim_id, [])

            # Calculate answer quality based on completeness and detail
            quality = self._calculate_answer_quality(answers_list, questions_list)

            # Preliminary score based on quality (will be adjusted by LLM)
            raw_score = quality * 100
            weighted_score = raw_score * (weight / 100)

            dimension_scores[dim_id] = DimensionScore(
                dimension_id=dim_id,
                raw_score=raw_score,
                weighted_score=weighted_score,
                weight=weight,
                answer_quality=quality,
            )

            total_weighted += weighted_score
            total_weight += weight
            total_quality += quality
            quality_count += 1

        # Calculate completion rate
        answered_count = len(answers)
        total_questions = len(questions)
        completion_rate = answered_count / total_questions if total_questions > 0 else 0

        return AssessmentResult(
            total_score=total_weighted,
            dimension_scores=dimension_scores,
            answer_quality_average=total_quality / quality_count if quality_count > 0 else 0,
            completion_rate=completion_rate,
        )

    def _calculate_answer_quality(
        self,
        answers: list,
        questions: list,
    ) -> float:
        """Calculate answer quality based on completeness and detail."""
        if not answers or not questions:
            return 0.0

        quality_scores = []

        for i, answer in enumerate(answers):
            if i >= len(questions):
                break

            question = questions[i]
            q_type = question.get("type", "text")
            min_length = question.get("minLength", 10)

            # Get the answer value
            if isinstance(answer, dict):
                value = answer.get("value", "")
                follow_up = answer.get("followUp", "")
            else:
                value = str(answer)
                follow_up = ""

            # Calculate quality based on question type
            if q_type == "text":
                # For text questions, measure length and detail
                text = str(value) + " " + str(follow_up)
                length_score = min(len(text) / max(min_length * 3, 1), 1.0)
                quality_scores.append(length_score)

            elif q_type in ("choice", "multiChoice"):
                # For choice questions, having a follow-up adds quality
                base_score = 0.7 if value else 0.0
                follow_up_bonus = 0.3 if follow_up and len(follow_up) > 10 else 0.0
                quality_scores.append(base_score + follow_up_bonus)

            elif q_type == "scale":
                # For scale questions, having a follow-up explanation is key
                base_score = 0.5 if value else 0.0
                follow_up_bonus = 0.5 if follow_up and len(follow_up) > 15 else 0.0
                quality_scores.append(base_score + follow_up_bonus)

            else:
                quality_scores.append(0.5 if value else 0.0)

        return sum(quality_scores) / len(quality_scores) if quality_scores else 0.0

    def update_scores_from_llm(
        self,
        result: AssessmentResult,
        llm_scores: Dict[str, float],
    ) -> AssessmentResult:
        """Update scores with LLM-provided scores."""
        new_dimension_scores = {}
        total_weighted = 0.0

        for dim_id, score in result.dimension_scores.items():
            llm_score = llm_scores.get(dim_id, score.raw_score)
            weight = score.weight

            new_score = DimensionScore(
                dimension_id=dim_id,
                raw_score=llm_score,
                weighted_score=llm_score * (weight / 100),
                weight=weight,
                answer_quality=score.answer_quality,
            )
            new_dimension_scores[dim_id] = new_score
            total_weighted += new_score.weighted_score

        return AssessmentResult(
            total_score=total_weighted,
            dimension_scores=new_dimension_scores,
            answer_quality_average=result.answer_quality_average,
            completion_rate=result.completion_rate,
        )
