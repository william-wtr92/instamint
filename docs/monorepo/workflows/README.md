# ✒️ Writing of the CHANGELOG.md

- The `CHANGELOG.md` file is a log of all notable changes made to a project. It is a living document that should be
  updated with each release of the project.
- It is a useful resource for **the client** to understand the changes
  made to the project over time.

## 🔍 To ensure that the client understands what we are doing, we are going to use a chronological linear version incrementation:

- **The version number is incremented in the following format:**

  - `[YY].[MM]?.(fix)` like [Ubuntu](https://ubuntu.com/about/release-cycle)
  - For example `v24.03` means the release of March of the year 2024.
  - If we have a fix in the same years & month, we will add an `incrementing number` at the end of the version
    number -> `v24.03.1` for example.

## 📝 The structure of the `CHANGELOG.md` file is as follows:

- **The `CHANGELOG.md` file is divided into sections:**<br><br>

  - `⭐️ Features: ` for new features.
  - `🐛 Bug Fixes: ` for bug fixes.
  - `🔨 Refactor: ` for code refactoring.
  - `🔧 Chore: ` for changes to the build process or auxiliary tools and libraries such as documentation generation.
  - `🔒 Security: ` in case of vulnerabilities.
  - `📦 Dependencies: ` for updates to dependencies.
  - `🔍 Tests: ` for changes to the test suite.
  - `📝 Documentation: ` for changes to the documentation.
  - `🚀 Performance: ` for performance improvements.

### 💡 For example:

```md
# 📝 Changelog

#### All notable changes of Instamint Project will be documented in this file.

## [v24.03](https://github.com/william-wtr92/instamint/compare/main..v24.03) (2024-03-22)

### 🔧 Chore:

- **chore: init codebase**, by [@william-wtr92](https://github.com/william-wtr92)
  in ([#2](https://github.com/william-wtr92/instamint/pull/2))
```

#### ⚠️ Each new version is placed on top of the old one, so that customers don't have to scroll to see the new changes.

## 💻 Git workflow:

- Ensure that the `CHANGELOG.md` file is updated.
- **Do the following to release a new version:**

```bash
git add CHANGELOG.md
git commit -m "chore(release): 🚀 v{version}" # Example "chore(release): 🚀 v24.03"
git tag -a v{version} -m "v{version}"  # Example "v24.03"
git push origin main --tags
```

#### ⚠️ When you add a tag to main it triggers the deploy workflow
