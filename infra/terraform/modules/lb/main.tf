resource "azurerm_public_ip" "lb_public_ip" {
  allocation_method   = "Static"
  location            = var.location
  resource_group_name = var.resource_group_name
  name                = "instamint-lb-ip"
  sku                 = "Standard"

  tags = {
    service     = "lb-public-ip"
    environment = "prod"
  }
}

## Load Balancer ##

resource "azurerm_lb" "lb_public" {
  location            = var.location
  resource_group_name = var.resource_group_name
  name                = "instamint-lb"
  sku                 = "Standard"

  frontend_ip_configuration {
    name                 = "PublicIPAddress"
    public_ip_address_id = azurerm_public_ip.lb_public_ip.id
  }

  tags = {
    service     = "lb-public"
    environment = "prod"
  }
}

## Backend Address Pool ##

resource "azurerm_lb_backend_address_pool" "backend_address_pool" {
  loadbalancer_id     = azurerm_lb.lb_public.id
  name                = "instamint-backend-pool"
}

## Backend Pool Association ##

resource "azurerm_network_interface_backend_address_pool_association" "webapp_backend_association" {
  network_interface_id    = var.webapp_nic
  ip_configuration_name   = "internal"
  backend_address_pool_id = azurerm_lb_backend_address_pool.backend_address_pool.id
}

resource "azurerm_network_interface_backend_address_pool_association" "business_backend_association" {
  network_interface_id    = var.business_nic
  ip_configuration_name   = "internal"
  backend_address_pool_id = azurerm_lb_backend_address_pool.backend_address_pool.id
}

resource "azurerm_network_interface_backend_address_pool_association" "files_backend_association" {
  network_interface_id    = var.files_nic
  ip_configuration_name   = "internal"
  backend_address_pool_id = azurerm_lb_backend_address_pool.backend_address_pool.id
}

resource "azurerm_network_interface_backend_address_pool_association" "cron_backend_association" {
  network_interface_id    = var.cron_nic
  ip_configuration_name   = "internal"
  backend_address_pool_id = azurerm_lb_backend_address_pool.backend_address_pool.id
}

## NAT Rules ##

resource "azurerm_lb_nat_rule" "nat_rule_webapp" {
  loadbalancer_id                = azurerm_lb.lb_public.id
  resource_group_name            = var.resource_group_name
  name                           = "WebAppNATRule"
  protocol                       = "Tcp"
  frontend_port                  = 8080
  backend_port                   = 80
  frontend_ip_configuration_name = "PublicIPAddress"
  enable_floating_ip             = false
}

resource "azurerm_lb_nat_rule" "nat_rule_business" {
  loadbalancer_id                = azurerm_lb.lb_public.id
  resource_group_name            = var.resource_group_name
  name                           = "BusinessNATRule"
  protocol                       = "Tcp"
  frontend_port                  = 8081
  backend_port                   = 80
  frontend_ip_configuration_name = "PublicIPAddress"
  enable_floating_ip             = false
}

resource "azurerm_lb_nat_rule" "nat_rule_files" {
  loadbalancer_id                = azurerm_lb.lb_public.id
  resource_group_name            = var.resource_group_name
  name                           = "FilesNATRule"
  protocol                       = "Tcp"
  frontend_port                  = 8082
  backend_port                   = 80
  frontend_ip_configuration_name = "PublicIPAddress"
  enable_floating_ip             = false
}

resource "azurerm_lb_nat_rule" "nat_rule_cron" {
  loadbalancer_id                = azurerm_lb.lb_public.id
  resource_group_name            = var.resource_group_name
  name                           = "CronNATRule"
  protocol                       = "Tcp"
  frontend_port                  = 8083
  backend_port                   = 80
  frontend_ip_configuration_name = "PublicIPAddress"
  enable_floating_ip             = false
}

## NAT Rules association ##

resource "azurerm_network_interface_nat_rule_association" "webapp_nat_association" {
  network_interface_id    = var.webapp_nic
  ip_configuration_name   = "internal"
  nat_rule_id             = azurerm_lb_nat_rule.nat_rule_webapp.id
}

resource "azurerm_network_interface_nat_rule_association" "business_nat_association" {
  network_interface_id    = var.business_nic
  ip_configuration_name   = "internal"
  nat_rule_id             = azurerm_lb_nat_rule.nat_rule_business.id
}

resource "azurerm_network_interface_nat_rule_association" "files_nat_association" {
  network_interface_id    = var.files_nic
  ip_configuration_name   = "internal"
  nat_rule_id             = azurerm_lb_nat_rule.nat_rule_files.id
}

resource "azurerm_network_interface_nat_rule_association" "cron_nat_association" {
  network_interface_id    = var.cron_nic
  ip_configuration_name   = "internal"
  nat_rule_id             = azurerm_lb_nat_rule.nat_rule_cron.id
}

## Outbound Rules ##

resource "azurerm_lb_outbound_rule" "outbound_rule" {
  loadbalancer_id          = azurerm_lb.lb_public.id
  name                     = "OutboundRule"
  backend_address_pool_id  = azurerm_lb_backend_address_pool.backend_address_pool.id
  protocol                 = "All"
  allocated_outbound_ports = 1024

  frontend_ip_configuration {
    name = "PublicIPAddress"
  }
}