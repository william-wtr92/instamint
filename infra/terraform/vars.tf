## VM Configuration

variable "admin_username" {
    type        = string
    description = "Admin username for VMs."
}

variable "admin_password" {
    type        = string
    description = "Admin password for VMs."
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

## Grafana ##

variable "grafana_password" {
    type        = string
    description = "Password for the Grafana server."
}

## Azure Identity ##

variable "tenant_id" {
    type        = string
    description = "Tenant ID."
}

variable "client_object_id" {
    type        = string
    description = "Client object ID."
}