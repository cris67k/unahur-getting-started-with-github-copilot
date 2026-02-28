
"""Tests for the root endpoint."""

def test_root_redirect(client):
    # Arrange: client fixture provides TestClient

    # Act: request without following redirects so we can inspect headers
    resp = client.get("/", allow_redirects=False)

    # Assert: should redirect to static index page
    assert resp.status_code in (307, 308)
    assert resp.headers["location"] == "/static/index.html"
