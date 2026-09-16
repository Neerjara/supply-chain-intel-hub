-- Supply Chain Intelligence Hub (SCIH) - PostgreSQL v16 Schema & Seed Script
-- Created: 2026-09-14

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. Table: transactions
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tracking_number VARCHAR(50) NOT NULL UNIQUE,
    origin VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    carrier_name VARCHAR(100) NOT NULL,
    status VARCHAR(30) NOT NULL, -- IN_TRANSIT, DELIVERED, DELAYED, EXCEPTION, CUSTOMS_HOLD
    estimated_delivery TIMESTAMPTZ NOT NULL,
    actual_delivery TIMESTAMPTZ,
    weight_kg NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_transactions_tracking ON transactions(tracking_number);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_carrier ON transactions(carrier_name);

-- -----------------------------------------------------------------------------
-- 2. Table: transaction_journey
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS transaction_journey (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    step_number INT NOT NULL,
    milestone_name VARCHAR(100) NOT NULL,
    location_name VARCHAR(150) NOT NULL,
    latitude NUMERIC(9, 6),
    longitude NUMERIC(9, 6),
    temperature_c NUMERIC(5, 2),
    humidity_percent NUMERIC(5, 2),
    shock_g NUMERIC(5, 2),
    status VARCHAR(30) NOT NULL,
    milestone_time TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

CREATE INDEX IF NOT EXISTS idx_journey_tx_step ON transaction_journey(transaction_id, step_number);
CREATE INDEX IF NOT EXISTS idx_journey_milestone_time ON transaction_journey(milestone_time);

-- -----------------------------------------------------------------------------
-- 3. Table: exceptions
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS exceptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    severity VARCHAR(20) NOT NULL, -- LOW, MEDIUM, HIGH, CRITICAL
    exception_type VARCHAR(50) NOT NULL, -- COLD_CHAIN_BREACH, DELAY_RISK, CUSTOMS_HOLD
    description TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN', -- OPEN, IN_REVIEW, RESOLVED, IGNORED
    resolution_notes TEXT,
    resolved_by VARCHAR(100),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

CREATE INDEX IF NOT EXISTS idx_exceptions_status_severity ON exceptions(status, severity);
CREATE INDEX IF NOT EXISTS idx_exceptions_tx_id ON exceptions(transaction_id);

-- -----------------------------------------------------------------------------
-- 4. Table: dashboard_metrics
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dashboard_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_date DATE NOT NULL UNIQUE,
    total_shipments INT NOT NULL DEFAULT 0,
    in_transit_count INT NOT NULL DEFAULT 0,
    delivered_count INT NOT NULL DEFAULT 0,
    delayed_count INT NOT NULL DEFAULT 0,
    exception_count INT NOT NULL DEFAULT 0,
    on_time_rate_percent NUMERIC(5, 2) NOT NULL DEFAULT 100.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_dashboard_metrics_date ON dashboard_metrics(metric_date);

-- -----------------------------------------------------------------------------
-- 5. Table: user_preferences
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(100) NOT NULL UNIQUE,
    theme VARCHAR(20) NOT NULL DEFAULT 'light',
    default_carrier VARCHAR(100),
    notification_channels JSONB DEFAULT '{"email": true, "slack": true, "webhook": false}'::jsonb,
    dashboard_layout JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_prefs_jsonb ON user_preferences USING GIN (notification_channels);

-- -----------------------------------------------------------------------------
-- 6. Table: access_mappings
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS access_mappings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL, -- ADMIN, DISPATCH_OPERATOR, COMPLIANCE_AUDITOR
    allowed_regions VARCHAR(50)[] DEFAULT ARRAY['EASTUS', 'WESTUS'],
    is_active BOOLEAN NOT NULL DEFAULT true,
    granted_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

CREATE INDEX IF NOT EXISTS idx_access_mappings_user ON access_mappings(user_id);

-- -----------------------------------------------------------------------------
-- 7. Table: notification_status
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notification_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exception_id UUID NOT NULL REFERENCES exceptions(id) ON DELETE CASCADE,
    channel VARCHAR(30) NOT NULL, -- EMAIL, SLACK, WEBHOOK
    recipient VARCHAR(200) NOT NULL,
    delivery_status VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- PENDING, SENT, FAILED
    sent_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

CREATE INDEX IF NOT EXISTS idx_notifications_exception_id ON notification_status(exception_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notification_status(delivery_status);

-- -----------------------------------------------------------------------------
-- SAMPLE SEED DATA INSERTION
-- -----------------------------------------------------------------------------

-- Transactions
INSERT INTO transactions (id, tracking_number, origin, destination, carrier_name, status, estimated_delivery, weight_kg)
VALUES 
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'TRK-908234-US', 'Chicago, IL', 'Dallas, TX', 'FedEx Freight', 'IN_TRANSIT', NOW() + INTERVAL '2 days', 1420.00),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'TRK-109238-CA', 'Seattle, WA', 'San Jose, CA', 'DHL Express', 'DELAYED', NOW() + INTERVAL '3 days', 850.00),
    ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'TRK-554109-EU', 'Atlanta, GA', 'Miami, FL', 'UPS Supply Chain', 'EXCEPTION', NOW() + INTERVAL '1 day', 2100.00),
    ('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'TRK-882731-MX', 'New York, NY', 'Boston, MA', 'XPO Logistics', 'DELIVERED', NOW() - INTERVAL '1 day', 340.00)
ON CONFLICT (tracking_number) DO NOTHING;

-- Journey Milestones & Telemetry
INSERT INTO transaction_journey (transaction_id, step_number, milestone_name, location_name, latitude, longitude, temperature_c, humidity_percent, shock_g, status, milestone_time)
VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 1, 'Order Created', 'Chicago Hub', 41.8781, -87.6298, 4.0, 42.0, 0.0, 'COMPLETED', NOW() - INTERVAL '2 days'),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 2, 'Departed Facility', 'Chicago Terminal', 41.8500, -87.6500, 4.1, 44.0, 0.2, 'COMPLETED', NOW() - INTERVAL '1 day'),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 3, 'In Transit', 'St. Louis Checkpoint', 38.6270, -90.1994, 4.2, 45.0, 0.1, 'ACTIVE', NOW() - INTERVAL '5 hours'),

    ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 1, 'Order Created', 'Atlanta Depot', 33.7490, -84.3880, 5.0, 50.0, 0.1, 'COMPLETED', NOW() - INTERVAL '3 days'),
    ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 2, 'Temperature Alert', 'Jacksonville Terminal', 30.3322, -81.6557, 14.8, 82.0, 0.3, 'ACTIVE', NOW() - INTERVAL '2 hours');

-- Exceptions
INSERT INTO exceptions (id, transaction_id, severity, exception_type, description, status)
VALUES
    ('e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'CRITICAL', 'COLD_CHAIN_BREACH', 'Cold chain temperature threshold exceeded (> 12°C recorded at Jacksonville)', 'OPEN'),
    ('e2eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'HIGH', 'DELAY_RISK', 'Severe weather delay near Medford pass causing 24h SLA slippage', 'OPEN')
ON CONFLICT DO NOTHING;

-- Dashboard Metrics
INSERT INTO dashboard_metrics (metric_date, total_shipments, in_transit_count, delivered_count, delayed_count, exception_count, on_time_rate_percent)
VALUES (CURRENT_DATE, 1482, 840, 590, 34, 18, 96.40)
ON CONFLICT (metric_date) DO NOTHING;

-- User Preferences
INSERT INTO user_preferences (user_id, theme, default_carrier)
VALUES ('usr_admin_001', 'light', 'FedEx Freight')
ON CONFLICT (user_id) DO NOTHING;

-- Access Mappings
INSERT INTO access_mappings (user_id, role, allowed_regions)
VALUES ('usr_admin_001', 'ADMIN', ARRAY['EASTUS', 'WESTUS', 'CENTRALUS']);

-- Notification Status
INSERT INTO notification_status (exception_id, channel, recipient, delivery_status, sent_at)
VALUES ('e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'SLACK', '#scih-alerts-critical', 'SENT', NOW() - INTERVAL '1 hour');
