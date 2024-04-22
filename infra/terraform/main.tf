## Resource Group ##

resource "azurerm_resource_group" "rg" {
  name     = "instamint"
  location = "France Central"
}

## Random ID ##

module "random_id" {
  source = "./modules/utils"
}

## Network ##

module "network" {
  source              = "./modules/network"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
}

## Bastion ##

module "bastion" {
  source              = "./modules/bastion"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  vnet_name           = module.network.vnet_name
}

## Security ##

module "security" {
  source              = "./modules/security"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  subnet_id           = module.network.subnet_id
  ssh_allowed_ip      = var.ssh_allowed_ip
}

## Load Balancer ##

module "loadbalancer" {
  source                   = "./modules/lb"
  location                 = azurerm_resource_group.rg.location
  resource_group_name      = azurerm_resource_group.rg.name
  /*probe_id                 = module.probe.http_probe_id*/

  webapp_nic   =  module.webapp_network_interface.vm_nic_id
  business_nic =  module.business_network_interface.vm_nic_id
  files_nic    =  module.files_network_interface.vm_nic_id
  cron_nic     =  module.cron_network_interface.vm_nic_id
}

## Probe ##

module "probe" {
  source              = "./modules/probe"
  loadbalancer_id     = module.loadbalancer.lb_id
}

## NIC ##

module "webapp_network_interface" {
  source              = "./modules/nic"
  vm_name             = "instamint-webapp-vm"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  subnet_id           = module.network.subnet_id
}

module "business_network_interface" {
  source              = "./modules/nic"
  vm_name             = "instamint-business-vm"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  subnet_id           = module.network.subnet_id
}

module "files_network_interface" {
  source              = "./modules/nic"
  vm_name             = "instamint-files-vm"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  subnet_id           = module.network.subnet_id
}

module "cron_network_interface" {
  source              = "./modules/nic"
  vm_name             = "instamint-cron-vm"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  subnet_id           = module.network.subnet_id
}

## Availability Set ##

module "av_set" {
  source              = "./modules/av"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
}

## PostgreSQL ##

module "postgres" {
  source              = "./modules/psql"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  psql_login          = var.psql_login
  psql_password       = var.psql_password
  database_name       = var.database_name
}

## Redis ##

module "redis" {
  source              = "./modules/redis"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
}

## Registry ##

module "registry" {
  source              = "./modules/registry"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
}

## Webapp Client ##

module "webapp_vm" {
  source                = "./modules/vm"
  vm_name               = "instamint-webapp-vm"
  resource_group_name   = azurerm_resource_group.rg.name
  location              = azurerm_resource_group.rg.location
  network_interface_ids = [module.webapp_network_interface.vm_nic_id]
  admin_username        = var.admin_username
  admin_password        = var.admin_password
  availability_set_id   = module.av_set.availability_set_id

  ssh_public_key  = var.ssh_public_key

  acr_username    = var.acr_username
  acr_password    = var.acr_password
  container_image = "instamint-client-webapp"
  container_name  = "webapp"
  container_port  = "3000"

  depends_on = [
    module.blob_storage
  ]
}

## Business Server ##

module "business_vm" {
  source                = "./modules/vm"
  vm_name               = "instamint-business-vm"
  resource_group_name   = azurerm_resource_group.rg.name
  location              = azurerm_resource_group.rg.location
  network_interface_ids = [module.business_network_interface.vm_nic_id]
  admin_username        = var.admin_username
  admin_password        = var.admin_password
  availability_set_id   = module.av_set.availability_set_id

  ssh_public_key  = var.ssh_public_key

  acr_username    = var.acr_username
  acr_password    = var.acr_password
  container_image = "instamint-server-business"
  container_name  = "business"
  container_port  = "3001"

  depends_on = [
    module.redis.redis_id,
    module.postgres.postgres_id
  ]
}

## Files Server ##

module "files_vm" {
  source                = "./modules/vm"
  vm_name               = "instamint-files-vm"
  resource_group_name   = azurerm_resource_group.rg.name
  location              = azurerm_resource_group.rg.location
  network_interface_ids = [module.files_network_interface.vm_nic_id]
  admin_username        = var.admin_username
  admin_password        = var.admin_password
  availability_set_id   = module.av_set.availability_set_id

  ssh_public_key  = var.ssh_public_key

  acr_username    = var.acr_username
  acr_password    = var.acr_password
  container_image = "instamint-server-files"
  container_name  = "files"
  container_port  = "3002"

  depends_on = [
    module.blob_storage
  ]
}

## Cron Server ##

module "cron_vm" {
  source                = "./modules/vm"
  vm_name               = "instamint-cron-vm"
  resource_group_name   = azurerm_resource_group.rg.name
  location              = azurerm_resource_group.rg.location
  network_interface_ids = [module.cron_network_interface.vm_nic_id]
  admin_username        = var.admin_username
  admin_password        = var.admin_password
  availability_set_id   = module.av_set.availability_set_id

  ssh_public_key  = var.ssh_public_key

  acr_username    = var.acr_username
  acr_password    = var.acr_password
  container_image = "instamint-server-cron"
  container_name  = "cron"
  container_port  = "3003"

  depends_on = [
    module.redis.redis_id,
  ]
}

## Grafana ##

module "analytics" {
  source              = "./modules/analytics"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  client_object_id    = var.client_object_id
}

module "grafana" {
  source              = "./modules/grafana"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  admin_password      = var.grafana_password
}

## Blob Storage ##

module "blob_storage" {
  source               = "./modules/blob"
  location             = azurerm_resource_group.rg.location
  resource_group_name  = azurerm_resource_group.rg.name
  storage_account_name = "instamintstorage${module.random_id.unique_id}"
  container_name       = "instamint-container"
}

## Key Vault ##

locals {
  secrets = {
    "DB-CONNECTION-HOST"                             = module.postgres.psql_server_name
    "DB-CONNECTION-USER"                             = var.psql_login
    "DB-CONNECTION-PWD"                              = var.psql_password
    "DB-CONNECTION-DB"                               = var.database_name
    "REDIS-HOST"                                     = module.redis.redis_host
    "REDIS-PORT"                                     = module.redis.redis_ssl_port
    "REDIS-PASSWORD"                                 = module.redis.redis_primary_access_key
    "CORS-ORIGIN"                                    = module.loadbalancer.webapp_ip // TODO: Change to Load Balancer IP on webapp VM
    "SECURITY-COOKIE-SECRET"                         = var.security_cookie_secret
    "SECURITY-JWT-SECRET"                            = var.security_jwt_secret
    "SECURITY-PASSWORD-PEPPER"                       = var.security_password_pepper
    "SENTRY-DSN"                                     = var.sentry_dsn
    "SENDGRID-BASE-URL"                              = module.loadbalancer.webapp_ip // TODO: Change to Load Balancer IP on webapp VM
    "SENDGRID-API-KEY"                               = var.sendgrid_api_key
    "SENDGRID-SENDER"                                = var.sendgrid_sender
    "SENDGRID-TEMPLATE-EMAIL-VALIDATION"             = var.sendgrid_template_email_validation
    "SENDGRID-TEMPLATE-RESET-PASSWORD"               = var.sendgrid_template_reset_password
    "SENDGRID-TEMPLATE-CONFIRM-RESET-PASSWORD"       = var.sendgrid_template_confirm_reset_password
    "SENDGRID-TEMPLATE-CONFIRM-ACCOUNT-DELETION"     = var.sendgrid_template_confirm_account_deletion
    "SENDGRID-TEMPLATE-ACCOUNT-REACTIVATION"         = var.sendgrid_template_account_reactivation
    "SENDGRID-TEMPLATE-ACCOUNT-CONFIRM-REACTIVATION" = var.sendgrid_template_account_confirm_reactivation
    "SENDGRID-TEMPLATE-ACCOUNT-MODIFY-PASSWORD"      = var.sendgrid_template_account_modify_password
    "SENDGRID-TEMPLATE-ACCOUNT-MODIFY-EMAIL"         = var.sendgrid_template_account_modify_email
    "SECURITY-CRON-JWT-SECRET"                       = var.security_cron_jwt_secret
    "SECURITY-CRON-JWT-SCOPE-DELETE-ACCOUNT"         = var.security_cron_jwt_scope_delete_account
    "BUSINESS-SERVICE-URL"                           = module.loadbalancer.business_ip // TODO: Change to Load Balancer IP on business VM
    "FILES-SERVICE-URL"                              = module.loadbalancer.files_ip // TODO: Change to Load Balancer IP on files VM
    "NEXT-PUBLIC-BASE-URL"                           = module.loadbalancer.business_ip // TODO: Change to Load Balancer IP on business VM
  }
}

module "key_vault" {
  source              = "./modules/kv"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  key_vault_name      = "instamint-kv-${module.random_id.unique_id}"
  secrets             = local.secrets
}