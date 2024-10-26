# GIT

## COMMIT TYPES

We are using husky precommit + commitlint + conventional commits, so in order to do a `git commit`, you have to specify the commit message type, e.g. `git commit feat(new):message` or `git commit feat:message`.

## Understanding the Types

[Conventional commits](https://www.conventionalcommits.org/en/v1.0.0/#summary)

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
