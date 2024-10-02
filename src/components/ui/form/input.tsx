import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';

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

type Props = React.ComponentPropsWithoutRef<typeof TextInput> &
  VariantProps<typeof inputVariants> & {
    label?: string;
    errorText?: string;
  };

export const Input = React.memo<Props>(
  ({ className, placeholderClassName, label, errorText, size, ...props }) => {
    return (
      <FormContainer>
        {label && <FormLabel className="mb-2" text={label} />}

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

        {errorText && <FormErrorMessage className="mt-1" text={errorText} />}
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

export const FakeInput = React.memo<Props>(
  ({
    className,
    label,
    errorText,
    placeholder,
    value,
    onPress,
    size,
    ...props
  }) => {
    return (
      <TouchableOpacity onPress={onPress}>
        <FormContainer>
          {label && <FormLabel className="mb-2" text={label} />}

          <View
            className={cn(
              fakeInputVariants({ size }),
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
