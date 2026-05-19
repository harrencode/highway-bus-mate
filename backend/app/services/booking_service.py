import logging
from datetime import UTC, datetime
from uuid import uuid4

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.exceptions import AppException, DatabaseException
from app.models.booking import Booking
from app.models.enums import BookingStatus
from app.repositories.booking_repo import BookingRepository
from app.schemas.booking import BookingAdminCreate, BookingCreate
from app.services.crud_service import CrudService

logger = logging.getLogger(__name__)


class BookingService(CrudService[Booking]):
    resource_name = "Booking"

    def __init__(self) -> None:
        super().__init__(BookingRepository())
        self.repo: BookingRepository

    def create_for_user(self, db: Session, user_id: int, data: BookingCreate) -> Booking:
        try:
            return self.repo.create(
                db,
                {
                    "user_id": user_id,
                    "trip_id": data.trip_id,
                    "booking_ref": self._booking_ref(),
                    "total_fare": data.total_fare,
                },
            )
        except SQLAlchemyError as e:
            db.rollback()
            logger.error(
                "create_booking_db_error", extra={"error": str(e), "error_type": type(e).__name__}
            )
            raise DatabaseException("Failed to create booking")

    def create(self, db: Session, data: BookingAdminCreate) -> Booking:
        try:
            payload = data.model_dump(exclude_unset=True)
            payload["booking_ref"] = payload.get("booking_ref") or self._booking_ref()
            return self.repo.create(db, payload)
        except SQLAlchemyError as e:
            db.rollback()
            logger.error(
                "create_admin_booking_db_error",
                extra={"error": str(e), "error_type": type(e).__name__},
            )
            raise DatabaseException("Failed to create booking")

    def list_items(self, db: Session, skip: int = 0, limit: int = 100) -> tuple[int, list[Booking]]:
        try:
            return self.repo.list_bookings(db, skip=skip, limit=limit)
        except SQLAlchemyError as e:
            logger.error(
                "list_bookings_db_error", extra={"error": str(e), "error_type": type(e).__name__}
            )
            raise DatabaseException("Failed to list bookings")

    def list_for_user(self, db: Session, user_id: int) -> list[Booking]:
        try:
            return self.repo.list_by_user(db, user_id)
        except SQLAlchemyError as e:
            logger.error(
                "list_user_bookings_db_error",
                extra={"error": str(e), "error_type": type(e).__name__},
            )
            raise DatabaseException("Failed to list user bookings")

    def cancel(self, db: Session, id: int) -> Booking:
        try:
            booking = self.get(db, id)
            return self.repo.update(
                db,
                booking,
                {"status": BookingStatus.CANCELLED, "cancelled_at": datetime.now(UTC)},
            )
        except AppException:
            raise
        except SQLAlchemyError as e:
            db.rollback()
            logger.error(
                "cancel_booking_db_error",
                extra={"error": str(e), "error_type": type(e).__name__, "id": id},
            )
            raise DatabaseException("Failed to cancel booking")

    def _booking_ref(self) -> str:
        return f"BM-{uuid4().hex[:8].upper()}"
