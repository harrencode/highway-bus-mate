from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.common import APIResponse, ResponseStatus
from app.schemas.saved_route import SavedRouteCreate, SavedRouteResponse
from app.services.saved_route_service import SavedRouteService

router = APIRouter()
service = SavedRouteService()


@router.post(
    "/me", response_model=APIResponse[SavedRouteResponse], status_code=status.HTTP_201_CREATED
)
async def save_route(
    body: SavedRouteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    saved_route = service.save_for_user(db, current_user.id, body.route_id)
    return APIResponse(
        data=SavedRouteResponse.model_validate(saved_route),
        status=ResponseStatus.SUCCESS,
        message="Route saved successfully",
        error_code=None,
    )


@router.get("/me", response_model=APIResponse[list[SavedRouteResponse]])
async def list_saved_routes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    saved_routes = service.list_for_user(db, current_user.id)
    return APIResponse(
        data=[SavedRouteResponse.model_validate(item) for item in saved_routes],
        status=ResponseStatus.SUCCESS,
        message="Saved routes retrieved successfully",
        error_code=None,
    )
