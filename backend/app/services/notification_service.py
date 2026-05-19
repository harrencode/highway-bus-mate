import logging

from app.models.notification import Notification
from app.repositories.notification_repo import NotificationRepository
from app.services.crud_service import CrudService

logger = logging.getLogger(__name__)


class NotificationService(CrudService[Notification]):
    resource_name = "Notification"

    def __init__(self) -> None:
        super().__init__(NotificationRepository())
