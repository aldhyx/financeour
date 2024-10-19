import { createContext, PropsWithChildren, ReactNode, useContext } from 'react';
import { Pressable, View } from 'react-native';

import { CheckIcon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';

type RadioGroupRootProps = {
  value?: string | null;
  children?: ReactNode;
  onChange?: (value: string) => void;
};

const RadioGroupContext = createContext<RadioGroupRootProps>({});

function useRadioGroupContext() {
  const context = useContext(RadioGroupContext);

  if (!context) {
    throw new Error('useRadioGroupContext should be used within <RadioGroup>');
  }

  return context;
}

const RadioGroup = ({ children, value, onChange }: RadioGroupRootProps) => {
  return (
    <RadioGroupContext.Provider value={{ value, onChange }}>
      {children}
    </RadioGroupContext.Provider>
  );
};

type RadioItemContextProps = {
  itemValue: string;
};

const RadioItemContext = createContext<RadioItemContextProps | null>(null);

type RadioGroupItemProps = {
  value: string;
  onPress?: (val: string) => void;
  className?: string;
} & PropsWithChildren;

const RadioGroupItem = ({
  value: itemValue,
  onPress,
  className,
  ...otherProps
}: RadioGroupItemProps) => {
  const { onChange } = useRadioGroupContext();

  function onPressHandler() {
    onChange?.(itemValue);
    onPress?.(itemValue);
  }

  return (
    <RadioItemContext.Provider value={{ itemValue }}>
      <Pressable className="active:bg-secondary" onPress={onPressHandler}>
        <View
          className={cn(
            'min-h-14 flex-row items-center justify-between gap-2 px-4',
            className
          )}
          {...otherProps}
        />
      </Pressable>
    </RadioItemContext.Provider>
  );
};

function useRadioItemContext() {
  const context = useContext(RadioItemContext);
  if (!context) {
    throw new Error(
      'useRadioItemContext should be used within <RadioGroupItem>'
    );
  }
  return context;
}

const RadioGroupIndicator = (props: PropsWithChildren) => {
  const { value } = useRadioGroupContext();
  const { itemValue } = useRadioItemContext();

  if (props.children) return itemValue === value ? <View {...props} /> : null;
  return itemValue === value ? (
    <View>
      <CheckIcon size={24} className="text-emerald-600" strokeWidth={3} />
    </View>
  ) : null;
};

export {
  RadioGroup,
  RadioGroupIndicator,
  RadioGroupItem,
  useRadioGroupContext,
  useRadioItemContext,
};
