/**
 * BlogTwin Text Component
 */

import React from 'react';
import {Text as RNText, TextProps as RNTextProps, StyleSheet, TextStyle} from 'react-native';
import {Typography, Colors} from '@constants';

interface TextProps extends RNTextProps {
  variant?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'body1'
    | 'body2'
    | 'subtitle1'
    | 'subtitle2'
    | 'caption'
    | 'overline'
    | 'button';
  color?: 'primary' | 'secondary' | 'disabled' | string;
  align?: 'left' | 'center' | 'right' | 'justify';
  children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({
  variant = 'body1',
  color = 'primary',
  align = 'left',
  style,
  children,
  ...props
}) => {
  const textStyle: TextStyle[] = [
    Typography[variant],
    styles[color] || {color},
    {textAlign: align},
    style,
  ];

  return (
    <RNText style={textStyle} {...props}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  primary: {
    color: Colors.light.text.primary,
  },
  secondary: {
    color: Colors.light.text.secondary,
  },
  disabled: {
    color: Colors.light.text.disabled,
  },
});
