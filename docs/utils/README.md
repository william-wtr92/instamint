# 💡 Utils

## 🔎 [Act](https://github.com/nektos/act)

We use the `act` command to run the action. The `act` command will run the action in a local environment. This is useful
for testing the action before pushing it to the repository.

```bash
brew install act

act  # Run the default action
act -j <job_name> # Run a specific job
act -W <workflow_name>  # Run a specific workflow
act -W <workflow_name> --secret-file <path_to_secret_file>  # Run a specific workflow with secrets
```

## 🧸 [Bruno](https://github.com/usebruno/bruno)

Bruno is a new and innovative API client, aimed at revolutionizing the status quo represented by Postman and similar
tools out there, he stores your collections directly in a folder on your filesystem.

## 📝 [Template for Pull Request](https://github.com/william-wtr92/instamint/blob/main/.github/pull_request.template.md)

This is a template for the pull request. It is used to standardize the pull request format and make it easier to review
