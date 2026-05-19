from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class BookingSeatCreate(BaseModel):
    booking_id: int
    seat_id: int
    seat_fare: Decimal = Field(..., ge=0)


class BookingSeatUpdate(BaseModel):
    booking_id: int | None = None
    seat_id: int | None = None
    seat_fare: Decimal | None = Field(default=None, ge=0)


class BookingSeatResponse(BaseModel):
    id: int
    booking_id: int
    seat_id: int
    seat_fare: Decimal

    model_config = ConfigDict(from_attributes=True)
