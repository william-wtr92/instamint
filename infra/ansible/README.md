# 🧰 Ansible

> Ansible directory contains the ansible code to provision the infrastructure.

## ⚠️ Requirements

- Install [Ansible](https://docs.ansible.com/ansible) 🧰
- Install [Ansible-Lint](https://ansible.readthedocs.io/projects/lint/installing/) **⚠️ Windows not supported ⚠️**
- Create an environment file `env.sh` in the root directory with the following content:

```bash
#!/bin/sh

export AZURE_SUBSCRIPTION_ID="YOUR_AZURE_SUBSCRIPTION_ID"
```

## ⚙️ Linter

- To lint the ansible code, run the following command:

```bash
ansible-lint -c .ansible-lint.yml
```
