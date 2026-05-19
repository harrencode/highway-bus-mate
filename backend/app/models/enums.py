from enum import Enum


class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"
    SUPER_ADMIN = "super_admin"


class RecordStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    CANCELLED = "cancelled"


class BusType(str, Enum):
    NORMAL = "normal"
    SEMI_LUXURY = "semi_luxury"
    LUXURY = "luxury"
    SUPER_LUXURY = "super_luxury"
    AC_EXPRESS = "ac_express"


class SeatClass(str, Enum):
    STANDARD = "standard"
    PREMIUM = "premium"
    FRONT = "front"


class TripStatus(str, Enum):
    SCHEDULED = "scheduled"
    BOARDING = "boarding"
    DEPARTED = "departed"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class BookingStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    COMPLETED = "completed"


class PaymentStatus(str, Enum):
    UNPAID = "unpaid"
    PENDING = "pending"
    PAID = "paid"
    FAILED = "failed"
    REFUNDED = "refunded"


class PaymentMethod(str, Enum):
    CASH = "cash"
    CARD = "card"
    BANK_TRANSFER = "bank_transfer"
    MOBILE_WALLET = "mobile_wallet"


class ContributionType(str, Enum):
    NEW_ROUTE = "new_route"
    NEW_BUS = "new_bus"
    UPDATE_BUS_INFO = "update_bus_info"
    UPDATE_ROUTE_INFO = "update_route_info"


class NotificationType(str, Enum):
    ROUTE_UPDATE = "route_update"
    BOOKING_UPDATE = "booking_update"
    SYSTEM = "system"
    PROMOTION = "promotion"


class NotificationTargetScope(str, Enum):
    ALL_USERS = "all_users"
    ROUTE_PASSENGERS = "route_passengers"
    UPCOMING_BOOKINGS = "upcoming_bookings"


class UserStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"
