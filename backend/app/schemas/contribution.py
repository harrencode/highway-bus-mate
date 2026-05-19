from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict

from app.models.enums import ContributionType, RecordStatus


class ContributionCreate(BaseModel):
    type: ContributionType
    payload: dict[str, Any]
    notes: str | None = None


class ContributionReview(BaseModel):
    status: RecordStatus
    notes: str | None = None


class ContributionUpdate(BaseModel):
    type: ContributionType | None = None
    payload: dict[str, Any] | None = None
    notes: str | None = None
    status: RecordStatus | None = None


class ContributionResponse(BaseModel):
    id: int
    submitted_by: int
    reviewed_by: int | None
    type: ContributionType
    payload: dict[str, Any]
    notes: str | None
    status: RecordStatus
    submitted_at: datetime
    reviewed_at: datetime | None

    model_config = ConfigDict(from_attributes=True)
