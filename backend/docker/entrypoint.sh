#!/bin/sh
set -e

PORT="${PORT:-8000}"

# Railway Postgres often exposes DATABASE_URL; Laravel reads DB_URL
if [ -n "$DATABASE_URL" ] && [ -z "$DB_URL" ]; then
  export DB_URL="$DATABASE_URL"
fi

mkdir -p \
  storage/framework/cache \
  storage/framework/sessions \
  storage/framework/views \
  storage/logs \
  bootstrap/cache
chmod -R ug+rwx storage bootstrap/cache 2>/dev/null || true

# Retry migrations until Postgres is ready (first deploy)
if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
  i=0
  until php artisan migrate --force --no-interaction; do
    i=$((i + 1))
    if [ "$i" -ge 15 ]; then
      echo "Migrations failed after $i attempts" >&2
      exit 1
    fi
    echo "Waiting for database... ($i)"
    sleep 2
  done
fi

if [ "${RUN_SEED:-false}" = "true" ]; then
  php artisan db:seed --force --no-interaction || true
fi

if [ "${MEDIA_DISK:-public}" = "public" ]; then
  php artisan storage:link --force 2>/dev/null || true
fi

php artisan config:cache 2>/dev/null || true
php artisan route:cache 2>/dev/null || true

if [ "$1" = "php" ] && [ "$2" = "artisan" ] && [ "$3" = "serve" ]; then
  exec php artisan serve --host=0.0.0.0 --port="$PORT"
fi

exec "$@"
