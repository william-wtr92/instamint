variable "resource_group_name" {
    type        = string
    description = "Name of the resource group"
}

variable "location" {
    type        = string
    description = "Location of the virtual machine"
}

variable "subnet_id" {
    type        = string
    description = "ID of the subnet"
}
