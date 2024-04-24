# 📡 Infrastructure

> This directory contains the infrastructure code for the project. This includes the code for the CI/CD pipeline, the
> code for the infrastructure as code, and the code for the monitoring and alerting.

## ⚠️ Requirements

- Read the `README.md` file in the `terraform` & `ansible` directories.
- For more information read [Terraform](../docs/deploy/infra/terraform/README.md)
  and [Ansible](../docs/deploy/infra/ansible/README.md) docs.

## 📂 Structure

- `ansible`: Ansible code to provision the infrastructure.
- `terraform`: Terraform code to provision the infrastructure.
- `setup.sh`: Setup script to install the required tools.

## 🚀 Installation

```bash
chmod +x setup.sh && ./setup.sh
```

## 💡 Code explanation

```shell
cd terraform
terraform apply -var-file="secrets.tfvars" # Apply the terraform configuration from the secrets file
terraform output -json > ../ansible/terraform_outputs.json # Save the terraform outputs to a file

cd ../ansible
chmod +x launch.sh # Make the launch script executable
./launch.sh # Launch the ansible playbooks
```
