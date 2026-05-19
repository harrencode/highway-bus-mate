"""
Health check and version information endpoints.
"""

from fastapi import APIRouter

from app.core.versioning import get_api_version_info
from app.schemas.common import APIResponse, MessageResponse, ResponseStatus

router = APIRouter(tags=["health"])


@router.get("/health", response_model=APIResponse[MessageResponse])
def health_check():
    """Health check endpoint."""
    return APIResponse(
        data=MessageResponse(message="Service is healthy"),
        status=ResponseStatus.SUCCESS,
        message="Health check passed",
        error_code=None,
    )


@router.get("/version", response_model=APIResponse[dict])
def get_version():
    """API version information."""
    return APIResponse(
        data=get_api_version_info(),
        status=ResponseStatus.SUCCESS,
        message="Version information retrieved successfully",
        error_code=None,
    )
