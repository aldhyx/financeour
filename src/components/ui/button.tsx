import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { ActivityIndicator, Pressable } from 'react-native';
import { TextClassContext } from 'src/components/ui/text';
import { cn } from 'src/lib/utils';

const buttonVariants = cva('group flex items-center justify-center', {
  variants: {
    variant: {
      default: 'bg-primary active:opacity-80',
      destructive: 'bg-destructive active:opacity-80',
      outline: 'border border-input bg-background active:bg-accent',
      secondary: 'bg-secondary active:opacity-60',
      ghost: 'active:bg-accent active:opacity-60',
      link: 'active:opacity-60',
    },
    size: {
      default: 'h-12 px-4',
      sm: 'h-9 px-3',
      lg: 'h-14 px-4',
      icon: 'size-10',
      'icon-md': 'size-12',
      'icon-lg': 'size-14',
    },
    rounded: {
      default: 'rounded-xl',
      full: 'rounded-full',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
    rounded: 'default',
  },
});

const buttonTextVariants = cva('text-base font-medium text-foreground', {
  variants: {
    variant: {
      default: 'text-primary-foreground',
      destructive: 'text-destructive-foreground dark:text-foreground',
      outline: 'group-active:text-accent-foreground',
      secondary:
        'text-secondary-foreground group-active:text-secondary-foreground',
      ghost: 'group-active:text-accent-foreground',
      link: 'font-medium text-primary',
    },
    size: {
      default: '',
      sm: '',
      lg: 'text-lg',
      icon: '',
      'icon-md': '',
      'icon-lg': '',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

type ButtonProps = React.ComponentPropsWithoutRef<typeof Pressable> &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean;
  };

const Button = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  ButtonProps
>(
  (
    {
      className,
      variant,
      size,
      loading,
      disabled,
      children,
      rounded,
      ...props
    },
    ref
  ) => {
    return (
      <TextClassContext.Provider
        value={cn(buttonTextVariants({ variant, size }))}
      >
        <Pressable
          ref={ref}
          role="button"
          className={cn(buttonVariants({ variant, size, rounded, className }))}
          disabled={disabled || loading}
          {...props}
        >
          {loading ? (
            <ActivityIndicator testID={`${props.testID}-loading-indicator`} />
          ) : (
            children
          )}
        </Pressable>
      </TextClassContext.Provider>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };
