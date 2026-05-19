import logging

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.exceptions import DatabaseException
from app.models.report_snapshot import ReportSnapshot
from app.repositories.report_snapshot_repo import ReportSnapshotRepository
from app.services.crud_service import CrudService

logger = logging.getLogger(__name__)


class ReportSnapshotService(CrudService[ReportSnapshot]):
    resource_name = "Report snapshot"

    def __init__(self) -> None:
        super().__init__(ReportSnapshotRepository())
        self.repo: ReportSnapshotRepository

    def list_items(
        self, db: Session, skip: int = 0, limit: int = 100
    ) -> tuple[int, list[ReportSnapshot]]:
        try:
            return self.repo.list_reports(db, skip=skip, limit=limit)
        except SQLAlchemyError as e:
            logger.error(
                "list_reports_db_error", extra={"error": str(e), "error_type": type(e).__name__}
            )
            raise DatabaseException("Failed to list report snapshots")
