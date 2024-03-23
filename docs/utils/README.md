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

This is an pull request template, used to standardise the format of the extraction request and facilitate its
examination.

## ♻️ [Git Hooks](https://github.com/william-wtr92/instamint/tree/main/scripts)

#### We use git hooks to execute actions at commit / push time and also on messages given in commits.

- To do this, I added a script to the `package.json` file in the project `root` directory. This `"postinstall"` script
  is run
  natively after `pnpm install`.

```bash
"postinstall": "if [ \"$PNPM_POSTINSTALL_ENABLE\" != \"false\" ]; then chmod +x ./scripts/setup-hooks.sh && ./scripts/setup-hooks.sh; fi",
```

- Here we have set a condition so as not to incorporate this `postinstall` script into our Docker containers.<br><br>

#### The script `setup-hooks.sh` is responsible for setting up the hooks in the `.git/hooks` directory.

```bash
#!/bin/sh

cp scripts/commit-msg.sh ./.git/hooks/commit-msg
cp scripts/pre-commit.sh ./.git/hooks/pre-commit
cp scripts/pre-push.sh ./.git/hooks/pre-push

chmod +x ./.git/hooks/commit-msg
chmod +x ./.git/hooks/pre-commit
chmod +x ./.git/hooks/pre-push
```

#### The `commit-msg` hook is responsible for checking the commit message with conventional commits, for this we have added 2 devDependencies to the project:

    "@commitlint/cli": "^19.0.3",
    "@commitlint/config-conventional": "^19.0.3",

```bash
#!/bin/sh
MESSAGE=$(cat $1)  # Get the commit message

echo "$MESSAGE" | pnpm exec -- commitlint    # Check the commit message

if [ $? -ne 0 ]; then               # If the commit message does not follow the conventional commit guidelines, exit with an error
  echo "Commit message does not follow the conventional commit guidelines."
  exit 1
fi
```

#### The `pre-commit` hook is responsible for running linting & prettier checking before the commit is made.

```bash
#!/bin/sh
echo "Running lint checks !"

pnpm run lint   # Run the lint checks
pnpm run format:check    # Run the prettier checks

if [ $? -ne 0 ]; then            # If the linting fails, exit with an error
  echo "Linting failed, commit aborted."
  exit 1
fi
```

#### The `pre-push` hook is responsible for running the tests before the push is made.

```bash
#!/bin/sh
echo "Running unit tests !"

## TODO : add all tests here
pnpm run test:business   # Run business server logic tests

if [ $? -ne 0 ]; then           # If the tests fail, exit with an error
  echo "Unit tests failed, push aborted."
  exit 1
fi
```

## 🧩 [Makefile](https://github.com/william-wtr92/instamint/tree/main/Makefile)

#### The Makefile is a useful tool for organizing and executing commands.

- He helps us to standardize the commands and make them more readable, to show the available commands make:

```bash
make help
```

- For example, we can start production Compose with the command:

  ```bash
  make prod-up
  ```

  - instead of:

  ```bash
  docker-compose -f docker-compose.prod.yml up -d
  ```
