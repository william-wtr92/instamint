# 💠 Terraform

> Terraform is an open-source infrastructure as code software tool created by HashiCorp. It enables users to define and
> provision a data center infrastructure using a high-level configuration language known as HashiCorp Configuration
> Language (HCL), or optionally JSON.

## 📚 Ressources

- [📖 Terraform](https://learn.hashicorp.com/tutorials/terraform/install-cli)
- [📖 Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
- [📖 Azure Subscription](https://portal.azure.com/)

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
- `terraform destroy`: Destroy the terraform configuration.
- `terraform output`: Show the terraform outputs.
- `terraform show`: Show the terraform state.
- `terraform state list`: List the terraform state.
- `terraform import {resource_type}.{resource_name} {resource_id}`: Import a resource into the terraform state.
- `terraform refresh`: Refresh the terraform state.

## 🔰 Architecture

- `root`:
  - `main.tf`: Main terraform configuration to imports other modules.
  - `vars.tf`: Variables definition.
  - `secrets.tfvars`: Secrets variables definition.
- `modules`:
  - `analytics`: Analytics module to create the analytics resources to monitor the VMs.
  - `bastion`: Bastion module to create the bastion resources to access the VMs.
  - `db`: Database module to create Postgres & Redis resources.
  - `network`: Network module to create the network resources like VNET, Subnets etc.
  - `vm`: VM module to create the VM resources.
  - `acr`: ACR module to create the Azure Container Registry resources to push the docker images.
  - `blob`: Blob module to create the Azure Blob Storage resources.
  - `security`: Security module to create the security resources like NSG, Security Groups etc.
  - `nic`: NIC module to create the Network Interface Card resources.
  - `kv`: KeyVault module to create the KeyVault resources.
  - `grafana`: Grafana module to create the Grafana resources to watch the metrics.
  - `utils`: Utils module to create the utils resources like random strings etc.

## 🤖 Azure CLI Commands

- ### 🛡️ **Bastion**

  #### 🔨 Azure SSH Tunneling

  - Add the ssh extension to the Azure CLI:

  ```shell
  az extension add -n ssh
  ```

  - Create ssh tunnel to the bastion:

  ```shell
  az network bastion ssh --name {bastion} --resource-group {ressourceGroup} --target-ip-address {privateIp} --auth-type "ssh-key" --username {vmUsername} --ssh-key "~/.ssh/azure"
  ```

  #### 🔨 Local SSH Tunneling

  - Create ssh tunnel to the VM to access it locally:

  ```shell
  az network bastion tunnel --name {bastion} --resource-group {ressourceGroup} --target-resource-id /subscriptions/{subscriptionId}/resourceGroups/{ressourceGroup}/providers/Microsoft.Compute/virtualMachines/{vmName} --resource-port 22 --port {localPort}
  ```

  - Connect to the VM locally:

  ```shell
  ssh -p {localPort} {vmUsername}@localhost
  ```

#### 📚 Tunelling Doc

- [📖 Terraform x Azure Bastion x Tunneling Setup](https://dev.to/holger/test-azure-bastion-deployment-via-terraform-18o8)

## 📸 Infra Schema
