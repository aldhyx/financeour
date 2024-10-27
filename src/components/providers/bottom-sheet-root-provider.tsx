import React, { PropsWithChildren } from 'react';

import { AccountActionSheetProvider } from '../action-sheets/account/account-action.sheet';
import { AccountListSheetProvider } from '../action-sheets/account/account-list.sheet';
import { AccountTypeListSheetProvider } from '../action-sheets/account/account-type-list.sheet';
import { NumInputSheetProvider } from '../action-sheets/general/num-input.sheet';
import { AppLanguageSheetProvider } from '../action-sheets/setting/app-language.sheet';
import { AppThemeSheetProvider } from '../action-sheets/setting/app-theme.sheet';
import { DeleteTransactionSheetProvider } from '../action-sheets/transaction/delete-transaction.sheet';

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
              <AppLanguageSheetProvider>
                <AppThemeSheetProvider>{children}</AppThemeSheetProvider>
              </AppLanguageSheetProvider>
            </NumInputSheetProvider>
          </DeleteTransactionSheetProvider>
        </AccountActionSheetProvider>
      </AccountListSheetProvider>
    </AccountTypeListSheetProvider>
  );
}
