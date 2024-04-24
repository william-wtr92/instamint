variable "resource_group_name" {
    type        = string
    description = "Name of the resource group."
}

variable "location" {
    type        = string
    description = "Location of the virtual machine."
}

variable "storage_account_name" {
    type        = string
    description = "Specifies the name of the storage account."
}

variable "container_name" {
    type        = string
    description = "Specifies the name of the storage container."
}