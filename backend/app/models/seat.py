from sqlalchemy import Boolean, Enum, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.models.enums import SeatClass


class Seat(Base):
    __tablename__ = "seats"
    __table_args__ = (UniqueConstraint("bus_id", "seat_number", name="uq_bus_seat_number"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    bus_id: Mapped[int] = mapped_column(ForeignKey("buses.id"), nullable=False, index=True)
    seat_number: Mapped[str] = mapped_column(String(10), nullable=False)
    seat_class: Mapped[SeatClass] = mapped_column(
        Enum(SeatClass, values_callable=lambda x: [e.value for e in x]),
        nullable=False,
        default=SeatClass.STANDARD,
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
