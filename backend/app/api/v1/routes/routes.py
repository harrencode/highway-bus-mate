from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.api.v1.routes.crud import build_admin_crud_router
from app.schemas.common import APIResponse, PaginatedData, ResponseStatus
from app.schemas.route import RouteCreate, RouteResponse, RouteUpdate
from app.services.route_service import RouteService

service = RouteService()
router = APIRouter()


@router.get("/public/search", response_model=APIResponse[PaginatedData[RouteResponse]])
async def search_routes(
    query: str = Query(..., min_length=1),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=1000),
    db: Session = Depends(get_db),
):
    total, routes = service.search(db, query=query, skip=skip, limit=limit)
    return APIResponse(
        data=PaginatedData(
            items=[RouteResponse.model_validate(route) for route in routes],
            total=total,
            skip=skip,
            limit=limit,
        ),
        status=ResponseStatus.SUCCESS,
        message="Routes retrieved successfully",
        error_code=None,
    )


router.routes.extend(
    build_admin_crud_router(
        service=service,
        create_schema=RouteCreate,
        update_schema=RouteUpdate,
        response_schema=RouteResponse,
        noun="Route",
    ).routes
)
