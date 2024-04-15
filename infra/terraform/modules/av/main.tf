resource "azurerm_availability_set" "instamint_av_set" {
  name                = "instamint-av-set"
  location            = var.location
  resource_group_name = var.resource_group_name
  managed             = true
}

output "availability_set_id" {
  value       = azurerm_availability_set.instamint_av_set.id
  description = "The ID of the Availability Set"
}