import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_check():
    """Test health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


def test_get_all_questions():
    """Test getting all questions."""
    response = client.get("/api/v1/questions")
    assert response.status_code == 200
    data = response.json()

    # Check structure
    assert "dimensions" in data
    assert "questions" in data
    assert "metadata" in data

    # Check questions count
    assert len(data["questions"]) == 18

    # Check metadata
    assert data["metadata"]["totalQuestions"] == 18


def test_get_single_question():
    """Test getting a single question by ID."""
    response = client.get("/api/v1/questions/1")
    assert response.status_code == 200
    data = response.json()

    assert "question" in data
    assert "dimension" in data
    assert data["question"]["id"] == 1


def test_get_nonexistent_question():
    """Test getting a question that doesn't exist."""
    response = client.get("/api/v1/questions/999")
    assert response.status_code == 404


def test_get_dimensions():
    """Test getting all dimensions."""
    response = client.get("/api/v1/dimensions")
    assert response.status_code == 200
    data = response.json()

    # Check expected dimensions
    expected_dimensions = [
        "warmup",
        "affection",
        "foundation",
        "conflict",
        "capability",
        "background",
    ]
    for dim in expected_dimensions:
        assert dim in data

    # Check weights sum (excluding warmup which has 0 weight)
    total_weight = sum(d["weight"] for d in data.values())
    assert total_weight == 100


def test_question_types():
    """Test that questions have valid types."""
    response = client.get("/api/v1/questions")
    assert response.status_code == 200
    data = response.json()

    valid_types = ["text", "choice", "multiChoice", "scale"]
    for question in data["questions"]:
        assert question["type"] in valid_types


def test_question_has_required_fields():
    """Test that all questions have required fields."""
    response = client.get("/api/v1/questions")
    assert response.status_code == 200
    data = response.json()

    required_fields = ["id", "dimension", "type", "question", "required"]
    for question in data["questions"]:
        for field in required_fields:
            assert field in question, f"Question {question['id']} missing field {field}"
