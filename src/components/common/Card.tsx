/**
 * BlogTwin Card Component
 */

import React from 'react';
import {View, StyleSheet, ViewProps, ViewStyle} from 'react-native';
import {Colors, Spacing, BorderRadius, Shadows} from '@constants';

interface CardProps extends ViewProps {
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: keyof typeof Spacing;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'elevated',
  padding = 'base',
  children,
  style,
  ...props
}) => {
  const cardStyle: ViewStyle[] = [
    styles.base,
    styles[variant],
    {padding: Spacing[padding]},
    style,
  ];

  return (
    <View style={cardStyle} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.light.card,
  },
  elevated: {
    ...Shadows.md,
  },
  outlined: {
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  filled: {
    backgroundColor: Colors.light.surface,
  },
});
