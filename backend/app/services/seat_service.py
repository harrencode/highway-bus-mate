import logging

from app.models.seat import Seat
from app.repositories.seat_repo import SeatRepository
from app.services.crud_service import CrudService

logger = logging.getLogger(__name__)


class SeatService(CrudService[Seat]):
    resource_name = "Seat"

    def __init__(self) -> None:
        super().__init__(SeatRepository())
