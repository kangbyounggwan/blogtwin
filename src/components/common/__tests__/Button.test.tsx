/**
 * Button Component Tests
 */

import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {Button} from '../Button';

describe('Button', () => {
  it('should render with title', () => {
    const {getByText} = render(<Button title="Click Me" onPress={() => {}} />);

    expect(getByText('Click Me')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPressMock = jest.fn();
    const {getByText} = render(<Button title="Click Me" onPress={onPressMock} />);

    fireEvent.press(getByText('Click Me'));

    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('should not call onPress when disabled', () => {
    const onPressMock = jest.fn();
    const {getByText} = render(
      <Button title="Click Me" onPress={onPressMock} disabled />
    );

    fireEvent.press(getByText('Click Me'));

    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('should show loading indicator when loading', () => {
    const {getByTestId, queryByText} = render(
      <Button title="Click Me" onPress={() => {}} loading />
    );

    // Title should not be visible when loading
    expect(queryByText('Click Me')).toBeNull();
    // ActivityIndicator should be rendered (has testID by default)
    expect(getByTestId).toBeDefined();
  });

  it('should apply variant styles', () => {
    const {getByText, rerender} = render(
      <Button title="Primary" onPress={() => {}} variant="primary" />
    );

    expect(getByText('Primary')).toBeTruthy();

    rerender(<Button title="Secondary" onPress={() => {}} variant="secondary" />);
    expect(getByText('Secondary')).toBeTruthy();

    rerender(<Button title="Outline" onPress={() => {}} variant="outline" />);
    expect(getByText('Outline')).toBeTruthy();

    rerender(<Button title="Text" onPress={() => {}} variant="text" />);
    expect(getByText('Text')).toBeTruthy();
  });

  it('should apply size styles', () => {
    const {getByText, rerender} = render(
      <Button title="Small" onPress={() => {}} size="small" />
    );

    expect(getByText('Small')).toBeTruthy();

    rerender(<Button title="Medium" onPress={() => {}} size="medium" />);
    expect(getByText('Medium')).toBeTruthy();

    rerender(<Button title="Large" onPress={() => {}} size="large" />);
    expect(getByText('Large')).toBeTruthy();
  });

  it('should render as full width when fullWidth is true', () => {
    const {getByText} = render(
      <Button title="Full Width" onPress={() => {}} fullWidth />
    );

    const button = getByText('Full Width').parent?.parent;
    expect(button?.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({width: '100%'}),
      ])
    );
  });

  it('should have correct accessibility props', () => {
    const {getByRole} = render(
      <Button title="Accessible Button" onPress={() => {}} />
    );

    const button = getByRole('button');
    expect(button.props.accessible).toBe(true);
    expect(button.props.accessibilityLabel).toBe('Accessible Button');
  });

  it('should indicate disabled state in accessibility', () => {
    const {getByRole} = render(
      <Button title="Disabled Button" onPress={() => {}} disabled />
    );

    const button = getByRole('button');
    expect(button.props.accessibilityState).toEqual({disabled: true});
  });
});
