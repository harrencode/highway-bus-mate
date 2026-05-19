from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi

from app.api.router import api_router
from app.core.exceptions import AppException
from app.core.logging import setup_logging
from app.core.settings import settings
from app.core.versioning import APIVersioning
from app.middleware.exception_handler import (
    exception_handler,
    general_exception_handler,
    http_exception_handler,
    validation_exception_handler,
)
from app.middleware.logging import RequestLoggingMiddleware
from app.utils.constants import API_VERSION_CURRENT, APP_NAME


def custom_openapi(app: FastAPI):
    def _openapi():
        if app.openapi_schema:
            return app.openapi_schema
        schema = get_openapi(
            title=app.title,
            version=app.version,
            description=app.description,
            routes=app.routes,
        )

        error_schema = {
            "type": "object",
            "properties": {
                "data": {"type": "null", "example": None},
                "status": {"type": "string", "example": "error"},
                "message": {"type": "string", "example": "Error description"},
                "error_code": {"type": "string", "example": "ERROR_CODE"},
            },
        }

        error_responses = {
            "400": ("Bad Request", "BAD_REQUEST"),
            "401": ("Unauthorized", "UNAUTHORIZED"),
            "403": ("Forbidden", "FORBIDDEN"),
            "404": ("Not Found", "NOT_FOUND"),
            "409": ("Conflict", "CONFLICT"),
            "422": ("Validation Error", "VALIDATION_ERROR"),
            "500": ("Internal Server Error", "INTERNAL_ERROR"),
        }

        for path in schema.get("paths", {}).values():
            for operation in path.values():
                if not isinstance(operation, dict):
                    continue
                for status_code, (description, error_code) in error_responses.items():
                    operation.setdefault("responses", {})[status_code] = {
                        "description": description,
                        "content": {
                            "application/json": {
                                "schema": error_schema,
                                "example": {
                                    "data": None,
                                    "status": "error",
                                    "message": description,
                                    "error_code": error_code,
                                },
                            }
                        },
                    }

        app.openapi_schema = schema
        return app.openapi_schema

    return _openapi


def create_app() -> FastAPI:
    setup_logging()

    @asynccontextmanager
    async def lifespan(application: FastAPI):
        yield

    application = FastAPI(
        title=f"{APP_NAME} API",
        version=API_VERSION_CURRENT,
        description="FastAPI Auth Starter — user registration, creation, and JWT authentication",
        lifespan=lifespan,
        docs_url="/docs" if settings.APP_DEBUG else None,
        redoc_url="/redoc" if settings.APP_DEBUG else None,
        openapi_url="/openapi.json" if settings.APP_DEBUG else None,
    )

    # CORS
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Custom middleware
    application.add_middleware(RequestLoggingMiddleware)

    # Exception handlers
    application.add_exception_handler(AppException, exception_handler)  # type: ignore[arg-type]
    application.add_exception_handler(HTTPException, http_exception_handler)  # type: ignore[arg-type]
    application.add_exception_handler(RequestValidationError, validation_exception_handler)  # type: ignore[arg-type]
    application.add_exception_handler(Exception, general_exception_handler)

    # Override OpenAPI schema for standardised error responses
    application.openapi = custom_openapi(application)  # type: ignore[method-assign]  # type: ignore[method-assign]

    # Register versioned routers
    APIVersioning.register_versioned_router(application, api_router, version="v1")

    return application


app = create_app()
