"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppHeader } from '@/components/layout/AppHeader';
import { BottomNav } from '@/components/layout/BottomNav';
import { Card } from '@/components/ui/Card';
import { type BlogPost } from '@/lib/supabase';

type FilterType = 'all' | 'draft' | 'published';

export default function MyPostsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>('all');
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    loadPosts();
  }, [filter]);

  const loadPosts = () => {
    // Mock data
    const allPosts: BlogPost[] = [
      {
        id: '1',
        user_id: 'demo',
        title: '제주도 여행 후기',
        content: '제주도 여행이 정말 좋았어요!',
        status: 'draft',
        platform: 'naver',
        category: '여행',
        tags: ['#제주도', '#여행'],
        created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        published_at: null,
      },
      {
        id: '2',
        user_id: 'demo',
        title: '맛집 리뷰: 성수동 카페',
        content: '성수동의 숨은 카페를 발견했습니다.',
        status: 'published',
        platform: 'naver',
        category: '맛집',
        tags: ['#성수동', '#카페'],
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        user_id: 'demo',
        title: 'AI가 작성한 첫 글',
        content: 'BlogTwin으로 만든 첫 글입니다',
        status: 'published',
        platform: 'naver',
        category: '일상',
        tags: ['#AI', '#블로그'],
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        published_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    const filtered = filter === 'all'
      ? allPosts
      : allPosts.filter(post => post.status === filter);

    setPosts(filtered);
  };

  const handleDelete = (id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AppHeader title="내 글" showBack />

      {/* Tab Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-14">
        <div className="flex">
          <TabButton
            active={filter === 'all'}
            onClick={() => setFilter('all')}
          >
            전체
          </TabButton>
          <TabButton
            active={filter === 'draft'}
            onClick={() => setFilter('draft')}
          >
            임시저장
          </TabButton>
          <TabButton
            active={filter === 'published'}
            onClick={() => setFilter('published')}
          >
            발행됨
          </TabButton>
        </div>
      </div>

      {/* Posts List */}
      <div className="screen-padding pt-4">
        {posts.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-500 mb-4">
              {filter === 'all' && '작성한 글이 없습니다'}
              {filter === 'draft' && '임시저장된 글이 없습니다'}
              {filter === 'published' && '발행된 글이 없습니다'}
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onClick={() => router.push(`/editor/${post.id}`)}
                onDelete={() => handleDelete(post.id)}
              />
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

// Tab Button Component
interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
        active
          ? 'border-primary-500 text-primary-600'
          : 'border-transparent text-gray-500 hover:text-gray-700'
      }`}
    >
      {children}
    </button>
  );
};

// Post Card Component
interface PostCardProps {
  post: BlogPost;
  onClick: () => void;
  onDelete: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onClick, onDelete }) => {
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return '방금 전';
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
    return `${Math.floor(diff / 86400)}일 전`;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        <div className="flex-1" onClick={onClick}>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-base font-semibold text-gray-900">
              {post.title}
            </h3>
            {post.status === 'draft' ? (
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                임시저장
              </span>
            ) : (
              <span className="text-xs px-2 py-1 bg-success-50 text-success-600 rounded">
                발행됨
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {post.content}
          </p>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>{post.category}</span>
            <span>•</span>
            <span>{getTimeAgo(post.created_at)}</span>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="text-error-500 hover:text-error-600 px-2 py-1"
        >
          🗑️
        </button>
      </div>
    </Card>
  );
};
