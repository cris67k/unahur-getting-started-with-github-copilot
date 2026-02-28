import copy
import pytest
from fastapi.testclient import TestClient

from src import app as application_module


@pytest.fixture
def client():
    """Provide a TestClient instance bound to the FastAPI app."""
    return TestClient(application_module.app)


@pytest.fixture(autouse=True)
def reset_activities():
    """Restore the in-memory activities dict before each test.

    The fixture makes a deep copy of the original data, yields control to
    the test, and then clears and updates the global dict so every test
    starts with the same state (AAA: Arrange phase setup).
    """
    original = copy.deepcopy(application_module.activities)
    yield
    application_module.activities.clear()
    application_module.activities.update(copy.deepcopy(original))
