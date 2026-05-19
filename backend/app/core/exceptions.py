"""
Custom Exceptions

Domain-specific exceptions for the application.
"""

from typing import Any

from app.schemas.common import ErrorCode


class AppException(Exception):
    """Base exception for all application errors."""

    def __init__(
        self,
        message: str,
        error_code: ErrorCode = ErrorCode.INTERNAL_ERROR,
        details: dict[str, Any] | None = None,
    ) -> None:
        self.message = message
        self.error_code = error_code
        self.details = details or {}
        super().__init__(self.message)


class NotFoundException(AppException):
    """Raised when a requested resource is not found."""

    def __init__(self, message: str, details: dict[str, Any] | None = None):
        super().__init__(message, ErrorCode.NOT_FOUND, details)


class ValidationException(AppException):
    """Raised when data validation fails."""

    def __init__(self, message: str, details: dict[str, Any] | None = None):
        super().__init__(message, ErrorCode.VALIDATION_ERROR, details)


class ConflictException(AppException):
    """Raised when there's a conflict with existing data."""

    def __init__(self, message: str, details: dict[str, Any] | None = None):
        super().__init__(message, ErrorCode.CONFLICT, details)


class AuthenticationException(AppException):
    """Raised when authentication fails."""

    def __init__(
        self, message: str = "Authentication failed", details: dict[str, Any] | None = None
    ):
        super().__init__(message, ErrorCode.UNAUTHORIZED, details)


class AuthorizationException(AppException):
    """Raised when user doesn't have permission."""

    def __init__(self, message: str = "Permission denied", details: dict[str, Any] | None = None):
        super().__init__(message, ErrorCode.FORBIDDEN, details)


class BadRequestException(AppException):
    """Raised when the request format is invalid."""

    def __init__(self, message: str = "Bad request", details: dict[str, Any] | None = None):
        super().__init__(message, ErrorCode.BAD_REQUEST, details)


class DatabaseException(AppException):
    """Raised when a database operation fails."""

    def __init__(
        self, message: str = "Database operation failed", details: dict[str, Any] | None = None
    ):
        super().__init__(message, ErrorCode.INTERNAL_ERROR, details)
