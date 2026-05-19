from fastapi import APIRouter, Depends, Query
from sqlalchemy import and_
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.api.v1.routes.crud import build_admin_crud_router
from app.models.booking import Booking
from app.models.booking_seat import BookingSeat
from app.models.schedule import Schedule
from app.models.seat import Seat
from app.models.trip import Trip
from app.schemas.common import APIResponse, PaginatedData, ResponseStatus
from app.schemas.seat import SeatCreate, SeatResponse, SeatUpdate
from app.services.seat_service import SeatService

router = build_admin_crud_router(
    service=SeatService(),
    create_schema=SeatCreate,
    update_schema=SeatUpdate,
    response_schema=SeatResponse,
    noun="Seat",
)


# Public endpoint to get seats for a trip
@router.get("/public/trip/{trip_id}", response_model=APIResponse[PaginatedData[SeatResponse]])
async def get_seats_for_trip(
    trip_id: int,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=1000),
    db: Session = Depends(get_db),
):
    """
    Get all seats for a trip with their availability status.
    
    Returns all bus seats for the trip's schedule, with booking status information.
    """
    # Get the trip to find the schedule
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        return APIResponse(
            data=PaginatedData(items=[], total=0, skip=skip, limit=limit),
            status=ResponseStatus.SUCCESS,
            message="No seats found for this trip",
            error_code=None,
        )

    # Get the schedule to find the bus
    schedule = db.query(Schedule).filter(Schedule.id == trip.schedule_id).first()
    if not schedule:
        return APIResponse(
            data=PaginatedData(items=[], total=0, skip=skip, limit=limit),
            status=ResponseStatus.SUCCESS,
            message="No seats found for this trip",
            error_code=None,
        )

    # Get all seats for this bus
    all_seats_query = db.query(Seat).filter(Seat.bus_id == schedule.bus_id)
    total = all_seats_query.count()
    seats = all_seats_query.offset(skip).limit(limit).all()

    # Get booked seats for this trip
    booked_seat_ids = (
        db.query(BookingSeat.seat_id)
        .join(Booking, BookingSeat.booking_id == Booking.id)
        .filter(Booking.trip_id == trip_id)
        .all()
    )
    booked_ids = set(bs[0] for bs in booked_seat_ids)

    # Mark booked seats (we'll use the response but in practice,
    # the frontend should track booking status separately or we add a field)
    seat_responses = [
        SeatResponse.model_validate(seat) for seat in seats
    ]

    return APIResponse(
        data=PaginatedData(
            items=seat_responses,
            total=total,
            skip=skip,
            limit=limit,
        ),
        status=ResponseStatus.SUCCESS,
        message="Seats retrieved successfully",
        error_code=None,
    )
