# fastapi-auth-starter

A clean, production-ready FastAPI boilerplate with JWT authentication, user management, and enforced layered architecture.

## Features

- User registration (open endpoint)
- Admin-created users with role assignment
- JWT access + refresh token authentication
- Role-based access control (`USER` / `ADMIN` / `SUPER_ADMIN`)
- Standardised `APIResponse` wrapper on every endpoint
- MySQL via SQLAlchemy 2.0 with Alembic migrations
- Docker + Docker Compose (dev & prod)
- GitHub Actions CI/CD pipeline (lint → test → build → deploy)
- Strict pre-commit pipeline with 6 architecture guard hooks
- Dedicated MySQL test database with per-test transaction rollback isolation

## Project structure

```
fastapi-auth-starter/
├── app/
│   ├── api/
│   │   ├── deps.py              # Auth dependencies (get_current_user, get_current_admin_user)
│   │   └── v1/routes/           # auth.py · users.py · health.py
│   ├── core/                    # settings · security · exceptions · logging · versioning
│   ├── db/                      # SQLAlchemy engine & session
│   ├── middleware/              # exception handler · request logging
│   ├── models/                  # User ORM model + enums
│   ├── repositories/            # BaseRepository · UserRepository
│   ├── schemas/                 # common · user Pydantic v2 schemas
│   ├── scripts/                 # create_admin CLI
│   ├── services/                # AuthService · UserService
│   └── utils/                   # constants · validators · response helpers
├── alembic/                     # migrations
├── scripts/
│   ├── checks/                  # architecture guard scripts (pre-commit)
│   ├── entrypoint.sh
│   └── migrate.sh
├── tests/
│   ├── api/                     # FastAPI TestClient integration tests
│   ├── repositories/            # repository-layer unit tests
│   └── services/                # service-layer unit tests
├── requirements/                # base · development · production
├── .env.example                 # template — copy to .env (used for app + tests)
├── .pre-commit-config.yaml
├── Dockerfile
├── docker-compose.yml
└── docker-compose.prod.yml
```

## Architecture

The codebase follows a strict 3-layer architecture. Every layer has a single responsibility and violations are **blocked at commit time** by pre-commit hooks.

```
HTTP Request
    │
    ▼
┌─────────────────────────────────────────────┐
│  Route layer  (app/api/v1/routes/)          │
│  • Parse request, call service, return      │
│  • Never raises exceptions directly         │
│  • Never touches the database               │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  Service layer  (app/services/)             │
│  • All business logic lives here            │
│  • Raises domain exceptions (AppException   │
│    subclasses) on bad input / state         │
│  • Wraps every DB call in                   │
│    try/except SQLAlchemyError               │
│  • Logs errors with structured logger       │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  Repository layer  (app/repositories/)      │
│  • All data access through repo methods     │
│  • No business logic                        │
└─────────────────────────────────────────────┘
```

### Exception flow

| Exception class | HTTP status | When raised |
|---|---|---|
| `AuthenticationException` | 401 | Invalid credentials, bad/expired token |
| `NotFoundException` | 404 | Resource does not exist |
| `ConflictException` | 409 | Duplicate email or username |
| `DatabaseException` | 500 | Unexpected SQLAlchemy error |

Exceptions are caught by `middleware/exception_handler.py` which maps them to JSON responses. 4xx errors are logged at `WARNING`; 5xx errors at `ERROR`.

## Quick start

```bash
# 1. Copy and edit environment config (one file for everything)
cp .env.example .env

# 2. Create the test database in MySQL (one-time, as root)
mysql -u root -p -e "
  CREATE DATABASE IF NOT EXISTS auth_test_db
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  GRANT ALL PRIVILEGES ON auth_test_db.* TO 'auth_user'@'%';
  FLUSH PRIVILEGES;
"

# 3. Install dependencies
pip install -r requirements/development.txt

# 4. Install pre-commit hooks
pre-commit install

# 5. Run migrations
alembic upgrade head

# 6. Start the server
uvicorn app.main:app --reload
```

Swagger UI: http://localhost:8000/docs

## Docker (development)

```bash
docker compose up --build
```

## Environment variables

Copy `.env.example` to `.env` and fill in real values. Never commit `.env`. A single `.env` file is used for both the app and the test suite.

| Variable | Default | Description |
|---|---|---|
| `APP_ENV` | `development` | `development` / `production` / `test` |
| `APP_DEBUG` | `true` | Enable Swagger UI |
| `ALLOWED_ORIGINS_STR` | `http://localhost:3000` | CORS origins (comma-separated) |
| `DB_HOST` | `localhost` | MySQL host |
| `DB_PORT` | `3306` | MySQL port |
| `DB_NAME` | `auth_db` | Database name |
| `DB_USER` | `auth_user` | DB username |
| `DB_PASSWORD` | — | DB password |
| `TEST_DB_HOST` | `127.0.0.1` | Test DB host |
| `TEST_DB_PORT` | `3306` | Test DB port |
| `TEST_DB_NAME` | `auth_test_db` | Test database name |
| `TEST_DB_USER` | — | Test DB username |
| `TEST_DB_PASSWORD` | — | Test DB password |
| `JWT_SECRET_KEY` | — | JWT signing key (keep secret) |
| `JWT_ALGORITHM` | `HS256` | JWT algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `30` | Access token lifetime |
| `REFRESH_TOKEN_EXPIRE_DAYS` | `7` | Refresh token lifetime |

## Running tests

Tests run against the database named in `TEST_DB_NAME` (default: `auth_test_db`) — never `DB_NAME`. Both variables live in the same `.env` file. See [Quick start](#quick-start) for the one-time database creation step.

### Running

```bash
pytest tests/ -v
```

Each test runs inside a **transaction that is always rolled back** on teardown — the database is never polluted between tests and no truncation scripts are needed.

## Pre-commit hooks

Install hooks once after cloning:

```bash
pre-commit install
```

Every commit runs 21 hooks across two categories:

### Standard quality hooks

| Hook | Purpose |
|---|---|
| trailing-whitespace | Remove trailing spaces |
| end-of-file-fixer | Ensure newline at EOF |
| check-yaml / check-toml | Validate config files |
| check-merge-conflict | Block unresolved merge markers |
| check-added-large-files | Block files > 500 KB |
| debug-statements | Block `pdb` / `breakpoint()` |
| autoflake | Remove unused imports and variables |
| isort | Sort imports (black-compatible profile) |
| black | Code formatting (line length 100) |
| ruff | Fast linting + pyupgrade rules |
| mypy | Static type checking |
| pytest | Full test suite must pass |

### Architecture guard hooks (`scripts/checks/`)

These hooks enforce the 3-layer architecture. **A commit is rejected if any rule is violated.**

| Hook | Rule enforced |
|---|---|
| `no-raise-in-routes` | Route handlers must never raise exceptions — all exception logic belongs in the service layer |
| `no-raw-db-query-in-services` | Services must not call `db.query()` directly — all data access must go through repository methods |
| `no-pydantic-v1-config` | Schema models must use Pydantic v2 `model_config = ConfigDict(...)`, not the deprecated `class Config` |
| `pagination-bounded` | Every `limit` Query parameter in a route must have an `le=` upper bound to prevent resource exhaustion |
| `service-sqlalchemy-guard` | Every public service method that accepts a `db` parameter must have an `except SQLAlchemyError` handler |
| `service-logger-required` | Every service module must declare a module-level `logger = logging.getLogger(__name__)` |

### Example — what gets blocked

```python
# ❌ Blocked by no-raise-in-routes
@router.post("/login")
async def login(...):
    if not user:
        raise HTTPException(status_code=401)   # move this to the service

# ❌ Blocked by no-raw-db-query-in-services
class UserService:
    def get(self, db, user_id):
        return db.query(User).filter(...).first()  # use self.repo.get(db, user_id)

# ❌ Blocked by no-pydantic-v1-config
class UserResponse(BaseModel):
    class Config:                              # replace with model_config = ConfigDict(...)
        use_enum_values = True

# ❌ Blocked by pagination-bounded
async def list_users(limit: int = Query(default=100)):  # add le=1000
    ...

# ❌ Blocked by service-sqlalchemy-guard
class UserService:
    def get(self, db, user_id):              # missing except SQLAlchemyError
        return self.repo.get(db, user_id)

# ❌ Blocked by service-logger-required
# (no logger = logging.getLogger(__name__) at module level)
class AuthService:
    ...
```

## Input validation

All user-facing schemas enforce:

- **Username**: minimum 3 characters (after stripping whitespace)
- **Password**: minimum 8 characters, must contain at least one uppercase letter, one lowercase letter, and one digit

Validation is done at the Pydantic schema level using `@field_validator` so invalid input is rejected before it reaches the service layer.

## Creating an admin user

```bash
python -m app.scripts.create_admin
```

## GitHub Actions secrets required

`CONTABO_HOST`, `CONTABO_USER`, `CONTABO_SSH_KEY`, `CONTABO_SSH_PORT`, `CONTABO_PROJECT_PATH`, `GH_PAT`, and all `DB_*` / `JWT_*` variables plus `APP_ENV`, `APP_DEBUG`, `ALLOWED_ORIGINS_STR`.
