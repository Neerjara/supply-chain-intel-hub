# Azure Monitor Action Group for Incident Notifications
resource "azurerm_monitor_action_group" "scih_ops" {
  name                = "ag-scih-ops-${var.location}"
  resource_group_name = var.resource_group_name
  short_name          = "scihops"
  tags                = var.tags

  email_receiver {
    name                    = "CloudOpsTeam"
    email_address           = "cloudops@scih-enterprise.com"
    use_common_alert_schema = true
  }

  webhook_receiver {
    name                    = "TeamsIncidentWebhook"
    service_uri             = "https://outlook.office.com/webhook/scih-incidents"
    use_common_alert_schema = true
  }
}

# Alert 1: Sev1 - API High Latency Alert (p95 > 1500ms)
resource "azurerm_monitor_scheduled_query_rules_alert_v2" "api_high_latency" {
  name                = "alert-scih-api-high-latency"
  resource_group_name = var.resource_group_name
  location            = var.location
  scopes              = [azurerm_application_insights.appi.id]
  severity            = 1
  evaluation_frequency = "PT5M"
  window_duration      = "PT5M"
  criteria_time_aggregation = "Average"
  description         = "Triggers when SCIH API p95 response duration exceeds 1500ms."
  tags                = var.tags

  criteria {
    query                   = <<-QUERY
      requests
      | where cloud_RoleName == "SCIH.Api"
      | summarize p95_duration = percentiles(duration, 95) by bin(timestamp, 5m)
    QUERY
    time_aggregation_method = "Average"
    metric_measure_column   = "p95_duration"
    operator                = "GreaterThan"
    threshold               = 1500
    failing_periods {
      minimum_failing_periods_to_trigger_alert = 1
      number_of_evaluation_periods             = 1
    }
  }

  action {
    action_groups = [azurerm_monitor_action_group.scih_ops.id]
  }
}

# Alert 2: Sev2 - HTTP 5xx Error Rate > 2%
resource "azurerm_monitor_scheduled_query_rules_alert_v2" "http_5xx_errors" {
  name                = "alert-scih-http-5xx-errors"
  resource_group_name = var.resource_group_name
  location            = var.location
  scopes              = [azurerm_application_insights.appi.id]
  severity            = 2
  evaluation_frequency = "PT5M"
  window_duration      = "PT5M"
  criteria_time_aggregation = "Average"
  description         = "Triggers when HTTP 5xx error rate exceeds 2%."
  tags                = var.tags

  criteria {
    query                   = <<-QUERY
      requests
      | where cloud_RoleName == "SCIH.Api"
      | summarize 
          Total = count(), 
          Errors = countif(toint(resultCode) >= 500) 
          by bin(timestamp, 5m)
      | extend ErrorRate = (Errors * 100.0) / Total
    QUERY
    time_aggregation_method = "Average"
    metric_measure_column   = "ErrorRate"
    operator                = "GreaterThan"
    threshold               = 2.0
    failing_periods {
      minimum_failing_periods_to_trigger_alert = 1
      number_of_evaluation_periods             = 1
    }
  }

  action {
    action_groups = [azurerm_monitor_action_group.scih_ops.id]
  }
}

# Alert 3: Sev1 - Worker Processing Failure Rate > 5%
resource "azurerm_monitor_scheduled_query_rules_alert_v2" "worker_failures" {
  name                = "alert-scih-worker-failures"
  resource_group_name = var.resource_group_name
  location            = var.location
  scopes              = [azurerm_application_insights.appi.id]
  severity            = 1
  evaluation_frequency = "PT5M"
  window_duration      = "PT5M"
  criteria_time_aggregation = "Count"
  description         = "Triggers when worker background job exception count exceeds 5 in 5 minutes."
  tags                = var.tags

  criteria {
    query                   = <<-QUERY
      exceptions
      | where cloud_RoleName == "SCIH.Worker"
      | summarize FailureCount = count() by bin(timestamp, 5m)
    QUERY
    time_aggregation_method = "Count"
    metric_measure_column   = "FailureCount"
    operator                = "GreaterThan"
    threshold               = 5
    failing_periods {
      minimum_failing_periods_to_trigger_alert = 1
      number_of_evaluation_periods             = 1
    }
  }

  action {
    action_groups = [azurerm_monitor_action_group.scih_ops.id]
  }
}
