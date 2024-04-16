variable "admin_username" {
    type        = string
    description = "Admin username for VMs."
}

variable "admin_password" {
    type        = string
    description = "Admin password for VMs."
}

variable "vm_name" {
    type        = string
    description = "Name of the VM."
}

variable "resource_group_name" {
    type        = string
    description = "Name of the resource group."
}

variable "location" {
    type        = string
    description = "Location of the virtual machine."
}

variable "subnet_id" {
    type        = string
    description = "ID of the subnet."
}

variable "availability_set_id" {
    type        = string
    description = "ID of the availability set."
}

variable "network_interface_ids" {
    type        = list(string)
    description = "List of network interface IDs."
}