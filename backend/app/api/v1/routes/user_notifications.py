from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.common import APIResponse, ResponseStatus
from app.schemas.user_notification import UserNotificationResponse
from app.services.user_notification_service import UserNotificationService

router = APIRouter()
service = UserNotificationService()


@router.get("/me", response_model=APIResponse[list[UserNotificationResponse]])
async def list_my_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    notifications = service.list_for_user(db, current_user.id)
    return APIResponse(
        data=[UserNotificationResponse.model_validate(item) for item in notifications],
        status=ResponseStatus.SUCCESS,
        message="Notifications retrieved successfully",
        error_code=None,
    )


@router.post("/{notification_id}/read", response_model=APIResponse[UserNotificationResponse])
async def mark_notification_read(
    notification_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    notification = service.mark_read(db, notification_id)
    return APIResponse(
        data=UserNotificationResponse.model_validate(notification),
        status=ResponseStatus.SUCCESS,
        message="Notification marked as read",
        error_code=None,
    )
