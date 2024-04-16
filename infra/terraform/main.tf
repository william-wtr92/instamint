terraform {
  required_providers {
    grafana = {
      source = "grafana/grafana"
      version = "2.17.0"
    }
  }
}

provider "azurerm" {
  features {}
}

provider "grafana" {}

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

## DB ##

module "db" {
  source              = "./modules/db"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  psql_login          = var.psql_login
  psql_password       = var.psql_password
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
  subnet_id             = module.network.subnet_id
  availability_set_id   = module.av_set.availability_set_id

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
  subnet_id             = module.network.subnet_id
  availability_set_id   = module.av_set.availability_set_id

  depends_on = [
    module.db.redis_id,
    module.db.postgres_id
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
  subnet_id             = module.network.subnet_id
  availability_set_id   = module.av_set.availability_set_id

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
  subnet_id             = module.network.subnet_id
  availability_set_id   = module.av_set.availability_set_id

  depends_on = [
    module.db.redis_id,
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

module "key_vault" {
  source              = "./modules/kv"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  key_vault_name      = "instamint-kv-${module.random_id.unique_id}"
  tenant_id           = var.tenant_id
  client_object_id    = var.client_object_id
}