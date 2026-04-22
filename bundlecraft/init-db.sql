-- Database initialization script for BundleCraft
-- This file will be run automatically when the PostgreSQL container starts

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create a simple health check function
CREATE OR REPLACE FUNCTION health_check()
RETURNS TABLE(status TEXT, timestamp TIMESTAMPTZ) AS $$
BEGIN
    RETURN QUERY SELECT 'ok'::TEXT as status, NOW() as timestamp;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON DATABASE bundlecraft TO bundlecraft;
