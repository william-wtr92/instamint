## VM Configuration

variable "admin_username" {
    type        = string
    description = "Admin username for VMs."
}

variable "admin_password" {
    type        = string
    description = "Admin password for VMs."
}

## SSH ##

variable "ssh_public_key" {
    type        = string
    description = "SSH public key."
}

variable "ssh_private_key" {
    type        = string
    description = "SSH private key."
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

## ACR ##

variable "acr_username" {
    type        = string
    description = "Username for the Azure Container Registry."
}

variable "acr_password" {
    type        = string
    description = "Password for the Azure Container Registry."
}

## LB ##

variable "ssh_allowed_ip" {
    type        = string
    description = "IP address allowed to connect to the virtual machine."
}