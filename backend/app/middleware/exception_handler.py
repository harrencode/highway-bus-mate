"""
Exception Handler Middleware

Centralised exception handling — converts domain exceptions to standardised HTTP responses.
"""

import logging

from fastapi import HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.core.exceptions import AppException
from app.schemas.common import APIResponse, ErrorCode, ResponseStatus

logger = logging.getLogger(__name__)

# Map error codes to HTTP status codes
STATUS_CODE_MAP = {
    "NOT_FOUND": 404,
    "VALIDATION_ERROR": 422,
    "CONFLICT": 409,
    "UNAUTHORIZED": 401,
    "FORBIDDEN": 403,
    "EXTERNAL_SERVICE_ERROR": 502,
    "INTERNAL_ERROR": 500,
    "BAD_REQUEST": 400,
    "UNPROCESSABLE_ENTITY": 422,
}

# Map HTTP status codes to error codes
ERROR_CODE_MAP = {
    400: ErrorCode.BAD_REQUEST,
    401: ErrorCode.UNAUTHORIZED,
    403: ErrorCode.FORBIDDEN,
    404: ErrorCode.NOT_FOUND,
    409: ErrorCode.CONFLICT,
    422: ErrorCode.UNPROCESSABLE_ENTITY,
    500: ErrorCode.INTERNAL_ERROR,
}


async def exception_handler(request: Request, exc: AppException) -> JSONResponse:
    """Handle application-level exceptions."""
    http_status_code = STATUS_CODE_MAP.get(exc.error_code.value, 500)
    log = logger.error if http_status_code >= 500 else logger.warning
    log(
        "api_exception_handled",
        extra={
            "path": request.url.path,
            "method": request.method,
            "error_code": exc.error_code.value,
            "error_message": exc.message,
            "error_details": exc.details,
        },
    )
    response = APIResponse(
        data=None,
        status=ResponseStatus.ERROR,
        message=exc.message,
        error_code=exc.error_code,
    )
    return JSONResponse(status_code=http_status_code, content=response.model_dump())


async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    """Handle FastAPI HTTPException."""
    log = logger.error if exc.status_code >= 500 else logger.warning
    log(
        "http_exception_handled",
        extra={
            "path": request.url.path,
            "method": request.method,
            "status_code": exc.status_code,
            "error_message": str(exc.detail),
        },
    )
    error_code = ERROR_CODE_MAP.get(exc.status_code, ErrorCode.INTERNAL_ERROR)
    response = APIResponse(
        data=None,
        status=ResponseStatus.ERROR,
        message=str(exc.detail),
        error_code=error_code,
    )
    return JSONResponse(status_code=exc.status_code, content=response.model_dump())


async def validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    """Handle Pydantic validation errors."""
    errors = exc.errors()
    message = "; ".join(f"{'.'.join(str(loc) for loc in e['loc'])}: {e['msg']}" for e in errors)
    response = APIResponse(
        data=None,
        status=ResponseStatus.ERROR,
        message=message,
        error_code=ErrorCode.VALIDATION_ERROR,
    )
    return JSONResponse(status_code=422, content=response.model_dump())


async def general_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Catch-all for unexpected errors."""
    logger.exception("unhandled_exception", extra={"path": request.url.path})
    response = APIResponse(
        data=None,
        status=ResponseStatus.ERROR,
        message="An unexpected error occurred",
        error_code=ErrorCode.INTERNAL_ERROR,
    )
    return JSONResponse(status_code=500, content=response.model_dump())
