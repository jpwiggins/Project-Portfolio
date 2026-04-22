-- Initialize RegReady Database
-- This script runs when the PostgreSQL container starts for the first time

-- Create the database if it doesn't exist (this is handled by POSTGRES_DB env var)
-- But we can add any additional setup here

-- Grant all privileges to the regready_user
GRANT ALL PRIVILEGES ON DATABASE regready TO regready_user;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO regready_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO regready_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO regready_user;

-- Ensure the user can create extensions if needed
ALTER USER regready_user CREATEDB;

-- Log that initialization is complete
\echo 'RegReady database initialization complete'