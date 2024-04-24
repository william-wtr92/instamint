output "key_vault_id" {
    value       = azurerm_key_vault.key_vault.id
    description = "The ID of the key vault."
}

output "key_vault_uri" {
    value       = azurerm_key_vault.key_vault.vault_uri
    description = "The URI of the key vault, used for accessing the secrets."
}

output "key_vault_name" {
    value       = azurerm_key_vault.key_vault.name
    description = "The name of the key vault."
}