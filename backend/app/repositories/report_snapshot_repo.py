from sqlalchemy.orm import Session

from app.models.report_snapshot import ReportSnapshot
from app.repositories.base import BaseRepository


class ReportSnapshotRepository(BaseRepository[ReportSnapshot]):
    def __init__(self) -> None:
        super().__init__(ReportSnapshot)

    def list_reports(
        self, db: Session, skip: int = 0, limit: int = 100
    ) -> tuple[int, list[ReportSnapshot]]:
        query = db.query(ReportSnapshot).order_by(ReportSnapshot.report_date.desc())
        return query.count(), query.offset(skip).limit(limit).all()
