"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppHeader } from '@/components/layout/AppHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingOverlay } from '@/components/ui/LoadingSpinner';

type Platform = 'naver' | 'tistory' | null;

interface FetchProgress {
  current: number;
  total: number;
  percentage: number;
}

export default function BlogConnectPage() {
  const router = useRouter();
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>(null);
  const [connecting, setConnecting] = useState(false);
  const [fetchingPosts, setFetchingPosts] = useState(false);
  const [fetchProgress, setFetchProgress] = useState<FetchProgress>({
    current: 0,
    total: 0,
    percentage: 0,
  });
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async (platform: Platform) => {
    try {
      setSelectedPlatform(platform);
      setConnecting(true);
      setError(null);

      // TODO: Implement OAuth flow for the selected platform
      if (platform === 'naver') {
        // Naver blog OAuth (different from Naver login)
        // This would open OAuth popup
        await connectNaverBlog();
      } else if (platform === 'tistory') {
        await connectTistory();
      }
    } catch (err: any) {
      console.error('Connection error:', err);
      setError(err.message || '연동 중 오류가 발생했습니다');
      setConnecting(false);
    }
  };

  const connectNaverBlog = async () => {
    // Simulate OAuth flow
    setTimeout(async () => {
      setConnecting(false);
      await fetchBlogPosts('naver');
    }, 1500);
  };

  const connectTistory = async () => {
    // Simulate OAuth flow
    const clientId = process.env.NEXT_PUBLIC_TISTORY_CLIENT_ID;
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/tistory/callback`);

    // Open Tistory OAuth
    window.location.href = `https://www.tistory.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
  };

  const fetchBlogPosts = async (platform: string) => {
    try {
      setFetchingPosts(true);

      // Simulate fetching posts with progress
      const totalPosts = 28; // Mock data
      for (let i = 0; i <= totalPosts; i++) {
        await new Promise(resolve => setTimeout(resolve, 50));
        setFetchProgress({
          current: i,
          total: totalPosts,
          percentage: Math.floor((i / totalPosts) * 100),
        });
      }

      setFetchingPosts(false);
      await analyzeStyle();
    } catch (err: any) {
      console.error('Fetch posts error:', err);
      setError(err.message || '글을 불러오는 중 오류가 발생했습니다');
      setFetchingPosts(false);
    }
  };

  const analyzeStyle = async () => {
    try {
      setAnalyzing(true);

      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 3000));

      setAnalyzing(false);

      // Success - go to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || '분석 중 오류가 발생했습니다');
      setAnalyzing(false);
    }
  };

  const handleSkip = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="블로그 연동" showBack />

      <div className="screen-padding">
        {!connecting && !fetchingPosts && !analyzing && (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                블로그를 연동해주세요
              </h1>
              <p className="text-gray-600">
                AI가 당신의 글쓰기 스타일을 학습합니다
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <PlatformCard
                platform="tistory"
                name="티스토리"
                icon="🅣"
                color="bg-[#FF6B00]"
                onClick={() => handleConnect('tistory')}
              />

              <PlatformCard
                platform="naver"
                name="네이버 블로그"
                icon="N"
                color="bg-[#03C75A]"
                onClick={() => handleConnect('naver')}
              />
            </div>

            {error && (
              <div className="mb-4 p-4 bg-error-50 border border-error-200 rounded-md">
                <p className="text-sm text-error-700">{error}</p>
              </div>
            )}

            <button
              onClick={handleSkip}
              className="w-full text-center text-gray-500 hover:text-gray-700 py-2"
            >
              나중에 하기
            </button>
          </>
        )}

        {fetchingPosts && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📚</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              글을 불러오는 중...
            </h2>
            <p className="text-gray-600 mb-6">
              {fetchProgress.current} / {fetchProgress.total}개
            </p>

            <div className="max-w-md mx-auto">
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${fetchProgress.percentage}%` }}
                />
              </div>
              <p className="text-sm text-gray-500">{fetchProgress.percentage}%</p>
            </div>
          </div>
        )}

        {analyzing && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4 animate-bounce">🤖</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              AI가 스타일을 분석하고 있습니다
            </h2>
            <p className="text-gray-600 mb-6">
              잠시만 기다려주세요...
            </p>

            <div className="flex justify-center">
              <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
        )}
      </div>

      {connecting && <LoadingOverlay message="연동 중..." />}
    </div>
  );
}

// Platform Card Component
interface PlatformCardProps {
  platform: string;
  name: string;
  icon: string;
  color: string;
  onClick: () => void;
}

const PlatformCard: React.FC<PlatformCardProps> = ({
  platform,
  name,
  icon,
  color,
  onClick,
}) => {
  return (
    <Card onClick={onClick} variant="elevated">
      <div className="flex items-center gap-4">
        <div className={`${color} text-white text-2xl font-bold w-12 h-12 rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        </div>
        <div className="text-gray-400 text-xl">→</div>
      </div>
    </Card>
  );
};
