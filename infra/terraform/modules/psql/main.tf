resource "azurerm_postgresql_server" "postgres" {
  name                             = "instamint-postgres"
  location                         = var.location
  resource_group_name              = var.resource_group_name
  sku_name                         = "B_Gen5_2"
  storage_mb                       = 51200
  version                          = "11"
  auto_grow_enabled                = true

  administrator_login              = var.psql_login
  administrator_login_password     = var.psql_password

  ssl_enforcement_enabled          = true
  ssl_minimal_tls_version_enforced = "TLS1_2"

  tags = {
    Service     = "postgres"
    Environment = "Prod"
  }
}

resource "azurerm_postgresql_database" "db" {
  name                = var.database_name
  resource_group_name = azurerm_postgresql_server.postgres.resource_group_name
  server_name         = azurerm_postgresql_server.postgres.name
  charset             = "UTF8"
  collation           = "English_United States.1252"

  lifecycle {
    prevent_destroy = true
  }
}