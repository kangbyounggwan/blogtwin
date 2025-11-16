/**
 * Splash Screen
 * 앱 시작 시 표시되는 화면
 */

import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {Screen, Text} from '@components/common';
import {Colors, Spacing} from '@constants';

interface SplashScreenProps {
  onComplete?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({onComplete}) => {
  useEffect(() => {
    // 2초 후 다음 화면으로 이동
    const timer = setTimeout(() => {
      onComplete?.();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <Screen padding={false} backgroundColor={Colors.primary[500]}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text variant="h1" style={styles.title}>
            🤖
          </Text>
          <Text variant="h2" style={styles.appName}>
            BlogTwin
          </Text>
          <Text variant="subtitle1" style={styles.subtitle}>
            AI 기반 블로그 작성 도우미
          </Text>
        </View>

        <View style={styles.footer}>
          <Text variant="caption" style={styles.version}>
            v0.1.0
          </Text>
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing['2xl'],
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 80,
    marginBottom: Spacing.lg,
  },
  appName: {
    color: Colors.common.white,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    color: Colors.primary[100],
  },
  footer: {
    alignItems: 'center',
  },
  version: {
    color: Colors.primary[200],
  },
});
