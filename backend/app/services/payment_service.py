import logging

from app.models.payment import Payment
from app.repositories.payment_repo import PaymentRepository
from app.services.crud_service import CrudService

logger = logging.getLogger(__name__)


class PaymentService(CrudService[Payment]):
    resource_name = "Payment"

    def __init__(self) -> None:
        super().__init__(PaymentRepository())
