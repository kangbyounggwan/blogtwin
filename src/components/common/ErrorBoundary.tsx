/**
 * Error Boundary Component
 * React 에러를 잡아서 처리하는 컴포넌트
 */

import React, {Component, ReactNode} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from './Text';
import {Button} from './Button';
import {Colors, Spacing} from '@constants';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);

    // TODO: Send to error tracking service (Sentry, etc.)
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Text variant="h5" style={styles.title}>
              앗! 문제가 발생했습니다
            </Text>
            <Text variant="body1" color="secondary" style={styles.message}>
              예상치 못한 오류가 발생했습니다.{'\n'}
              잠시 후 다시 시도해주세요.
            </Text>

            {__DEV__ && this.state.error && (
              <View style={styles.errorDetails}>
                <Text variant="caption" color="error">
                  {this.state.error.toString()}
                </Text>
              </View>
            )}

            <Button
              title="다시 시도"
              onPress={this.handleReset}
              variant="primary"
              size="medium"
              style={styles.button}
            />
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.common.white,
    padding: Spacing.xl,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
  },
  title: {
    marginBottom: Spacing.base,
    textAlign: 'center',
  },
  message: {
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },
  errorDetails: {
    backgroundColor: Colors.error[50],
    padding: Spacing.base,
    borderRadius: 8,
    marginBottom: Spacing.lg,
    width: '100%',
  },
  button: {
    minWidth: 150,
  },
});
