# 💠 Terraform

> Terraform directory to provision the infrastructure.

## ⚠️ Requirements

- Create a service principal with `Contributor`:
  - `az ad sp create-for-rbac --name instamint-prod-sp --role Contributor --scopes /subscriptions/{subscription_id}`
- Create a service principal with `AcrPush`:
  - `az ad sp create-for-rbac --name instamint-prod-acr-sp --scopes /subscriptions/{subscriptionId}/resourceGroups/{ressourceGroup}/providers/Microsoft.ContainerRegistry/registries/{acrName} --role acrpush`
- Create a role assignment with `AcrPull`:
  - `az role assignment create --assignee {appId} --scope /subscriptions/{subscriptionId}/resourceGroups/{ressourceGroup}/providers/Microsoft.ContainerRegistry/registries/{acrName} --role AcrPull`
- Create ssh key pair:
  - `ssh-keygen -t rsa -b 2048 -f ~/.ssh/azure`
- Setup `secrets.tfvars` with the following content:
  ```hcl
    admin_username      = "" # Azure admin username
    admin_password      = "" # Azure admin password
    psql_login          = "" # Postgres login
    psql_password       = "" # Postgres password
    grafana_password    = "" # Grafana password
    tenant_id           = "" # Azure tenant id > az account show --query tenantId
    client_object_id    = "" # Azure client object id > az ad sp show --id <appId> --query objectId
    acr_username        = "" # Azure Container Registry username
    acr_password        = "" # Azure Container Registry password
    ssh_public_key      = "~/.ssh/azure.pub" # Azure ssh public key
    ssh_private_key     = "~/.ssh/azure" # Azure ssh private key
    ssh_allowed_ip      = "" # Azure ssh allowed ip(s) ! If you want to switch to an array change the variable type in the vars.tf file at root level
  ```

## 🧩 Commands

- `terraform init`: Initialize the terraform configuration.
- `terraform validate`: Validate the terraform configuration.
- `terraform plan -out=plan.out`: Plan the terraform configuration and save it to a file.
- `terraform apply plan.out` or `terraform apply -var-file="secrets.tfvars"`: Apply the terraform configuration from
  the plan file or with a secrets file.
