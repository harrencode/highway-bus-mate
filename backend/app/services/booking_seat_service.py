import logging

from app.models.booking_seat import BookingSeat
from app.repositories.booking_seat_repo import BookingSeatRepository
from app.services.crud_service import CrudService

logger = logging.getLogger(__name__)


class BookingSeatService(CrudService[BookingSeat]):
    resource_name = "Booking seat"

    def __init__(self) -> None:
        super().__init__(BookingSeatRepository())
