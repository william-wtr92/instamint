output "storage_account_name" {
    value       = azurerm_storage_account.storage_account.name
    description = "The name of the storage account."
}

output "storage_container_name" {
    value       = azurerm_storage_container.storage_container.name
    description = "The name of the storage container."
}

output "storage_account_key" {
    value = azurerm_storage_account.storage_account.primary_access_key
    description = "The primary access key of the storage account."
}

output "storage_account_connection_string" {
    value = azurerm_storage_account.storage_account.primary_connection_string
    description = "The primary connection string of the storage account."
}

output "storage_url" {
    value = azurerm_storage_account.storage_account.primary_blob_endpoint
    description = "The primary blob endpoint of the storage account."
}