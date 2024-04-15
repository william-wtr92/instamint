provider "azurerm" {
  features {}
}

## Resource Group ##

resource "azurerm_resource_group" "rg" {
  name     = "instamint"
  location = "France Central"
}

## Virtual Network ##

resource "azurerm_virtual_network" "vnet" {
  name                = "instamint-vnet"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
}

resource "azurerm_subnet" "subnet" {
  name                 = "instamint-subnet"
  resource_group_name  = azurerm_resource_group.rg.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["10.0.1.0/24"]
}

## Load Balancer ##

resource "azurerm_public_ip" "lb_public_ip" {
  name                = "lb-public-ip"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  allocation_method   = "Static"
  sku                 = "Standard"
}

resource "azurerm_lb" "lb_frontend" {
  name                = "instamint-lb-frontend"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  sku                 = "Standard"

  frontend_ip_configuration {
    name                 = "frontend-config"
    public_ip_address_id = azurerm_public_ip.lb_public_ip.id
  }
}

resource "azurerm_lb_backend_address_pool" "lb_backend" {
  name                = "instamint-lb-backend"
  loadbalancer_id     = azurerm_lb.lb_frontend.id
}

resource "azurerm_lb_rule" "ssh" {
  loadbalancer_id                = azurerm_lb.lb_frontend.id
  name                           = "ssh-rules"
  protocol                       = "Tcp"
  frontend_port                  = 22
  backend_port                   = 22
  frontend_ip_configuration_name = "frontend-config"
  backend_address_pool_ids       = [azurerm_lb_backend_address_pool.lb_backend.id]
  probe_id                       = azurerm_lb_probe.ssh_probe.id
}

resource "azurerm_lb_probe" "ssh_probe" {
  name                = "ssh-probe"
  loadbalancer_id     = azurerm_lb.lb_frontend.id
  protocol            = "Tcp"
  port                = 22
  interval_in_seconds = 5
  number_of_probes    = 2
}

## Network Security Group ##

resource "azurerm_network_security_group" "nsg" {
  name                = "instamint-nsg"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
}

resource "azurerm_network_security_rule" "ssh" {
  name                        = "ssh"
  priority                    = 100
  direction                   = "Inbound"
  access                      = "Allow"
  protocol                    = "Tcp"
  source_port_range           = "*"
  destination_port_ranges     = ["22", "2201", "2202", "2203", "2204"]
  source_address_prefix       = "*"
  destination_address_prefix  = "*"
  resource_group_name         = azurerm_resource_group.rg.name
  network_security_group_name = azurerm_network_security_group.nsg.name
}

resource "azurerm_subnet_network_security_group_association" "nsg_association" {
  subnet_id                 = azurerm_subnet.subnet.id
  network_security_group_id = azurerm_network_security_group.nsg.id
}

## Ddos Protection Plan ##

resource "azurerm_network_ddos_protection_plan" "ddos" {
  name                = "instamint-ddos"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
}

## Availability Set ##

resource "azurerm_availability_set" "instamint_av_set" {
  name                = "instamint-av-set"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  managed             = true
}

## Docker Registry ##

resource "azurerm_container_registry" "acr" {
    name                = "instamintACR"
    resource_group_name = azurerm_resource_group.rg.name
    location            = azurerm_resource_group.rg.location
    sku                 = "Standard"
    admin_enabled       = false
}

## PostgreSQL ##

resource "azurerm_postgresql_server" "postgres" {
  name                = "instamint-postgres"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  sku_name            = "B_Gen5_2"
  storage_mb          = 51200
  version             = "11"
  auto_grow_enabled   = true

  administrator_login          = var.psql_login
  administrator_login_password = var.psql_password

  ssl_enforcement_enabled      = true
  ssl_minimal_tls_version_enforced = "TLS1_2"
}

## Redis Cache ##

resource "azurerm_redis_cache" "redis" {
  name                = "instamint-redis"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  capacity            = 0
  family              = "C"
  sku_name            = "Basic"
  enable_non_ssl_port = false
}

## Webapp Client ##

module "webapp_vm" {
  source              = "./vm"
  vm_name             = "instamint-webapp-vm"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  admin_username      = var.admin_username
  admin_password      = var.admin_password
  subnet_id           = azurerm_subnet.subnet.id
  availability_set_id = azurerm_availability_set.instamint_av_set.id
}

resource "azurerm_network_interface_backend_address_pool_association" "webapp_nic_backend" {
  network_interface_id    = module.webapp_vm.network_interface_id
  ip_configuration_name   = "internal"
  backend_address_pool_id = azurerm_lb_backend_address_pool.lb_backend.id
}

resource "azurerm_lb_nat_rule" "ssh_webapp" {
  resource_group_name            = azurerm_resource_group.rg.name
  loadbalancer_id                = azurerm_lb.lb_frontend.id
  name                           = "natrulewebapp"
  protocol                       = "Tcp"
  frontend_port                  = 2201
  backend_port                   = 22
  frontend_ip_configuration_name = "frontend-config"
}

## Business Server ##

module "business_vm" {
  source              = "./vm"
  vm_name             = "instamint-business-vm"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  admin_username      = var.admin_username
  admin_password      = var.admin_password
  subnet_id           = azurerm_subnet.subnet.id
  availability_set_id = azurerm_availability_set.instamint_av_set.id
}

resource "azurerm_network_interface_backend_address_pool_association" "business_nic_backend" {
  network_interface_id    = module.business_vm.network_interface_id
  ip_configuration_name   = "internal"
  backend_address_pool_id = azurerm_lb_backend_address_pool.lb_backend.id
}

resource "azurerm_lb_nat_rule" "ssh_business" {
  resource_group_name            = azurerm_resource_group.rg.name
  loadbalancer_id                = azurerm_lb.lb_frontend.id
  name                           = "natrulebusiness"
  protocol                       = "Tcp"
  frontend_port                  = 2202
  backend_port                   = 22
  frontend_ip_configuration_name = "frontend-config"
}

## Files Server ##

module "files_vm" {
  source              = "./vm"
  vm_name             = "instamint-files-vm"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  admin_username      = var.admin_username
  admin_password      = var.admin_password
  subnet_id           = azurerm_subnet.subnet.id
  availability_set_id = azurerm_availability_set.instamint_av_set.id
}

resource "azurerm_network_interface_backend_address_pool_association" "files_nic_backend" {
  network_interface_id    = module.files_vm.network_interface_id
  ip_configuration_name   = "internal"
  backend_address_pool_id = azurerm_lb_backend_address_pool.lb_backend.id
}

resource "azurerm_lb_nat_rule" "ssh_files" {
  resource_group_name            = azurerm_resource_group.rg.name
  loadbalancer_id                = azurerm_lb.lb_frontend.id
  name                           = "natrulefiles"
  protocol                       = "Tcp"
  frontend_port                  = 2203
  backend_port                   = 22
  frontend_ip_configuration_name = "frontend-config"
}

## Cron Server ##

module "cron_vm" {
  source              = "./vm"
  vm_name             = "instamint-cron-vm"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  admin_username      = var.admin_username
  admin_password      = var.admin_password
  subnet_id           = azurerm_subnet.subnet.id
  availability_set_id = azurerm_availability_set.instamint_av_set.id
}

resource "azurerm_network_interface_backend_address_pool_association" "cron_nic_backend" {
  network_interface_id    = module.cron_vm.network_interface_id
  ip_configuration_name   = "internal"
  backend_address_pool_id = azurerm_lb_backend_address_pool.lb_backend.id
}

resource "azurerm_lb_nat_rule" "ssh_cron" {
  resource_group_name            = azurerm_resource_group.rg.name
  loadbalancer_id                = azurerm_lb.lb_frontend.id
  name                           = "natrulecron"
  protocol                       = "Tcp"
  frontend_port                  = 2204
  backend_port                   = 22
  frontend_ip_configuration_name = "frontend-config"
}