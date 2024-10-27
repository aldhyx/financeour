import { i18n } from '@lingui/core';
import { I18nProvider as DefaultI18nProvider } from '@lingui/react';
import React, { PropsWithChildren } from 'react';

export default function I18nProvider({ children }: PropsWithChildren) {
  return <DefaultI18nProvider i18n={i18n}>{children}</DefaultI18nProvider>;
}
