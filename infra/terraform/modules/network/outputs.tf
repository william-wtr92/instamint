output "vnet_name" {
    value = azurerm_virtual_network.vnet.name
    description = "The name of the virtual network."
}

output "subnet_id" {
    value = azurerm_subnet.subnet.id
    description = "The ID of the subnet."
}