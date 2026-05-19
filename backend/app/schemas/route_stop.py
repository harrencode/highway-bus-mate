from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class RouteStopCreate(BaseModel):
    route_id: int
    stop_name: str
    stop_order: int
    distance_from_origin: Decimal | None = None


class RouteStopUpdate(BaseModel):
    route_id: int | None = None
    stop_name: str | None = None
    stop_order: int | None = None
    distance_from_origin: Decimal | None = None


class RouteStopResponse(BaseModel):
    id: int
    route_id: int
    stop_name: str
    stop_order: int
    distance_from_origin: Decimal | None

    model_config = ConfigDict(from_attributes=True)
