output "psql_server_name" {
    value       = azurerm_postgresql_server.postgres.name
    description = "The name of the PostgreSQL server."
}

output "psql_db_name" {
    value = azurerm_postgresql_database.db.name
    description = "The name of the PostgreSQL database."
}

output "postgres_id" {
    value       = azurerm_postgresql_server.postgres.id
    description = "The ID of the PostgreSQL server."
}