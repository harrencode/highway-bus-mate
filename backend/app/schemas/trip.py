from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import TripStatus


class TripCreate(BaseModel):
    schedule_id: int
    trip_date: date
    available_seats: int = Field(..., ge=0)
    status: TripStatus = TripStatus.SCHEDULED


class TripUpdate(BaseModel):
    schedule_id: int | None = None
    trip_date: date | None = None
    available_seats: int | None = Field(default=None, ge=0)
    status: TripStatus | None = None


class TripResponse(BaseModel):
    id: int
    schedule_id: int
    trip_date: date
    available_seats: int
    status: TripStatus
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
