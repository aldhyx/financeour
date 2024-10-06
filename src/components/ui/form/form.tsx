import {
  createContext,
  forwardRef,
  PropsWithChildren,
  ReactNode,
  useContext,
} from 'react';
import { TextInputProps, View } from 'react-native';
import { TextInput } from 'react-native';

import { cn } from '@/lib/utils';

import { Text } from '../text';
import { Input } from './input';

type FormRootContext = { errorMessage?: string | null };
const formRootContext = createContext<FormRootContext>({});
const useFormRootContext = () => {
  const formContext = useContext(formRootContext);

  if (!formContext) {
    throw new Error('useFormRootContext should be used within <FormGroup>');
  }
  return formContext;
};

type FormGroupProps = PropsWithChildren &
  FormRootContext & {
    className?: string;
  };

const FormGroup = ({ children, className, errorMessage }: FormGroupProps) => {
  return (
    <formRootContext.Provider
      value={{
        errorMessage,
      }}
    >
      <View className={cn('grow mb-2', className)}>{children}</View>
    </formRootContext.Provider>
  );
};

FormGroup.Label = function Label(props: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <Text
      className={cn(
        'text-foreground leading-none text-base mb-1',
        props.className
      )}
    >
      {props.children}
    </Text>
  );
};

FormGroup.ErrorMessage = function ErrorMessage(props: { className?: string }) {
  const { errorMessage } = useFormRootContext();
  if (!errorMessage) return null;

  return (
    <Text
      className={cn(
        'text-destructive text-sm leading-none mt-2',
        props.className
      )}
    >
      {errorMessage}
    </Text>
  );
};

// For simplicity, only pick what needed from TextInputProps
type FormInputProps = Pick<
  TextInputProps,
  'inputMode' | 'placeholder' | 'defaultValue' | 'onBlur'
> & {
  className?: string;
  disabled?: boolean;
  value?: string | null;
  onChange?: (text: string) => void;
};

FormGroup.Input = forwardRef<TextInput, FormInputProps>(function FormInput(
  { className, disabled, onChange, value, ...otherProps },
  ref
) {
  const { errorMessage } = useFormRootContext();

  return (
    <Input
      ref={ref}
      className={cn(className, errorMessage && 'border-destructive')}
      editable={!disabled}
      onChangeText={onChange}
      value={value ?? ''}
      {...otherProps}
    />
  );
});

export { FormGroup, useFormRootContext };
