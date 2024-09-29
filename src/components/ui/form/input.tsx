import React from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { cn } from 'src/lib/utils';

import { Text } from '../text';
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

        {errorText && <FormErrorMessage className="mt-1" text={errorText} />}
      </FormContainer>
    );
  }
);

Input.displayName = 'Input';

export const FakeInput = React.memo<Props>(
  ({ className, label, errorText, placeholder, value, onPress, ...props }) => {
    return (
      <TouchableOpacity onPress={onPress}>
        <FormContainer>
          {label && <FormLabel className="mb-2" text={label} />}

          <View
            className={cn(
              'h-12 rounded-2xl border border-secondary bg-secondary px-3 leading-[1.25] justify-center',
              errorText && 'border border-destructive',
              className
            )}
            {...props}
          >
            <Text
              className={cn(
                'text-base capitalize',
                value ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {value || placeholder || ''}
            </Text>
          </View>

          {errorText && <FormErrorMessage className="mt-1" text={errorText} />}
        </FormContainer>
      </TouchableOpacity>
    );
  }
);

FakeInput.displayName = 'FakeInput';
