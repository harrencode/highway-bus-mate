from datetime import date, time

from sqlalchemy import Date, Enum, ForeignKey, Integer, String, Time
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.models.enums import RecordStatus


class Schedule(Base):
    __tablename__ = "schedules"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    bus_id: Mapped[int] = mapped_column(ForeignKey("buses.id"), nullable=False, index=True)
    route_id: Mapped[int] = mapped_column(ForeignKey("routes.id"), nullable=False, index=True)
    departure_time: Mapped[time] = mapped_column(Time(), nullable=False)
    arrival_time: Mapped[time] = mapped_column(Time(), nullable=False)
    days_of_week: Mapped[str] = mapped_column(String(80), nullable=False)
    valid_from: Mapped[date] = mapped_column(Date(), nullable=False)
    valid_until: Mapped[date | None] = mapped_column(Date(), nullable=True)
    status: Mapped[RecordStatus] = mapped_column(
        Enum(RecordStatus, values_callable=lambda x: [e.value for e in x]),
        nullable=False,
        default=RecordStatus.ACTIVE,
    )
