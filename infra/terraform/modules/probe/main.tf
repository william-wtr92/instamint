// TODO: Change when introduce Backend Pool to split inbound trafic

resource "azurerm_lb_probe" "http_probe" {
  loadbalancer_id     = var.loadbalancer_id
  name                = "http-probe"
  protocol            = "Tcp"
  port                = 80
  interval_in_seconds = 5
  number_of_probes    = 2
}