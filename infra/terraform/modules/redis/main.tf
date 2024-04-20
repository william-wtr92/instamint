resource "azurerm_redis_cache" "redis" {
  name                = "instamint-redis"
  location            = var.location
  resource_group_name = var.resource_group_name
  capacity            = 2
  family              = "C"
  sku_name            = "Basic"
  enable_non_ssl_port = false
}

data "azurerm_redis_cache" "redis" {
  name                = azurerm_redis_cache.redis.name
  resource_group_name = azurerm_redis_cache.redis.resource_group_name
}