# Highway Bus Mate — Monorepo

Monorepo scaffold containing:
- `admin` — Next.js admin portal (web)
- `mobile` — Expo React Native mobile app
- `backend` — FastAPI backend with MySQL
- `infra` — docker-compose for backend + MySQL

Quick start (development):

1. Backend (local, requires Python 3.11+)

```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
# Linux/macOS
source .venv/bin/activate
pip install -r requirements.txt
# configure .env with DATABASE_URL
python app/seed.py  # creates tables + seed
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

2. Admin (Next.js)

```bash
cd admin
npm install
npm run dev
```

3. Mobile (Expo)

```bash
cd mobile
npm install
npx expo start
```

4. Docker (backend + MySQL)

```bash
cd infra
docker compose up --build
```
