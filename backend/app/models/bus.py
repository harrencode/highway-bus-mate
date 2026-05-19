from datetime import UTC, datetime

from sqlalchemy import DateTime, Enum, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.models.enums import BusType, RecordStatus


class Bus(Base):
    __tablename__ = "buses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    registration_no: Mapped[str] = mapped_column(String(30), unique=True, nullable=False)
    operator_name: Mapped[str] = mapped_column(String(150), nullable=False)
    operator_phone: Mapped[str | None] = mapped_column(String(30), nullable=True)
    bus_type: Mapped[BusType] = mapped_column(
        Enum(BusType, values_callable=lambda x: [e.value for e in x]), nullable=False
    )
    total_seats: Mapped[int] = mapped_column(Integer, nullable=False)
    status: Mapped[RecordStatus] = mapped_column(
        Enum(RecordStatus, values_callable=lambda x: [e.value for e in x]),
        nullable=False,
        default=RecordStatus.PENDING,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False
    )
