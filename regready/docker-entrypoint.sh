#!/bin/bash
set -e

echo "Starting RegReady application..."

# Wait for database to be ready with more robust checking
echo "Waiting for database to be ready..."
RETRIES=30
until pg_isready -h db -p 5432 || [ $RETRIES -eq 0 ]; do
  echo "$(date): Database is unavailable - sleeping (retries left: $RETRIES)"
  sleep 5
  RETRIES=$((RETRIES-1))
done

if [ $RETRIES -eq 0 ]; then
  echo "ERROR: Database failed to become ready after 150 seconds"
  exit 1
fi

echo "Database is ready!"

# Run database migrations using drizzle-kit (continue on failure)
echo "Running database migrations..."
npm run db:migrate:kit || echo "⚠️  Migration failed (tables may already exist) - continuing..."

# Seed database if needed (continue on failure)
echo "Seeding database..."
npm run db:seed || echo "⚠️  Seeding failed (data may already exist) - continuing..."

echo "Starting the application..."
exec node dist/index.js