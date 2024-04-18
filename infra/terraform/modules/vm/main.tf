resource "azurerm_linux_virtual_machine" "vm" {
  name                  = var.vm_name
  resource_group_name   = var.resource_group_name
  location              = var.location
  size                  = "Standard_B1ms"
  admin_username        = var.admin_username
  admin_password        = var.admin_password
  network_interface_ids = var.network_interface_ids
  availability_set_id   = var.availability_set_id

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "UbuntuServer"
    sku       = "18.04-LTS"
    version   = "latest"
  }

  admin_ssh_key {
    username   = var.admin_username
    public_key = file(var.ssh_public_key)
  }

  disable_password_authentication = true
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