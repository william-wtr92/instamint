variable "resource_group_name" {
    type        = string
    description = "Name of the resource group"
}

variable "location" {
    type        = string
    description = "Location of the virtual machine"
}

variable "admin_password" {
    type        = string
    description = "Admin password for Grafana."
}