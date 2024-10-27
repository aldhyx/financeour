## Important

- `pnpm run prebuild` -> you will also need to run this anytime `app.json` or native `package.json` deps change

- `pnpm intl:build` -> you will also need to run this anytime `./src/i18n/{locale}/messages.po` change

## Local build (for testing purpose)

To build the app locally, run one of the following commands bellow.

- Development env (with expo devtools)

```sh
# prebuild the native code
pnpm prebuild
# generate apk & install to emulator or real device
pnpm run apk:all
```

- Staging env

```sh
# prebuild the native code
pnpm prebuild:staging
# generate apk & install to emulator or real device
pnpm run apk:all
```

- Production env

```sh
# prebuild the native code
pnpm prebuild:production
# generate apk & install to emulator or real device
pnpm run apk:all
```

## Using EAS BUILD

TODO: Never try, so I need to try first
