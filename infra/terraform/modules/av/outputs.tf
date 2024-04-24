output "availability_set_id" {
    value       = azurerm_availability_set.instamint_av_set.id
    description = "The ID of the Availability Set."
}