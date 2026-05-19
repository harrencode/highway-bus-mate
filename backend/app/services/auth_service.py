"""
Authentication Service

Business logic for user authentication and token management.
"""

import logging

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.exceptions import AppException, AuthenticationException, DatabaseException
from app.core.security import create_access_token, create_refresh_token, decode_token
from app.repositories.user_repo import UserRepository
from app.schemas.user import Token

logger = logging.getLogger(__name__)


class AuthService:
    """Service for authentication operations."""

    def __init__(self) -> None:
        self.user_repo = UserRepository()

    def login(self, db: Session, username: str, password: str) -> Token:
        """
        Authenticate user and return JWT token pair.

        Raises AuthenticationException if credentials are invalid or user is inactive.
        Raises DatabaseException on unexpected database errors.
        """
        try:
            user = self.user_repo.authenticate(db, username, password)
            if not user or not user.is_active:
                raise AuthenticationException("Invalid username or password")
            return Token(
                access_token=create_access_token(user.id),
                refresh_token=create_refresh_token(user.id),
            )
        except AppException:
            raise
        except SQLAlchemyError as e:
            logger.error(
                "login_db_error",
                extra={"error": str(e), "error_type": type(e).__name__, "username": username},
            )
            raise DatabaseException("Failed to authenticate due to database error")

    def refresh_token(self, db: Session, token: str) -> Token:
        """
        Issue a new token pair from a valid refresh token.

        Raises AuthenticationException if the token is invalid, expired, or wrong type.
        Raises DatabaseException on unexpected database errors.
        """
        try:
            payload = decode_token(token)
            if not payload or payload.get("type") != "refresh":
                raise AuthenticationException("Invalid or expired refresh token")

            sub = payload.get("sub")
            if not sub:
                raise AuthenticationException("Invalid or expired refresh token")

            user = self.user_repo.get(db, int(sub))
            if not user or not user.is_active:
                raise AuthenticationException("Invalid or expired refresh token")

            return Token(
                access_token=create_access_token(user.id),
                refresh_token=create_refresh_token(user.id),
            )
        except AppException:
            raise
        except SQLAlchemyError as e:
            logger.error(
                "refresh_token_db_error",
                extra={"error": str(e), "error_type": type(e).__name__},
            )
            raise DatabaseException("Failed to refresh token due to database error")
