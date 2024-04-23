data "azurerm_client_config" "current" {}

resource "azurerm_key_vault" "key_vault" {
  name                        = var.key_vault_name
  location                    = var.location
  resource_group_name         = var.resource_group_name
  tenant_id                   = data.azurerm_client_config.current.tenant_id
  sku_name                    = "standard"
}

resource "azurerm_key_vault_access_policy" "key_vault_access_policy" {
  key_vault_id = azurerm_key_vault.key_vault.id
  object_id    = data.azurerm_client_config.current.object_id
  tenant_id    = data.azurerm_client_config.current.tenant_id

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

## Add service principal access policy ##

data "azuread_service_principal" "instamint-prod-sp" {
  display_name = "instamint-prod-sp"
}

resource "azurerm_key_vault_access_policy" "key_vault_access_policy_sp" {
  key_vault_id = azurerm_key_vault.key_vault.id
  object_id    = data.azuread_service_principal.instamint-prod-sp.object_id
  tenant_id    = data.azurerm_client_config.current.tenant_id

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

## Set secrets ##

resource "azurerm_key_vault_secret" "key_vault_secret" {
  for_each     = var.secrets

  name         = each.key
  value        = each.value
  key_vault_id = azurerm_key_vault.key_vault.id

  tags = {
    service     = "key-vault"
    environment = "prod"
  }
}