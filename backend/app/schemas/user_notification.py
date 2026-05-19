from datetime import datetime

from pydantic import BaseModel, ConfigDict


class UserNotificationCreate(BaseModel):
    notification_id: int
    user_id: int
    is_read: bool = False


class UserNotificationUpdate(BaseModel):
    is_read: bool | None = None
    read_at: datetime | None = None


class UserNotificationResponse(BaseModel):
    id: int
    notification_id: int
    user_id: int
    is_read: bool
    read_at: datetime | None

    model_config = ConfigDict(from_attributes=True)
