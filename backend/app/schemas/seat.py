from pydantic import BaseModel, ConfigDict

from app.models.enums import SeatClass


class SeatCreate(BaseModel):
    bus_id: int
    seat_number: str
    seat_class: SeatClass = SeatClass.STANDARD
    is_active: bool = True


class SeatUpdate(BaseModel):
    bus_id: int | None = None
    seat_number: str | None = None
    seat_class: SeatClass | None = None
    is_active: bool | None = None


class SeatResponse(BaseModel):
    id: int
    bus_id: int
    seat_number: str
    seat_class: SeatClass
    is_active: bool

    model_config = ConfigDict(from_attributes=True)
