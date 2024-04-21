# 💠 Terraform

> Terraform directory to provision the infrastructure.

## ⚠️ Requirements

- Install [Terraform](https://learn.hashicorp.com/tutorials/terraform/install-cli) | [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) | [TFLint](https://github.com/terraform-linters/tflint)
  🚀
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
  # VM
  admin_username      = "" # Azure admin username
  admin_password      = "" # Azure admin password

  # PostgreSQL
  psql_login          = "" # Postgres login
  psql_password       = "" # Postgres password
  database_name       = "" # Postgres database name

  # Grafana
  grafana_password    = "" # Grafana password

  # Azure
  client_object_id    = "" # Azure client object id > az ad sp show --id <appId> --query objectId

  # ACR
  acr_username        = "" # Azure Container Registry username
  acr_password        = "" # Azure Container Registry password

  # SSH Keys
  ssh_public_key      = "~/.ssh/azure.pub" # Azure ssh public key

  # Network
  ssh_allowed_ip      = "" # Azure ssh allowed ip(s) ! If you want to switch to an array change the variable type in the vars.tf file at root level

  ### ENVIRONMENT VARIABLES ###

  security_cookie_secret=""
  security_jwt_secret=""
  security_password_pepper= ""

  ## Sentry
  sentry_dsn=""

  ## SendGrid
  sendgrid_api_key="SG."
  sendgrid_sender=""
  sendgrid_template_email_validation="d-"
  sendgrid_template_reset_password="d-"
  sendgrid_template_confirm_reset_password="d-"
  sendgrid_template_confirm_account_deletion="d-"
  sendgrid_template_account_reactivation="d-"
  sendgrid_template_account_confirm_reactivation="d-"
  sendgrid_template_modify_password="d-"

  ## Cron Jobs
  security_cron_jwt_secret=""
  security_cron_jwt_scope_delete_account=""
  ```

## 🧩 Commands

- `terraform init`: Initialize the terraform configuration.
- `terraform validate`: Validate the terraform configuration.
- `terraform plan -out=plan.out`: Plan the terraform configuration and save it to a file.
- `terraform apply plan.out` or `terraform apply -var-file="secrets.tfvars"`: Apply the terraform configuration from
  the plan file or with a secrets file.

## ⚙️ Linter

- To lint the terraform code, run the following command:

```sh
tflint --recursive --config "$(pwd)/.tflint.hcl"
```
