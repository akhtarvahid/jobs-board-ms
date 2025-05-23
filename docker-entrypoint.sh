#!/bin/sh
set -e

# Determine environment
if [ "$NODE_ENV" = "development" ]; then
  echo "Running in DEVELOPMENT mode"
  npm run db:drop  # Uncomment if needed
  npm run db:migrate
  npm run db:seed
  exec npm start

else
  echo "Running in PRODUCTION mode"
  
  # Wait for database if DB_HOST is set
  if [ -n "$DB_HOST" ]; then
    until nc -z "$DB_HOST" "${DB_PORT:-5432}"; do
      echo "Waiting for PostgreSQL at $DB_HOST:${DB_PORT:-5432}..."
      sleep 2
    done
  fi

  # Conditional database operations
  if [ "$RUN_DB_OPS" != "false" ]; then
    echo "Running database migrations..."
    npm run db:migrate
    
    if [ "$RUN_DB_SEED" = "true" ]; then
      echo "Seeding database..."
      npm run db:seed
    fi
  fi

  # Start application
  exec node dist/main.js
fi