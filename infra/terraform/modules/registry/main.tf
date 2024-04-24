resource "azurerm_container_registry" "acr" {
  name                = "instamintACR"
  location            = var.location
  resource_group_name = var.resource_group_name
  sku                 = "Standard"
  admin_enabled       = false

  tags = {
    Service     = "registry"
    Environment = "Prod"
  }
}