import { registerSheet, SheetDefinition } from 'react-native-actions-sheet';

import { Account } from '@/db/actions/account';

import AccountActionSheet from './account/account-action.sheet';
import ChooseAccountTypeSheet from './account/choose-account-type.sheet';

// account
registerSheet('choose-account-type.sheet', ChooseAccountTypeSheet);
registerSheet('account-action.sheet', AccountActionSheet);

type AccountSheets = {
  'choose-account-type.sheet': SheetDefinition<{
    payload: { accountType?: string };
    returnValue?: { accountType: string };
  }>;
  'account-action.sheet': SheetDefinition<{
    payload: Account;
  }>;
};

// We extend some of the types here to give us great intellisense
// across the app for all registered sheets.
declare module 'react-native-actions-sheet' {
  interface Sheets extends AccountSheets {}
}

export {};
