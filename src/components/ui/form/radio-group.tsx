import { createContext, PropsWithChildren, useContext } from 'react';
import { TouchableOpacity, View } from 'react-native';

type RadioGroupRootProps = {
  id?: string | null;
  value?: string | null;
  onChange?: (id: string, val: string) => void;
};

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
  id,
  onChange,
}: PropsWithChildren & RadioGroupRootProps) => {
  return (
    <RadioGroupContext.Provider value={{ id, value, onChange }}>
      {children}
    </RadioGroupContext.Provider>
  );
};

type RadioGroupItemProps = {
  id: string;
  value: string;
  onPress?: (id: string, val: string) => void;
} & PropsWithChildren;

type RadioItemContextProps = {
  itemId: string;
};

const RadioItemContext = createContext<RadioItemContextProps | null>(null);

const RadioGroupItem = ({
  value: itemValue,
  id: itemId,
  onPress,
  ...otherProps
}: RadioGroupItemProps) => {
  const { onChange } = useRadioGroupContext();

  function onPressHandler() {
    onChange?.(itemId, itemValue);
    onPress?.(itemId, itemValue);
  }

  return (
    <RadioItemContext.Provider value={{ itemId }}>
      <TouchableOpacity onPress={onPressHandler}>
        <View
          className="h-14 flex-row items-center justify-between gap-2 border-b border-b-border px-4"
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
  const { id } = useRadioGroupContext();
  const { itemId } = useRadioItemContext();

  if (itemId !== id) return null;

  return <View {...props} />;
};

export { RadioGroup, RadioGroupIndicator, RadioGroupItem };
