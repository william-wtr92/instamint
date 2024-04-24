output "http_probe_id" {
    value       = azurerm_lb_probe.http_probe.id
    description = "The ID of the SSH probe."
}