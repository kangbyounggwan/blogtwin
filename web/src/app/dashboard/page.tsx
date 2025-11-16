"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppHeader } from '@/components/layout/AppHeader';
import { BottomNav } from '@/components/layout/BottomNav';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingOverlay } from '@/components/ui/LoadingSpinner';
import { supabase, isSupabaseConfigured, type BlogPost } from '@/lib/supabase';

interface BlogInfo {
  platform: string;
  analyzedPostCount: number;
  lastSyncAt: Date | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [blogInfo, setBlogInfo] = useState<BlogInfo | null>(null);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    initializePage();
  }, []);

  const initializePage = async () => {
    // Always use mock data for demo
    loadMockData();
  };

  const loadMockData = () => {
    setLoading(false);
    setBlogInfo({
      platform: 'naver',
      analyzedPostCount: 28,
      lastSyncAt: new Date(),
    });
    setRecentPosts([
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
    ]);
  };

  const handleSync = async () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      loadMockData();
    }, 2000);
  };

  if (loading) {
    return <LoadingOverlay message="로딩 중..." />;
  }

  return (
    <div className="min-h-screen pb-20">
      <AppHeader
        title="BlogTwin"
        showMenu
        showNotifications
        showSettings
      />

      <div className="screen-padding">
        {/* Supabase Warning */}
        {!isSupabaseConfigured() && (
          <div className="mb-4 p-3 bg-warning-50 border border-warning-200 rounded-md">
            <p className="text-sm text-warning-700">
              ⚠️ 데모 모드로 실행 중입니다. 실제 데이터를 사용하려면 환경 변수를 설정하세요.
            </p>
          </div>
        )}

        {/* Blog Info Card */}
        <Card variant="elevated" className="mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">
                연동된 블로그: <span className="font-semibold text-gray-900">
                  {blogInfo?.platform === 'naver' ? '네이버 블로그' : '티스토리'}
                </span>
              </p>
              <p className="text-sm text-gray-600 mb-1">
                📊 분석된 글: <span className="font-semibold">{blogInfo?.analyzedPostCount}개</span>
              </p>
              <p className="text-sm text-gray-600">
                🕐 마지막 동기화: <span className="font-semibold">
                  {blogInfo?.lastSyncAt ? '방금 전' : '-'}
                </span>
              </p>
            </div>
            <button
              onClick={handleSync}
              disabled={syncing}
              className="text-2xl hover:scale-110 active:scale-95 transition-transform disabled:opacity-50"
            >
              {syncing ? (
                <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                '🔄'
              )}
            </button>
          </div>
        </Card>

        {/* Action Cards */}
        <div className="grid gap-4 mb-6">
          <ActionCard
            icon="✍️"
            title="카테고리별 글 작성"
            subtitle="주제를 입력하고 AI가 글을 작성합니다"
            onClick={() => router.push('/create/category')}
          />
          <ActionCard
            icon="📸"
            title="사진으로 포스팅"
            subtitle="사진만 올리면 자동으로 글이 작성됩니다"
            onClick={() => router.push('/create/photo')}
          />
        </div>

        {/* Recent Posts */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900">최근 작성 글</h2>
            <button
              onClick={() => router.push('/posts')}
              className="text-sm text-primary-500 hover:underline"
            >
              전체보기
            </button>
          </div>

          {recentPosts.length === 0 ? (
            <Card className="text-center py-8">
              <p className="text-gray-500 mb-4">아직 작성한 글이 없습니다</p>
              <Button
                variant="outline"
                size="small"
                onClick={() => router.push('/create/category')}
              >
                첫 글 작성하기
              </Button>
            </Card>
          ) : (
            <div className="space-y-2">
              {recentPosts.map((post) => (
                <PostListItem
                  key={post.id}
                  post={post}
                  onClick={() => router.push(`/editor/${post.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

// Action Card Component
interface ActionCardProps {
  icon: string;
  title: string;
  subtitle: string;
  onClick: () => void;
}

const ActionCard: React.FC<ActionCardProps> = ({ icon, title, subtitle, onClick }) => {
  return (
    <Card onClick={onClick} variant="elevated">
      <div className="flex items-center gap-4">
        <div className="text-4xl">{icon}</div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{subtitle}</p>
        </div>
        <div className="text-gray-400 text-xl">→</div>
      </div>
    </Card>
  );
};

// Post List Item Component
interface PostListItemProps {
  post: BlogPost;
  onClick: () => void;
}

const PostListItem: React.FC<PostListItemProps> = ({ post, onClick }) => {
  const getStatusBadge = (status: string) => {
    if (status === 'draft') {
      return <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">임시저장</span>;
    }
    return <span className="text-xs px-2 py-1 bg-success-50 text-success-600 rounded">✅ 발행</span>;
  };

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
    <div
      onClick={onClick}
      className="list-item cursor-pointer"
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-base font-medium text-gray-900 line-clamp-1">
            {post.title}
          </h3>
          {getStatusBadge(post.status)}
        </div>
        <p className="text-sm text-gray-500">{getTimeAgo(post.created_at)}</p>
      </div>
      <div className="text-gray-400">→</div>
    </div>
  );
};
