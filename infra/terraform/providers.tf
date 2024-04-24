terraform {
  required_providers {
    grafana = {
      source = "grafana/grafana"
      version = "2.17.0"
    }
    azurerm = {
      source = "hashicorp/azurerm"
      version = "=3.100.0"
    }
    azuread = {
      source = "hashicorp/azuread"
      version = "=2.48.0"
    }
  }

  required_version = ">= 1.8.1"
}

provider "azurerm" {
  features {}
}

provider "grafana" {}