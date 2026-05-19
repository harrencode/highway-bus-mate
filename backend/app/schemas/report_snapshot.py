from datetime import date, datetime
from decimal import Decimal
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class ReportSnapshotCreate(BaseModel):
    report_date: date
    total_bookings: int = Field(default=0, ge=0)
    total_revenue: Decimal = Field(default=0, ge=0)
    active_buses: int = Field(default=0, ge=0)
    new_users: int = Field(default=0, ge=0)
    route_breakdown: dict[str, Any] | None = None


class ReportSnapshotResponse(BaseModel):
    id: int
    generated_by: int | None
    report_date: date
    total_bookings: int
    total_revenue: Decimal
    active_buses: int
    new_users: int
    route_breakdown: dict[str, Any] | None
    generated_at: datetime

    model_config = ConfigDict(from_attributes=True)
