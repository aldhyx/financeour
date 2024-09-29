import React from 'react';
import { TextInput } from 'react-native';
import { cn } from 'src/lib/utils';

import { FormContainer, FormErrorMessage, FormLabel } from './form';

type Props = React.ComponentPropsWithoutRef<typeof TextInput> & {
  label?: string;
  errorText?: string;
};

export const Input = React.memo<Props>(
  ({ className, placeholderClassName, label, errorText, ...props }) => {
    return (
      <FormContainer>
        {label && <FormLabel className="mb-2" text={label} />}

        <TextInput
          className={cn(
            'h-12 rounded-2xl border border-secondary bg-secondary px-3 text-base leading-[1.25] text-foreground placeholder:text-muted-foreground',
            errorText && 'border border-destructive',
            className
          )}
          placeholderClassName={cn(
            'text-muted-foreground',
            placeholderClassName
          )}
          {...props}
        />

        {errorText && <FormErrorMessage className="mt-1" />}
      </FormContainer>
    );
  }
);

Input.displayName = 'Input';
