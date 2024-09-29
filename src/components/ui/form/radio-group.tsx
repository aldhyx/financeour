import { createContext, PropsWithChildren, useContext } from 'react';
import { TouchableOpacity, View } from 'react-native';

type RadioGroupRootProps = {
  value: string | undefined;
  onValueChange?: (val: string) => void;
};

type RadioGroupItemProps = {
  value: string;
  onPress?: (val: string) => void;
} & PropsWithChildren;

const RadioGroupContext = createContext<RadioGroupRootProps | null>(null);

function useRadioGroupContext() {
  const context = useContext(RadioGroupContext);

  if (!context) {
    throw new Error(
      'RadioGroup compound components cannot be rendered outside the RadioGroup component'
    );
  }

  return context;
}

const RadioGroup = ({
  children,
  value,
  onValueChange,
}: PropsWithChildren & RadioGroupRootProps) => {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      {children}
    </RadioGroupContext.Provider>
  );
};

type RadioItemContextProps = {
  itemValue: string | undefined;
};

const RadioItemContext = createContext<RadioItemContextProps | null>(null);

const RadioGroupItem = ({
  value: itemValue,
  onPress,
  ...otherProps
}: RadioGroupItemProps) => {
  const { onValueChange } = useRadioGroupContext();

  function onPressHandler() {
    onValueChange?.(itemValue);
    onPress?.(itemValue);
  }

  return (
    <RadioItemContext.Provider value={{ itemValue }}>
      <TouchableOpacity onPress={onPressHandler}>
        <View
          className="h-14 flex-row items-center justify-between gap-2 border-b border-b-secondary px-3"
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
      'RadioItem compound components cannot be rendered outside the RadioItem component'
    );
  }
  return context;
}

const RadioGroupIndicator = (props: PropsWithChildren) => {
  const { value } = useRadioGroupContext();
  const { itemValue } = useRadioItemContext();

  if (itemValue !== value) return null;

  return <View {...props} />;
};

export { RadioGroup, RadioGroupIndicator, RadioGroupItem };
