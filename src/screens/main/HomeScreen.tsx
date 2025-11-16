/**
 * Home Screen
 * 메인 대시보드 화면
 */

import React from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Screen, Text, Card, Button} from '@components/common';
import {Colors, Spacing, BorderRadius} from '@constants';
import {HomeScreenNavigationProp} from '@types/navigation';
import {useBlogStore} from '@stores/blogStore';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const {naverConnection} = useBlogStore();
  return (
    <Screen padding={false}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text variant="h3">안녕하세요! 👋</Text>
          <Text variant="body2" color="secondary">
            오늘도 멋진 글을 작성해보세요
          </Text>
        </View>

        {/* Blog Connection Status */}
        <Card variant="elevated" padding="lg" style={styles.card}>
          <View style={styles.cardHeader}>
            <Text variant="h5">연동된 블로그</Text>
            <Text variant="caption" color="secondary">
              {naverConnection.isConnected ? '1' : '0'}개 연동됨
            </Text>
          </View>
          <View style={styles.blogStatus}>
            {naverConnection.isConnected && naverConnection.profile ? (
              <>
                <View style={styles.connectedBlog}>
                  <View style={[styles.blogBadge, {backgroundColor: Colors.naver}]}>
                    <Text variant="caption" style={styles.blogBadgeText}>
                      N
                    </Text>
                  </View>
                  <View>
                    <Text variant="subtitle1">네이버 블로그</Text>
                    <Text variant="caption" color="secondary">
                      {naverConnection.profile.nickname}
                    </Text>
                  </View>
                </View>
                <Button
                  title="연동 관리"
                  variant="outline"
                  size="small"
                  onPress={() => navigation.navigate('BlogConnection')}
                  style={styles.connectButton}
                />
              </>
            ) : (
              <>
                <Text variant="body2" color="secondary" align="center">
                  아직 연동된 블로그가 없습니다
                </Text>
                <Button
                  title="블로그 연동하기"
                  variant="outline"
                  size="small"
                  onPress={() => navigation.navigate('BlogConnection')}
                  style={styles.connectButton}
                />
              </>
            )}
          </View>
        </Card>

        {/* AI Analysis Status */}
        <Card variant="elevated" padding="lg" style={styles.card}>
          <View style={styles.cardHeader}>
            <Text variant="h5">📊 AI 스타일 분석</Text>
          </View>
          <View style={styles.analysisPlaceholder}>
            <Text variant="caption" color="secondary" align="center">
              {naverConnection.isConnected
                ? 'AI가 당신의 글쓰기 스타일을 분석합니다'
                : '블로그를 연동하면\nAI가 당신의 스타일을 분석합니다'}
            </Text>
            {naverConnection.isConnected && (
              <Button
                title="스타일 분석하기"
                variant="primary"
                size="small"
                onPress={() => navigation.navigate('StyleAnalysis')}
                style={styles.analysisButton}
              />
            )}
          </View>
        </Card>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text variant="h5" style={styles.sectionTitle}>
            빠른 시작
          </Text>
          <View style={styles.actionButtons}>
            <ActionCard
              emoji="✍️"
              title="카테고리별 글 작성"
              description="주제를 입력하고 글 작성"
              onPress={() => navigation.navigate('CategoryPost')}
            />
            <ActionCard
              emoji="📸"
              title="사진으로 포스팅"
              description="사진만으로 글 작성"
              onPress={() => navigation.navigate('PhotoPost')}
            />
          </View>
        </View>

        {/* Recent Posts */}
        <View style={styles.recentPosts}>
          <Text variant="h5" style={styles.sectionTitle}>
            최근 작성 글
          </Text>
          <Card variant="outlined" padding="lg">
            <Text variant="body2" color="secondary" align="center">
              작성한 글이 없습니다
            </Text>
          </Card>
        </View>
      </ScrollView>
    </Screen>
  );
};

const ActionCard: React.FC<{
  emoji: string;
  title: string;
  description: string;
  onPress: () => void;
}> = ({emoji, title, description, onPress}) => (
  <Card variant="outlined" padding="base" style={styles.actionCard}>
    <Text variant="h2" align="center" style={styles.actionEmoji}>
      {emoji}
    </Text>
    <Text variant="subtitle1" align="center" style={styles.actionTitle}>
      {title}
    </Text>
    <Text variant="caption" color="secondary" align="center">
      {description}
    </Text>
    <Button
      title="시작하기"
      variant="primary"
      size="small"
      fullWidth
      onPress={onPress}
      style={styles.actionButton}
    />
  </Card>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.base,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  card: {
    marginBottom: Spacing.base,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  blogStatus: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  connectedBlog: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
    marginBottom: Spacing.base,
  },
  blogBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blogBadgeText: {
    color: Colors.common.white,
    fontWeight: 'bold',
  },
  connectButton: {
    marginTop: Spacing.base,
  },
  analysisPlaceholder: {
    paddingVertical: Spacing['2xl'],
    alignItems: 'center',
  },
  analysisButton: {
    marginTop: Spacing.base,
  },
  quickActions: {
    marginBottom: Spacing.base,
  },
  sectionTitle: {
    marginBottom: Spacing.base,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.base,
  },
  actionCard: {
    flex: 1,
    alignItems: 'center',
  },
  actionEmoji: {
    marginBottom: Spacing.sm,
  },
  actionTitle: {
    marginBottom: Spacing.xs,
  },
  actionButton: {
    marginTop: Spacing.base,
  },
  recentPosts: {
    marginBottom: Spacing.xl,
  },
});
