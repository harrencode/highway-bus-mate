from datetime import datetime

from pydantic import BaseModel, ConfigDict


class SavedRouteCreate(BaseModel):
    route_id: int


class SavedRouteAdminCreate(BaseModel):
    user_id: int
    route_id: int


class SavedRouteResponse(BaseModel):
    id: int
    user_id: int
    route_id: int
    saved_at: datetime

    model_config = ConfigDict(from_attributes=True)
