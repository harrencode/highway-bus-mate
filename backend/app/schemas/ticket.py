from datetime import datetime

from pydantic import BaseModel, ConfigDict


class TicketCreate(BaseModel):
    booking_id: int
    qr_code: str | None = None


class TicketUpdate(BaseModel):
    qr_code: str | None = None
    is_verified: bool | None = None
    verified_at: datetime | None = None


class TicketResponse(BaseModel):
    id: int
    booking_id: int
    qr_code: str
    is_verified: bool
    verified_at: datetime | None
    issued_at: datetime

    model_config = ConfigDict(from_attributes=True)
