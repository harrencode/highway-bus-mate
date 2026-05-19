from fastapi import APIRouter

from app.api.v1.routes import (
    auth,
    booking_seats,
    bookings,
    buses,
    contributions,
    health,
    notifications,
    payments,
    pricing,
    reports,
    reviews,
    route_stops,
    routes,
    saved_routes,
    schedules,
    seats,
    tickets,
    trips,
    user_notifications,
    users,
)

v1_router = APIRouter()

# Health & version endpoints
v1_router.include_router(health.router)

# Authentication routes
v1_router.include_router(auth.router, prefix="/auth", tags=["auth"])

# User routes
v1_router.include_router(users.router, prefix="/users", tags=["users"])
v1_router.include_router(routes.router, prefix="/routes", tags=["routes"])
v1_router.include_router(route_stops.router, prefix="/route-stops", tags=["route-stops"])
v1_router.include_router(buses.router, prefix="/buses", tags=["buses"])
v1_router.include_router(seats.router, prefix="/seats", tags=["seats"])
v1_router.include_router(schedules.router, prefix="/schedules", tags=["schedules"])
v1_router.include_router(trips.router, prefix="/trips", tags=["trips"])
v1_router.include_router(pricing.router, prefix="/pricing", tags=["pricing"])
v1_router.include_router(bookings.router, prefix="/bookings", tags=["bookings"])
v1_router.include_router(booking_seats.router, prefix="/booking-seats", tags=["booking-seats"])
v1_router.include_router(payments.router, prefix="/payments", tags=["payments"])
v1_router.include_router(tickets.router, prefix="/tickets", tags=["tickets"])
v1_router.include_router(contributions.router, prefix="/contributions", tags=["contributions"])
v1_router.include_router(notifications.router, prefix="/notifications", tags=["notifications"])
v1_router.include_router(
    user_notifications.router, prefix="/user-notifications", tags=["user-notifications"]
)
v1_router.include_router(saved_routes.router, prefix="/saved-routes", tags=["saved-routes"])
v1_router.include_router(reviews.router, prefix="/reviews", tags=["reviews"])
v1_router.include_router(reports.router, prefix="/reports", tags=["reports"])
