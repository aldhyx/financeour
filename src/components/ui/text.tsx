import * as Slot from '@rn-primitives/slot';
import { SlottableTextProps, TextRef } from '@rn-primitives/types';
import * as React from 'react';
import { Text as RNText } from 'react-native';
import { cn } from 'src/lib/utils';

import { translate, TxKeyPath } from '@/lib/i18n';

type Props = SlottableTextProps & {
  tx?: TxKeyPath;
};

const TextClassContext = React.createContext<string | undefined>(undefined);

const Text = React.forwardRef<TextRef, Props>(
  ({ className, asChild = false, children, tx, ...props }, ref) => {
    const textClass = React.useContext(TextClassContext);
    const Component = asChild ? Slot.Text : RNText;

    return (
      <Component
        className={cn(
          'text-base text-foreground leading-tight',
          textClass,
          className
        )}
        ref={ref}
        {...props}
      >
        {tx ? translate(tx) : children}
      </Component>
    );
  }
);

Text.displayName = 'Text';

export { Text, TextClassContext };
