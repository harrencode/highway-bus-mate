from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, field_validator

from app.models.enums import RecordStatus


class RouteCreate(BaseModel):
    origin: str
    destination: str
    province_origin: str | None = None
    province_destination: str | None = None
    distance_km: Decimal | None = None
    estimated_minutes: int | None = None
    status: RecordStatus = RecordStatus.ACTIVE

    @field_validator("origin", "destination")
    @classmethod
    def strip_required(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Value is required")
        return value


class RouteUpdate(BaseModel):
    origin: str | None = None
    destination: str | None = None
    province_origin: str | None = None
    province_destination: str | None = None
    distance_km: Decimal | None = None
    estimated_minutes: int | None = None
    status: RecordStatus | None = None


class RouteResponse(BaseModel):
    id: int
    origin: str
    destination: str
    province_origin: str | None
    province_destination: str | None
    distance_km: Decimal | None
    estimated_minutes: int | None
    status: RecordStatus
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
