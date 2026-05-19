# Quick Start - Admin Portal + Backend

## Prerequisites
- Node.js 18+ (for admin frontend)
- Python 3.9+ (for backend)
- Docker & Docker Compose (optional, for MySQL database)

## Step 1: Start Backend (FastAPI)

### Option A: Using Docker Compose (Recommended)
```bash
cd backend
docker-compose up -d
```

This starts:
- FastAPI server at http://localhost:8000
- MySQL database at localhost:3306
- Redis cache (if configured)

### Option B: Manual Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements/development.txt

# Run migrations
alembic upgrade head

# Start server
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Verify Backend:**
```bash
curl http://localhost:8000/api/v1/routes
# Should return: {"data": [...]}
```

## Step 2: Start Admin Frontend

```bash
cd admin

# Install dependencies (if not done)
npm install

# Ensure .env.local is configured
cat .env.local
# Should show: NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Start development server
npm run dev
```

**Verify Frontend:**
Open http://localhost:3000/admin in your browser.

## Step 3: Verify Integration

### Dashboard Test
- Page should show 4 stat cards with real data
- Recent bookings table should populate
- Top routes chart should display

### Routes Page Test
- Click "Add Route" button
- Fill in form (route_code, origin, destination, distance_km)
- Click "Add" button
- New route should appear in table
- Backend should have received POST request

### Check Network Activity
1. Open Developer Tools (F12)
2. Go to Network tab
3. Refresh admin page
4. Look for requests to:
   - `/api/v1/routes`
   - `/api/v1/buses`
   - `/api/v1/bookings`
   - etc.
5. All should return 200 status with data

## Step 4: Test CRUD Operations

### Create
- Navigate to any module (Routes, Buses, Bookings, etc.)
- Click the Add/Create button
- Fill in form
- Submit
- Item should appear in table

### Read
- Data should load on page open
- Tables should display all items

### Update
- Click Edit button on any item
- Modify fields
- Save
- Item should update in table

### Delete
- Click Delete button
- Confirm
- Item should disappear from table

## Common Issues

### "API Connection Failed"
```
Error: Failed to fetch from http://localhost:8000/api/v1/routes
```
**Fix:** Ensure backend is running on port 8000
```bash
# Check if backend is running
curl http://localhost:8000/api/v1/health

# If not running, start it:
cd backend
docker-compose up -d
```

### "CORS Error"
```
Error: Access to XMLHttpRequest blocked by CORS policy
```
**Fix:** Ensure backend has CORS middleware enabled
- Check `backend/app/middleware/` for CORS configuration
- Verify FastAPI middleware includes: `CORSMiddleware`
- Allowed origins should include `http://localhost:3000`

### "Empty Tables"
**Cause:** No data in backend database

**Fix:** Seed development data
```bash
cd backend

# Using Docker
docker-compose exec web python -m scripts.seed

# Or manually
python -c "from scripts.dev_seed import seed; seed()"
```

### "401 Unauthorized"
**Cause:** Token is invalid or missing

**Fix:** Check localStorage
1. Open Developer Tools
2. Go to Application → Local Storage → http://localhost:3000
3. Look for `token` key
4. If missing, log in first (or manually add test token)

## Development Workflow

### When Making Backend Changes
1. Modify backend code (e.g., add new endpoint)
2. Backend auto-reloads (if using `--reload`)
3. Update service file: `lib/services/module.ts`
4. Import and use in page component
5. Frontend auto-refreshes

### When Making Frontend Changes
1. Modify `.tsx` file
2. Frontend auto-refreshes (Next.js dev server)
3. Test in browser

### Building for Production

#### Backend
```bash
cd backend
docker build -t bus-mate-backend .
docker run -p 8000:8000 bus-mate-backend
```

#### Frontend
```bash
cd admin
npm run build
npm start
# Or deploy to Vercel/Netlify
```

## Environment Variables Reference

### Backend
```bash
# database/
DATABASE_URL=mysql://user:pass@localhost:3306/bus_mate

# jwt/
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=24h

# cors/
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Frontend
```bash
# API connection
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_API_PREFIX=/api/v1
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Optional
NEXT_PUBLIC_DEBUG=true|false
```

## Testing API Endpoints

### Using curl
```bash
# Get all routes
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/v1/routes

# Create new route
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"route_code":"R001","origin":"City A","destination":"City B","distance_km":150}' \
  http://localhost:8000/api/v1/routes

# Get buses
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/v1/buses

# Get bookings
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/v1/bookings
```

### Using Postman/Thunder Client
1. Create new collection
2. Add environment variables:
   - `base_url`: `http://localhost:8000/api/v1`
   - `token`: Get from browser localStorage
3. Create requests for each endpoint
4. Set `Authorization: Bearer {{token}}`

## Next Steps

1. ✅ Start backend and frontend
2. ✅ Verify dashboard loads with data
3. ✅ Test CRUD on each module
4. ✅ Check browser console for errors
5. ✅ Review service files for API details
6. 📝 Deploy to production
7. 📝 Set up monitoring and logging

## Support

- **Backend Issues**: Check `backend/README.md`
- **Frontend Issues**: Check `admin/ADMIN_SETUP.md`
- **API Issues**: Review service files in `admin/src/lib/services/`
- **Database Issues**: Check `backend/alembic/versions/`

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│         Admin Portal (Next.js)                          │
│  http://localhost:3000/admin                           │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Pages (routes, buses, bookings, etc)           │  │
│  │  - State management (useState, useEffect)       │  │
│  │  - Component rendering (MUI)                    │  │
│  └─────────────────────────────────────────────────┘  │
│                      ↓                                 │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Services (/lib/services/)                      │  │
│  │  - Business logic                               │  │
│  │  - API calls (getRoutes, createBus, etc)       │  │
│  └─────────────────────────────────────────────────┘  │
│                      ↓                                 │
│  ┌─────────────────────────────────────────────────┐  │
│  │  API Client (/lib/api.ts)                       │  │
│  │  - HTTP methods (GET, POST, PUT, DELETE)       │  │
│  │  - Token management                             │  │
│  │  - Error handling                               │  │
│  └─────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
            ↓ HTTP (Bearer Token) ↓
┌─────────────────────────────────────────────────────────┐
│         Backend (FastAPI)                               │
│  http://localhost:8000/api/v1                          │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Routes (/routes, /buses, /bookings, etc)      │  │
│  │  - Request validation                           │  │
│  │  - Authentication                               │  │
│  │  - Business logic                               │  │
│  └─────────────────────────────────────────────────┘  │
│                      ↓                                 │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Services (business logic layer)                │  │
│  └─────────────────────────────────────────────────┘  │
│                      ↓                                 │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Repositories (database access)                 │  │
│  └─────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
            ↓ SQL ↓
┌─────────────────────────────────────────────────────────┐
│         MySQL Database                                  │
│  localhost:3306                                        │
│                                                         │
│  - routes                                              │
│  - buses                                               │
│  - bookings                                            │
│  - schedules                                           │
│  - pricing                                             │
│  - etc                                                 │
└─────────────────────────────────────────────────────────┘
```

---

**Last Updated:** January 2025
**Admin Portal Version:** 1.0.0
**Status:** ✅ Production Ready
