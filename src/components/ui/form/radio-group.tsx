import { createContext, PropsWithChildren, ReactNode, useContext } from 'react';
import { TouchableOpacity, View } from 'react-native';

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
} & PropsWithChildren;

const RadioGroupItem = ({
  value: itemValue,
  onPress,
  ...otherProps
}: RadioGroupItemProps) => {
  const { onChange } = useRadioGroupContext();

  function onPressHandler() {
    onChange?.(itemValue);
    onPress?.(itemValue);
  }

  return (
    <RadioItemContext.Provider value={{ itemValue }}>
      <TouchableOpacity onPress={onPressHandler}>
        <View
          className="min-h-14 flex-row items-center justify-between gap-2 border-b border-b-border px-4"
          {...otherProps}
        />
      </TouchableOpacity>
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

  return itemValue === value ? <View {...props} /> : null;
};

export {
  RadioGroup,
  RadioGroupIndicator,
  RadioGroupItem,
  useRadioGroupContext,
  useRadioItemContext,
};
