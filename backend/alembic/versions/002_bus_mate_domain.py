"""Highway Bus Mate domain schema

Revision ID: 002
Revises: 001
Create Date: 2026-04-26 00:00:00.000000

"""

from typing import Sequence, Union

import sqlalchemy as sa

from alembic import op

revision: str = "002"
down_revision: Union[str, None] = "001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

record_status = sa.Enum(
    "active", "inactive", "pending", "approved", "rejected", "cancelled", name="recordstatus"
)
bus_type = sa.Enum("normal", "semi_luxury", "luxury", "super_luxury", "ac_express", name="bustype")
seat_class = sa.Enum("standard", "premium", "front", name="seatclass")
trip_status = sa.Enum("scheduled", "boarding", "departed", "completed", "cancelled", name="tripstatus")
booking_status = sa.Enum("pending", "confirmed", "cancelled", "completed", name="bookingstatus")
payment_status = sa.Enum("unpaid", "pending", "paid", "failed", "refunded", name="paymentstatus")
payment_method = sa.Enum("cash", "card", "bank_transfer", "mobile_wallet", name="paymentmethod")
contribution_type = sa.Enum(
    "new_route", "new_bus", "update_bus_info", "update_route_info", name="contributiontype"
)
notification_type = sa.Enum("route_update", "booking_update", "system", "promotion", name="notificationtype")
notification_scope = sa.Enum(
    "all_users", "route_passengers", "upcoming_bookings", name="notificationtargetscope"
)
user_status = sa.Enum("active", "inactive", "suspended", name="userstatus")


def upgrade() -> None:
    op.add_column("users", sa.Column("full_name", sa.String(length=150), nullable=True))
    op.add_column("users", sa.Column("phone", sa.String(length=30), nullable=True))
    op.add_column("users", sa.Column("status", user_status, nullable=False, server_default="active"))
    op.create_unique_constraint("uq_users_phone", "users", ["phone"])

    op.create_table(
        "routes",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("origin", sa.String(length=120), nullable=False),
        sa.Column("destination", sa.String(length=120), nullable=False),
        sa.Column("province_origin", sa.String(length=120), nullable=True),
        sa.Column("province_destination", sa.String(length=120), nullable=True),
        sa.Column("distance_km", sa.Numeric(8, 2), nullable=True),
        sa.Column("estimated_minutes", sa.Integer(), nullable=True),
        sa.Column("status", record_status, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_routes_origin", "routes", ["origin"])
    op.create_index("ix_routes_destination", "routes", ["destination"])

    op.create_table(
        "buses",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("registration_no", sa.String(length=30), nullable=False),
        sa.Column("operator_name", sa.String(length=150), nullable=False),
        sa.Column("operator_phone", sa.String(length=30), nullable=True),
        sa.Column("bus_type", bus_type, nullable=False),
        sa.Column("total_seats", sa.Integer(), nullable=False),
        sa.Column("status", record_status, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("registration_no"),
    )

    op.create_table(
        "admins",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("department", sa.String(length=120), nullable=True),
        sa.Column("last_login", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("user_id"),
    )
    op.create_table(
        "sessions",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("token_hash", sa.String(length=255), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_sessions_user_id", "sessions", ["user_id"])
    op.create_index("ix_sessions_token_hash", "sessions", ["token_hash"])

    op.create_table(
        "route_stops",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("route_id", sa.Integer(), nullable=False),
        sa.Column("stop_name", sa.String(length=120), nullable=False),
        sa.Column("stop_order", sa.Integer(), nullable=False),
        sa.Column("distance_from_origin", sa.Numeric(8, 2), nullable=True),
        sa.ForeignKeyConstraint(["route_id"], ["routes.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("route_id", "stop_order", name="uq_route_stop_order"),
    )
    op.create_index("ix_route_stops_route_id", "route_stops", ["route_id"])

    op.create_table(
        "seats",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("bus_id", sa.Integer(), nullable=False),
        sa.Column("seat_number", sa.String(length=10), nullable=False),
        sa.Column("seat_class", seat_class, nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.ForeignKeyConstraint(["bus_id"], ["buses.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("bus_id", "seat_number", name="uq_bus_seat_number"),
    )
    op.create_index("ix_seats_bus_id", "seats", ["bus_id"])

    op.create_table(
        "schedules",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("bus_id", sa.Integer(), nullable=False),
        sa.Column("route_id", sa.Integer(), nullable=False),
        sa.Column("departure_time", sa.Time(), nullable=False),
        sa.Column("arrival_time", sa.Time(), nullable=False),
        sa.Column("days_of_week", sa.String(length=80), nullable=False),
        sa.Column("valid_from", sa.Date(), nullable=False),
        sa.Column("valid_until", sa.Date(), nullable=True),
        sa.Column("status", record_status, nullable=False),
        sa.ForeignKeyConstraint(["bus_id"], ["buses.id"]),
        sa.ForeignKeyConstraint(["route_id"], ["routes.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_schedules_bus_id", "schedules", ["bus_id"])
    op.create_index("ix_schedules_route_id", "schedules", ["route_id"])

    op.create_table(
        "pricing",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("route_id", sa.Integer(), nullable=False),
        sa.Column("bus_type", bus_type, nullable=False),
        sa.Column("base_fare", sa.Numeric(10, 2), nullable=False),
        sa.Column("per_km_rate", sa.Numeric(10, 2), nullable=False),
        sa.Column("effective_from", sa.DateTime(timezone=True), nullable=False),
        sa.Column("effective_until", sa.DateTime(timezone=True), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.ForeignKeyConstraint(["route_id"], ["routes.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_pricing_route_id", "pricing", ["route_id"])

    op.create_table(
        "trips",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("schedule_id", sa.Integer(), nullable=False),
        sa.Column("trip_date", sa.Date(), nullable=False),
        sa.Column("available_seats", sa.Integer(), nullable=False),
        sa.Column("status", trip_status, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["schedule_id"], ["schedules.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("schedule_id", "trip_date", name="uq_schedule_trip_date"),
    )
    op.create_index("ix_trips_schedule_id", "trips", ["schedule_id"])
    op.create_index("ix_trips_trip_date", "trips", ["trip_date"])

    op.create_table(
        "bookings",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("trip_id", sa.Integer(), nullable=False),
        sa.Column("booking_ref", sa.String(length=30), nullable=False),
        sa.Column("total_fare", sa.Numeric(10, 2), nullable=False),
        sa.Column("status", booking_status, nullable=False),
        sa.Column("payment_status", payment_status, nullable=False),
        sa.Column("booked_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("cancelled_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["trip_id"], ["trips.id"]),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("booking_ref"),
    )
    op.create_index("ix_bookings_user_id", "bookings", ["user_id"])
    op.create_index("ix_bookings_trip_id", "bookings", ["trip_id"])

    op.create_table(
        "booking_seats",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("booking_id", sa.Integer(), nullable=False),
        sa.Column("seat_id", sa.Integer(), nullable=False),
        sa.Column("seat_fare", sa.Numeric(10, 2), nullable=False),
        sa.ForeignKeyConstraint(["booking_id"], ["bookings.id"]),
        sa.ForeignKeyConstraint(["seat_id"], ["seats.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("booking_id", "seat_id", name="uq_booking_seat"),
    )
    op.create_index("ix_booking_seats_booking_id", "booking_seats", ["booking_id"])
    op.create_index("ix_booking_seats_seat_id", "booking_seats", ["seat_id"])

    op.create_table(
        "payments",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("booking_id", sa.Integer(), nullable=False),
        sa.Column("amount", sa.Numeric(10, 2), nullable=False),
        sa.Column("method", payment_method, nullable=False),
        sa.Column("transaction_ref", sa.String(length=120), nullable=True),
        sa.Column("status", payment_status, nullable=False),
        sa.Column("paid_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["booking_id"], ["bookings.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_payments_booking_id", "payments", ["booking_id"])

    op.create_table(
        "tickets",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("booking_id", sa.Integer(), nullable=False),
        sa.Column("qr_code", sa.String(length=255), nullable=False),
        sa.Column("is_verified", sa.Boolean(), nullable=False),
        sa.Column("verified_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("issued_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["booking_id"], ["bookings.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("qr_code"),
    )
    op.create_index("ix_tickets_booking_id", "tickets", ["booking_id"])

    op.create_table(
        "contributions",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("submitted_by", sa.Integer(), nullable=False),
        sa.Column("reviewed_by", sa.Integer(), nullable=True),
        sa.Column("type", contribution_type, nullable=False),
        sa.Column("payload", sa.JSON(), nullable=False),
        sa.Column("notes", sa.String(length=500), nullable=True),
        sa.Column("status", record_status, nullable=False),
        sa.Column("submitted_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("reviewed_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["reviewed_by"], ["users.id"]),
        sa.ForeignKeyConstraint(["submitted_by"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_contributions_submitted_by", "contributions", ["submitted_by"])

    op.create_table(
        "notifications",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("sent_by", sa.Integer(), nullable=True),
        sa.Column("title", sa.String(length=150), nullable=False),
        sa.Column("body", sa.Text(), nullable=False),
        sa.Column("type", notification_type, nullable=False),
        sa.Column("target_scope", notification_scope, nullable=False),
        sa.Column("target_route_id", sa.Integer(), nullable=True),
        sa.Column("sent_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["sent_by"], ["users.id"]),
        sa.ForeignKeyConstraint(["target_route_id"], ["routes.id"]),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "user_notifications",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("notification_id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("is_read", sa.Boolean(), nullable=False),
        sa.Column("read_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["notification_id"], ["notifications.id"]),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("notification_id", "user_id", name="uq_user_notification"),
    )
    op.create_index("ix_user_notifications_notification_id", "user_notifications", ["notification_id"])
    op.create_index("ix_user_notifications_user_id", "user_notifications", ["user_id"])

    op.create_table(
        "saved_routes",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("route_id", sa.Integer(), nullable=False),
        sa.Column("saved_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["route_id"], ["routes.id"]),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("user_id", "route_id", name="uq_user_saved_route"),
    )
    op.create_index("ix_saved_routes_user_id", "saved_routes", ["user_id"])
    op.create_index("ix_saved_routes_route_id", "saved_routes", ["route_id"])

    op.create_table(
        "reviews",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("bus_id", sa.Integer(), nullable=False),
        sa.Column("trip_id", sa.Integer(), nullable=True),
        sa.Column("rating", sa.Integer(), nullable=False),
        sa.Column("comment", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["bus_id"], ["buses.id"]),
        sa.ForeignKeyConstraint(["trip_id"], ["trips.id"]),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_reviews_user_id", "reviews", ["user_id"])
    op.create_index("ix_reviews_bus_id", "reviews", ["bus_id"])

    op.create_table(
        "report_snapshots",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("generated_by", sa.Integer(), nullable=True),
        sa.Column("report_date", sa.Date(), nullable=False),
        sa.Column("total_bookings", sa.Integer(), nullable=False),
        sa.Column("total_revenue", sa.Numeric(12, 2), nullable=False),
        sa.Column("active_buses", sa.Integer(), nullable=False),
        sa.Column("new_users", sa.Integer(), nullable=False),
        sa.Column("route_breakdown", sa.JSON(), nullable=True),
        sa.Column("generated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["generated_by"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_report_snapshots_report_date", "report_snapshots", ["report_date"])


def downgrade() -> None:
    for table in [
        "report_snapshots",
        "reviews",
        "saved_routes",
        "user_notifications",
        "notifications",
        "contributions",
        "tickets",
        "payments",
        "booking_seats",
        "bookings",
        "trips",
        "pricing",
        "schedules",
        "seats",
        "route_stops",
        "sessions",
        "admins",
        "buses",
        "routes",
    ]:
        op.drop_table(table)

    op.drop_constraint("uq_users_phone", "users", type_="unique")
    op.drop_column("users", "status")
    op.drop_column("users", "phone")
    op.drop_column("users", "full_name")
