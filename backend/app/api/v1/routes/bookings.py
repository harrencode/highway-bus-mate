from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin_user, get_current_user, get_db
from app.models.user import User
from app.schemas.booking import BookingAdminCreate, BookingCreate, BookingResponse, BookingUpdate
from app.schemas.common import APIResponse, PaginatedData, ResponseStatus
from app.services.booking_service import BookingService

router = APIRouter()
service = BookingService()


@router.post(
    "/me", response_model=APIResponse[BookingResponse], status_code=status.HTTP_201_CREATED
)
async def create_my_booking(
    body: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    booking = service.create_for_user(db, current_user.id, body)
    return APIResponse(
        data=BookingResponse.model_validate(booking),
        status=ResponseStatus.SUCCESS,
        message="Booking created successfully",
        error_code=None,
    )


@router.get("/me", response_model=APIResponse[list[BookingResponse]])
async def list_my_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    bookings = service.list_for_user(db, current_user.id)
    return APIResponse(
        data=[BookingResponse.model_validate(booking) for booking in bookings],
        status=ResponseStatus.SUCCESS,
        message="Bookings retrieved successfully",
        error_code=None,
    )


@router.post("", response_model=APIResponse[BookingResponse], status_code=status.HTTP_201_CREATED)
async def create_booking(
    body: BookingAdminCreate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin_user),
):
    booking = service.create(db, body)
    return APIResponse(
        data=BookingResponse.model_validate(booking),
        status=ResponseStatus.SUCCESS,
        message="Booking created successfully",
        error_code=None,
    )


@router.get("", response_model=APIResponse[PaginatedData[BookingResponse]])
async def list_bookings(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=1000),
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin_user),
):
    total, bookings = service.list_items(db, skip=skip, limit=limit)
    return APIResponse(
        data=PaginatedData(
            items=[BookingResponse.model_validate(booking) for booking in bookings],
            total=total,
            skip=skip,
            limit=limit,
        ),
        status=ResponseStatus.SUCCESS,
        message="Bookings retrieved successfully",
        error_code=None,
    )


@router.get("/{booking_id}", response_model=APIResponse[BookingResponse])
async def get_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin_user),
):
    booking = service.get(db, booking_id)
    return APIResponse(
        data=BookingResponse.model_validate(booking),
        status=ResponseStatus.SUCCESS,
        message="Booking retrieved successfully",
        error_code=None,
    )


@router.patch("/{booking_id}", response_model=APIResponse[BookingResponse])
async def update_booking(
    booking_id: int,
    body: BookingUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin_user),
):
    booking = service.update(db, booking_id, body)
    return APIResponse(
        data=BookingResponse.model_validate(booking),
        status=ResponseStatus.SUCCESS,
        message="Booking updated successfully",
        error_code=None,
    )


@router.post("/{booking_id}/cancel", response_model=APIResponse[BookingResponse])
async def cancel_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    booking = service.cancel(db, booking_id)
    return APIResponse(
        data=BookingResponse.model_validate(booking),
        status=ResponseStatus.SUCCESS,
        message="Booking cancelled successfully",
        error_code=None,
    )
