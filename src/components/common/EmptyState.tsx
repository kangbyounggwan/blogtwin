/**
 * Empty State Component
 * 데이터가 없을 때 표시하는 컴포넌트
 */

import React from 'react';
import {View, StyleSheet, ViewStyle, Image, ImageSourcePropType} from 'react-native';
import {Text} from './Text';
import {Button} from './Button';
import {Colors, Spacing} from '@constants';

interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: ImageSourcePropType;
  iconText?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  icon,
  iconText = '📭',
  actionLabel,
  onAction,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {icon ? (
        <Image source={icon} style={styles.icon} resizeMode="contain" />
      ) : (
        <Text style={styles.iconText}>{iconText}</Text>
      )}

      <Text variant="h6" style={styles.title}>
        {title}
      </Text>

      {message && (
        <Text variant="body2" color="secondary" style={styles.message}>
          {message}
        </Text>
      )}

      {actionLabel && onAction && (
        <Button
          title={actionLabel}
          onPress={onAction}
          variant="primary"
          size="medium"
          style={styles.button}
        />
      )}
    </View>
  );
};

/**
 * Predefined Empty States
 */
export const EmptyStates = {
  NoPosts: () => (
    <EmptyState
      iconText="📝"
      title="작성된 글이 없습니다"
      message="새로운 글을 작성해보세요!"
    />
  ),

  NoConnection: () => (
    <EmptyState
      iconText="🔌"
      title="블로그가 연동되지 않았습니다"
      message="네이버 블로그를 연동하여 AI가 스타일을 분석할 수 있도록 해주세요."
    />
  ),

  NoResults: () => (
    <EmptyState
      iconText="🔍"
      title="검색 결과가 없습니다"
      message="다른 검색어로 시도해보세요."
    />
  ),

  NoImages: () => (
    <EmptyState
      iconText="🖼️"
      title="선택된 이미지가 없습니다"
      message="이미지를 선택하여 AI가 콘텐츠를 생성할 수 있도록 해주세요."
    />
  ),

  Error: (message?: string) => (
    <EmptyState
      iconText="⚠️"
      title="오류가 발생했습니다"
      message={message || '잠시 후 다시 시도해주세요.'}
    />
  ),

  Loading: () => (
    <EmptyState
      iconText="⏳"
      title="불러오는 중..."
      message="잠시만 기다려주세요."
    />
  ),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  icon: {
    width: 120,
    height: 120,
    marginBottom: Spacing.lg,
  },
  iconText: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  title: {
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  message: {
    marginBottom: Spacing.xl,
    textAlign: 'center',
    maxWidth: 300,
  },
  button: {
    minWidth: 150,
  },
});
