resource "azurerm_virtual_network" "vnet" {
  name                = "instamint-vnet"
  address_space       = ["10.0.0.0/16"]
  location            = var.location
  resource_group_name = var.resource_group_name
}

resource "azurerm_subnet" "subnet" {
  name                 = "instamint-subnet"
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["10.0.1.0/24"]
}

output "vnet_name" {
  value = azurerm_virtual_network.vnet.name
  description = "The name of the virtual network."
}

output "subnet_id" {
  value = azurerm_subnet.subnet.id
  description = "The ID of the subnet."
}