"""
Server-side question data with hidden psychological tags.

Tags are intentionally kept on the backend only — the frontend never sees them.
The frontend sends (questionId, selectedValue); the backend looks up tags here.
"""

from typing import Dict, Optional, Tuple

# ── Tag lookup table ──
# Structure: QUESTION_TAGS[question_id][choice_value] = { tag: score, ... }

QUESTION_TAGS: Dict[int, Dict[str, Dict[str, float]]] = {
    # ─── Chapter 1: 安全与底线 ───
    1: {
        "A": {"safe": 3, "loyal": 3},
        "B": {"safe": 1, "loyal": 1},
        "C": {"risk": 2, "dismissive": 2, "gaslighting": 1},
        "D": {"danger": 5, "risk": 5, "selfish": 3},
    },
    2: {
        "A": {"safe": 2, "loyal": 2},
        "B": {"safe": 1},
        "C": {"risk": 3, "selfish": 2},
        "D": {"danger": 4, "risk": 4, "selfish": 3, "gaslighting": 2},
    },
    3: {
        "A": {"safe": 3, "mature": 1},
        "B": {"safe": 1},
        "C": {"risk": 2, "controlled": 2},
        "D": {"danger": 4, "controlled": 4, "risk": 4},
    },
    4: {
        "A": {"safe": 2, "compatible": 2},
        "B": {"safe": 1, "compatible": 1},
        "C": {"risk": 2, "selfish": 1},
        "D": {"danger": 4, "controlled": 3, "risk": 3},
    },
    5: {
        "A": {"safe": 3, "mature": 1},
        "B": {"safe": 1},
        "C": {"risk": 2, "controlled": 2, "mental_anxious": 1},
        "D": {"danger": 5, "risk": 5, "mental_depressed": 3},
    },
    6: {
        "A": {"safe": 3, "mental_healthy": 1},
        "B": {"risk": 1, "verbal_abuse": 1, "mental_anxious": 1},
        "C": {"risk": 3, "verbal_abuse": 3, "controlled": 2, "mental_depressed": 2},
        "D": {"danger": 5, "risk": 5, "controlled": 3, "mental_depressed": 3},
    },

    # ─── Chapter 2: 互动与情绪模式 ───
    7: {
        "A": {"mature": 2},
        "B": {"avoidant": 2},
        "C": {"mental_anxious": 1},
        "D": {"selfish": 1, "dismissive": 1},
    },
    8: {
        "A": {"mature": 2, "safe": 1},
        "B": {"avoidant": 2},
        "C": {"risk": 1, "mental_unstable": 1},
        "D": {"risk": 2, "selfish": 2, "gaslighting": 1},
    },
    9: {
        "A": {"mature": 3, "safe": 2},
        "B": {"mature": 1, "safe": 1},
        "C": {"avoidant": 3, "mental_depressed": 1},
        "D": {"danger": 2, "risk": 3, "verbal_abuse": 3, "mental_depressed": 2},
    },
    10: {
        "A": {"mature": 3, "safe": 2},
        "B": {"mature": 1, "safe": 1},
        "C": {"selfish": 3, "dismissive": 2, "gaslighting": 2},
        "D": {"danger": 4, "controlled": 3, "mental_unstable": 3},
    },

    # ─── Chapter 3: 价值观与核心规划 ───
    11: {
        "A": {"compatible": 3},
        "B": {"compatible": 2},
        "C": {"incompatible": 1},
        "D": {"incompatible": 3, "conflict": 1},
    },
    12: {
        "A": {"compatible": 3, "mature": 2},
        "B": {"compatible": 2, "mature": 1},
        "C": {"immature": 1, "avoidant": 1},
        "D": {"incompatible": 3, "stubborn": 2, "avoidant": 2},
    },
    13: {
        "A": {"compatible": 3, "mature": 2},
        "B": {"compatible": 2},
        "C": {"immature": 1, "avoidant": 1},
        "D": {"incompatible": 3},
    },
    14: {
        "A": {"mature": 3, "compatible": 2},
        "B": {"mature": 1, "compatible": 1},
        "C": {"avoidant": 2, "immature": 2, "incompatible": 1},
        "D": {"incompatible": 3, "immature": 2},
    },
    15: {
        "A": {"safe": 2, "mature": 2, "compatible": 1},
        "B": {"safe": 1, "compatible": 1},
        "C": {"dismissive": 1, "controlled": 1},
        "D": {"controlled": 3, "selfish": 2, "verbal_abuse": 1, "incompatible": 2},
    },
    16: {
        "A": {"mature": 3, "compatible": 2},
        "B": {"mature": 1, "compatible": 1},
        "C": {"unbalanced": 3, "selfish": 2, "mental_depressed": 2, "drain": 2},
        "D": {"unbalanced": 2, "immature": 1},
    },

    # ─── Chapter 4: 家庭边界 ───
    17: {
        "A": {"family_healthy": 3, "safe": 1},
        "B": {"family_healthy": 1},
        "C": {"family_risk": 2},
        "D": {"family_risk": 4, "danger": 2},
    },
    18: {
        "A": {"mature": 3, "family_healthy": 2},
        "B": {"mature": 1, "family_healthy": 1},
        "C": {"immature": 2, "family_risk": 2, "incompatible": 1},
        "D": {"immature": 3, "family_risk": 3, "incompatible": 2},
    },

    # ─── Chapter 5: 主观体感 ───
    19: {
        "A": {"compatible": 3, "safe": 2, "mental_healthy": 2},
        "B": {"compatible": 2, "mental_healthy": 1},
        "C": {"mental_anxious": 2, "drain": 2},
        "D": {"mental_depressed": 3, "controlled": 2, "drain": 4},
    },
    20: {
        # Multi-select: tags are merged for all selected values
        "A": {"unbalanced": 2, "mental_depressed": 1, "drain": 1},
        "B": {"anxious": 3, "mental_anxious": 2, "drain": 2},
        "C": {"avoidant": 2, "mental_depressed": 2, "drain": 2},
        "D": {"incompatible": 2, "drain": 1},
        "E": {"controlled": 3, "mental_depressed": 2, "drain": 3},
        "F": {"compatible": 2, "mental_healthy": 1},
    },
    21: {
        # Scale 1-5
        "1": {"incompatible": 5, "drain": 4, "mental_depressed": 2},
        "2": {"incompatible": 3, "drain": 2},
        "3": {"incompatible": 1},
        "4": {"compatible": 2, "mental_healthy": 1},
        "5": {"compatible": 4, "mental_healthy": 2, "safe": 1},
    },
    22: {
        "1": {"unbalanced": 5, "mental_depressed": 3, "drain": 4},
        "2": {"unbalanced": 3, "mental_anxious": 2, "drain": 2},
        "3": {"unbalanced": 1},
        "4": {"safe": 2, "loyal": 1},
        "5": {"safe": 3, "loyal": 2, "compatible": 2},
    },
    23: {
        "1": {"incompatible": 4, "drain": 3},
        "2": {"incompatible": 2, "drain": 1},
        "3": {},
        "4": {"compatible": 2, "mature": 1},
        "5": {"compatible": 3, "mature": 2},
    },
    24: {
        "1": {"selfish": 4, "dismissive": 3, "drain": 4, "controlled": 1},
        "2": {"selfish": 2, "dismissive": 2, "drain": 2},
        "3": {},
        "4": {"safe": 2, "mature": 1},
        "5": {"safe": 3, "mature": 3, "compatible": 2},
    },
    # Q25 is freeform text — no tags
}


def lookup_tags(question_id: int, value: str) -> Dict[str, float]:
    """Look up the hidden tags for a given question + selected value.

    For multi-select (comma-separated values like "A,C"), merges tags from
    all selected choices.
    """
    q_tags = QUESTION_TAGS.get(question_id)
    if not q_tags:
        return {}

    # Multi-select: value may be "A,C,E"
    if "," in value:
        merged: Dict[str, float] = {}
        for v in value.split(","):
            v = v.strip()
            choice_tags = q_tags.get(v, {})
            for tag, score in choice_tags.items():
                merged[tag] = merged.get(tag, 0) + score
        return merged

    return dict(q_tags.get(value, {}))
