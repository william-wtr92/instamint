variable "resource_group_name" {
    type        = string
    description = "Name of the resource group."
}

variable "location" {
    type        = string
    description = "Location of the virtual machine."
}

/*variable "probe_id" {
    type        = string
    description = "ID of the probe."
}*/

## NIC ##

variable "webapp_nic" {
    type        = string
    description = "Webapp NIC."
}

variable "business_nic" {
    type        = string
    description = "Business NIC."
}

variable "files_nic" {
    type        = string
    description = "Files NIC."
}

variable "cron_nic" {
    type        = string
    description = "Cron NIC."
}