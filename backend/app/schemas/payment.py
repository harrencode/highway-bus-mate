from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import PaymentMethod, PaymentStatus


class PaymentCreate(BaseModel):
    booking_id: int
    amount: Decimal = Field(..., ge=0)
    method: PaymentMethod
    transaction_ref: str | None = None
    status: PaymentStatus = PaymentStatus.PENDING
    paid_at: datetime | None = None


class PaymentUpdate(BaseModel):
    amount: Decimal | None = Field(default=None, ge=0)
    method: PaymentMethod | None = None
    transaction_ref: str | None = None
    status: PaymentStatus | None = None
    paid_at: datetime | None = None


class PaymentResponse(BaseModel):
    id: int
    booking_id: int
    amount: Decimal
    method: PaymentMethod
    transaction_ref: str | None
    status: PaymentStatus
    paid_at: datetime | None

    model_config = ConfigDict(from_attributes=True)
