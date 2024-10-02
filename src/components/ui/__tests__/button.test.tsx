import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

// Mocking the translate function
jest.mock('@/lib/i18n', () => ({
  translate: jest.fn((key) => {
    return `translated: ${key}`;
  }),
}));

describe('Button component ', () => {
  it('should render correctly', () => {
    render(
      <Button>
        <Text>Click Me</Text>
      </Button>
    );

    expect(screen.getByText('Click Me')).toBeOnTheScreen();
  });

  it('should be clickable', () => {
    const onPress = jest.fn();
    render(<Button onPress={onPress} testID="button" />);

    fireEvent(screen.getByTestId('button'), 'press');
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should be unclickable if disable prop true', () => {
    const onPress = jest.fn();
    render(<Button onPress={onPress} testID="button" disabled />);

    fireEvent(screen.getByTestId('button'), 'press');
    expect(onPress).not.toHaveBeenCalled();
  });

  it('should be unclickable & show loading indicator if loading prop true', () => {
    const onPress = jest.fn();
    render(<Button onPress={onPress} testID="button" loading />);

    fireEvent(screen.getByTestId('button'), 'press');

    expect(onPress).not.toHaveBeenCalled();
    expect(screen.getByTestId('button-loading-indicator')).toBeOnTheScreen();
  });
});
