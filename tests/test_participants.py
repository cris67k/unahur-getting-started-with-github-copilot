
"""Tests for participant removal endpoint."""

from src import app as application_module


def test_delete_participant_success(client):
    # pick an existing participant from the default data
    activity = "Chess Club"
    email = application_module.activities[activity]["participants"][0]

    # Act
    resp = client.delete(f"/activities/{activity}/participants?email={email}")

    # Assert
    assert resp.status_code == 200
    assert resp.json()["message"] == f"Removed {email} from {activity}"
    assert email not in application_module.activities[activity]["participants"]


def test_delete_participant_not_found(client):
    resp = client.delete("/activities/Chess Club/participants?email=absent@x.com")
    assert resp.status_code == 404
    assert resp.json()["detail"] == "Participant not found"


def test_delete_activity_not_found(client):
    resp = client.delete("/activities/Nope/participants?email=test@x.com")
    assert resp.status_code == 404
    assert resp.json()["detail"] == "Activity not found"
