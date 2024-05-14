output "bastion_host_ip" {
    value       = azurerm_public_ip.bastion_ip.ip_address
    description = "Public IP address of the bastion host."
}