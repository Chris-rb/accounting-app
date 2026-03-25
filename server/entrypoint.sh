#!/usr/bin/env bash
set -euo pipefail

echo "Waiting for MySQL to be ready..."

# Wait until MySQL accepts connections
until python - <<EOF
import os
import sys
from sqlalchemy import create_engine, text

url = os.getenv("DATABASE_URL")

if not url:
    print("DATABASE_URL not set")
    sys.exit(1)

try:
    engine = create_engine(url)
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    print("Database is ready")
except Exception as e:
    print("Database not ready:", e)
    sys.exit(1)
EOF
do
  sleep 3
done
echo "MySQL is up."

echo "Running migrations..."
flask db upgrade

echo "Starting Flask..."
exec flask run --host=0.0.0.0