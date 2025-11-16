/**
 * Loading Spinner Component
 * 다양한 로딩 상태를 표시하는 애니메이션 컴포넌트
 */

import React from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  Animated,
  Easing,
} from 'react-native';
import {Text} from './Text';
import {Colors, Spacing} from '@constants';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  message?: string;
  fullScreen?: boolean;
  overlay?: boolean;
  style?: ViewStyle;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = Colors.primary.main,
  message,
  fullScreen = false,
  overlay = false,
  style,
}) => {
  const spinValue = new Animated.Value(0);

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const getSize = () => {
    switch (size) {
      case 'small':
        return 24;
      case 'large':
        return 48;
      default:
        return 32;
    }
  };

  const containerStyle = [
    fullScreen ? styles.fullScreen : styles.inline,
    overlay && styles.overlay,
    style,
  ];

  return (
    <View style={containerStyle}>
      <ActivityIndicator size={size === 'small' ? 'small' : 'large'} color={color} />
      {message && (
        <Text variant="body2" color="secondary" style={styles.message}>
          {message}
        </Text>
      )}
    </View>
  );
};

/**
 * Skeleton Loader Component
 * 콘텐츠 로딩 중 스켈레톤 UI 표시
 */
interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
}) => {
  const pulseAnim = new Animated.Value(0);

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
};

/**
 * Progress Bar Component
 * 진행률을 표시하는 프로그레스 바
 */
interface ProgressBarProps {
  progress: number; // 0-100
  height?: number;
  color?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 4,
  color = Colors.primary.main,
  backgroundColor = Colors.grey[200],
  showPercentage = false,
  style,
}) => {
  const progressAnim = new Animated.Value(0);

  React.useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: Math.min(Math.max(progress, 0), 100),
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const width = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={style}>
      <View style={[styles.progressContainer, {height, backgroundColor}]}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width,
              backgroundColor: color,
            },
          ]}
        />
      </View>
      {showPercentage && (
        <Text variant="caption" color="secondary" style={styles.percentage}>
          {Math.round(progress)}%
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  inline: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  overlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  message: {
    marginTop: Spacing.sm,
  },
  skeleton: {
    backgroundColor: Colors.grey[200],
  },
  progressContainer: {
    width: '100%',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
  percentage: {
    marginTop: Spacing.xs,
    textAlign: 'right',
  },
});
