## Terraform

## Command

azure commands to login
terraform command:

- terraform init
- terraform plan -out=plan.out
- terraform apply plan.out

## Azure CLI

- `az ad sp create-for-rbac --name instamint-prod-sp --role Contributor --scopes /subscriptions/821952a0-1ce2-493d-83b6-5838b231e550`
- `az ad sp create-for-rbac --name instamint-prod-acr-sp --scopes /subscriptions/821952a0-1ce2-493d-83b6-5838b231e550/resourceGroups/instamint/providers/Microsoft.ContainerRegistry/registries/instamintACR --role acrpush`
- `az ad sp show --id <appId>` # Get the client object id with id key in JSON response
