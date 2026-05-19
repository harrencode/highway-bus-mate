from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import BookingStatus, PaymentStatus


class BookingCreate(BaseModel):
    trip_id: int
    seat_ids: list[int] = Field(default_factory=list)
    total_fare: Decimal = Field(..., ge=0)


class BookingAdminCreate(BaseModel):
    user_id: int
    trip_id: int
    booking_ref: str | None = None
    total_fare: Decimal = Field(..., ge=0)
    status: BookingStatus = BookingStatus.PENDING
    payment_status: PaymentStatus = PaymentStatus.UNPAID


class BookingUpdate(BaseModel):
    trip_id: int | None = None
    total_fare: Decimal | None = Field(default=None, ge=0)
    status: BookingStatus | None = None
    payment_status: PaymentStatus | None = None


class BookingResponse(BaseModel):
    id: int
    user_id: int
    trip_id: int
    booking_ref: str
    total_fare: Decimal
    status: BookingStatus
    payment_status: PaymentStatus
    booked_at: datetime
    cancelled_at: datetime | None

    model_config = ConfigDict(from_attributes=True)
