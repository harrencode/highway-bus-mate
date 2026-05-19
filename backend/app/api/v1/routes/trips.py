from datetime import date

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.api.v1.routes.crud import build_admin_crud_router
from app.schemas.common import APIResponse, PaginatedData, ResponseStatus
from app.schemas.trip import TripCreate, TripResponse, TripUpdate
from app.services.trip_service import TripService

service = TripService()
router = APIRouter()


@router.get("/public/search", response_model=APIResponse[PaginatedData[TripResponse]])
async def search_trips(
    trip_date: date | None = Query(default=None),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=1000),
    db: Session = Depends(get_db),
):
    total, trips = service.list_items(db, skip=skip, limit=limit, trip_date=trip_date)
    return APIResponse(
        data=PaginatedData(
            items=[TripResponse.model_validate(trip) for trip in trips],
            total=total,
            skip=skip,
            limit=limit,
        ),
        status=ResponseStatus.SUCCESS,
        message="Trips retrieved successfully",
        error_code=None,
    )


router.routes.extend(
    build_admin_crud_router(
        service=service,
        create_schema=TripCreate,
        update_schema=TripUpdate,
        response_schema=TripResponse,
        noun="Trip",
    ).routes
)
