import * as Slot from '@rn-primitives/slot';
import { SlottableTextProps, TextRef } from '@rn-primitives/types';
import * as React from 'react';
import { Text as RNText } from 'react-native';
import { cn } from 'src/lib/utils';

type Props = SlottableTextProps;

const TextClassContext = React.createContext<string | undefined>(undefined);

const Text = React.forwardRef<TextRef, Props>(
  ({ className, asChild = false, children, ...props }, ref) => {
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
        {children}
      </Component>
    );
  }
);

Text.displayName = 'Text';

export { Text, TextClassContext };
