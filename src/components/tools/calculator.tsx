import React, { useCallback, useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import {
  CheckIcon,
  DeleteIcon,
  DivideIcon,
  EqualIcon,
  MinusIcon,
  PlusIcon,
  XIcon,
} from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useMaskCurrency } from '@/hooks/use-mask-currency';

type Props = {
  onPressDone: (result: number) => void;
  onPressNumpad: () => void;
  amount?: number;
};

const mathOperators: Record<string, string> = {
  '+': '+',
  '-': '-',
  '*': '*',
  '/': '/',
};

// eslint-disable-next-line max-lines-per-function
export const Calculator = (props: Props) => {
  const [input, setInput] = useState(props.amount ? `${props.amount}` : '0'); // To hold the current input
  const [result, setResult] = useState<number>(props.amount ?? 0); // To hold the final result
  const { maskCurrency } = useMaskCurrency();

  // Function to handle button click for numbers and operators
  const pressNumberHandler = useCallback(
    (value?: string) => () => {
      if (value === undefined) return;

      const valueIsMathOperator = mathOperators[value];
      const isValueZero = value === '0';

      setInput((prev) => {
        const isPrevZero = prev === '0';
        const isValueTripleZero = value === '000';

        // Prevent pressing multiple leading zeros
        if (isPrevZero && (isValueZero || isValueTripleZero)) return '0';
        // Prevent operator at the start of input
        if (isPrevZero && valueIsMathOperator) return '0';
        // Replace the leading zero with the next valid value
        if (isPrevZero && !valueIsMathOperator) return value;

        const lastIndex = prev.length - 1;
        const lastChar = prev[lastIndex];

        const lastCharIsOperator = mathOperators[lastChar];
        // Prevent multiple consecutive operators, replace the last operator if needed
        if (lastCharIsOperator && valueIsMathOperator) {
          return prev.slice(0, lastIndex) + value;
        }

        return prev + value;
      });
    },
    []
  );

  // Function to handle calculation when "=" is pressed
  const calculateHandler = () => {
    if (!input.trim()) return;

    let evalInput = input;
    const lastIndex = input.length - 1;
    const lastChar = input[lastIndex];

    const lastCharIsMathOperator = mathOperators[lastChar];
    if (lastCharIsMathOperator) evalInput = evalInput.slice(0, lastIndex);

    try {
      const evalResult = eval(evalInput); // Use eval carefully to calculateHandler the result
      if (typeof evalResult === 'number' && !isNaN(evalResult)) {
        setResult(evalResult);
      }
    } catch (_error) {
      //TODO
    }
  };
  // Function to clear input and result
  const clearHandler = () => {
    setInput('0');
    setResult(0);
  };

  // Function to handle backspace (deletes the last character)
  const backspaceHandler = () =>
    setInput((prevInput) => prevInput.slice(0, -1) || '0');

  const pressDoneHandler = async () => {
    props.onPressDone(result);
  };

  return (
    <View className="mx-auto w-[372px] items-center justify-center gap-2 p-4">
      <View className="w-full justify-end">
        <Text className="text-right text-3xl font-semibold">
          {maskCurrency(result).masked}
        </Text>
      </View>

      <View className="mb-2 w-full justify-end">
        <Text className="text-right text-xl">{input}</Text>
      </View>

      <View className="flex-row gap-2">
        <Button
          size="icon"
          variant="secondary"
          roundedFull
          className="size-20"
          onPress={pressNumberHandler('*')}
        >
          <XIcon size={24} className="text-foreground" />
        </Button>

        <Button
          size="icon"
          variant="secondary"
          roundedFull
          className="size-20"
          onPress={pressNumberHandler('/')}
        >
          <DivideIcon size={24} className="text-foreground" />
        </Button>

        <Button
          size="icon"
          variant="secondary"
          roundedFull
          className="size-20"
          onPress={pressNumberHandler('+')}
        >
          <PlusIcon size={24} className="text-foreground" />
        </Button>

        <Button
          size="icon"
          variant="secondary"
          roundedFull
          className="size-20"
          onPress={pressNumberHandler('-')}
        >
          <MinusIcon size={24} className="text-foreground" />
        </Button>
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
          onLongPress={clearHandler}
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
          onLongPress={clearHandler}
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
          className="size-20 bg-amber-500"
          onPress={calculateHandler}
        >
          <EqualIcon size={32} className="text-background" />
        </Button>
      </View>

      <View className="flex-row gap-2">
        <Button
          size="icon"
          variant="secondary"
          roundedFull
          className="size-20"
          onPress={props.onPressNumpad}
        >
          <Text className="text-xl">123</Text>
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
        <Button
          size="icon"
          roundedFull
          className="size-20 bg-emerald-500"
          onPress={pressDoneHandler}
        >
          <CheckIcon size={32} className="text-background" />
        </Button>
      </View>
    </View>
  );
};
