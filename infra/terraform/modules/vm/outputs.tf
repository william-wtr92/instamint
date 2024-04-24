output "vm_ip_address" {
    value       = azurerm_linux_virtual_machine.vm.private_ip_address
    description = "The private IP address of the VM."
}

output "acr_username" {
    value = var.acr_username
}

output "acr_password" {
    value = var.acr_password
}

output "container_image" {
    value = var.container_image
}

output "container_name" {
    value = var.container_name
}

output "container_port" {
    value = var.container_port
}