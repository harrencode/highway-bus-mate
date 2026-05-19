from app.api.v1.routes.crud import build_admin_crud_router
from app.schemas.route_stop import RouteStopCreate, RouteStopResponse, RouteStopUpdate
from app.services.route_stop_service import RouteStopService

router = build_admin_crud_router(
    service=RouteStopService(),
    create_schema=RouteStopCreate,
    update_schema=RouteStopUpdate,
    response_schema=RouteStopResponse,
    noun="Route stop",
)
