# 🤖 GitHub Actions

#### We use Github Actions to ensure continuous integration and deployment processes.

## 📝 Our needs

- **Linting**: Check the code quality and ensure that it follows the coding standards.
- **Formatting**: Format the code to ensure that it is consistent and easy to read.
- **Testing**: Run the tests to ensure that the code works as expected.
- **Deployment**: And finally to deploy the code to the server after the tests pass.

## 🚀 How it works

In a specific directory `.github/workflows`, we have all YAML files that define the workflows for **GitHub Actions**.

#### 💡 Our workflows schema is as follows:

![https://excalidraw.com/#room=c2cf84378c43c36d0ee3,IbFMJ8C0PsCeGq9k-cAzIQ](img.png)

## 🤑 Infracost

- In our CI we use [Infracost](https://www.infracost.io/) to calculate the cost of the infrastructure.

### 🚀 Installation

- Install Infracost:

```shell
brew install infracost

infracost auth login # Login to the Infracost
nano .config/infracost/credentials.yml # Get the API key in this file
```

- Put the API key in the `Github Secrets` with the name `INFRACOST_API_KEY`.
