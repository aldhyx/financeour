import React, { ReactNode, useCallback, useState } from 'react';
import { Pressable, View } from 'react-native';

import { CalculatorIcon, CheckIcon, DeleteIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useMaskCurrency } from '@/hooks/use-mask-currency';
import { cn } from '@/lib/utils';

type Props = {
  onPressDone: (result: number) => void;
  onPressCalc?: () => void;
  value?: number;
};

const Button = (props: {
  onPress?: () => void;
  onLongPress?: () => void;
  children?: ReactNode;
  className?: string;
}) => {
  return (
    <Pressable
      className={cn(
        'size-20 items-center justify-center rounded-full bg-secondary active:opacity-50',
        props.className
      )}
      onPress={props.onPress}
      onLongPress={props.onLongPress}
    >
      {props.children}
    </Pressable>
  );
};

// eslint-disable-next-line max-lines-per-function
export const Numpad = (props: Props) => {
  const defaultVal = props.value && !isNaN(props.value) ? props.value : 0;
  const [input, setInput] = useState<string>(`${defaultVal}`);
  const { maskCurrency } = useMaskCurrency();

  // Function to handle button click for numbers and operators
  const pressNumberHandler = useCallback(
    (value: string) => () => {
      const valueInt = parseInt(value);
      const isValZero = valueInt === 0;

      setInput((prev) => {
        const isPrevZero = prev === '0';
        // Prevent pressing multiple leading zeros
        if (isPrevZero && isValZero) return prev;
        // Replace zero with not zero value
        if (isPrevZero) return value;
        return prev + value;
      });
    },
    []
  );

  // Function to clear input and result
  const clearHandler = () => setInput('0');

  // Function to handle backspace (deletes the last character)
  const backspaceHandler = () => setInput((state) => state.slice(0, -1) || '0');

  const pressDoneHandler = () => {
    const result = parseInt(input);
    props?.onPressDone(isNaN(result) ? 0 : result);
  };

  return (
    <View className="mx-auto w-[372px] items-center justify-center gap-2 p-4">
      <View className="mb-2 w-full justify-end">
        <Text className="text-right text-3xl font-semibold">
          {maskCurrency(input).masked}
        </Text>
      </View>

      <View className="flex-row gap-2">
        <Button onPress={pressNumberHandler('1')}>
          <Text className="text-2xl">1</Text>
        </Button>
        <Button onPress={pressNumberHandler('2')}>
          <Text className="text-2xl">2</Text>
        </Button>
        <Button onPress={pressNumberHandler('3')}>
          <Text className="text-2xl">3</Text>
        </Button>
        <Button
          onPress={backspaceHandler}
          onLongPress={clearHandler}
          className="bg-red-500 dark:bg-red-500"
        >
          <DeleteIcon
            size={32}
            className="text-background dark:text-foreground"
          />
        </Button>
      </View>

      <View className="flex-row gap-2">
        <Button onPress={pressNumberHandler('4')}>
          <Text className="text-2xl">4</Text>
        </Button>
        <Button onPress={pressNumberHandler('5')}>
          <Text className="text-2xl">5</Text>
        </Button>
        <Button onPress={pressNumberHandler('6')}>
          <Text className="text-2xl">6</Text>
        </Button>
        <Button
          onPress={clearHandler}
          onLongPress={clearHandler}
          className="bg-red-500 dark:bg-red-500"
        >
          <Text className="text-3xl text-background dark:text-foreground">
            C
          </Text>
        </Button>
      </View>

      <View className="flex-row gap-2">
        <Button onPress={pressNumberHandler('7')}>
          <Text className="text-2xl">7</Text>
        </Button>
        <Button onPress={pressNumberHandler('8')}>
          <Text className="text-2xl">8</Text>
        </Button>
        <Button onPress={pressNumberHandler('9')}>
          <Text className="text-2xl">9</Text>
        </Button>
        <Button
          onPress={pressDoneHandler}
          className="size-20 bg-emerald-500 dark:bg-emerald-500"
        >
          <CheckIcon
            size={32}
            className="text-background dark:text-foreground"
          />
        </Button>
      </View>
      <View className="flex-row gap-2">
        <Button
          onPress={props.onPressCalc}
          className="bg-foreground/15 dark:bg-foreground/25"
        >
          <CalculatorIcon size={32} className="text-foreground" />
        </Button>
        <Button onPress={pressNumberHandler('0')}>
          <Text className="text-2xl">0</Text>
        </Button>
        <Button onPress={pressNumberHandler('000')}>
          <Text className="text-2xl">000</Text>
        </Button>
        <View className="size-20" />
      </View>
    </View>
  );
};
