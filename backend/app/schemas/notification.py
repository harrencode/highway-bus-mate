from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.enums import NotificationTargetScope, NotificationType


class NotificationCreate(BaseModel):
    title: str
    body: str
    type: NotificationType
    target_scope: NotificationTargetScope
    target_route_id: int | None = None


class NotificationUpdate(BaseModel):
    title: str | None = None
    body: str | None = None
    type: NotificationType | None = None
    target_scope: NotificationTargetScope | None = None
    target_route_id: int | None = None


class NotificationResponse(BaseModel):
    id: int
    sent_by: int | None
    title: str
    body: str
    type: NotificationType
    target_scope: NotificationTargetScope
    target_route_id: int | None
    sent_at: datetime

    model_config = ConfigDict(from_attributes=True)
