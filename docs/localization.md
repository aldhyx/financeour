# Internationalization

## Tools

We are using Lingui to manage translations. You can find the documentation [here](https://lingui.dev/).

### Adding new strings

When adding a new string, do it as follows:

```jsx
// Before
import { Text } from 'react-native';

<Text>Hello World</Text>;
```

```jsx
// After
import { Text } from 'react-native';
import { Trans } from '@lingui/macro';

<Text>
  <Trans>Hello World</Trans>
</Text>;
```

The `<Trans>` macro will extract the string and add it to the catalog. It is not really a component, but a macro. Further reading [here](https://lingui.dev/ref/macro.html)

However sometimes you will run into this case:

```jsx
// Before
import { Text } from 'react-native';

const text = 'Hello World';
<Text accessibilityLabel="Label is here">{text}</Text>;
```

In this case, you can use the `useLingui()` hook:

```jsx
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';

const { _ } = useLingui();
return <Text accessibilityLabel={_(msg`Label is here`)}>{text}</Text>;
```

If you want to do this outside of a React component, you can use the `t` macro instead (note: this won't react to changes if the locale is switched dynamically within the app):

```jsx
import { t } from '@lingui/macro';

const text = t`Hello World`;
```

We can then run `pnpm run intl:extract` to update the catalog in `src/i18n/locales/{locale}/messages.po`. This will add the new string to the catalog.
We can then run `pnpm run intl:compile` to update the translation files in `src/i18n/locales/{locale}/messages.js`. This will add the new string to the translation files.
The configuration for translations is defined in `lingui.config.js`

So the workflow is as follows:

1. Wrap messages in Trans macro
2. Run `yarn intl:extract` command to generate message catalogs
3. Translate message catalogs (send them to translators usually)
4. Run `yarn intl:compile` to create runtime catalogs
5. Load runtime catalog
6. Enjoy translated app!

### Common pitfalls

These pitfalls are memoization pitfalls that will cause the components to not re-render when the locale is changed -- causing stale translations to be shown.

```jsx
import { msg } from '@lingui/macro';
import { i18n } from '@lingui/core';

const welcomeMessage = msg`Welcome!`;

// ❌ Bad! This code won't work
export function Welcome() {
  const buggyWelcome = useMemo(() => {
    return i18n._(welcomeMessage);
  }, []);

  return <div>{buggyWelcome}</div>;
}

// ❌ Bad! This code won't work either because the reference to i18n does not change
export function Welcome() {
  const { i18n } = useLingui();

  const buggyWelcome = useMemo(() => {
    return i18n._(welcomeMessage);
  }, [i18n]);

  return <div>{buggyWelcome}</div>;
}

// ✅ Good! `useMemo` has i18n context in the dependency
export function Welcome() {
  const linguiCtx = useLingui();

  const welcome = useMemo(() => {
    return linguiCtx.i18n._(welcomeMessage);
  }, [linguiCtx]);

  return <div>{welcome}</div>;
}

// 🤩 Better! `useMemo` consumes the `_` function from the Lingui context
export function Welcome() {
  const { _ } = useLingui();

  const welcome = useMemo(() => {
    return _(welcomeMessage);
  }, [_]);

  return <div>{welcome}</div>;
}
```
