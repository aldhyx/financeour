import { render, screen } from '@testing-library/react-native';
import React from 'react';

import { Text, TextClassContext } from '@/components/ui/text';

describe('Text component ', () => {
  const defaultTextClassName = 'text-base text-foreground';

  it('should render correctly ', () => {
    render(<Text>Default Text</Text>);
    const textElement = screen.getByText('Default Text');

    expect(textElement).toBeOnTheScreen();
    expect(textElement.type).toBe('Text');
  });

  it('should render correctly when asChild is true', () => {
    render(
      <Text asChild className="parent-class">
        <Text className="child-class">Child Text</Text>
      </Text>
    );

    const textElement = screen.getByText('Child Text');
    expect(textElement).toBeOnTheScreen();
    // The element should have combined class names
    expect(textElement.props.className).toContain(
      `${defaultTextClassName} parent-class child-class`
    );
  });

  it('should applies the correct class names from the text context', () => {
    render(
      <TextClassContext.Provider value="context-class">
        <Text className="custom-class">Styled Text</Text>
      </TextClassContext.Provider>
    );

    const textElement = screen.getByText('Styled Text');
    expect(textElement).toBeOnTheScreen();
    // The element should have combined class names
    expect(textElement.props.className).toContain(
      `${defaultTextClassName} context-class custom-class`
    );
  });

  it('renders children when tx prop is not provided', () => {
    render(<Text>Plain Text</Text>);

    const textElement = screen.getByText('Plain Text');
    expect(textElement).toBeOnTheScreen();
  });
});
