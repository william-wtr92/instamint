variable "resource_group_name" {
    type        = string
    description = "Name of the resource group"
}

variable "vm_name" {
    type        = string
    description = "Name of the VM"
}

variable "location" {
    type        = string
    description = "Location of the resource"
}

variable "subnet_id" {
    type        = string
    description = "ID of the subnet"
}

variable "availability_set_id" {
    type        = string
    description = "ID of the availability set"
}

variable "admin_username" {
    type        = string
    description = "Admin username for the VM"
}

variable "admin_password" {
    type        = string
    description = "Admin password for the VM"
}
