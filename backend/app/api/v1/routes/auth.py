"""
Authentication Endpoints

Handles user login, token refresh, logout, and OAuth2-compatible token endpoint.
"""

from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.common import APIResponse, ResponseStatus
from app.schemas.user import Token, TokenRefresh, UserLogin
from app.services.auth_service import AuthService

router = APIRouter()
auth_service = AuthService()


@router.post("/login", response_model=APIResponse[Token])
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """
    User login.

    Returns access + refresh token pair on success.
    """
    token = auth_service.login(db, credentials.username, credentials.password)
    return APIResponse(
        data=token,
        status=ResponseStatus.SUCCESS,
        message="Login successful",
        error_code=None,
    )


@router.post("/refresh", response_model=APIResponse[Token])
async def refresh(body: TokenRefresh, db: Session = Depends(get_db)):
    """
    Refresh access token.

    Exchange a valid refresh token for a new access + refresh token pair.
    """
    token = auth_service.refresh_token(db, body.refresh_token)
    return APIResponse(
        data=token,
        status=ResponseStatus.SUCCESS,
        message="Token refreshed successfully",
        error_code=None,
    )


@router.post("/logout", response_model=APIResponse[dict])
async def logout():
    """
    Logout the current user.

    Token invalidation is handled client-side (stateless JWT).
    """
    return APIResponse(
        data={"detail": "Logged out."},
        status=ResponseStatus.SUCCESS,
        message="Logout successful",
        error_code=None,
    )


@router.post("/token", response_model=APIResponse[Token])
async def token_endpoint(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    """
    OAuth2-compatible token endpoint (form body).

    Useful for Swagger UI's 'Authorize' button.
    """
    token = auth_service.login(db, form_data.username, form_data.password)
    return APIResponse(
        data=token,
        status=ResponseStatus.SUCCESS,
        message="Login successful",
        error_code=None,
    )
