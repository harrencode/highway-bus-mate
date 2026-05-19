import logging

from app.models.pricing import Pricing
from app.repositories.pricing_repo import PricingRepository
from app.services.crud_service import CrudService

logger = logging.getLogger(__name__)


class PricingService(CrudService[Pricing]):
    resource_name = "Pricing"

    def __init__(self) -> None:
        super().__init__(PricingRepository())
