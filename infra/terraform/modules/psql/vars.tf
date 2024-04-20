variable "resource_group_name" {
    type        = string
    description = "Name of the resource group."
}

variable "location" {
    type        = string
    description = "Location of the virtual machine."
}

## PostgreSQL

variable "psql_login" {
    type        = string
    description = "Login for the PostgreSQL server."
}

variable "psql_password" {
    type        = string
    description = "Password for the PostgreSQL server."
}

variable "database_name" {
    type        = string
    description = "Name of the PostgreSQL database."
}