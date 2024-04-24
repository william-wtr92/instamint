resource "azurerm_log_analytics_workspace" "instamint-log-analytics" {
  name                = "instamint-workspace"
  location            = var.location
  resource_group_name = var.resource_group_name
  sku                 = "PerGB2018"
  retention_in_days   = 30

  tags = {
    Service     = "analytics"
    Environment = "Prod"
  }
}

resource "azurerm_role_assignment" "instamint-log-analytics-reader" {
  scope                = azurerm_log_analytics_workspace.instamint-log-analytics.id
  role_definition_name = "Reader"
  principal_id         = var.client_object_id
  principal_type       = "ServicePrincipal"
}