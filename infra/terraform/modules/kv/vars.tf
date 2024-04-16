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

variable "tenant_id" {
    type        = string
    description = "The Azure tenant ID."
}

variable "client_object_id" {
    type        = string
    description = "The object ID of a user, service principal or security group in the Azure Active Directory tenant for the vault."
}