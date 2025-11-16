/**
 * BlogTwin Screen Wrapper Component
 */

import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet, ViewProps, ViewStyle} from 'react-native';
import {Colors, Spacing} from '@constants';

interface ScreenProps extends ViewProps {
  children: React.ReactNode;
  scroll?: boolean;
  padding?: boolean;
  backgroundColor?: string;
}

export const Screen: React.FC<ScreenProps> = ({
  children,
  scroll = false,
  padding = true,
  backgroundColor = Colors.light.background,
  style,
  ...props
}) => {
  const containerStyle: ViewStyle[] = [
    styles.container,
    {backgroundColor},
    padding && styles.padding,
    style,
  ];

  if (scroll) {
    return (
      <SafeAreaView style={[styles.safeArea, {backgroundColor}]}>
        <ScrollView
          style={containerStyle}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          {...props}>
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor}]}>
      <SafeAreaView style={containerStyle} {...props}>
        {children}
      </SafeAreaView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  padding: {
    padding: Spacing.base,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
