resource "azurerm_storage_account" "storage_account" {
  name                     = var.storage_account_name
  resource_group_name      = var.resource_group_name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_storage_container" "storage_container" {
  name                  = var.container_name
  storage_account_name  = azurerm_storage_account.storage_account.name
  container_access_type = "private"
}

output "storage_account_name" {
  value       = azurerm_storage_account.storage_account.name
  description = "The name of the storage account."
}

output "storage_container_name" {
  value       = azurerm_storage_container.storage_container.name
  description = "The name of the storage container."
}