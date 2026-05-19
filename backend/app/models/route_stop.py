from decimal import Decimal

from sqlalchemy import ForeignKey, Integer, Numeric, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class RouteStop(Base):
    __tablename__ = "route_stops"
    __table_args__ = (UniqueConstraint("route_id", "stop_order", name="uq_route_stop_order"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    route_id: Mapped[int] = mapped_column(ForeignKey("routes.id"), nullable=False, index=True)
    stop_name: Mapped[str] = mapped_column(String(120), nullable=False)
    stop_order: Mapped[int] = mapped_column(Integer, nullable=False)
    distance_from_origin: Mapped[Decimal | None] = mapped_column(Numeric(8, 2), nullable=True)
