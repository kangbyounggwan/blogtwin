"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppHeader } from '@/components/layout/AppHeader';
import { BottomNav } from '@/components/layout/BottomNav';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingOverlay } from '@/components/ui/LoadingSpinner';
import { supabase, isSupabaseConfigured, type BlogPost } from '@/lib/supabase';
import { blogPostService } from '@/lib/supabase-service';

interface BlogInfo {
  platform: string;
  analyzedPostCount: number;
  lastSyncAt: Date | null;
}

// Temporary user ID (in real app, get from session)
const TEMP_USER_ID = 'temp-user-id';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [blogInfo, setBlogInfo] = useState<BlogInfo | null>(null);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    initializePage();
  }, []);

  const initializePage = async () => {
    setLoading(true);

    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    // Load real data from Supabase
    await loadRealData();
    setLoading(false);
  };

  const loadRealData = async () => {
    // In real app, get user_id from session
    const userId = TEMP_USER_ID;

    // Fetch recent posts
    const posts = await blogPostService.getUserPosts(userId);
    setRecentPosts(posts.slice(0, 3)); // Show only 3 most recent

    // Check if blog is connected (has posts)
    setIsConnected(posts.length > 0);

    if (posts.length > 0) {
      setBlogInfo({
        platform: 'naver',
        analyzedPostCount: posts.length,
        lastSyncAt: new Date(),
      });
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    await loadRealData();
    setTimeout(() => {
      setSyncing(false);
    }, 2000);
  };

  const handleConnectBlog = () => {
    router.push('/blog-connect');
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
          <div className="mb-4 p-3 bg-error-50 border border-error-200 rounded-md">
            <p className="text-sm text-error-700 font-semibold">
              ⚠️ Supabase가 설정되지 않았습니다
            </p>
            <p className="text-xs text-error-600 mt-1">
              SUPABASE_INTEGRATION_GUIDE.md를 참고하여 환경 변수를 설정하세요.
            </p>
          </div>
        )}

        {/* Blog Info Card */}
        <Card variant="elevated" className="mb-6">
          {isConnected ? (
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
          ) : (
            <div className="text-center py-4">
              <div className="text-4xl mb-3">🔗</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                블로그를 연동해주세요
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                네이버 블로그를 연동하면<br />
                AI가 당신의 스타일을 학습합니다
              </p>
              <Button
                variant="primary"
                size="medium"
                onClick={handleConnectBlog}
              >
                블로그 연동하기
              </Button>
            </div>
          )}
        </Card>

        {/* Action Cards */}
        <div className="grid gap-4 mb-6">
          <Card
            onClick={() => router.push('/create/category')}
            variant="elevated"
            className="cursor-pointer hover:shadow-xl transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl">✍️</div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900 mb-1">카테고리별 글 작성</h3>
                <p className="text-sm text-gray-600 mb-3">주제를 입력하고 AI가 글을 작성합니다</p>

                {/* Examples */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-2 py-1 bg-primary-50 text-primary-600 rounded-full">
                    여행 후기
                  </span>
                  <span className="text-xs px-2 py-1 bg-primary-50 text-primary-600 rounded-full">
                    맛집 리뷰
                  </span>
                  <span className="text-xs px-2 py-1 bg-primary-50 text-primary-600 rounded-full">
                    일상 이야기
                  </span>
                  <span className="text-xs px-2 py-1 bg-primary-50 text-primary-600 rounded-full">
                    제품 리뷰
                  </span>
                </div>
              </div>
              <div className="text-gray-400 text-xl">→</div>
            </div>
          </Card>

          <Card
            onClick={() => router.push('/create/photo')}
            variant="elevated"
            className="cursor-pointer hover:shadow-xl transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl">📸</div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900 mb-1">사진으로 포스팅</h3>
                <p className="text-sm text-gray-600 mb-3">사진만 올리면 자동으로 글이 작성됩니다</p>

                {/* Examples */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-2 py-1 bg-success-50 text-success-600 rounded-full">
                    카페 사진
                  </span>
                  <span className="text-xs px-2 py-1 bg-success-50 text-success-600 rounded-full">
                    음식 사진
                  </span>
                  <span className="text-xs px-2 py-1 bg-success-50 text-success-600 rounded-full">
                    여행 사진
                  </span>
                  <span className="text-xs px-2 py-1 bg-success-50 text-success-600 rounded-full">
                    제품 사진
                  </span>
                </div>
              </div>
              <div className="text-gray-400 text-xl">→</div>
            </div>
          </Card>
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
