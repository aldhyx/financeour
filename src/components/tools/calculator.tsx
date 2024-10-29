import React, { ReactNode, useCallback, useState } from 'react';
import { Pressable, View } from 'react-native';

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
import { cn } from '@/lib/utils';

type Props = {
  onPressDone: (result: number) => void;
  onPressNumpad: () => void;
  value?: number;
};

const mathOperators: Record<string, string> = {
  '+': '+',
  '-': '-',
  '*': '*',
  '/': '/',
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
export const Calculator = (props: Props) => {
  const defaultVal = props.value && !isNaN(props.value) ? props.value : 0;
  const [input, setInput] = useState<string>(`${defaultVal}`); // To hold the current input
  const [result, setResult] = useState<number>(defaultVal); // To hold the final result
  const { maskCurrency } = useMaskCurrency();

  // Function to handle button click for numbers and operators
  const pressNumberHandler = useCallback(
    (value: string) => () => {
      const valueIsMathOperator = mathOperators[value];
      const valueInt = parseInt(value);
      const isValZero = valueInt === 0;

      setInput((prev) => {
        const isPrevZero = prev === '0';
        // Prevent pressing multiple leading zeros
        if (isPrevZero && isValZero) return prev;
        // Prevent operator at the start of input
        if (isPrevZero && valueIsMathOperator) return prev;
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
    props?.onPressDone(result);
  };

  return (
    <View className="mx-auto w-[372px] items-center justify-center gap-2 p-4">
      <View className="w-full justify-end">
        <Text className="text-right text-3xl font-semibold">
          {maskCurrency(result)}
        </Text>
      </View>

      <View className="mb-2 w-full justify-end">
        <Text className="text-right text-xl">{input}</Text>
      </View>

      <View className="flex-row gap-2">
        <Button
          onPress={pressNumberHandler('*')}
          className="bg-foreground/15 dark:bg-foreground/25"
        >
          <XIcon size={24} className="text-foreground" />
        </Button>
        <Button
          onPress={pressNumberHandler('/')}
          className="bg-foreground/15 dark:bg-foreground/25"
        >
          <DivideIcon size={24} className="text-foreground" />
        </Button>
        <Button
          onPress={pressNumberHandler('+')}
          className="bg-foreground/15 dark:bg-foreground/25"
        >
          <PlusIcon size={24} className="text-foreground" />
        </Button>
        <Button
          onPress={pressNumberHandler('-')}
          className="bg-foreground/15 dark:bg-foreground/25"
        >
          <MinusIcon size={24} className="text-foreground" />
        </Button>
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
          className="bg-red-500 dark:bg-red-500"
          onPress={backspaceHandler}
          onLongPress={clearHandler}
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
          className="bg-red-500 dark:bg-red-500"
          onPress={clearHandler}
          onLongPress={clearHandler}
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
          className="bg-amber-500 dark:bg-amber-500"
          onPress={calculateHandler}
        >
          <EqualIcon
            size={32}
            className="text-background dark:text-foreground"
          />
        </Button>
      </View>

      <View className="flex-row gap-2">
        <Button
          onPress={props.onPressNumpad}
          className="bg-foreground/15 dark:bg-foreground/25"
        >
          <Text className="text-xl">123</Text>
        </Button>
        <Button onPress={pressNumberHandler('0')}>
          <Text className="text-2xl">0</Text>
        </Button>
        <Button onPress={pressNumberHandler('000')}>
          <Text className="text-2xl">000</Text>
        </Button>
        <Button
          className="size-20 bg-emerald-500 dark:bg-emerald-600"
          onPress={pressDoneHandler}
        >
          <CheckIcon
            size={32}
            className="text-background dark:text-foreground"
          />
        </Button>
      </View>
    </View>
  );
};
