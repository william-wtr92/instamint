variable "resource_group_name" {
  type        = string
  description = "Name of the resource group."
}

variable "location" {
  type        = string
  description = "Location of the virtual machine."
}

variable "key_vault_name" {
    type        = string
    description = "Specifies the name of the key vault."
}

## Secrets ##

variable "secrets" {
  type        = map(string)
  description = "Environment variables."
}