resource "azurerm_availability_set" "instamint_av_set" {
  name                = "instamint-av-set"
  location            = var.location
  resource_group_name = var.resource_group_name
  managed             = true

  tags = {
    Service     = "av-set"
    Environment = "Prod"
  }
}