from typing import Any

from app.schemas.common import APIResponse, ErrorCode, ResponseStatus


def success_response(
    message: str = "Operation completed successfully", data: Any = None
) -> APIResponse:
    return APIResponse(
        status=ResponseStatus.SUCCESS,
        message=message,
        data=data,
    )


def created_response(message: str = "Created successfully", data: Any = None) -> APIResponse:
    return APIResponse(
        status=ResponseStatus.SUCCESS,
        message=message,
        data=data,
    )


def error_response(
    message: str, error_code: ErrorCode | None = ErrorCode.INTERNAL_ERROR
) -> APIResponse:
    return APIResponse(
        status=ResponseStatus.ERROR,
        message=message,
        error_code=error_code,
    )
