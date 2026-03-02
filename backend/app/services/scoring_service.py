from typing import Dict, List, Optional


def aggregate_tags(answers: Dict[str, dict]) -> Dict[str, float]:
    """Aggregate psychological tags from all answers."""
    tag_totals: Dict[str, float] = {}
    for answer in answers.values():
        tags = answer.get("tags", {})
        for tag, score in tags.items():
            tag_totals[tag] = tag_totals.get(tag, 0) + score
    return tag_totals


def compute_risk_score(tags: Dict[str, float]) -> float:
    """Compute an overall risk score from 0-100 (higher = more risk)."""
    risk_tags = ["risk", "danger", "controlled", "selfish", "verbal_abuse",
                 "gaslighting", "mental_depressed", "mental_unstable",
                 "incompatible", "immature", "unbalanced", "stubborn"]
    safe_tags = ["safe", "mature", "compatible", "loyal", "mental_healthy",
                 "family_healthy", "secure"]

    risk_sum = sum(tags.get(t, 0) for t in risk_tags)
    safe_sum = sum(tags.get(t, 0) for t in safe_tags)

    total = risk_sum + safe_sum
    if total == 0:
        return 50.0

    # Risk percentage
    return round((risk_sum / total) * 100, 1)


def determine_verdict(risk_score: float) -> str:
    """Determine verdict level based on risk score."""
    if risk_score <= 25:
        return "angel"
    elif risk_score <= 55:
        return "observe"
    else:
        return "run"


def get_personality_weight_adjustments(
    user_personality: Optional[str],
    partner_personality: Optional[str],
) -> Dict[str, float]:
    """Return tag weight adjustments based on personality types."""
    adjustments: Dict[str, float] = {}

    # Emotional users may over-report anxiety
    if user_personality == "emotional":
        adjustments["anxious"] = 0.7
        adjustments["mental_anxious"] = 0.7

    # Rational users may under-report emotional issues
    if user_personality == "rational":
        adjustments["controlled"] = 1.3
        adjustments["verbal_abuse"] = 1.2

    # Emotional partner + rational user = common mismatch, less alarming
    if user_personality == "rational" and partner_personality == "emotional":
        adjustments["incompatible"] = 0.8

    return adjustments


def apply_adjustments(
    tags: Dict[str, float],
    adjustments: Dict[str, float],
) -> Dict[str, float]:
    """Apply personality-based weight adjustments to tags."""
    adjusted = dict(tags)
    for tag, factor in adjustments.items():
        if tag in adjusted:
            adjusted[tag] = round(adjusted[tag] * factor, 2)
    return adjusted
