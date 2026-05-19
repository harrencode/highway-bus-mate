from app.api.v1.routes.crud import build_admin_crud_router
from app.schemas.schedule import ScheduleCreate, ScheduleResponse, ScheduleUpdate
from app.services.schedule_service import ScheduleService

router = build_admin_crud_router(
    service=ScheduleService(),
    create_schema=ScheduleCreate,
    update_schema=ScheduleUpdate,
    response_schema=ScheduleResponse,
    noun="Schedule",
)
