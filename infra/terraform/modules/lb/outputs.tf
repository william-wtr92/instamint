output "lb_id" {
    value       =  azurerm_lb.lb_public.id
    description = "The ID of the Load Balancer."
}

## Full addresses of Services

output "webapp_ip" {
    value = "http://${azurerm_public_ip.lb_public_ip.ip_address}:${azurerm_lb_nat_rule.nat_rule_webapp.frontend_port}"
    description = "WebApp IP Address."
}

output "business_ip" {
    value = "http://${azurerm_public_ip.lb_public_ip.ip_address}:${azurerm_lb_nat_rule.nat_rule_business.frontend_port}"
    description = "Business IP Address."
}

output "files_ip" {
    value = "http://${azurerm_public_ip.lb_public_ip.ip_address}:${azurerm_lb_nat_rule.nat_rule_files.frontend_port}"
    description = "Files IP Address."
}

output "cron_ip" {
    value = "http://${azurerm_public_ip.lb_public_ip.ip_address}:${azurerm_lb_nat_rule.nat_rule_cron.frontend_port}"
    description = "Cron IP Address."
}