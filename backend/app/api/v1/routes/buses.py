from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.api.v1.routes.crud import build_admin_crud_router
from app.schemas.bus import BusCreate, BusResponse, BusUpdate
from app.schemas.common import APIResponse, PaginatedData, ResponseStatus
from app.services.bus_service import BusService

service = BusService()
router = APIRouter()


@router.get("/public/search", response_model=APIResponse[PaginatedData[BusResponse]])
async def search_buses(
    query: str = Query(..., min_length=1),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=1000),
    db: Session = Depends(get_db),
):
    total, buses = service.search(db, query=query, skip=skip, limit=limit)
    return APIResponse(
        data=PaginatedData(
            items=[BusResponse.model_validate(bus) for bus in buses],
            total=total,
            skip=skip,
            limit=limit,
        ),
        status=ResponseStatus.SUCCESS,
        message="Buses retrieved successfully",
        error_code=None,
    )


router.routes.extend(
    build_admin_crud_router(
        service=service,
        create_schema=BusCreate,
        update_schema=BusUpdate,
        response_schema=BusResponse,
        noun="Bus",
    ).routes
)
