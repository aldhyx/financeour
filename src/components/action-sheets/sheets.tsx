import { registerSheet, SheetDefinition } from 'react-native-actions-sheet';

import ChooseAccountTypeSheet from './account/choose-account-type.sheet';

// account
registerSheet('choose-account-type.sheet', ChooseAccountTypeSheet);

type AccountSheets = {
  'choose-account-type.sheet': SheetDefinition<{
    payload: { accountType?: string };
    returnValue?: { accountType: string };
  }>;
};

// We extend some of the types here to give us great intellisense
// across the app for all registered sheets.
declare module 'react-native-actions-sheet' {
  interface Sheets extends AccountSheets {}
}

export {};
