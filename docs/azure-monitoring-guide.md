# Azure Monitor & Application Insights Operational Guide

This document provides operational **Kusto Query Language (KQL)** queries, alert definitions, and debugging procedures for the **Supply Chain Intelligence Hub (SCIH)**.

---

## 1. Kusto Query Language (KQL) Diagnostics

### A. API Response Latency (Percentiles: p50, p95, p99)
```kusto
requests
| where timestamp > ago(1h)
| where cloud_RoleName == "SCIH.Api"
| summarize 
    TotalRequests = count(),
    p50_ms = percentiles(duration, 50),
    p95_ms = percentiles(duration, 95),
    p99_ms = percentiles(duration, 99)
    by name, resultCode
| order by p95_ms desc
```

### B. HTTP Server Error Rate (5xx Failures)
```kusto
requests
| where timestamp > ago(15m)
| where cloud_RoleName == "SCIH.Api"
| summarize 
    TotalCount = count(),
    ErrorCount = countif(toint(resultCode) >= 500),
    ErrorRatePercent = (countif(toint(resultCode) >= 500) * 100.0) / count()
    by bin(timestamp, 1m)
| where ErrorRatePercent > 2.0
```

### C. Worker Background Job Failures & Exceptions
```kusto
exceptions
| where timestamp > ago(1h)
| where cloud_RoleName == "SCIH.Worker"
| extend JobId = tostring(customDimensions.JobId)
| summarize 
    FailureCount = count(),
    LastOccurrence = max(timestamp)
    by type, outerMessage, JobId
| order by FailureCount desc
```

### D. PostgreSQL Slow Query Detection (> 1000ms)
```kusto
AzureDiagnostics
| where TimeGenerated > ago(1h)
| where ResourceProvider == "MICROSOFT.DBFORPOSTGRESQL"
| where Category == "PostgreSQLFlexDatabaseXlogs" or Category == "PostgreSQLLogs"
| where Message contains "duration:"
| parse Message with * "duration: " DurationMs " ms  statement: " QueryText
| extend DurationSeconds = todouble(DurationMs) / 1000.0
| where DurationSeconds > 1.0
| project TimeGenerated, DurationSeconds, QueryText, Resource
| order by DurationSeconds desc
```

### E. Container Apps Health & Unexpected Restarts
```kusto
ContainerAppSystemLogs_CL
| where TimeGenerated > ago(1h)
| where Type_s == "ContainerAppRestart" or Message contains "Killing" or Message contains "OOMKilled"
| summarize RestartCount = count() by ContainerAppName_s, RevisionName_s, bin(TimeGenerated, 5m)
| order by RestartCount desc
```

---

## 2. Alert Severity Matrix & Response SLAs

| Alert Name | Severity | Condition | Action Group | Response SLA |
| :--- | :--- | :--- | :--- | :--- |
| **`Database-Connection-Failure`** | **Sev0 (Critical)** | DB Connection Probe Failure | PagerDuty + SMS + Email | **< 15 Mins** |
| **`API-High-Latency-p95`** | **Sev1 (High)** | p95 Latency > 1500ms for 5m | Teams Webhook + Email | **< 30 Mins** |
| **`Worker-Job-Failure-Rate`** | **Sev1 (High)** | Job Error Rate > 5.0% | Teams Webhook + Email | **< 1 Hour** |
| **`HTTP-5xx-Error-Rate`** | **Sev2 (Warning)** | 5xx Errors > 2.0% | Slack Webhook | Next Business Day |
| **`Container-Memory-Throttling`** | **Sev2 (Warning)** | Memory Usage > 85.0% | Slack Webhook | Next Business Day |
