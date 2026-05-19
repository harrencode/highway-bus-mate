# Admin Portal - Setup & Implementation Guide

## Overview

Complete admin dashboard for Highway Bus Mate built with Next.js 16.1.3, TypeScript, and Material-UI. Integrates with FastAPI backend without modifying existing endpoints.

## Architecture

### Frontend Stack
- **Framework**: Next.js 16.1.3 with App Router
- **UI Library**: Material-UI (MUI) 7.3.7
- **Language**: TypeScript 5
- **Styling**: Emotion CSS-in-JS

### Backend Connection
- **API**: FastAPI at `/api/v1`
- **Auth**: Bearer token in Authorization header
- **Base URL**: `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000`

## Setup Instructions

### 1. Environment Configuration

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your backend URL:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_API_PREFIX=/api/v1
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000/admin](http://localhost:3000/admin) in your browser.

## Module Documentation

### Core Infrastructure

#### `lib/api.ts`
Central HTTP client for all API communication:
- Automatic Bearer token management
- Error handling with 401 redirects
- Generic TypeScript support for type-safe responses
- Methods: `get<T>()`, `post<T>()`, `put<T>()`, `patch<T>()`, `delete<T>()`

**Usage:**
```typescript
import { apiClient } from "@/lib/api";

const data = await apiClient.get<RoutesResponse>("/routes");
```

### Service Layer

All services follow the same pattern:

#### `lib/services/dashboard.ts`
Dashboard statistics and trending data:
- `getDashboardStats()` - KPI cards (bookings, revenue, buses, contributions)
- `getRecentBookings(limit)` - Latest 5 bookings
- `getTopRoutes(limit)` - Top 4 routes by bookings
- `getBookingsChart(days)` - Time-series booking data

#### `lib/services/routes.ts`
Route management with CRUD:
- `getRoutes(limit, offset, status?)` - Paginated list with optional status filter
- `createRoute(data)` - Create new route
- `updateRoute(id, data)` - Update existing route
- `deleteRoute(id)` - Delete route
- `searchRoutes(query)` - Full-text search

#### `lib/services/buses.ts`
Fleet management with approval workflow:
- `getBuses(limit, offset, status?)` - List buses with status filtering
- `createBus(data)` - Add new bus to fleet
- `updateBus(id, data)` - Update bus details
- `deleteBus(id)` - Remove bus from fleet
- `approveBus(id)` - Approve pending bus (POST /buses/{id}/approve)
- `rejectBus(id)` - Reject pending bus (POST /buses/{id}/reject)

#### `lib/services/bookings.ts`
Booking management and analytics:
- `getBookings(limit, offset, status?)` - List bookings with filtering
- `getBookingStats()` - Statistics (today's, confirmed, pending, cancelled)
- `cancelBooking(id, reason?)` - Cancel booking
- `confirmBooking(id)` - Mark as confirmed

#### `lib/services/schedules.ts`
Schedule management:
- `getSchedules(limit, offset)` - List schedules
- `createSchedule(data)` - Create schedule
- `updateSchedule(id, data)` - Update schedule
- `deleteSchedule(id)` - Delete schedule

#### `lib/services/pricing.ts`
Pricing configuration:
- `getPricings(limit, offset)` - List pricing rules
- `createPricing(data)` - Create pricing rule
- `updatePricing(id, data)` - Update pricing
- `deletePricing(id)` - Delete pricing rule

#### `lib/services/contributions.ts`
Community contributions (new routes, buses, updates):
- `getContributions(limit, offset, status?)` - List with status filter
- `approveContribution(id)` - Approve contribution (POST /contributions/{id}/approve)
- `rejectContribution(id, reason?)` - Reject contribution
- `getContributionStats()` - Contribution statistics

#### `lib/services/notifications.ts`
System notifications:
- `sendNotification(data)` - Send notification (POST /notifications/send)
- `getNotifications(limit)` - List recent notifications
- `scheduleNotification(data)` - Schedule for later

#### `lib/services/users.ts`
User and admin account management:
- `getUsers(limit, offset)` - List all users
- `suspendUser(id)` - Suspend user account
- `activateUser(id)` - Reactivate user
- `createAdmin(data)` - Create admin account
- `updateUserRole(id, role)` - Change user role

#### `lib/services/reports.ts`
Analytics and reporting:
- `getReportStats(period)` - Revenue, bookings, users, cancellation rate
- `getMostBookedRoutes(limit)` - Top routes by booking count
- `getRevenueByBusType(period)` - Revenue breakdown by vehicle type
- `exportReport(format, period)` - Export as CSV/PDF (if backend supports)

### Page Components

#### Dashboard (`admin/page.tsx`)
Landing page with KPIs and trending data:
- 4 stat cards: Total Bookings, Monthly Revenue, Active Buses, Pending Contributions
- Recent bookings table (5 latest)
- Top routes visualization (bar chart)
- Real-time update support via polling

**Features:**
- Loading skeletons while fetching
- Error boundary with alert
- Responsive grid layout
- Data refreshes on mount

#### Routes Management (`admin/routes/page.tsx`)
Full CRUD for transportation routes:
- Table view with columns: Code, Origin, Destination, Distance, Active Buses, Avg Fare, Status
- Create/Edit via modal dialog
- Delete with confirmation
- Filter by status (Active/Inactive)
- Search routes by name/code

**Features:**
- Form validation
- Duplicate prevention
- Inline status badge
- Bulk operations support (in planning)

#### Bus Fleet (`admin/buses/page.tsx`)
Bus management with approval workflow:
- Card grid layout (3 columns) showing each bus
- Displays: Bus number, Type, Operator, Seats, Status
- Add/Edit forms with route assignment
- Approval flow: Pending → Approve/Reject → Active
- Delete previously rejected buses

**Features:**
- Real-time seat availability updates
- Photo/document uploads (future)
- Maintenance schedule tracking (future)

#### Booking Management (`admin/bookings/page.tsx`)
Passenger booking analytics and management:
- 4 stat boxes: Today's bookings, Confirmed, Pending, Cancelled
- Comprehensive table with: Booking ID, Passenger, Route, Seats, Date, Fare, Payment Status
- Cancel booking with reason
- View booking details
- Export booking data (future)

**Features:**
- Status-based filtering
- Date range selection
- Refund processing
- Passenger communication

#### Schedules (`admin/schedules/page.tsx`)
Schedule management:
- Table with: Schedule ID, Bus, Route, Departure, Arrival, Date, Available Seats, Actions
- Create/Edit schedules
- Delete old schedules
- View seat availability

#### Pricing Management (`admin/pricing/page.tsx`)
Fare and surcharge configuration:
- Table showing: Route, Bus Type, Base Fare, Surcharge, Total, Last Updated
- Edit pricing rules
- Dynamic pricing support
- Historical pricing tracking

#### Contributions Management (`admin/contributions/page.tsx`)
Community-submitted content review:
- Filtered view (Pending only)
- Type badges: New Route (blue), New Bus (amber), Update (green)
- Approve/Reject buttons with inline actions
- Submission metadata: Type, Submitter, Details, Date, Notes

**Features:**
- Comments on contributions
- Bulk approval workflow
- Notification to submitters

#### Notifications (`admin/notifications/page.tsx`)
System-wide communication:
- Send form: Type, Title, Message, Target Audience
- Type options: Announcement, Route Update, Alert, Booking Update
- Target options: All Passengers, Passengers with upcoming bookings
- Schedule for future send
- Recent notifications history (right sidebar)

#### Reports & Analytics (`admin/reports/page.tsx`)
Business intelligence dashboard:
- 4 stat cards: Monthly Revenue, Total Bookings, Active Users, Cancellation Rate
- Chart 1: Most Booked Routes (bar chart, top 5)
- Chart 2: Revenue by Bus Type (bar chart)
- Period selector: This Month / Last Month / This Year
- Download button for CSV export

#### User Management (`admin/users/page.tsx`)
Admin and passenger account management:
- Table with: User, Email, Phone, Role, Bookings, Joined, Status, Actions
- Add Admin button
- View user details
- Suspend/Activate accounts
- Role management (User/Admin)

## Design System

All pages use consistent color palette:

```typescript
const colors = {
  brand: "#1A6B45",           // Primary green
  brandMid: "#2D9E6B",        // Medium green
  brandLight: "#E6F5EE",      // Light green background
  brandDark: "#0D3D27",       // Dark green
  accent: "#F5A623",          // Orange accent
  accentLight: "#FEF3DC",     // Light orange
  bg: "#F3F7F5",              // Page background
  surface2: "#EEF3F0",        // Secondary surface
  text: "#111B16",            // Primary text
  text2: "#4A6055",           // Secondary text
  text3: "#8FA89B",           // Tertiary text
  border: "rgba(0,0,0,0.08)", // Subtle borders
  red: "#D94040",             // Error/danger
  redLight: "#FCEAEA",        // Light red
  blue: "#2563EB",            // Info
  blueLight: "#EFF4FF",       // Light blue
};
```

## State Management Pattern

All pages follow the same pattern using React hooks:

```typescript
"use client"; // Required for interactivity

import { useState, useEffect } from "react";
import { getService } from "@/lib/services/module";

export default function Page() {
  const [data, setData] = useState<Type[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getService(limit, offset);
        setData(result || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Render UI with loading/error/empty states
}
```

## API Integration Examples

### Create with Form Submission

```typescript
const handleCreate = async (formData) => {
  try {
    setIsLoading(true);
    await createService(formData);
    // Refresh list
    const updated = await getService();
    setData(updated);
  } catch (err) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
};
```

### Update with Dialog

```typescript
const handleEdit = (item) => {
  setFormData(item);
  setOpenDialog(true);
};

const handleSave = async () => {
  try {
    await updateService(formData.id, formData);
    // Refresh list
  } catch (err) {
    setError(err.message);
  }
};
```

### Delete with Confirmation

```typescript
const handleDelete = async (id) => {
  if (confirm("Are you sure?")) {
    try {
      await deleteService(id);
      setData(data.filter(d => d.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }
};
```

## Testing the Integration

### 1. Start Backend
```bash
cd backend
docker-compose up -d
# OR
python main.py
```

### 2. Start Admin Frontend
```bash
cd admin
npm run dev
```

### 3. Test Endpoints
- Visit http://localhost:3000/admin
- Dashboard should load with real data from backend
- Test Create/Read/Update/Delete on each page
- Check browser console for any API errors

### 4. Verify Token Management
- Logs out on 401 Unauthorized
- Token persists across page refreshes
- API calls include Bearer token in header

## Troubleshooting

### "API Connection Failed"
- Ensure backend is running: `curl http://localhost:8000/api/v1/routes`
- Check `.env.local` has correct `NEXT_PUBLIC_API_URL`
- Verify CORS is enabled in backend (check FastAPI middleware)

### "401 Unauthorized"
- Backend is rejecting token
- Check if token is being stored correctly in localStorage
- Verify backend expects Bearer format: `Authorization: Bearer {token}`

### "Empty Data"
- Backend endpoints may be returning empty arrays
- Check backend database has seed data
- Run migrations: `alembic upgrade head`
- Seed development data: `python scripts/seed.py`

### "Type Errors"
- Services have TypeScript interfaces for all responses
- Ensure backend returns expected field names
- Check `lib/services/*.ts` for Interface definitions

## Future Enhancements

### Phase 2
- [ ] Real-time WebSocket updates
- [ ] Advanced search and filtering
- [ ] Bulk operations (select multiple, bulk update)
- [ ] Export to Excel/PDF
- [ ] Toast notifications for actions
- [ ] Activity log/audit trail
- [ ] User role-based access control

### Phase 3
- [ ] Dark mode
- [ ] Mobile-responsive improvements
- [ ] Chart library integration (Recharts, Chart.js)
- [ ] Real-time chat with passengers
- [ ] Advanced analytics (predictive models)
- [ ] Automated alerts and workflows

## File Structure

```
admin/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout
│   │   ├── globals.css             # Global styles
│   │   └── (admin)/
│   │       └── admin/
│   │           ├── page.tsx        # Dashboard
│   │           ├── routes/
│   │           │   └── page.tsx
│   │           ├── buses/
│   │           │   └── page.tsx
│   │           ├── bookings/
│   │           │   └── page.tsx
│   │           ├── schedules/
│   │           │   └── page.tsx
│   │           ├── pricing/
│   │           │   └── page.tsx
│   │           ├── contributions/
│   │           │   └── page.tsx
│   │           ├── notifications/
│   │           │   └── page.tsx
│   │           ├── reports/
│   │           │   └── page.tsx
│   │           └── users/
│   │               └── page.tsx
│   ├── components/
│   │   └── sidebar.tsx             # Navigation
│   └── lib/
│       ├── api.ts                  # HTTP client
│       ├── routes.ts               # Route definitions
│       └── services/
│           ├── dashboard.ts        # Dashboard API calls
│           ├── routes.ts           # Routes API calls
│           ├── buses.ts            # Buses API calls
│           ├── bookings.ts         # Bookings API calls
│           ├── schedules.ts        # Schedules API calls
│           ├── pricing.ts          # Pricing API calls
│           ├── contributions.ts    # Contributions API calls
│           ├── notifications.ts    # Notifications API calls
│           ├── users.ts            # Users API calls
│           └── reports.ts          # Reports API calls
├── .env.example                    # Environment template
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript config
├── next.config.ts                  # Next.js config
└── README.md                       # This file
```

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review backend API documentation
3. Check service files for API endpoint mappings
4. Review browser console and network tab for details

## License

Part of Highway Bus Mate project - see root LICENSE
