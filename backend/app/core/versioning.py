"""
API Versioning utilities for managing multiple API versions.
"""

from fastapi import APIRouter, FastAPI

from app.utils.constants import API_VERSION_AVAILABLE, API_VERSION_CURRENT


class APIVersioning:
    """Handle API versioning through URL paths."""

    @staticmethod
    def get_current_version() -> str:
        return API_VERSION_CURRENT

    @staticmethod
    def get_available_versions() -> list[str]:
        return API_VERSION_AVAILABLE

    @staticmethod
    def register_versioned_router(
        app: FastAPI,
        router: APIRouter,
        version: str = "v1",
    ) -> None:
        prefix = f"/api/{version}"
        app.include_router(router, prefix=prefix)


def get_api_version_info() -> dict:
    """Get API version information for documentation."""
    return {
        "current_version": APIVersioning.get_current_version(),
        "available_versions": APIVersioning.get_available_versions(),
        "documentation": {
            "swagger": "/docs",
            "redoc": "/redoc",
            "openapi": "/openapi.json",
        },
    }
