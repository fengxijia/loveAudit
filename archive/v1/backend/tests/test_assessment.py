import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_validate_text_answer_valid():
    """Test validating a valid text answer."""
    response = client.post(
        "/api/v1/assessment/validate",
        json={
            "question_id": 1,
            "answer": {
                "value": "我们交往了两年，一起旅行过很多地方，见过双方父母。",
            },
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["valid"] is True


def test_validate_text_answer_too_short():
    """Test validating a text answer that's too short."""
    response = client.post(
        "/api/v1/assessment/validate",
        json={
            "question_id": 1,
            "answer": {
                "value": "短",
            },
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["valid"] is False
    assert "字符" in data["message"]


def test_validate_choice_answer_valid():
    """Test validating a valid choice answer."""
    response = client.post(
        "/api/v1/assessment/validate",
        json={
            "question_id": 4,
            "answer": {
                "value": "partner",
            },
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["valid"] is True


def test_validate_choice_answer_invalid():
    """Test validating an invalid choice answer."""
    response = client.post(
        "/api/v1/assessment/validate",
        json={
            "question_id": 4,
            "answer": {
                "value": "invalid_option",
            },
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["valid"] is False


def test_validate_scale_answer_valid():
    """Test validating a valid scale answer."""
    response = client.post(
        "/api/v1/assessment/validate",
        json={
            "question_id": 5,
            "answer": {
                "value": 3,
            },
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["valid"] is True


def test_validate_scale_answer_out_of_range():
    """Test validating a scale answer out of range."""
    response = client.post(
        "/api/v1/assessment/validate",
        json={
            "question_id": 5,
            "answer": {
                "value": 10,
            },
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["valid"] is False


def test_validate_nonexistent_question():
    """Test validating an answer for a nonexistent question."""
    response = client.post(
        "/api/v1/assessment/validate",
        json={
            "question_id": 999,
            "answer": {
                "value": "test",
            },
        },
    )
    assert response.status_code == 404


def test_submit_insufficient_answers():
    """Test submitting with insufficient answers."""
    response = client.post(
        "/api/v1/assessment/submit",
        json={
            "answers": {
                "1": {"value": "test answer"},
                "2": {"value": "test"},
            },
        },
    )
    assert response.status_code == 400
    assert "必答问题" in response.json()["detail"]


def test_validate_multichoice_answer():
    """Test validating a multi-choice answer."""
    response = client.post(
        "/api/v1/assessment/validate",
        json={
            "question_id": 10,
            "answer": {
                "value": ["direct", "hint"],
            },
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["valid"] is True


def test_validate_multichoice_too_many_selections():
    """Test validating a multi-choice answer with too many selections."""
    response = client.post(
        "/api/v1/assessment/validate",
        json={
            "question_id": 10,
            "answer": {
                "value": ["direct", "hint", "silent", "cold"],
            },
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["valid"] is False
