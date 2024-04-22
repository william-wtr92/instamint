# 🧰 Ansible

> Ansible is a simple IT automation tool that automates apps and IT infrastructure. It is an open-source software
> provisioning, configuration management, and application-deployment tool.

## 📚 Ressources

- [📖 Documentation](https://docs.ansible.com/ansible)

## 🚀 Installation

- Install [Ansible](https://docs.ansible.com/ansible) 🧰
- Install [Ansible-Lint](https://ansible.readthedocs.io/projects/lint/installing/) **⚠️ Windows not supported ⚠️**

### 🍏 For MacOS

```bash
brew install ansible
brew install ansible-lint
```

⚠️ For other OS please refer to
the [official documentation](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html).

## 🔰 Architecture

- `root`:
  - `ansible.cfg`: Main ansible configuration file.
  - `env.sh`: Environment variables for ansible.
  - `inventory`: Inventory file to define the hosts.
  - `playbooks`: Playbooks directory to define the tasks.
    - `scripts`: Scripts directory to define the scripts used in playbooks.

## 🧩 Dependencies

- Install the required dependencies:

```bash
ansible-galaxy collection install community.docker --force
```

## ⚙️ Linter

To lint the ansible code, run the following command:

```bash
ansible-lint -c .ansible-lint.yml
```
