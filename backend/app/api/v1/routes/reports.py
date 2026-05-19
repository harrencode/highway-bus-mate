from datetime import UTC, datetime, timedelta

from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin_user, get_db
from app.models.booking import Booking
from app.models.bus import Bus
from app.models.contribution import Contribution
from app.models.enums import BookingStatus, RecordStatus
from app.models.route import Route
from app.models.schedule import Schedule
from app.models.trip import Trip
from app.models.user import User
from app.schemas.common import APIResponse, PaginatedData, ResponseStatus
from app.schemas.report_snapshot import ReportSnapshotCreate, ReportSnapshotResponse
from app.services.report_snapshot_service import ReportSnapshotService

router = APIRouter()
service = ReportSnapshotService()


def _period_start(period: str) -> datetime:
    now = datetime.now(UTC)
    if period == "this-year":
        return datetime(now.year, 1, 1, tzinfo=UTC)
    if period == "last-month":
        first_this_month = datetime(now.year, now.month, 1, tzinfo=UTC)
        last_month_end = first_this_month - timedelta(days=1)
        return datetime(last_month_end.year, last_month_end.month, 1, tzinfo=UTC)
    return datetime(now.year, now.month, 1, tzinfo=UTC)


def _period_end(period: str) -> datetime:
    now = datetime.now(UTC)
    if period == "last-month":
        return datetime(now.year, now.month, 1, tzinfo=UTC)
    return now


def _money(value: object) -> float:
    return float(value or 0)


@router.get("/stats", response_model=APIResponse[dict])
async def get_report_stats(
    period: str = Query(default="this-month"),
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin_user),
):
    start = _period_start(period)
    end = _period_end(period)

    booking_query = db.query(Booking).filter(Booking.booked_at >= start, Booking.booked_at < end)
    total_bookings = booking_query.count()
    monthly_revenue = (
        db.query(func.coalesce(func.sum(Booking.total_fare), 0))
        .filter(Booking.booked_at >= start, Booking.booked_at < end)
        .scalar()
    )
    active_users = db.query(User).filter(User.is_active.is_(True)).count()
    cancelled_bookings = booking_query.filter(Booking.status == BookingStatus.CANCELLED).count()
    cancellation_rate = (
        round((cancelled_bookings / total_bookings) * 100, 2) if total_bookings else 0
    )

    return APIResponse(
        data={
            "monthly_revenue": f"Rs. {_money(monthly_revenue):,.2f}",
            "total_bookings": total_bookings,
            "active_users": active_users,
            "cancellation_rate": cancellation_rate,
        },
        status=ResponseStatus.SUCCESS,
        message="Report stats retrieved successfully",
        error_code=None,
    )


@router.get("/dashboard-stats", response_model=APIResponse[dict])
async def get_dashboard_stats(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin_user),
):
    today = datetime.now(UTC).date()
    yesterday = today - timedelta(days=1)

    bookings_today = db.query(Booking).filter(func.date(Booking.booked_at) == today).count()
    bookings_yesterday = db.query(Booking).filter(func.date(Booking.booked_at) == yesterday).count()
    revenue_today = (
        db.query(func.coalesce(func.sum(Booking.total_fare), 0))
        .filter(func.date(Booking.booked_at) == today)
        .scalar()
    )
    revenue_yesterday = (
        db.query(func.coalesce(func.sum(Booking.total_fare), 0))
        .filter(func.date(Booking.booked_at) == yesterday)
        .scalar()
    )
    active_buses = db.query(Bus).filter(Bus.status == RecordStatus.ACTIVE).count()
    pending_contributions = (
        db.query(Contribution).filter(Contribution.status == RecordStatus.PENDING).count()
    )

    booking_change = (
        round(((bookings_today - bookings_yesterday) / bookings_yesterday) * 100, 2)
        if bookings_yesterday
        else 0
    )
    revenue_yesterday_value = _money(revenue_yesterday)
    revenue_change = (
        round(
            ((_money(revenue_today) - revenue_yesterday_value) / revenue_yesterday_value) * 100,
            2,
        )
        if revenue_yesterday_value
        else 0
    )

    return APIResponse(
        data={
            "total_bookings_today": bookings_today,
            "revenue_today": _money(revenue_today),
            "active_buses": active_buses,
            "pending_contributions": pending_contributions,
            "booking_change_percent": booking_change,
            "revenue_change_percent": revenue_change,
        },
        status=ResponseStatus.SUCCESS,
        message="Dashboard stats retrieved successfully",
        error_code=None,
    )


@router.get("/most-booked-routes", response_model=APIResponse[list[dict]])
async def get_most_booked_routes(
    limit: int = Query(default=5, ge=1, le=100),
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin_user),
):
    rows = (
        db.query(
            Route.origin,
            Route.destination,
            func.count(Booking.id).label("booking_count"),
        )
        .join(Schedule, Schedule.route_id == Route.id)
        .join(Trip, Trip.schedule_id == Schedule.id)
        .join(Booking, Booking.trip_id == Trip.id)
        .group_by(Route.id, Route.origin, Route.destination)
        .order_by(func.count(Booking.id).desc())
        .limit(limit)
        .all()
    )

    return APIResponse(
        data=[
            {"name": f"{origin} - {destination}", "bookings": int(booking_count)}
            for origin, destination, booking_count in rows
        ],
        status=ResponseStatus.SUCCESS,
        message="Most booked routes retrieved successfully",
        error_code=None,
    )


@router.get("/top-routes", response_model=APIResponse[list[dict]])
async def get_top_routes(
    limit: int = Query(default=5, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    return await get_most_booked_routes(limit=limit, db=db, _=current_user)


@router.get("/revenue-by-type", response_model=APIResponse[list[dict]])
async def get_revenue_by_bus_type(
    period: str = Query(default="this-month"),
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin_user),
):
    start = _period_start(period)
    end = _period_end(period)
    rows = (
        db.query(Bus.bus_type, func.coalesce(func.sum(Booking.total_fare), 0).label("revenue"))
        .join(Schedule, Schedule.bus_id == Bus.id)
        .join(Trip, Trip.schedule_id == Schedule.id)
        .join(Booking, Booking.trip_id == Trip.id)
        .filter(Booking.booked_at >= start, Booking.booked_at < end)
        .group_by(Bus.bus_type)
        .all()
    )
    total = sum(_money(revenue) for _, revenue in rows)

    return APIResponse(
        data=[
            {
                "type": bus_type.value if hasattr(bus_type, "value") else str(bus_type),
                "revenue": f"{_money(revenue):.2f}",
                "percentage": round((_money(revenue) / total) * 100, 2) if total else 0,
            }
            for bus_type, revenue in rows
        ],
        status=ResponseStatus.SUCCESS,
        message="Revenue by bus type retrieved successfully",
        error_code=None,
    )


@router.get("/bookings-chart", response_model=APIResponse[dict])
async def get_bookings_chart(
    days: int = Query(default=7, ge=1, le=60),
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin_user),
):
    start_date = datetime.now(UTC).date() - timedelta(days=days - 1)
    rows = (
        db.query(func.date(Booking.booked_at).label("booking_date"), func.count(Booking.id))
        .filter(func.date(Booking.booked_at) >= start_date)
        .group_by(func.date(Booking.booked_at))
        .all()
    )
    counts = {str(day): int(count) for day, count in rows}
    data = {
        str(start_date + timedelta(days=index)): counts.get(
            str(start_date + timedelta(days=index)), 0
        )
        for index in range(days)
    }

    return APIResponse(
        data=data,
        status=ResponseStatus.SUCCESS,
        message="Bookings chart retrieved successfully",
        error_code=None,
    )


@router.get("/download")
async def download_report(
    format: str = Query(default="csv", pattern="^csv$"),
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin_user),
):
    total_bookings = db.query(Booking).count()
    total_revenue = db.query(func.coalesce(func.sum(Booking.total_fare), 0)).scalar()
    active_buses = db.query(Bus).filter(Bus.status == RecordStatus.ACTIVE).count()
    csv = (
        "metric,value\n"
        f"total_bookings,{total_bookings}\n"
        f"total_revenue,{_money(total_revenue):.2f}\n"
        f"active_buses,{active_buses}\n"
    )
    return Response(
        content=csv,
        media_type="text/csv",
        headers={"Content-Disposition": 'attachment; filename="highway-bus-mate-report.csv"'},
    )


@router.post(
    "", response_model=APIResponse[ReportSnapshotResponse], status_code=status.HTTP_201_CREATED
)
async def create_report_snapshot(
    body: ReportSnapshotCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    report = service.create(
        db, {**body.model_dump(exclude_unset=True), "generated_by": current_user.id}
    )
    return APIResponse(
        data=ReportSnapshotResponse.model_validate(report),
        status=ResponseStatus.SUCCESS,
        message="Report snapshot created successfully",
        error_code=None,
    )


@router.get("", response_model=APIResponse[PaginatedData[ReportSnapshotResponse]])
async def list_report_snapshots(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=1000),
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin_user),
):
    total, reports = service.list_items(db, skip=skip, limit=limit)
    return APIResponse(
        data=PaginatedData(
            items=[ReportSnapshotResponse.model_validate(item) for item in reports],
            total=total,
            skip=skip,
            limit=limit,
        ),
        status=ResponseStatus.SUCCESS,
        message="Report snapshots retrieved successfully",
        error_code=None,
    )
