import logging
from datetime import UTC, datetime
from uuid import uuid4

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.exceptions import AppException, DatabaseException
from app.models.ticket import Ticket
from app.repositories.ticket_repo import TicketRepository
from app.schemas.ticket import TicketCreate
from app.services.crud_service import CrudService

logger = logging.getLogger(__name__)


class TicketService(CrudService[Ticket]):
    resource_name = "Ticket"

    def __init__(self) -> None:
        super().__init__(TicketRepository())
        self.repo: TicketRepository

    def create(self, db: Session, data: TicketCreate) -> Ticket:
        try:
            payload = data.model_dump(exclude_unset=True)
            payload["qr_code"] = payload.get("qr_code") or f"TICKET-{uuid4().hex}"
            return self.repo.create(db, payload)
        except SQLAlchemyError as e:
            db.rollback()
            logger.error(
                "create_ticket_db_error", extra={"error": str(e), "error_type": type(e).__name__}
            )
            raise DatabaseException("Failed to create ticket")

    def verify(self, db: Session, id: int) -> Ticket:
        try:
            ticket = self.get(db, id)
            return self.repo.update(
                db, ticket, {"is_verified": True, "verified_at": datetime.now(UTC)}
            )
        except AppException:
            raise
        except SQLAlchemyError as e:
            db.rollback()
            logger.error(
                "verify_ticket_db_error",
                extra={"error": str(e), "error_type": type(e).__name__, "id": id},
            )
            raise DatabaseException("Failed to verify ticket")
