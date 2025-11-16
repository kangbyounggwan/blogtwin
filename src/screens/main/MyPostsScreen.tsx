/**
 * My Posts Screen
 * 내가 작성한 글 목록 및 관리 화면
 */

import React, {useState} from 'react';
import {StyleSheet, View, FlatList} from 'react-native';
import {Screen, Text, Card, Button} from '@components/common';
import {Colors, Spacing} from '@constants';

type PostStatus = 'all' | 'draft' | 'published';

interface Post {
  id: string;
  title: string;
  preview: string;
  status: 'draft' | 'published';
  createdAt: string;
  platform?: 'tistory' | 'naver';
}

// Placeholder data
const PLACEHOLDER_POSTS: Post[] = [];

export const MyPostsScreen: React.FC = () => {
  const [filter, setFilter] = useState<PostStatus>('all');

  const filteredPosts = PLACEHOLDER_POSTS.filter(post => {
    if (filter === 'all') return true;
    return post.status === filter;
  });

  const renderPost = ({item}: {item: Post}) => (
    <Card variant="outlined" padding="base" style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.postStatus}>
          <View
            style={[
              styles.statusBadge,
              item.status === 'published'
                ? styles.statusPublished
                : styles.statusDraft,
            ]}>
            <Text variant="caption" style={styles.statusText}>
              {item.status === 'published' ? '발행됨' : '임시저장'}
            </Text>
          </View>
          {item.platform && (
            <Text variant="caption" color="secondary">
              {item.platform === 'tistory' ? '티스토리' : '네이버'}
            </Text>
          )}
        </View>
        <Text variant="caption" color="secondary">
          {item.createdAt}
        </Text>
      </View>
      <Text variant="h6" style={styles.postTitle}>
        {item.title}
      </Text>
      <Text variant="body2" color="secondary" numberOfLines={2} style={styles.postPreview}>
        {item.preview}
      </Text>
      <View style={styles.postActions}>
        <Button
          title="수정"
          variant="outline"
          size="small"
          onPress={() => console.log('Edit', item.id)}
          style={styles.actionButton}
        />
        <Button
          title={item.status === 'published' ? '보기' : '발행'}
          variant="primary"
          size="small"
          onPress={() => console.log('Publish/View', item.id)}
          style={styles.actionButton}
        />
      </View>
    </Card>
  );

  return (
    <Screen padding={false}>
      <View style={styles.container}>
        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <FilterButton
            title="전체"
            active={filter === 'all'}
            onPress={() => setFilter('all')}
          />
          <FilterButton
            title="임시저장"
            active={filter === 'draft'}
            onPress={() => setFilter('draft')}
          />
          <FilterButton
            title="발행됨"
            active={filter === 'published'}
            onPress={() => setFilter('published')}
          />
        </View>

        {/* Posts List */}
        {filteredPosts.length > 0 ? (
          <FlatList
            data={filteredPosts}
            renderItem={renderPost}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text variant="h2" align="center" style={styles.emptyEmoji}>
              📝
            </Text>
            <Text variant="h5" align="center" style={styles.emptyTitle}>
              작성한 글이 없습니다
            </Text>
            <Text variant="body2" color="secondary" align="center" style={styles.emptyDescription}>
              새로운 글을 작성해보세요
            </Text>
            <Button
              title="글 작성하기"
              variant="primary"
              size="medium"
              onPress={() => console.log('Navigate to CreatePost')}
              style={styles.createButton}
            />
          </View>
        )}
      </View>
    </Screen>
  );
};

const FilterButton: React.FC<{
  title: string;
  active: boolean;
  onPress: () => void;
}> = ({title, active, onPress}) => (
  <Button
    title={title}
    variant={active ? 'primary' : 'ghost'}
    size="small"
    onPress={onPress}
    style={styles.filterButton}
  />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
    backgroundColor: Colors.common.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  filterButton: {
    flex: 1,
  },
  listContent: {
    padding: Spacing.base,
  },
  postCard: {
    marginBottom: Spacing.base,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  postStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusPublished: {
    backgroundColor: Colors.success[50],
  },
  statusDraft: {
    backgroundColor: Colors.gray[100],
  },
  statusText: {
    fontSize: 11,
  },
  postTitle: {
    marginBottom: Spacing.xs,
  },
  postPreview: {
    marginBottom: Spacing.base,
    lineHeight: 20,
  },
  postActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing['2xl'],
  },
  emptyEmoji: {
    fontSize: 80,
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    marginBottom: Spacing.sm,
  },
  emptyDescription: {
    marginBottom: Spacing.xl,
  },
  createButton: {
    minWidth: 160,
  },
});
