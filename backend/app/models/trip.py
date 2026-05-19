from datetime import UTC, date, datetime

from sqlalchemy import Date, DateTime, Enum, ForeignKey, Integer, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.models.enums import TripStatus


class Trip(Base):
    __tablename__ = "trips"
    __table_args__ = (UniqueConstraint("schedule_id", "trip_date", name="uq_schedule_trip_date"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    schedule_id: Mapped[int] = mapped_column(ForeignKey("schedules.id"), nullable=False, index=True)
    trip_date: Mapped[date] = mapped_column(Date(), nullable=False, index=True)
    available_seats: Mapped[int] = mapped_column(Integer, nullable=False)
    status: Mapped[TripStatus] = mapped_column(
        Enum(TripStatus, values_callable=lambda x: [e.value for e in x]),
        nullable=False,
        default=TripStatus.SCHEDULED,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False
    )
