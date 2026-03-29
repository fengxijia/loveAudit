from typing import Dict, List, Optional, Tuple


# ---------------------------------------------------------------------------
# Tag → Dimension mapping
# ---------------------------------------------------------------------------
# For safety / compatibility / repair: higher score = better
# For drain: higher score = worse (hidden from user)

DIMENSIONS = {
    "safety": {
        "positive": ["safe", "loyal", "secure", "family_healthy", "mental_healthy"],
        "negative": ["danger", "risk", "controlled", "verbal_abuse", "gaslighting",
                     "mental_unstable", "family_risk"],
    },
    "compatibility": {
        "positive": ["compatible", "mature", "family_healthy"],
        "negative": ["incompatible", "immature", "stubborn", "avoidant", "unbalanced"],
    },
    "repair": {
        "positive": ["mature", "safe"],
        "negative": ["avoidant", "dismissive", "selfish", "mental_unstable",
                     "verbal_abuse", "stubborn"],
    },
}

DRAIN_CONFIG = {
    "positive": ["mental_healthy", "compatible", "safe"],
    "negative": ["drain", "mental_depressed", "mental_anxious", "anxious",
                 "unbalanced", "controlled", "verbal_abuse", "gaslighting"],
}


# ---------------------------------------------------------------------------
# Core scoring functions
# ---------------------------------------------------------------------------

def aggregate_tags(answers: Dict[str, dict]) -> Dict[str, float]:
    """Aggregate psychological tags from all answers."""
    tag_totals: Dict[str, float] = {}
    for answer in answers.values():
        tags = answer.get("tags", {})
        for tag, score in tags.items():
            tag_totals[tag] = tag_totals.get(tag, 0) + score
    return tag_totals


def count_meaningful_answers(answers: Dict[str, dict]) -> int:
    """Count answers that have actual tags (not skip/empty)."""
    count = 0
    for answer in answers.values():
        value = answer.get("value", "")
        tags = answer.get("tags", {})
        if value and value != "skip" and value != "" and tags:
            count += 1
    return count


# Minimum meaningful answers required for a real analysis
MIN_MEANINGFUL_ANSWERS = 5


def _ratio_score(tags: Dict[str, float], positive: List[str], negative: List[str]) -> float:
    pos = sum(tags.get(t, 0) for t in positive)
    neg = sum(tags.get(t, 0) for t in negative)
    total = pos + neg
    if total == 0:
        return 50.0
    return round(pos / total * 100, 1)


def compute_dimension_scores(tags: Dict[str, float]) -> Dict[str, float]:
    """Compute 3 visible indices (0-100, higher=better) + hidden drain (higher=worse)."""
    scores: Dict[str, float] = {}
    for name, config in DIMENSIONS.items():
        scores[name] = _ratio_score(tags, config["positive"], config["negative"])

    # Drain is inverted: higher = more drained = worse
    drain_pos = sum(tags.get(t, 0) for t in DRAIN_CONFIG["positive"])
    drain_neg = sum(tags.get(t, 0) for t in DRAIN_CONFIG["negative"])
    drain_total = drain_pos + drain_neg
    scores["drain"] = round(drain_neg / drain_total * 100, 1) if drain_total > 0 else 30.0

    return scores


def detect_warnings(tags: Dict[str, float]) -> List[Dict[str, str]]:
    """Detect hard-flag patterns and return warning objects."""
    warnings: List[Dict[str, str]] = []

    if tags.get("danger", 0) >= 5:
        warnings.append({
            "code": "severe_safety",
            "message": "系统识别到这段关系中可能存在明显的安全风险信号。",
        })
    if tags.get("controlled", 0) >= 4:
        warnings.append({
            "code": "control_pattern",
            "message": "存在较明显的控制倾向或边界侵犯模式。",
        })
    if tags.get("verbal_abuse", 0) >= 3:
        warnings.append({
            "code": "verbal_abuse",
            "message": "关系中存在言语伤害或情绪暴力的信号。",
        })
    if tags.get("gaslighting", 0) >= 3:
        warnings.append({
            "code": "gaslighting",
            "message": "对方可能在影响你对现实的判断和感受。",
        })
    return warnings


def determine_result_type(
    scores: Dict[str, float], tags: Dict[str, float],
) -> Tuple[str, str, str]:
    """Priority cascade → (resultType, resultLabel, riskTier)."""
    safety = scores["safety"]
    compat = scores["compatibility"]
    repair = scores["repair"]
    drain = scores["drain"]

    danger_sum = tags.get("danger", 0)
    controlled_sum = tags.get("controlled", 0)

    # Priority 1: High risk
    if safety < 30 or danger_sum >= 8:
        return ("high_risk", "高风险关系型", "high")

    # Priority 2: Boundary imbalance
    if safety < 50 and (controlled_sum >= 4 or drain > 65):
        return ("boundary_imbalance", "边界失衡型", "medium")

    # Priority 3: High drain + low repair
    if drain > 60 and repair < 40:
        return ("high_drain", "高消耗拉扯型", "medium")

    # Priority 4: Reality gap
    if compat < 45 and safety >= 50:
        return ("reality_gap", "现实分歧型", "low")

    # Priority 5: Angel couple
    if safety >= 75 and compat >= 65 and repair >= 65 and drain < 35:
        return ("angel_couple", "神仙伴侣型", "low")

    # Default
    return ("grinding_growth", "磨合可成型", "low")


# ---------------------------------------------------------------------------
# Personality adjustments (kept from v1)
# ---------------------------------------------------------------------------

def get_personality_weight_adjustments(
    user_personality: Optional[str],
    partner_personality: Optional[str],
) -> Dict[str, float]:
    adjustments: Dict[str, float] = {}
    if user_personality == "emotional":
        adjustments["anxious"] = 0.7
        adjustments["mental_anxious"] = 0.7
    if user_personality == "rational":
        adjustments["controlled"] = 1.3
        adjustments["verbal_abuse"] = 1.2
    if user_personality == "rational" and partner_personality == "emotional":
        adjustments["incompatible"] = 0.8
    return adjustments


def apply_adjustments(
    tags: Dict[str, float], adjustments: Dict[str, float],
) -> Dict[str, float]:
    adjusted = dict(tags)
    for tag, factor in adjustments.items():
        if tag in adjusted:
            adjusted[tag] = round(adjusted[tag] * factor, 2)
    return adjusted
