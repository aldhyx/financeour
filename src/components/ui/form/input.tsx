import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { TextInput, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

import { FormContainer, FormErrorMessage, FormLabel } from './form';

const inputVariants = cva(
  'group rounded-2xl border border-secondary bg-secondary px-3 text-base leading-tight text-foreground placeholder:text-muted-foreground',
  {
    variants: {
      size: {
        default: 'h-12',
        sm: 'h-9',
        lg: 'h-14',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

type InputProps = React.ComponentPropsWithoutRef<typeof TextInput> &
  VariantProps<typeof inputVariants> & {
    label?: string;
    errorText?: string;
    hideErrorText?: boolean;
  };

export const Input = React.memo<InputProps>(
  ({
    className,
    placeholderClassName,
    label,
    errorText,
    size,
    hideErrorText,
    ...props
  }) => {
    return (
      <FormContainer>
        {label && <FormLabel text={label} />}

        <TextInput
          className={cn(
            inputVariants({ size }),
            errorText && 'border border-destructive',
            className
          )}
          placeholderClassName={cn(
            'text-muted-foreground',
            placeholderClassName
          )}
          {...props}
        />

        {!hideErrorText && errorText && <FormErrorMessage text={errorText} />}
      </FormContainer>
    );
  }
);
Input.displayName = 'Input';

const fakeInputVariants = cva(
  'group justify-center rounded-2xl border border-secondary bg-secondary px-3 leading-tight',
  {
    variants: {
      size: {
        default: 'h-12',
        sm: 'h-9',
        lg: 'h-14',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

export const FakeInput = React.memo<InputProps>(
  ({
    className,
    label,
    errorText,
    placeholder,
    value,
    size,
    hideErrorText,
  }) => {
    return (
      <FormContainer>
        {label && <FormLabel text={label} />}

        <View
          className={cn(
            fakeInputVariants({ size }),
            errorText && 'border border-destructive',
            className
          )}
        >
          <Text
            className={cn(
              'text-base capitalize leading-tight',
              value ? 'text-foreground' : 'text-muted-foreground'
            )}
          >
            {value || placeholder || ''}
          </Text>
        </View>

        {!hideErrorText && errorText && <FormErrorMessage text={errorText} />}
      </FormContainer>
    );
  }
);
FakeInput.displayName = 'FakeInput';

export const FakeInputBordered = (props: {
  errorText?: string;
  value: string;
  label?: string;
  hideErrorText?: boolean;
}) => {
  return (
    <FormContainer className="mb-3">
      {props.label && <FormLabel text={props.label} />}
      <View className="flex-row items-end gap-3">
        <Text className="text-2xl font-medium leading-none">Rp</Text>

        <View
          className={cn(
            'grow border-b border-b-border',
            props.errorText && 'border-b-destructive'
          )}
        >
          <Text className="text-4xl font-semibold leading-none">
            {props.value}
          </Text>
        </View>
      </View>

      {!props.hideErrorText && props.errorText && (
        <View className="pl-10">
          <FormErrorMessage text={props.errorText} />
        </View>
      )}
    </FormContainer>
  );
};
