import React, { PropsWithChildren } from 'react';

import { AccountActionSheetProvider } from '@/components/action-sheets/account/account-action.sheet';
import { AccountListSheetProvider } from '@/components/action-sheets/account/account-list.sheet';
import { AccountTypeListSheetProvider } from '@/components/action-sheets/account/account-type-list.sheet';
import { NumInputSheetProvider } from '@/components/action-sheets/general/num-input.sheet';
import { AppCurrencySheetProvider } from '@/components/action-sheets/setting/app-currency.sheet';
import { AppLanguageSheetProvider } from '@/components/action-sheets/setting/app-language.sheet';
import { AppThemeSheetProvider } from '@/components/action-sheets/setting/app-theme.sheet';
import { DeleteTransactionSheetProvider } from '@/components/action-sheets/transaction/delete-transaction.sheet';

/**
 * Register all sheet provider here
 * Place it inside BottomSheetModalProvider
 */
export default function BottomSheetRootProvider({
  children,
}: PropsWithChildren) {
  return (
    <AccountTypeListSheetProvider>
      <AccountListSheetProvider>
        <AccountActionSheetProvider>
          <DeleteTransactionSheetProvider>
            <NumInputSheetProvider>
              <AppCurrencySheetProvider>
                <AppLanguageSheetProvider>
                  <AppThemeSheetProvider>{children}</AppThemeSheetProvider>
                </AppLanguageSheetProvider>
              </AppCurrencySheetProvider>
            </NumInputSheetProvider>
          </DeleteTransactionSheetProvider>
        </AccountActionSheetProvider>
      </AccountListSheetProvider>
    </AccountTypeListSheetProvider>
  );
}
