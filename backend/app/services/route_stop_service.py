import logging

from app.models.route_stop import RouteStop
from app.repositories.route_stop_repo import RouteStopRepository
from app.services.crud_service import CrudService

logger = logging.getLogger(__name__)


class RouteStopService(CrudService[RouteStop]):
    resource_name = "Route stop"

    def __init__(self) -> None:
        super().__init__(RouteStopRepository())
