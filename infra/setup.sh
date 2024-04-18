#!/bin/sh

# shellcheck disable=SC2164
cd terraform

echo "Initializing Terraform..."
terraform apply -var-file="secrets.tfvars"
echo "Saving Terraform outputs..."
terraform output -json > ../ansible/terraform_outputs.json
echo "Terraform execution completed."

echo "Starting Ansible playbooks..."
cd ../ansible
chmod +x launch.sh
./launch.sh
