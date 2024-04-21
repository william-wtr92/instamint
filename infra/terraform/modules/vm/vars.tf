variable "admin_username" {
    type        = string
    description = "Admin username for VMs."
}

variable "admin_password" {
    type        = string
    description = "Admin password for VMs."
}

variable "ssh_public_key" {
    type        = string
    description = "SSH public key."
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

variable "availability_set_id" {
    type        = string
    description = "ID of the availability set."
}

variable "network_interface_ids" {
    type        = list(string)
    description = "List of network interface IDs."
}

## ACR ##

variable "acr_username" {
    type        = string
    description = "Username for the Azure Container Registry."
}

variable "acr_password" {
    type        = string
    description = "Password for the Azure Container Registry."
}

## Docker ##

variable "container_image" {
    type        = string
    description = "Image of the container."
}

variable "container_name" {
    type        = string
    description = "Name of the container."
}

variable "container_port" {
    type        = string
    description = "Port of the container."
}