"""
Server-side question data with hidden psychological tags.

Tags are intentionally kept on the backend only — the frontend never sees them.
The frontend sends (questionId, selectedValue); the backend looks up tags here.
"""

from typing import Dict


def _clone_choices(data: Dict[str, Dict[str, float]]) -> Dict[str, Dict[str, float]]:
    return {key: dict(value) for key, value in data.items()}


BASE_QUESTION_TAGS: Dict[int, Dict[str, Dict[str, float]]] = {
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
    19: {
        "A": {"compatible": 3, "safe": 2, "mental_healthy": 2},
        "B": {"compatible": 2, "mental_healthy": 1},
        "C": {"mental_anxious": 2, "drain": 2},
        "D": {"mental_depressed": 3, "controlled": 2, "drain": 4},
    },
    20: {
        "A": {"unbalanced": 2, "mental_depressed": 1, "drain": 1},
        "B": {"anxious": 3, "mental_anxious": 2, "drain": 2},
        "C": {"avoidant": 2, "mental_depressed": 2, "drain": 2},
        "D": {"incompatible": 2, "drain": 1},
        "E": {"controlled": 3, "mental_depressed": 2, "drain": 3},
        "F": {"compatible": 2, "mental_healthy": 1},
    },
    21: {
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
}


TEMPLATES: Dict[str, Dict[str, Dict[str, float]]] = {
    "safe_single": _clone_choices(BASE_QUESTION_TAGS[1]),
    "trust_single": _clone_choices(BASE_QUESTION_TAGS[2]),
    "control_single": _clone_choices(BASE_QUESTION_TAGS[3]),
    "money_single": _clone_choices(BASE_QUESTION_TAGS[4]),
    "consent_single": _clone_choices(BASE_QUESTION_TAGS[5]),
    "fear_single": _clone_choices(BASE_QUESTION_TAGS[6]),
    "conflict_self_single": _clone_choices(BASE_QUESTION_TAGS[7]),
    "conflict_partner_single": _clone_choices(BASE_QUESTION_TAGS[8]),
    "repair_single": _clone_choices(BASE_QUESTION_TAGS[9]),
    "expression_single": _clone_choices(BASE_QUESTION_TAGS[10]),
    "compat_single": _clone_choices(BASE_QUESTION_TAGS[11]),
    "future_single": _clone_choices(BASE_QUESTION_TAGS[12]),
    "marriage_view_single": _clone_choices(BASE_QUESTION_TAGS[13]),
    "marriage_intent_single": _clone_choices(BASE_QUESTION_TAGS[14]),
    "support_single": _clone_choices(BASE_QUESTION_TAGS[15]),
    "responsibility_single": _clone_choices(BASE_QUESTION_TAGS[16]),
    "family_single": _clone_choices(BASE_QUESTION_TAGS[17]),
    "parent_boundary_single": _clone_choices(BASE_QUESTION_TAGS[18]),
    "feeling_single": _clone_choices(BASE_QUESTION_TAGS[19]),
    "drain_multi": {
        **_clone_choices(BASE_QUESTION_TAGS[20]),
        "G": {"mental_anxious": 2, "mental_depressed": 2, "drain": 3, "unbalanced": 2},
    },
    "affection_self_scale": _clone_choices(BASE_QUESTION_TAGS[21]),
    "affection_partner_scale": _clone_choices(BASE_QUESTION_TAGS[22]),
    "growth_scale": _clone_choices(BASE_QUESTION_TAGS[23]),
    "self_trust_scale": _clone_choices(BASE_QUESTION_TAGS[24]),
    "safe_scale_positive": {
        "1": {"danger": 4, "risk": 4, "controlled": 2},
        "2": {"risk": 3, "controlled": 1},
        "3": {"risk": 1},
        "4": {"safe": 2, "mental_healthy": 1},
        "5": {"safe": 4, "loyal": 2, "compatible": 1},
    },
    "safe_scale_negative": {
        "1": {"safe": 4, "mental_healthy": 1},
        "2": {"safe": 2},
        "3": {"risk": 1},
        "4": {"risk": 3, "controlled": 2},
        "5": {"danger": 5, "risk": 5, "controlled": 3, "mental_depressed": 2},
    },
    "control_scale_negative": {
        "1": {"safe": 3, "mental_healthy": 1},
        "2": {"safe": 1},
        "3": {"risk": 1, "controlled": 1},
        "4": {"risk": 3, "controlled": 3, "drain": 2},
        "5": {"danger": 4, "controlled": 4, "gaslighting": 2, "drain": 3},
    },
    "repair_scale_positive": {
        "1": {"avoidant": 4, "selfish": 2, "drain": 3},
        "2": {"avoidant": 2, "dismissive": 1, "drain": 1},
        "3": {"avoidant": 1},
        "4": {"mature": 2, "safe": 1},
        "5": {"mature": 4, "safe": 2, "compatible": 2},
    },
    "repair_scale_negative": {
        "1": {"mature": 3, "safe": 2},
        "2": {"mature": 1, "safe": 1},
        "3": {"avoidant": 1},
        "4": {"avoidant": 2, "dismissive": 2, "drain": 2},
        "5": {"verbal_abuse": 3, "selfish": 3, "mental_unstable": 2, "drain": 3},
    },
    "compat_scale_positive": {
        "1": {"incompatible": 4, "drain": 3},
        "2": {"incompatible": 2, "immature": 1},
        "3": {"incompatible": 1},
        "4": {"compatible": 2, "mature": 1},
        "5": {"compatible": 4, "mature": 2, "safe": 1},
    },
    "compat_scale_negative": {
        "1": {"compatible": 4, "mature": 2},
        "2": {"compatible": 2},
        "3": {"incompatible": 1},
        "4": {"incompatible": 3, "stubborn": 2},
        "5": {"incompatible": 5, "stubborn": 3, "drain": 2},
    },
    "trust_scale_positive": {
        "1": {"risk": 4, "selfish": 2, "drain": 2},
        "2": {"risk": 2, "dismissive": 1},
        "3": {"risk": 1},
        "4": {"safe": 2, "loyal": 1},
        "5": {"safe": 4, "loyal": 3, "compatible": 1},
    },
    "stability_scale_positive": {
        "1": {"mental_depressed": 3, "drain": 4, "unbalanced": 2},
        "2": {"mental_anxious": 2, "drain": 2, "unbalanced": 1},
        "3": {"drain": 1},
        "4": {"mental_healthy": 2, "safe": 1},
        "5": {"mental_healthy": 4, "safe": 2, "compatible": 2},
    },
    "stability_scale_negative": {
        "1": {"mental_healthy": 3, "safe": 2},
        "2": {"mental_healthy": 1, "safe": 1},
        "3": {"drain": 1},
        "4": {"mental_anxious": 2, "drain": 2, "unbalanced": 1},
        "5": {"mental_depressed": 3, "drain": 4, "controlled": 2, "unbalanced": 2},
    },
    "family_scale_positive": {
        "1": {"family_risk": 4, "danger": 2},
        "2": {"family_risk": 2, "incompatible": 1},
        "3": {"family_risk": 1},
        "4": {"family_healthy": 2, "mature": 1},
        "5": {"family_healthy": 4, "mature": 2, "safe": 1},
    },
    "family_scale_negative": {
        "1": {"family_healthy": 3, "safe": 1},
        "2": {"family_healthy": 1},
        "3": {"family_risk": 1},
        "4": {"family_risk": 3, "incompatible": 1},
        "5": {"family_risk": 5, "controlled": 2, "danger": 2},
    },
    "future_outlook_single": {
        "A": {"compatible": 3, "safe": 2, "mental_healthy": 2},
        "B": {"compatible": 2, "mature": 1},
        "C": {"mental_anxious": 2, "drain": 3, "incompatible": 1},
        "D": {"danger": 3, "mental_depressed": 3, "drain": 4, "controlled": 1},
    },
    "friend_advice_single": {
        "A": {"compatible": 3, "safe": 2},
        "B": {"compatible": 2},
        "C": {"risk": 2, "controlled": 2, "drain": 2},
        "D": {"danger": 4, "risk": 4, "mental_depressed": 2, "drain": 4},
    },
}


QUESTION_TAGS: Dict[int, Dict[str, Dict[str, float]]] = {
    qid: _clone_choices(tags) for qid, tags in BASE_QUESTION_TAGS.items()
}


for base_qid in range(1, 25):
    QUESTION_TAGS[base_qid + 100] = _clone_choices(BASE_QUESTION_TAGS[base_qid])


def _assign_deep(start_id: int, template_names: list[str]) -> None:
    for offset, template_name in enumerate(template_names):
        QUESTION_TAGS[start_id + offset] = _clone_choices(TEMPLATES[template_name])


_assign_deep(201, [
    "safe_scale_positive",
    "family_scale_positive",
    "safe_scale_negative",
    "safe_scale_positive",
    "control_scale_negative",
    "safe_scale_positive",
    "control_scale_negative",
    "control_scale_negative",
    "trust_scale_positive",
    "safe_scale_positive",
    "safe_scale_positive",
    "control_scale_negative",
    "control_scale_negative",
    "stability_scale_positive",
    "consent_single",
    "control_single",
    "fear_single",
    "control_single",
])

_assign_deep(219, [
    "conflict_self_single",
    "conflict_partner_single",
    "repair_single",
    "expression_single",
    "repair_scale_positive",
    "repair_scale_negative",
    "repair_scale_positive",
    "repair_scale_positive",
    "repair_scale_positive",
    "repair_scale_positive",
    "repair_scale_positive",
    "repair_scale_positive",
    "repair_single",
    "expression_single",
    "repair_scale_positive",
    "repair_scale_negative",
    "repair_scale_positive",
    "safe_scale_positive",
])

_assign_deep(237, [
    "trust_single",
    "trust_scale_positive",
    "trust_scale_positive",
    "trust_scale_positive",
    "safe_single",
    "trust_scale_positive",
    "trust_scale_positive",
    "trust_scale_positive",
    "future_single",
    "trust_scale_positive",
    "compat_scale_positive",
    "trust_scale_positive",
    "marriage_intent_single",
    "trust_scale_positive",
])

_assign_deep(251, [
    "money_single",
    "future_single",
    "marriage_view_single",
    "marriage_intent_single",
    "support_single",
    "responsibility_single",
    "compat_scale_positive",
    "compat_scale_positive",
    "compat_scale_positive",
    "compat_scale_positive",
    "compat_scale_positive",
    "compat_scale_positive",
    "trust_scale_positive",
    "compat_scale_positive",
    "stability_scale_positive",
    "future_single",
])

_assign_deep(267, [
    "stability_scale_positive",
    "stability_scale_positive",
    "stability_scale_negative",
    "stability_scale_positive",
    "stability_scale_negative",
    "repair_scale_positive",
    "repair_scale_positive",
    "repair_scale_positive",
    "stability_scale_positive",
    "stability_scale_negative",
    "consent_single",
    "stability_scale_positive",
])

_assign_deep(279, [
    "family_single",
    "parent_boundary_single",
    "family_scale_positive",
    "family_scale_negative",
    "family_scale_positive",
    "family_scale_negative",
    "family_scale_positive",
    "family_scale_positive",
    "parent_boundary_single",
    "family_scale_negative",
    "family_scale_positive",
    "family_scale_positive",
])

_assign_deep(291, [
    "feeling_single",
    "drain_multi",
    "affection_self_scale",
    "affection_partner_scale",
    "growth_scale",
    "self_trust_scale",
    "future_outlook_single",
    "friend_advice_single",
])


def lookup_tags(question_id: int, value: str) -> Dict[str, float]:
    """Look up the hidden tags for a given question + selected value.

    For multi-select (comma-separated values like "A,C"), merges tags from
    all selected choices.
    """
    q_tags = QUESTION_TAGS.get(question_id)
    if not q_tags:
        return {}

    if "," in value:
        merged: Dict[str, float] = {}
        for choice in value.split(","):
            choice = choice.strip()
            choice_tags = q_tags.get(choice, {})
            for tag, score in choice_tags.items():
                merged[tag] = merged.get(tag, 0) + score
        return merged

    return dict(q_tags.get(value, {}))
