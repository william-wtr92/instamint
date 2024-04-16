resource "azurerm_key_vault" "key_vault" {
  name                        = var.key_vault_name
  location                    = var.location
  resource_group_name         = var.resource_group_name
  tenant_id                   = var.tenant_id
  sku_name                    = "standard"
}

resource "azurerm_key_vault_access_policy" "key_vault_access_policy" {
  key_vault_id = azurerm_key_vault.key_vault.id
  object_id    = var.client_object_id
  tenant_id    = var.tenant_id

  key_permissions = [
    "Get",
  ]

  secret_permissions = [
    "Get",
    "List",
    "Set",
    "Delete",
  ]

  certificate_permissions = [
    "Get",
    "List",
  ]
}

output "key_vault_id" {
  value       = azurerm_key_vault.key_vault.id
  description = "The ID of the key vault."
}

output "key_vault_uri" {
  value       = azurerm_key_vault.key_vault.vault_uri
  description = "The URI of the key vault, used for accessing the secrets."
}