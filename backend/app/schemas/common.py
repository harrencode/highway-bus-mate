"""
Common Schemas

Shared Pydantic schemas used across multiple modules.
"""

from enum import Enum
from typing import Generic, TypeVar

from pydantic import BaseModel, ConfigDict, Field

DataT = TypeVar("DataT")


class ResponseStatus(str, Enum):
    SUCCESS = "success"
    ERROR = "error"
    PENDING = "pending"


class ErrorCode(str, Enum):
    """Error codes enum - only used when status is ERROR or PENDING."""

    NOT_FOUND = "NOT_FOUND"
    VALIDATION_ERROR = "VALIDATION_ERROR"
    UNAUTHORIZED = "UNAUTHORIZED"
    FORBIDDEN = "FORBIDDEN"
    INTERNAL_ERROR = "INTERNAL_ERROR"
    CONFLICT = "CONFLICT"
    BAD_REQUEST = "BAD_REQUEST"
    UNPROCESSABLE_ENTITY = "UNPROCESSABLE_ENTITY"
    EXTERNAL_SERVICE_ERROR = "EXTERNAL_SERVICE_ERROR"


class APIResponse(BaseModel, Generic[DataT]):
    """Standard API response wrapper."""

    model_config = ConfigDict(use_enum_values=True)

    data: DataT | None = None
    status: ResponseStatus = ResponseStatus.SUCCESS
    message: str = Field(default="Operation completed successfully")
    error_code: ErrorCode | None = None


class PaginatedData(BaseModel, Generic[DataT]):
    """Paginated data wrapper."""

    items: list[DataT]
    total: int
    skip: int
    limit: int


class MessageResponse(BaseModel):
    """Simple message response schema."""

    message: str


class ErrorResponse(BaseModel):
    """Error response schema."""

    error: str
    detail: str | None = None
