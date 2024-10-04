import React, { useCallback, useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { CalculatorIcon, CheckIcon, DeleteIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useMaskCurrency } from '@/hooks/use-mask-currency';

type Props = {
  onPressDone: (result: number) => void;
  onPressCalc?: () => void;
  amount?: number;
};

// eslint-disable-next-line max-lines-per-function
export const Numpad = (props: Props) => {
  const { maskCurrency } = useMaskCurrency();
  const [input, setInput] = useState(props.amount ? `${props.amount}` : '0');

  // Function to handle button click for numbers and operators
  const pressNumberHandler = useCallback(
    (value?: string) => () => {
      if (value === undefined) return;
      setInput((prev) => {
        // Prevent pressing multiple leading zeros
        if (prev === '0' && value === '0') return prev;
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
    props?.onPressDone(parseInt(input));
  };

  return (
    <View className="mx-auto w-[372px] items-center justify-center gap-2 p-4">
      <View className="mb-2 w-full justify-end">
        <Text className="text-right text-3xl font-semibold">
          {maskCurrency(input).masked}
        </Text>
      </View>

      <View className="flex-row gap-2">
        <Button
          size="icon"
          variant="outline"
          roundedFull
          className="size-20"
          onPress={pressNumberHandler('1')}
        >
          <Text className="text-2xl">1</Text>
        </Button>
        <Button
          size="icon"
          variant="outline"
          roundedFull
          className="size-20"
          onPress={pressNumberHandler('2')}
        >
          <Text className="text-2xl">2</Text>
        </Button>
        <Button
          size="icon"
          variant="outline"
          roundedFull
          className="size-20"
          onPress={pressNumberHandler('3')}
        >
          <Text className="text-2xl">3</Text>
        </Button>
        <Button
          size="icon"
          variant="destructive"
          roundedFull
          className="size-20"
          onPress={backspaceHandler}
        >
          <DeleteIcon size={32} className="text-background" />
        </Button>
      </View>

      <View className="flex-row gap-2">
        <Button
          size="icon"
          variant="outline"
          roundedFull
          className="size-20"
          onPress={pressNumberHandler('4')}
        >
          <Text className="text-2xl">4</Text>
        </Button>
        <Button
          size="icon"
          variant="outline"
          roundedFull
          className="size-20"
          onPress={pressNumberHandler('5')}
        >
          <Text className="text-2xl">5</Text>
        </Button>
        <Button
          size="icon"
          variant="outline"
          roundedFull
          className="size-20"
          onPress={pressNumberHandler('6')}
        >
          <Text className="text-2xl">6</Text>
        </Button>
        <Button
          size="icon"
          variant="destructive"
          roundedFull
          className="size-20"
          onPress={clearHandler}
        >
          <Text className="text-3xl text-background">C</Text>
        </Button>
      </View>

      <View className="flex-row gap-2">
        <Button
          size="icon"
          variant="outline"
          roundedFull
          className="size-20"
          onPress={pressNumberHandler('7')}
        >
          <Text className="text-2xl">7</Text>
        </Button>
        <Button
          size="icon"
          variant="outline"
          roundedFull
          className="size-20"
          onPress={pressNumberHandler('8')}
        >
          <Text className="text-2xl">8</Text>
        </Button>
        <Button
          size="icon"
          variant="outline"
          roundedFull
          className="size-20"
          onPress={pressNumberHandler('9')}
        >
          <Text className="text-2xl">9</Text>
        </Button>
        <Button
          size="icon"
          roundedFull
          className="size-20 bg-emerald-500"
          onPress={pressDoneHandler}
        >
          <CheckIcon size={32} className="text-background" />
        </Button>
      </View>
      <View className="flex-row gap-2">
        <Button
          size="icon"
          variant="secondary"
          roundedFull
          className="size-20"
          onPress={props.onPressCalc}
        >
          <CalculatorIcon size={32} className="text-foreground" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          roundedFull
          className="size-20"
          onPress={pressNumberHandler('0')}
        >
          <Text className="text-2xl">0</Text>
        </Button>
        <Button
          size="icon"
          variant="outline"
          roundedFull
          className="size-20"
          onPress={pressNumberHandler('000')}
        >
          <Text className="text-2xl">000</Text>
        </Button>
        <View className="size-20" />
      </View>
    </View>
  );
};
