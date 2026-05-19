#!/bin/bash
set -e

echo "Running Alembic migrations..."
python -c "
from alembic.config import Config
from alembic import command
import sqlalchemy
from app.core.settings import settings

cfg = Config('alembic.ini')
cfg.set_main_option('sqlalchemy.url', settings.DATABASE_URL)
command.upgrade(cfg, 'head')
print('Migrations completed.')
"
