variable "admin_username" {
    type        = string
    description = "Admin username for VMs"
}

variable "admin_password" {
    type        = string
    description = "Admin password for VMs"
}


variable "psql_login" {
    type        = string
    description = "Login for the PostgreSQL server"
}

variable "psql_password" {
    type        = string
    description = "Password for the PostgreSQL server"
}
