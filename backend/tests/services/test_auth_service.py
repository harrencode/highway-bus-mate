import pytest

from app.core.exceptions import AuthenticationException
from app.schemas.user import UserRegister
from app.services.auth_service import AuthService
from app.services.user_service import UserService


@pytest.fixture()
def auth_service() -> AuthService:
    return AuthService()


@pytest.fixture()
def registered_user(db):
    svc = UserService()
    return svc.register(
        db,
        UserRegister(username="authuser", email="auth@example.com", password="Secret123"),
    )


class TestLogin:
    def test_login_success_returns_tokens(self, db, auth_service, registered_user):
        token = auth_service.login(db, "authuser", "Secret123")
        assert token.access_token
        assert token.refresh_token

    def test_login_wrong_password_raises(self, db, auth_service, registered_user):
        with pytest.raises(AuthenticationException):
            auth_service.login(db, "authuser", "wrongpass")

    def test_login_unknown_user_raises(self, db, auth_service):
        with pytest.raises(AuthenticationException):
            auth_service.login(db, "ghost", "any")

    def test_login_inactive_user_raises(self, db, auth_service, registered_user):
        from app.schemas.user import UserUpdate

        UserService().update(db, registered_user.id, UserUpdate(is_active=False))
        with pytest.raises(AuthenticationException):
            auth_service.login(db, "authuser", "Secret123")


class TestRefreshToken:
    def test_refresh_returns_new_tokens(self, db, auth_service, registered_user):
        token = auth_service.login(db, "authuser", "Secret123")
        new_token = auth_service.refresh_token(db, token.refresh_token)
        assert new_token.access_token

    def test_refresh_with_access_token_raises(self, db, auth_service, registered_user):
        token = auth_service.login(db, "authuser", "Secret123")
        # access token must not be accepted as a refresh token
        with pytest.raises(AuthenticationException):
            auth_service.refresh_token(db, token.access_token)

    def test_refresh_with_invalid_token_raises(self, db, auth_service):
        with pytest.raises(AuthenticationException):
            auth_service.refresh_token(db, "not.a.valid.token")
