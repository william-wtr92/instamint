resource "azurerm_resource_group" "rg" {
  name     = "instamint"
  location = "France Central"

  tags = {
    Service     = "rg"
    Environment = "Prod"
  }
}