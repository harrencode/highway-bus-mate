from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import BusType, RecordStatus


class BusCreate(BaseModel):
    registration_no: str
    operator_name: str
    operator_phone: str | None = None
    bus_type: BusType
    total_seats: int = Field(..., ge=1, le=100)
    status: RecordStatus = RecordStatus.PENDING


class BusUpdate(BaseModel):
    registration_no: str | None = None
    operator_name: str | None = None
    operator_phone: str | None = None
    bus_type: BusType | None = None
    total_seats: int | None = Field(default=None, ge=1, le=100)
    status: RecordStatus | None = None


class BusResponse(BaseModel):
    id: int
    registration_no: str
    operator_name: str
    operator_phone: str | None
    bus_type: BusType
    total_seats: int
    status: RecordStatus
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
