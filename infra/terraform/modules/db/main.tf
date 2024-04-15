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
}


resource "azurerm_redis_cache" "redis" {
  name                = "instamint-redis"
  location            = var.location
  resource_group_name = var.resource_group_name
  capacity            = 0
  family              = "C"
  sku_name            = "Basic"
  enable_non_ssl_port = false
}

output "postgres_id" {
  value       = azurerm_postgresql_server.postgres.id
  description = "The ID of the PostgreSQL server"
}

output "redis_id" {
  value       = azurerm_redis_cache.redis.id
  description = "The ID of the Redis cache"
}