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

## Grafana ##

variable "grafana_password" {
    type        = string
    description = "Password for the Grafana server."
}

## Azure Identity ##

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

## Secrets ##

variable "security_cookie_secret" {
    type        = string
    description = "Security cookie secret."
}

variable "security_jwt_secret" {
    type        = string
    description = "Security JWT secret."
}

variable "security_password_pepper" {
    type        = string
    description = "Security password pepper."
}

variable "sentry_dsn" {
    type        = string
    description = "Sentry DSN."
}

variable "sendgrid_api_key" {
    type        = string
    description = "SendGrid API key."
}

variable "sendgrid_sender" {
    type        = string
    description = "SendGrid sender."
}

variable "sendgrid_template_email_validation" {
    type        = string
    description = "SendGrid template ID for email validation."
}
variable "sendgrid_template_reset_password" {
    type        = string
    description = "SendGrid template ID for reset password."
}

variable "sendgrid_template_confirm_reset_password" {
    type        = string
    description = "SendGrid template ID for confirm reset password."
}

variable "sendgrid_template_confirm_account_deletion" {
    type        = string
    description = "SendGrid template ID for confirm account deletion."
}

variable "sendgrid_template_account_reactivation" {
    type        = string
    description = "SendGrid template ID for account reactivation after deletion."
}

variable "sendgrid_template_account_confirm_reactivation" {
    type        = string
    description = "SendGrid template ID for confirm account reactivation."
}

variable "sendgrid_template_account_modify_password" {
    type        = string
    description = "SendGrid template ID for account modify password."
}

variable "sendgrid_template_account_modify_email" {
    type        = string
    description = "SendGrid template ID for account modify email."
}

variable "security_cron_jwt_secret" {
    type        = string
    description = "Cron job JWT secret for deleting accounts."
}

variable "security_cron_jwt_scope_delete_account" {
    type        = string
    description = "Cron job scope for deleting accounts."
}