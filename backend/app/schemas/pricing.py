from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import BusType


class PricingCreate(BaseModel):
    route_id: int
    bus_type: BusType
    base_fare: Decimal = Field(..., ge=0)
    per_km_rate: Decimal = Field(..., ge=0)
    effective_from: datetime | None = None
    effective_until: datetime | None = None
    is_active: bool = True


class PricingUpdate(BaseModel):
    route_id: int | None = None
    bus_type: BusType | None = None
    base_fare: Decimal | None = Field(default=None, ge=0)
    per_km_rate: Decimal | None = Field(default=None, ge=0)
    effective_from: datetime | None = None
    effective_until: datetime | None = None
    is_active: bool | None = None


class PricingResponse(BaseModel):
    id: int
    route_id: int
    bus_type: BusType
    base_fare: Decimal
    per_km_rate: Decimal
    effective_from: datetime
    effective_until: datetime | None
    is_active: bool

    model_config = ConfigDict(from_attributes=True)
