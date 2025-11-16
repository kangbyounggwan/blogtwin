/**
 * Toast Component
 * 간단한 알림 메시지를 표시하는 컴포넌트
 */

import React, {useEffect} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {Text} from './Text';
import {Colors, Spacing, BorderRadius} from '@constants';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onDismiss?: () => void;
  visible: boolean;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onDismiss,
  visible,
}) => {
  const translateY = new Animated.Value(-100);
  const opacity = new Animated.Value(0);

  useEffect(() => {
    if (visible) {
      // Show toast
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto dismiss
      if (duration > 0) {
        const timer = setTimeout(() => {
          handleDismiss();
        }, duration);

        return () => clearTimeout(timer);
      }
    } else {
      handleDismiss();
    }
  }, [visible]);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss?.();
    });
  };

  const getToastColor = () => {
    switch (type) {
      case 'success':
        return Colors.success.main;
      case 'error':
        return Colors.error.main;
      case 'warning':
        return Colors.warning.main;
      default:
        return Colors.info.main;
    }
  };

  const getIconText = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      default:
        return 'ℹ';
    }
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{translateY}],
          opacity,
        },
      ]}>
      <TouchableOpacity
        style={[styles.toast, {borderLeftColor: getToastColor()}]}
        onPress={handleDismiss}
        activeOpacity={0.9}>
        <View style={[styles.iconContainer, {backgroundColor: getToastColor()}]}>
          <Text style={styles.icon}>{getIconText()}</Text>
        </View>
        <Text variant="body2" style={styles.message}>
          {message}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

/**
 * Toast Manager - 전역 Toast 관리
 */
class ToastManager {
  private listeners: Set<(toast: ToastState) => void> = new Set();
  private currentToast: ToastState | null = null;

  show(message: string, type: ToastType = 'info', duration?: number) {
    const toast: ToastState = {
      message,
      type,
      duration,
      visible: true,
      id: Date.now(),
    };

    this.currentToast = toast;
    this.notifyListeners();
  }

  success(message: string, duration?: number) {
    this.show(message, 'success', duration);
  }

  error(message: string, duration?: number) {
    this.show(message, 'error', duration);
  }

  warning(message: string, duration?: number) {
    this.show(message, 'warning', duration);
  }

  info(message: string, duration?: number) {
    this.show(message, 'info', duration);
  }

  hide() {
    if (this.currentToast) {
      this.currentToast = {...this.currentToast, visible: false};
      this.notifyListeners();
    }
  }

  subscribe(listener: (toast: ToastState) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    if (this.currentToast) {
      this.listeners.forEach(listener => listener(this.currentToast!));
    }
  }

  getToast(): ToastState | null {
    return this.currentToast;
  }
}

interface ToastState {
  message: string;
  type: ToastType;
  duration?: number;
  visible: boolean;
  id: number;
}

export const toastManager = new ToastManager();

/**
 * Toast Provider - App의 최상위에 배치
 */
export const ToastProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [toast, setToast] = React.useState<ToastState | null>(null);

  useEffect(() => {
    const unsubscribe = toastManager.subscribe(setToast);
    return unsubscribe;
  }, []);

  return (
    <>
      {children}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          visible={toast.visible}
          onDismiss={() => toastManager.hide()}
        />
      )}
    </>
  );
};

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 9999,
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
  },
  toast: {
    backgroundColor: Colors.common.white,
    borderRadius: BorderRadius.md,
    borderLeftWidth: 4,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxWidth: width - Spacing.base * 2,
    minWidth: 200,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  icon: {
    color: Colors.common.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  message: {
    flex: 1,
  },
});
