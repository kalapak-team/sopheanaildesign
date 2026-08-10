#!/bin/sh
set -e

PORT="${PORT:-8000}"

# Railway Postgres injects DATABASE_URL; Laravel prefers DB_URL
if [ -n "$DATABASE_URL" ] && [ -z "$DB_URL" ]; then
  export DB_URL="$DATABASE_URL"
fi

# Normalize postgres:// → postgresql://
if [ -n "$DB_URL" ]; then
  case "$DB_URL" in
    postgres://*)
      DB_URL="postgresql://${DB_URL#postgres://}"
      export DB_URL
      ;;
  esac
  # Ensure SSL for Railway Postgres
  case "$DB_URL" in
    *sslmode=*) ;;
    *)
      case "$DB_URL" in
        *\?*) DB_URL="${DB_URL}&sslmode=require" ;;
        *) DB_URL="${DB_URL}?sslmode=require" ;;
      esac
      export DB_URL
      ;;
  esac
fi

export DB_SSLMODE="${DB_SSLMODE:-require}"

echo "Boot: PORT=$PORT DB_CONNECTION=${DB_CONNECTION:-unset} has_DB_URL=$([ -n "$DB_URL" ] && echo yes || echo no)"

if [ -z "$DB_URL" ] && [ -z "$DB_HOST" ]; then
  echo "ERROR: No database configured. Link Railway Postgres and set DATABASE_URL (or DB_URL)." >&2
fi

mkdir -p \
  storage/framework/cache \
  storage/framework/sessions \
  storage/framework/views \
  storage/logs \
  bootstrap/cache
chmod -R ug+rwx storage bootstrap/cache 2>/dev/null || true

if [ "${MEDIA_DISK:-public}" = "public" ]; then
  php artisan storage:link --force 2>/dev/null || true
fi

export PGCONNECT_TIMEOUT="${PGCONNECT_TIMEOUT:-5}"

if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
  i=0
  migrated=0
  while [ "$i" -lt 12 ]; do
    if php artisan migrate --force --no-interaction; then
      migrated=1
      break
    fi
    i=$((i + 1))
    echo "Waiting for database... ($i/12)"
    sleep 2
  done
  if [ "$migrated" -ne 1 ]; then
    echo "WARNING: migrations failed — check Postgres is linked (DATABASE_URL/DB_URL)." >&2
  else
    echo "Migrations OK"
  fi
fi

if [ "${RUN_SEED:-false}" = "true" ]; then
  php artisan db:seed --force --no-interaction || true
fi

php artisan config:clear 2>/dev/null || true
php artisan route:clear 2>/dev/null || true

if [ "$1" = "php" ] && [ "$2" = "artisan" ] && [ "$3" = "serve" ]; then
  echo "Starting Laravel on 0.0.0.0:${PORT}"
  exec php artisan serve --host=0.0.0.0 --port="$PORT"
fi

exec "$@"
