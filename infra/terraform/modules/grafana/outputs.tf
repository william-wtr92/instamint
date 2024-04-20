output "grafana_url" {
    value = "http://${azurerm_container_group.grafana.fqdn}:3000"
    description = "URL to access Grafana."
}