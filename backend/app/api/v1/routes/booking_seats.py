from app.api.v1.routes.crud import build_admin_crud_router
from app.schemas.booking_seat import BookingSeatCreate, BookingSeatResponse, BookingSeatUpdate
from app.services.booking_seat_service import BookingSeatService

router = build_admin_crud_router(
    service=BookingSeatService(),
    create_schema=BookingSeatCreate,
    update_schema=BookingSeatUpdate,
    response_schema=BookingSeatResponse,
    noun="Booking seat",
)
