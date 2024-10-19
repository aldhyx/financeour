/* eslint-disable max-lines-per-function */
import type { ConfigContext, ExpoConfig } from '@expo/config';

import { ClientEnv, Env } from './env';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: Env.NAME,
  description: `${Env.NAME} Mobile App`,
  owner: Env.EXPO_ACCOUNT_OWNER,
  scheme: Env.SCHEME,
  slug: Env.SLUG,
  version: Env.VERSION.toString(),
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/images/splash.png',
    resizeMode: 'cover',
    backgroundColor: '#09090B',
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: Env.BUNDLE_ID,
  },
  jsEngine: 'hermes',
  experiments: {
    typedRoutes: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#09090B',
    },
    package: Env.PACKAGE,
  },
  plugins: [
    'expo-router',
    [
      'expo-build-properties',
      {
        ios: {
          newArchEnabled: true,
        },
        android: {
          newArchEnabled: true,
        },
      },
    ],
    [
      'app-icon-badge',
      {
        enabled: Env.APP_ENV !== 'production',
        badges: [
          {
            text: Env.APP_ENV,
            type: 'banner',
            color: 'black',
            background: '#FFE101',
          },
          {
            text: Env.VERSION.toString(),
            type: 'ribbon',
            color: 'black',
            background: '#FFE101',
          },
        ],
      },
    ],
    [
      '@react-native-community/datetimepicker',
      {
        android: {
          datePicker: {
            colorAccent: {
              light: '#09090B',
            },
            textColorSecondaryInverse: {
              light: '#ffffff',
            },
            textColorPrimaryInverse: {
              light: '#ffffff',
            },
            windowBackground: {
              light: '#ffffff',
            },
            textColor: {
              light: '#09090B',
            },
            textColorPrimary: {
              light: '#09090B',
            },
            colorControlActivated: {
              light: '#09090B',
            },
          },
        },
      },
    ],
  ],
  extra: {
    ...ClientEnv,
    eas: {
      projectId: Env.EAS_PROJECT_ID,
    },
  },
});
