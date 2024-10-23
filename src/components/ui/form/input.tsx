import { cva, VariantProps } from 'class-variance-authority';
import React, { forwardRef } from 'react';
import { TextInput } from 'react-native';

import { cn } from '@/lib/utils';

export const inputVariants = cva(
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
  VariantProps<typeof inputVariants>;

export const Input = forwardRef<TextInput, InputProps>(
  ({ className, placeholderClassName, size, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        className={cn(inputVariants({ size }), className)}
        placeholderClassName={cn('text-muted-foreground', placeholderClassName)}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
