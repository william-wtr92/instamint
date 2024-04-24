output "vm_nic_id" {
    value       = azurerm_network_interface.vm_nic.id
    description = "The ID of the network interface."
}