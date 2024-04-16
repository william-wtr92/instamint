resource "azurerm_container_group" "grafana" {
  name                = "instamint-grafana"
  location            = var.location
  resource_group_name = var.resource_group_name
  os_type             = "Linux"

  container {
    name   = "grafana"
    image  = "grafana/grafana"
    cpu    = "0.5"
    memory = "1.5"

    ports {
      port     = 3000
      protocol = "TCP"
    }

    environment_variables = {
      "GF_SECURITY_ADMIN_PASSWORD" = var.admin_password
      "GF_USERS_ALLOW_SIGN_UP"     = "false"
    }
  }

  ip_address_type = "Public"
  dns_name_label  = "instamint-grafana-${var.location}"
}

output "grafana_url" {
  value = "http://${azurerm_container_group.grafana.fqdn}:3000"
  description = "URL to access Grafana."
}
