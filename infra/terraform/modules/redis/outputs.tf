output "redis_id" {
    value       = azurerm_redis_cache.redis.id
    description = "The ID of the Redis cache."
}

output "redis_host" {
    value       = azurerm_redis_cache.redis.hostname
    description = "The hostname of the Redis cache."
}

output "redis_ssl_port" {
    value = azurerm_redis_cache.redis.ssl_port
    description = "The SSL port of the Redis cache."
}

output "redis_primary_access_key" {
    value       = data.azurerm_redis_cache.redis.primary_access_key
    description = "The primary access key for the Redis cache."
}

output "redis_secondary_access_key" {
    value       = data.azurerm_redis_cache.redis.secondary_access_key
    description = "The secondary access key for the Redis cache."
}