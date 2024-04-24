## VMS ##

output "webapp_config" {
    sensitive = true
    value = {
      username = var.acr_username
      password = var.acr_password
      image    = module.webapp_vm.container_image
      name     = module.webapp_vm.container_name
      port     = module.webapp_vm.container_port
    }
}

output "business_config" {
    sensitive = true
    value = {
      username = var.acr_username
      password = var.acr_password
      image    = module.business_vm.container_image
      name     = module.business_vm.container_name
      port     = module.business_vm.container_port
    }
}

output "files_config" {
    sensitive = true
    value = {
      username = var.acr_username
      password = var.acr_password
      image    = module.files_vm.container_image
      name     = module.files_vm.container_name
      port     = module.files_vm.container_port
    }
}

output "cron_config" {
    sensitive = true
    value = {
      username = var.acr_username
      password = var.acr_password
      image    = module.cron_vm.container_image
      name     = module.cron_vm.container_name
      port     = module.cron_vm.container_port
    }
}

## SECRETS ##

output "secrets" {
    sensitive = true
    value = local.secrets
    description = "Environment variables for the containers."
}