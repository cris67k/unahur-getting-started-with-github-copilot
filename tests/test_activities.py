
"""Tests exercising /activities endpoints."""

from src import app as application_module


def test_get_activities(client):
    # Arrange: client fixture

    # Act
    resp = client.get("/activities")

    # Assert
    assert resp.status_code == 200
    data = resp.json()
    # should match the in-memory dictionary exactly
    assert data == application_module.activities


def test_signup_success(client):
    email = "newstudent@mergington.edu"
    # Act
    resp = client.post(f"/activities/Chess%20Club/signup?email={email}")

    # Assert
    assert resp.status_code == 200
    assert resp.json()["message"] == f"Signed up {email} for Chess Club"
    assert email in application_module.activities["Chess Club"]["participants"]


def test_signup_missing_activity(client):
    resp = client.post("/activities/Nonexistent/signup?email=test@x.com")
    assert resp.status_code == 404
    assert resp.json()["detail"] == "Activity not found"
