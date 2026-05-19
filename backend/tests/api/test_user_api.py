"""
API integration tests for User and Auth endpoints.

Uses FastAPI TestClient with the real MySQL test database (auth_test_db).
Each test runs inside a rolled-back transaction for full isolation.
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

import app.models  # noqa: F401
from app.db.session import get_db
from app.main import app
from app.schemas.user import UserCreate
from app.services.user_service import UserService

# ── Fixtures ──────────────────────────────────────────────────────────────────


@pytest.fixture()
def db(db_engine) -> Session:
    """
    Per-test isolated session on the shared MySQL engine.
    Wraps the test in a transaction + nested savepoint; always rolls back.
    """
    connection = db_engine.connect()
    transaction = connection.begin()
    session = Session(bind=connection)
    session.begin_nested()

    yield session

    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture()
def override_db(db):
    """Override FastAPI's get_db dependency with the test session."""

    def _get_test_db():
        yield db

    app.dependency_overrides[get_db] = _get_test_db
    yield
    app.dependency_overrides.clear()


@pytest.fixture()
def client(override_db):
    return TestClient(app)


@pytest.fixture()
def registered_user_data():
    return {"username": "apiuser", "email": "api@example.com", "password": "Password1"}


@pytest.fixture()
def registered_user(client, registered_user_data):
    client.post("/api/v1/users/register", json=registered_user_data)
    return registered_user_data


@pytest.fixture()
def auth_headers(client, registered_user):
    resp = client.post(
        "/api/v1/auth/login",
        json={"username": registered_user["username"], "password": registered_user["password"]},
    )
    token = resp.json()["data"]["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture()
def admin_headers(client, db):
    """Create an admin user directly via service and return its auth headers."""
    svc = UserService()
    from app.models.enums import UserRole

    svc.create(
        db,
        UserCreate(
            username="adminuser",
            email="admin@example.com",
            password="Admin1234",
            role=UserRole.ADMIN,
        ),
    )

    resp = client.post(
        "/api/v1/auth/login",
        json={"username": "adminuser", "password": "Admin1234"},
    )
    token = resp.json()["data"]["access_token"]
    return {"Authorization": f"Bearer {token}"}


# ── Health ─────────────────────────────────────────────────────────────────────


class TestHealth:
    def test_health_check(self, client):
        resp = client.get("/api/v1/health")
        assert resp.status_code == 200
        assert resp.json()["status"] == "success"

    def test_version(self, client):
        resp = client.get("/api/v1/version")
        assert resp.status_code == 200


# ── Registration ───────────────────────────────────────────────────────────────


class TestRegisterEndpoint:
    def test_register_success(self, client):
        resp = client.post(
            "/api/v1/users/register",
            json={"username": "newuser", "email": "new@example.com", "password": "Pass1234"},
        )
        assert resp.status_code == 201
        data = resp.json()
        assert data["status"] == "success"
        assert data["data"]["username"] == "newuser"
        assert data["data"]["role"] == "user"

    def test_register_duplicate_email_returns_409(self, client, registered_user):
        resp = client.post(
            "/api/v1/users/register",
            json={
                "username": "different",
                "email": registered_user["email"],
                "password": "Pass1234",
            },
        )
        assert resp.status_code == 409

    def test_register_duplicate_username_returns_409(self, client, registered_user):
        resp = client.post(
            "/api/v1/users/register",
            json={
                "username": registered_user["username"],
                "email": "different@example.com",
                "password": "Pass1234",
            },
        )
        assert resp.status_code == 409


# ── Login ──────────────────────────────────────────────────────────────────────


class TestLoginEndpoint:
    def test_login_success_returns_tokens(self, client, registered_user):
        resp = client.post(
            "/api/v1/auth/login",
            json={"username": registered_user["username"], "password": registered_user["password"]},
        )
        assert resp.status_code == 200
        data = resp.json()["data"]
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"

    def test_login_wrong_password_returns_401(self, client, registered_user):
        resp = client.post(
            "/api/v1/auth/login",
            json={"username": registered_user["username"], "password": "wrongpass"},
        )
        assert resp.status_code == 401

    def test_login_unknown_user_returns_401(self, client):
        resp = client.post(
            "/api/v1/auth/login",
            json={"username": "nobody", "password": "irrelevant"},
        )
        assert resp.status_code == 401


# ── Token Refresh ──────────────────────────────────────────────────────────────


class TestRefreshEndpoint:
    def test_refresh_success(self, client, registered_user):
        login_resp = client.post(
            "/api/v1/auth/login",
            json={"username": registered_user["username"], "password": registered_user["password"]},
        )
        refresh_token = login_resp.json()["data"]["refresh_token"]

        resp = client.post("/api/v1/auth/refresh", json={"refresh_token": refresh_token})
        assert resp.status_code == 200
        assert "access_token" in resp.json()["data"]

    def test_refresh_with_bad_token_returns_401(self, client):
        resp = client.post("/api/v1/auth/refresh", json={"refresh_token": "invalid.token.here"})
        assert resp.status_code == 401


# ── /users/me ─────────────────────────────────────────────────────────────────


class TestMeEndpoint:
    def test_get_me_authenticated(self, client, auth_headers, registered_user):
        resp = client.get("/api/v1/users/me", headers=auth_headers)
        assert resp.status_code == 200
        assert resp.json()["data"]["username"] == registered_user["username"]

    def test_get_me_unauthenticated_returns_403(self, client):
        resp = client.get("/api/v1/users/me")
        assert resp.status_code == 403


# ── Admin: create user ────────────────────────────────────────────────────────


class TestAdminCreateUser:
    def test_admin_can_create_user(self, client, admin_headers):
        resp = client.post(
            "/api/v1/users",
            json={
                "username": "created",
                "email": "created@example.com",
                "password": "Created1",
                "role": "admin",
            },
            headers=admin_headers,
        )
        assert resp.status_code == 201
        assert resp.json()["data"]["role"] == "admin"

    def test_non_admin_create_returns_403(self, client, auth_headers):
        resp = client.post(
            "/api/v1/users",
            json={
                "username": "shouldfail",
                "email": "shouldfail@example.com",
                "password": "Fail1234",
            },
            headers=auth_headers,
        )
        assert resp.status_code == 403


# ── Change password ────────────────────────────────────────────────────────────


class TestChangePassword:
    def test_change_password_success(self, client, auth_headers):
        resp = client.put(
            "/api/v1/users/change-password",
            json={"password": "NewPass999"},
            headers=auth_headers,
        )
        assert resp.status_code == 200
        assert resp.json()["status"] == "success"

    def test_change_password_unauthenticated_returns_403(self, client):
        resp = client.put(
            "/api/v1/users/change-password",
            json={"password": "NewPass999"},
        )
        assert resp.status_code == 403

    def test_change_password_weak_password_returns_422(self, client, auth_headers):
        resp = client.put(
            "/api/v1/users/change-password",
            json={"password": "weak"},
            headers=auth_headers,
        )
        assert resp.status_code == 422

    def test_changed_password_allows_login(self, client, auth_headers, registered_user):
        client.put(
            "/api/v1/users/change-password",
            json={"password": "NewPass999"},
            headers=auth_headers,
        )
        resp = client.post(
            "/api/v1/auth/login",
            json={"username": registered_user["username"], "password": "NewPass999"},
        )
        assert resp.status_code == 200


# ── Admin: search users ────────────────────────────────────────────────────────


class TestSearchUsers:
    def test_search_returns_matching_users(self, client, admin_headers, registered_user):
        resp = client.get(
            "/api/v1/users/search",
            params={"query": registered_user["username"]},
            headers=admin_headers,
        )
        assert resp.status_code == 200
        data = resp.json()["data"]
        assert data["total"] >= 1
        assert any(u["username"] == registered_user["username"] for u in data["items"])

    def test_search_by_email_partial(self, client, admin_headers, registered_user):
        resp = client.get(
            "/api/v1/users/search",
            params={"query": "api@example"},
            headers=admin_headers,
        )
        assert resp.status_code == 200
        assert resp.json()["data"]["total"] >= 1

    def test_search_no_results(self, client, admin_headers):
        resp = client.get(
            "/api/v1/users/search",
            params={"query": "zzz_no_match_xyz"},
            headers=admin_headers,
        )
        assert resp.status_code == 200
        assert resp.json()["data"]["total"] == 0
        assert resp.json()["data"]["items"] == []

    def test_search_non_admin_returns_403(self, client, auth_headers):
        resp = client.get(
            "/api/v1/users/search",
            params={"query": "user"},
            headers=auth_headers,
        )
        assert resp.status_code == 403

    def test_search_unauthenticated_returns_403(self, client):
        resp = client.get("/api/v1/users/search", params={"query": "user"})
        assert resp.status_code == 403

    def test_search_empty_query_returns_422(self, client, admin_headers):
        resp = client.get(
            "/api/v1/users/search",
            params={"query": ""},
            headers=admin_headers,
        )
        assert resp.status_code == 422

    def test_search_pagination(self, client, admin_headers, registered_user):
        resp = client.get(
            "/api/v1/users/search",
            params={"query": "api", "limit": 1},
            headers=admin_headers,
        )
        assert resp.status_code == 200
        assert len(resp.json()["data"]["items"]) <= 1
