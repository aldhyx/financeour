import { type PropsWithChildren } from 'react';
import { View } from 'react-native';

import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

type FormLabelProps = { text?: string | null; className?: string };
type FormErrorProps = { text?: string | null; className?: string };
type FormContainerProps = PropsWithChildren & {
  className?: string;
};

export const FormLabel = (props: FormLabelProps) => {
  if (!props.text) return null;

  return (
    <Text
      className={cn('text-foreground text-sm leading-none', props.className)}
    >
      {props.text}
    </Text>
  );
};

export const FormErrorMessage = (props: FormErrorProps) => {
  if (!props.text) return null;

  return (
    <Text className={cn('text-destructive text-sm', props.className)}>
      {props.text}
    </Text>
  );
};

export const FormContainer = (props: FormContainerProps) => {
  return (
    <View className={cn('grow mb-4', props.className)}>{props.children}</View>
  );
};
