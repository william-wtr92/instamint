provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg" {
  name     = "instamint"
  location = "France Central"
}

resource "azurerm_container_registry" "acr" {
    name                = "instamintACR"
    resource_group_name = azurerm_resource_group.rg.name
    location            = azurerm_resource_group.rg.location
    sku                 = "Standard"
    admin_enabled       = false
}