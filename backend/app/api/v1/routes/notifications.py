from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin_user, get_db
from app.models.user import User
from app.schemas.common import APIResponse, PaginatedData, ResponseStatus
from app.schemas.notification import NotificationCreate, NotificationResponse, NotificationUpdate
from app.services.notification_service import NotificationService

router = APIRouter()
service = NotificationService()


@router.post(
    "", response_model=APIResponse[NotificationResponse], status_code=status.HTTP_201_CREATED
)
async def create_notification(
    body: NotificationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    notification = service.create(
        db, {**body.model_dump(exclude_unset=True), "sent_by": current_user.id}
    )
    return APIResponse(
        data=NotificationResponse.model_validate(notification),
        status=ResponseStatus.SUCCESS,
        message="Notification sent successfully",
        error_code=None,
    )


@router.get("", response_model=APIResponse[PaginatedData[NotificationResponse]])
async def list_notifications(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=1000),
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin_user),
):
    total, notifications = service.list_items(db, skip=skip, limit=limit)
    return APIResponse(
        data=PaginatedData(
            items=[NotificationResponse.model_validate(item) for item in notifications],
            total=total,
            skip=skip,
            limit=limit,
        ),
        status=ResponseStatus.SUCCESS,
        message="Notifications retrieved successfully",
        error_code=None,
    )


@router.patch("/{notification_id}", response_model=APIResponse[NotificationResponse])
async def update_notification(
    notification_id: int,
    body: NotificationUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin_user),
):
    notification = service.update(db, notification_id, body)
    return APIResponse(
        data=NotificationResponse.model_validate(notification),
        status=ResponseStatus.SUCCESS,
        message="Notification updated successfully",
        error_code=None,
    )
