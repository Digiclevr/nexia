-- =====================================================
-- NEXIA KUBERNETES HEALTH MONITORING DATABASE SCHEMA
-- =====================================================
-- Description: PostgreSQL schema for storing health metrics and trends
-- Author: NEXIA Monitoring System
-- Version: 1.0
-- =====================================================

-- Create database (run separately as superuser)
-- CREATE DATABASE nexia_monitoring;
-- \c nexia_monitoring;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CLUSTERS TABLE
-- =====================================================
CREATE TABLE clusters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    endpoint VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- =====================================================
-- HEALTH CATEGORIES TABLE
-- =====================================================
CREATE TABLE health_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    weight DECIMAL(3,2) DEFAULT 1.0, -- For weighted scoring
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO health_categories (name, description, weight) VALUES
    ('infrastructure', 'Node health, CPU, memory, storage capacity', 1.0),
    ('applications', 'Pod status, deployments, services health', 1.2),
    ('storage', 'Persistent volumes, storage performance', 1.0),
    ('network', 'LoadBalancers, ingress, connectivity', 1.0),
    ('security', 'RBAC, secrets, security contexts', 1.1),
    ('monitoring', 'Observability stack, alerts, metrics', 0.9);

-- =====================================================
-- HEALTH REPORTS TABLE
-- =====================================================
CREATE TABLE health_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cluster_id UUID NOT NULL REFERENCES clusters(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
    overall_status VARCHAR(50) NOT NULL,
    report_data JSONB, -- Full JSON report for detailed analysis
    execution_time_seconds DECIMAL(10,3),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_cluster_timestamp UNIQUE (cluster_id, timestamp)
);

-- =====================================================
-- CATEGORY SCORES TABLE
-- =====================================================
CREATE TABLE category_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES health_reports(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES health_categories(id) ON DELETE CASCADE,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    status VARCHAR(50) NOT NULL,
    issues JSONB, -- Array of issues detected
    metrics JSONB, -- Additional metrics (CPU%, memory%, etc.)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_report_category UNIQUE (report_id, category_id)
);

-- =====================================================
-- HEALTH ISSUES TABLE
-- =====================================================
CREATE TABLE health_issues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES health_reports(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES health_categories(id) ON DELETE CASCADE,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('critical', 'warning', 'info')),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    resource_type VARCHAR(100), -- pod, node, pv, etc.
    resource_name VARCHAR(255),
    namespace VARCHAR(255),
    recommendation TEXT,
    is_resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ACTIONS TABLE
-- =====================================================
CREATE TABLE recommended_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES health_reports(id) ON DELETE CASCADE,
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('urgent', 'medium', 'low', 'maintenance')),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    command TEXT, -- kubectl command or action to take
    estimated_time_minutes INTEGER,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    completed_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- METRICS HISTORY TABLE
-- =====================================================
CREATE TABLE metrics_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cluster_id UUID NOT NULL REFERENCES clusters(id) ON DELETE CASCADE,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,4),
    metric_unit VARCHAR(50),
    labels JSONB, -- Additional labels/tags
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ALERTS TABLE
-- =====================================================
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cluster_id UUID NOT NULL REFERENCES clusters(id) ON DELETE CASCADE,
    alert_type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('critical', 'warning', 'info')),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    triggered_at TIMESTAMP WITH TIME ZONE NOT NULL,
    resolved_at TIMESTAMP WITH TIME ZONE,
    is_resolved BOOLEAN DEFAULT false,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Health Reports indexes
CREATE INDEX idx_health_reports_cluster_timestamp ON health_reports(cluster_id, timestamp DESC);
CREATE INDEX idx_health_reports_overall_score ON health_reports(overall_score);
CREATE INDEX idx_health_reports_created_at ON health_reports(created_at DESC);

-- Category Scores indexes
CREATE INDEX idx_category_scores_report_id ON category_scores(report_id);
CREATE INDEX idx_category_scores_category_id ON category_scores(category_id);
CREATE INDEX idx_category_scores_score ON category_scores(score);

-- Health Issues indexes
CREATE INDEX idx_health_issues_report_id ON health_issues(report_id);
CREATE INDEX idx_health_issues_severity ON health_issues(severity);
CREATE INDEX idx_health_issues_resolved ON health_issues(is_resolved);
CREATE INDEX idx_health_issues_resource ON health_issues(resource_type, resource_name);

-- Actions indexes
CREATE INDEX idx_recommended_actions_report_id ON recommended_actions(report_id);
CREATE INDEX idx_recommended_actions_priority ON recommended_actions(priority);
CREATE INDEX idx_recommended_actions_completed ON recommended_actions(is_completed);

-- Metrics History indexes
CREATE INDEX idx_metrics_history_cluster_metric_timestamp ON metrics_history(cluster_id, metric_name, timestamp DESC);
CREATE INDEX idx_metrics_history_timestamp ON metrics_history(timestamp DESC);

-- Alerts indexes
CREATE INDEX idx_alerts_cluster_id ON alerts(cluster_id);
CREATE INDEX idx_alerts_triggered_at ON alerts(triggered_at DESC);
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_alerts_resolved ON alerts(is_resolved);

-- =====================================================
-- USEFUL VIEWS
-- =====================================================

-- Latest reports per cluster
CREATE VIEW latest_reports AS
SELECT DISTINCT ON (cluster_id) 
    hr.*,
    c.name as cluster_name
FROM health_reports hr
JOIN clusters c ON c.id = hr.cluster_id
WHERE c.is_active = true
ORDER BY cluster_id, timestamp DESC;

-- Score trends (last 24 hours)
CREATE VIEW score_trends_24h AS
SELECT 
    hr.cluster_id,
    c.name as cluster_name,
    hc.name as category_name,
    cs.score,
    cs.status,
    hr.timestamp,
    LAG(cs.score, 1) OVER (
        PARTITION BY hr.cluster_id, cs.category_id 
        ORDER BY hr.timestamp
    ) as previous_score
FROM health_reports hr
JOIN clusters c ON c.id = hr.cluster_id
JOIN category_scores cs ON cs.report_id = hr.id
JOIN health_categories hc ON hc.id = cs.category_id
WHERE hr.timestamp >= NOW() - INTERVAL '24 hours'
    AND c.is_active = true
ORDER BY hr.cluster_id, hc.name, hr.timestamp DESC;

-- Critical issues summary
CREATE VIEW critical_issues_summary AS
SELECT 
    c.name as cluster_name,
    hc.name as category_name,
    COUNT(*) as issue_count,
    MAX(hr.timestamp) as latest_report
FROM health_issues hi
JOIN health_reports hr ON hr.id = hi.report_id
JOIN clusters c ON c.id = hr.cluster_id
JOIN health_categories hc ON hc.id = hi.category_id
WHERE hi.severity = 'critical' 
    AND hi.is_resolved = false
    AND c.is_active = true
GROUP BY c.name, hc.name
ORDER BY issue_count DESC;

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to calculate weighted overall score
CREATE OR REPLACE FUNCTION calculate_weighted_score(report_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    weighted_sum DECIMAL;
    total_weight DECIMAL;
BEGIN
    SELECT 
        SUM(cs.score * hc.weight),
        SUM(hc.weight)
    INTO weighted_sum, total_weight
    FROM category_scores cs
    JOIN health_categories hc ON hc.id = cs.category_id
    WHERE cs.report_id = report_uuid;
    
    IF total_weight > 0 THEN
        RETURN ROUND(weighted_sum / total_weight);
    ELSE
        RETURN 0;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to get cluster health trend
CREATE OR REPLACE FUNCTION get_health_trend(
    cluster_uuid UUID, 
    hours_back INTEGER DEFAULT 24
)
RETURNS TABLE (
    timestamp TIMESTAMP WITH TIME ZONE,
    overall_score INTEGER,
    infrastructure_score INTEGER,
    applications_score INTEGER,
    storage_score INTEGER,
    network_score INTEGER,
    security_score INTEGER,
    monitoring_score INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        hr.timestamp,
        hr.overall_score,
        MAX(CASE WHEN hc.name = 'infrastructure' THEN cs.score END) as infrastructure_score,
        MAX(CASE WHEN hc.name = 'applications' THEN cs.score END) as applications_score,
        MAX(CASE WHEN hc.name = 'storage' THEN cs.score END) as storage_score,
        MAX(CASE WHEN hc.name = 'network' THEN cs.score END) as network_score,
        MAX(CASE WHEN hc.name = 'security' THEN cs.score END) as security_score,
        MAX(CASE WHEN hc.name = 'monitoring' THEN cs.score END) as monitoring_score
    FROM health_reports hr
    JOIN category_scores cs ON cs.report_id = hr.id
    JOIN health_categories hc ON hc.id = cs.category_id
    WHERE hr.cluster_id = cluster_uuid
        AND hr.timestamp >= NOW() - INTERVAL '%s hours'
    GROUP BY hr.timestamp, hr.overall_score
    ORDER BY hr.timestamp DESC;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SAMPLE DATA INSERT
-- =====================================================

-- Insert default cluster
INSERT INTO clusters (name, description, endpoint) 
VALUES ('default-cluster', 'Main Kubernetes cluster', 'https://kubernetes.default.svc');

-- =====================================================
-- PERMISSIONS (adjust as needed)
-- =====================================================

-- Create application user
-- CREATE USER nexia_app WITH PASSWORD 'secure_password_here';
-- GRANT CONNECT ON DATABASE nexia_monitoring TO nexia_app;
-- GRANT USAGE ON SCHEMA public TO nexia_app;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO nexia_app;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO nexia_app;