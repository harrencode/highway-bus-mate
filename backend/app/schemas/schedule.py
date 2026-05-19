from datetime import date, time

from pydantic import BaseModel, ConfigDict

from app.models.enums import RecordStatus


class ScheduleCreate(BaseModel):
    bus_id: int
    route_id: int
    departure_time: time
    arrival_time: time
    days_of_week: str
    valid_from: date
    valid_until: date | None = None
    status: RecordStatus = RecordStatus.ACTIVE


class ScheduleUpdate(BaseModel):
    bus_id: int | None = None
    route_id: int | None = None
    departure_time: time | None = None
    arrival_time: time | None = None
    days_of_week: str | None = None
    valid_from: date | None = None
    valid_until: date | None = None
    status: RecordStatus | None = None


class ScheduleResponse(BaseModel):
    id: int
    bus_id: int
    route_id: int
    departure_time: time
    arrival_time: time
    days_of_week: str
    valid_from: date
    valid_until: date | None
    status: RecordStatus

    model_config = ConfigDict(from_attributes=True)
