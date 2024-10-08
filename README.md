<h1 align="center">
  <img alt="logo" src="./assets/images/icon.png" width="124px" style="border-radius:10px"/><br/>
Mobile App 
</h1>

## Requirements

- [Expo React Native dev environment ](https://docs.expo.dev/get-started/set-up-your-environment/)
- [Dev Process ](https://docs.expo.dev/guides/overview/)
- [Node.js LTS release](https://nodejs.org/en/)
- [Git](https://git-scm.com/)
- [Watchman](https://facebook.github.io/watchman/docs/install#buildinstall), required only for macOS or Linux users
- [Pnpm](https://pnpm.io/installation)
- [VS Code Editor](https://code.visualstudio.com/download) ⚠️ Make sure to install all recommended extension from `.vscode/extensions.json`

## 👋 Quick start

Clone the repo to your machine and install deps :

```sh
git clone https://github.com/user/repo-name

cd ./repo-name
```

#### This app will be run in bare workflow not expo manage workflow.

Install app dependencies

```sh
pnpm install
```

Generate native code

```sh
pnpm prebuild
```

To run the app on ios

```sh
pnpm ios
```

To run the app on Android

```sh
pnpm android
```

To run the app in staging

```sh
pnpm prebuild:staging
pnpm ios:staging
pnpm android:staging
```

To build the app bundle, see build commands or apk commands in package.json

## COMMIT TYPES

Understanding the Types

These types are often based on Conventional Commits, which provide a standardized way of writing commit messages. Here’s what each type generally means:

- **build**: Changes that affect the build system or external dependencies (e.g., gulp, webpack, npm).

  E.g: build: update dependencies

- **chore**: Other changes that don’t modify src or test files (e.g., maintenance tasks).

  E.g: chore: update package.json

- **ci**: Changes to CI configuration files and scripts (e.g., GitHub Actions, Travis CI).

  E.g: ci: fix CI build

- **docs**: Documentation only changes.

  E.g: docs: update README.md

- **feat**: A new feature for the user.

  E.g: feat: add new login feature

- **fix**: A bug fix for the user.

  E.g: fix: resolve issue with login not working

- **perf**: A code change that improves performance.

  E.g: perf: optimize loading time

- **refactor**: A code change that neither fixes a bug nor adds a feature.

  E.g: refactor: improve code structure

- **revert**: A commit that reverts a previous commit.

  E.g: revert: undo changes from commit xyz

- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc.).

  E.g: style: format code using prettier

- **test**: Adding missing tests or correcting existing tests.

  E.g: test: add unit tests for new feature
