/**
 * Animated Touchable Component
 * 마이크로 인터랙션을 지원하는 터치 가능한 컴포넌트
 */

import React, {useRef} from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  Animated,
  ViewStyle,
} from 'react-native';

interface AnimatedTouchableProps extends TouchableOpacityProps {
  scaleValue?: number;
  children: React.ReactNode;
  style?: ViewStyle;
}

export const AnimatedTouchable: React.FC<AnimatedTouchableProps> = ({
  scaleValue = 0.95,
  children,
  style,
  onPressIn,
  onPressOut,
  ...props
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = (event: any) => {
    Animated.spring(scaleAnim, {
      toValue: scaleValue,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
    onPressIn?.(event);
  };

  const handlePressOut = (event: any) => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
    onPressOut?.(event);
  };

  return (
    <TouchableOpacity
      {...props}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}>
      <Animated.View style={[style, {transform: [{scale: scaleAnim}]}]}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

/**
 * Fade In View - 페이드 인 애니메이션
 */
interface FadeInViewProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  style?: ViewStyle;
}

export const FadeInView: React.FC<FadeInViewProps> = ({
  children,
  duration = 500,
  delay = 0,
  style,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }).start();
    }, delay);
  }, []);

  return (
    <Animated.View style={[style, {opacity: fadeAnim}]}>
      {children}
    </Animated.View>
  );
};

/**
 * Slide In View - 슬라이드 인 애니메이션
 */
interface SlideInViewProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'top' | 'bottom';
  duration?: number;
  delay?: number;
  distance?: number;
  style?: ViewStyle;
}

export const SlideInView: React.FC<SlideInViewProps> = ({
  children,
  direction = 'bottom',
  duration = 500,
  delay = 0,
  distance = 50,
  style,
}) => {
  const slideAnim = useRef(new Animated.Value(distance)).current;

  React.useEffect(() => {
    setTimeout(() => {
      Animated.spring(slideAnim, {
        toValue: 0,
        duration,
        useNativeDriver: true,
        bounciness: 8,
      }).start();
    }, delay);
  }, []);

  const getTransform = () => {
    switch (direction) {
      case 'left':
        return [{translateX: slideAnim.interpolate({
          inputRange: [0, distance],
          outputRange: [0, -distance],
        })}];
      case 'right':
        return [{translateX: slideAnim}];
      case 'top':
        return [{translateY: slideAnim.interpolate({
          inputRange: [0, distance],
          outputRange: [0, -distance],
        })}];
      case 'bottom':
      default:
        return [{translateY: slideAnim}];
    }
  };

  return (
    <Animated.View style={[style, {transform: getTransform()}]}>
      {children}
    </Animated.View>
  );
};

/**
 * Pulse Animation - 펄스 애니메이션 (알림, 주목 등에 사용)
 */
interface PulseViewProps {
  children: React.ReactNode;
  minScale?: number;
  maxScale?: number;
  duration?: number;
  style?: ViewStyle;
}

export const PulseView: React.FC<PulseViewProps> = ({
  children,
  minScale = 0.95,
  maxScale = 1.05,
  duration = 1000,
  style,
}) => {
  const pulseAnim = useRef(new Animated.Value(minScale)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: maxScale,
          duration: duration / 2,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: minScale,
          duration: duration / 2,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[style, {transform: [{scale: pulseAnim}]}]}>
      {children}
    </Animated.View>
  );
};

/**
 * Shake Animation - 흔들기 애니메이션 (에러 표시 등)
 */
interface ShakeViewProps {
  children: React.ReactNode;
  trigger: boolean;
  style?: ViewStyle;
}

export const ShakeView: React.FC<ShakeViewProps> = ({
  children,
  trigger,
  style,
}) => {
  const shakeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (trigger) {
      Animated.sequence([
        Animated.timing(shakeAnim, {toValue: 10, duration: 50, useNativeDriver: true}),
        Animated.timing(shakeAnim, {toValue: -10, duration: 50, useNativeDriver: true}),
        Animated.timing(shakeAnim, {toValue: 10, duration: 50, useNativeDriver: true}),
        Animated.timing(shakeAnim, {toValue: 0, duration: 50, useNativeDriver: true}),
      ]).start();
    }
  }, [trigger]);

  return (
    <Animated.View style={[style, {transform: [{translateX: shakeAnim}]}]}>
      {children}
    </Animated.View>
  );
};
