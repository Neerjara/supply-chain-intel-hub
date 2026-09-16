resource "azurerm_api_management" "apim" {
  name                = var.apim_name
  location            = var.location
  resource_group_name = var.resource_group_name
  publisher_name      = var.publisher_name
  publisher_email     = var.publisher_email
  sku_name            = var.sku_name
  tags                = var.tags

  identity {
    type = "SystemAssigned"
  }
}

# APIM Global Tenant Policy
resource "azurerm_api_management_policy" "global" {
  api_management_id = azurerm_api_management.apim.id
  xml_content       = file("${path.module}/policies/global-policy.xml")
}

# APIM Application Insights Logger
resource "azurerm_api_management_logger" "appi" {
  name                = "apim-logger"
  api_management_name = azurerm_api_management.apim.name
  resource_group_name = var.resource_group_name
  resource_id         = var.app_insights_id

  application_insights {
    instrumentation_key = var.app_insights_instrumentation_key
  }
}

# SCIH v1 API Definition
resource "azurerm_api_management_api" "scih_v1" {
  name                = "scih-api-v1"
  resource_group_name = var.resource_group_name
  api_management_name = azurerm_api_management.apim.name
  revision            = "1"
  display_name        = "Supply Chain Intelligence Hub API"
  path                = "v1"
  protocols           = ["https"]
  service_url         = "https://${var.api_fqdn}"
}

# Dashboard API Policy Configuration
resource "azurerm_api_management_api_operation" "dashboard" {
  operation_id        = "get-dashboard"
  api_name            = azurerm_api_management_api.scih_v1.name
  api_management_name = azurerm_api_management.apim.name
  resource_group_name = var.resource_group_name
  display_name        = "Get Dashboard Logistics Metrics"
  method              = "GET"
  url_template        = "/dashboard"
}

resource "azurerm_api_management_api_operation_policy" "dashboard" {
  api_name            = azurerm_api_management_api.scih_v1.name
  api_management_name = azurerm_api_management.apim.name
  resource_group_name = var.resource_group_name
  operation_id        = azurerm_api_management_api_operation.dashboard.operation_id
  xml_content         = file("${path.module}/policies/dashboard-api-policy.xml")
}

# Search API Policy Configuration
resource "azurerm_api_management_api_operation" "search" {
  operation_id        = "search-shipments"
  api_name            = azurerm_api_management_api.scih_v1.name
  api_management_name = azurerm_api_management.apim.name
  resource_group_name = var.resource_group_name
  display_name        = "Search Shipments & Transactions"
  method              = "GET"
  url_template        = "/search"
}

resource "azurerm_api_management_api_operation_policy" "search" {
  api_name            = azurerm_api_management_api.scih_v1.name
  api_management_name = azurerm_api_management.apim.name
  resource_group_name = var.resource_group_name
  operation_id        = azurerm_api_management_api_operation.search.operation_id
  xml_content         = file("${path.module}/policies/search-api-policy.xml")
}

# Journey API Policy Configuration
resource "azurerm_api_management_api_operation" "journey" {
  operation_id        = "get-journey"
  api_name            = azurerm_api_management_api.scih_v1.name
  api_management_name = azurerm_api_management.apim.name
  resource_group_name = var.resource_group_name
  display_name        = "Get Shipment Milestone Journey & Telemetry"
  method              = "GET"
  url_template        = "/journey/{id}"

  template_parameter {
    name     = "id"
    type     = "string"
    required = true
  }
}

resource "azurerm_api_management_api_operation_policy" "journey" {
  api_name            = azurerm_api_management_api.scih_v1.name
  api_management_name = azurerm_api_management.apim.name
  resource_group_name = var.resource_group_name
  operation_id        = azurerm_api_management_api_operation.journey.operation_id
  xml_content         = file("${path.module}/policies/journey-api-policy.xml")
}
