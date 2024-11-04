-- Create schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS moisture;

-- Create the predictions table with statistics column
CREATE TABLE IF NOT EXISTS moisture.predictions (
    id SERIAL PRIMARY KEY,
    sensor_id VARCHAR(255) NOT NULL,
    queue VARCHAR(255) NOT NULL,  -- Change UUID to VARCHAR(255)
    date_time TIMESTAMP,
    predictions JSONB,
    statistics JSONB,  -- New column to store statistics
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes to improve query performance
CREATE INDEX idx_sensor_id ON moisture.predictions(sensor_id);
CREATE INDEX idx_queue ON moisture.predictions(queue);


