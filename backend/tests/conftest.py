import os

import pytest
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

import app.models  # noqa: F401 - register all models with Base metadata
from app.db.base import Base

# ── Database URL ──────────────────────────────────────────────────────────────
# Tests use a fully independent set of TEST_DB_* credentials from .env so they
# never touch the development database (auth_db).

load_dotenv(".env", override=False)

_DB_URL = (
    f"mysql+pymysql://{os.environ['TEST_DB_USER']}:{os.environ['TEST_DB_PASSWORD']}"
    f"@{os.environ['TEST_DB_HOST']}:{os.environ['TEST_DB_PORT']}/{os.environ['TEST_DB_NAME']}"
)

# ── Session-scoped engine — tables created once per test run ──────────────────


@pytest.fixture(scope="session")
def db_engine():
    engine = create_engine(_DB_URL, echo=False, pool_pre_ping=True)
    Base.metadata.create_all(bind=engine)
    yield engine
    Base.metadata.drop_all(bind=engine)
    engine.dispose()


# ── Function-scoped DB session — each test runs in a rolled-back transaction ──


@pytest.fixture()
def db(db_engine) -> Session:
    """
    Yield a SQLAlchemy session that wraps every test in a transaction.
    The transaction is always rolled back on teardown, so tests are fully
    isolated and the database stays clean without being recreated each run.
    """
    connection = db_engine.connect()
    transaction = connection.begin()
    session = Session(bind=connection)

    # Prevent the service layer from issuing its own COMMIT / ROLLBACK,
    # which would break the outer savepoint strategy.
    session.begin_nested()

    yield session

    session.close()
    transaction.rollback()
    connection.close()
