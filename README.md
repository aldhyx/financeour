<h1 align="center">
  <img alt="logo" src="./assets/images/icon.png" width="124px" style="border-radius:10px"/>
  <br/>
  Mobile App 
</h1>

## ❗Requirements

- [Expo React Native dev environment](https://docs.expo.dev/get-started/set-up-your-environment/)
- [Dev Process](https://docs.expo.dev/guides/overview/)
- [Node.js LTS release](https://nodejs.org/en/)
- [Git](https://git-scm.com/)
- [Watchman](https://facebook.github.io/watchman/docs/install#buildinstall), required only for macOS or Linux users
- [Pnpm](https://pnpm.io/installation)
- [VS Code Editor](https://code.visualstudio.com/download) ⚠️ Make sure to install all recommended extension from [here](/.vscode/extensions.json)

## 👋 Quick start

Clone the repo to your machine and install deps :

```sh
git clone https://github.com/user/repo-name

cd ./repo-name
```

#### This app will be run in expo bare workflow

Install app dependencies

```sh
pnpm install
```

Generate native code

```sh
pnpm prebuild
```

To run the app, you have to setup the emulator first, then run one of the following commands

```sh
pnpm start
# or compile & run on each platform
pnpm ios
pnpm android
# add --d to choose which device selected to tun
pnpm android -d
pnpm ios -d
```

To run the app in staging environment

```sh
pnpm prebuild:staging
pnpm start:staging
# or compile & run on each platform
pnpm ios:staging
pnpm android:staging
```

## Developer Menu

To open the [Developer Menu](https://docs.expo.dev/debugging/tools/#developer-menu) on an `expo-dev-client` app you can do the following:

- Android Device: Shake the device vertically, or if your device is connected via USB, run adb shell input keyevent 82 in your terminal
- Android Emulator: Either press Cmd ⌘ + m or Ctrl + m or run adb shell input keyevent 82 in your terminal
- iOS Device: Shake the device, or touch 3 fingers to the screen
- iOS Simulator: Press Ctrl + Cmd ⌘ + z on a Mac in the emulator to simulate the shake gesture or press Cmd ⌘ + d

## Others

- To build the app bundle see [Build docs](/docs/build.md)
- How the localization work, see [Localization docs](/docs/localization.md)
- How to do a git commit, see [Git docs](/docs/git.md)
