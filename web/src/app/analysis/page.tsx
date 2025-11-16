"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppHeader } from '@/components/layout/AppHeader';
import { BottomNav } from '@/components/layout/BottomNav';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function StyleAnalysisPage() {
  const router = useRouter();
  const [syncing, setSyncing] = useState(false);
  const [profile, setProfile] = useState({
    totalPosts: 42,
    avgWordCount: 1250,
    postFrequency: 3.2,
    lastSyncAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    characteristics: [
      '친근하고 편안한 말투를 사용합니다',
      '구체적인 경험과 예시를 자주 활용합니다',
      '이모지를 적절히 활용하여 생동감을 더합니다',
      '독자에게 질문을 던지며 소통을 유도합니다',
    ],
    categoryDistribution: {
      '여행': 15,
      '맛집': 12,
      '일상': 10,
      'IT/기술': 5,
    },
    commonPhrases: [
      '정말 좋았어요',
      '추천드려요',
      '꼭 가보세요',
      '개인적으로',
      '솔직히',
      '그런데',
    ],
    recentPosts: [
      {
        id: '1',
        title: '제주도 여행 후기',
        analyzedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        title: '성수동 카페 투어',
        analyzedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        title: 'Next.js 14 신기능',
        analyzedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  });

  const handleSync = async () => {
    setSyncing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSyncing(false);
    setProfile({
      ...profile,
      lastSyncAt: new Date(),
    });
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return '방금 전';
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
    return `${Math.floor(diff / 86400)}일 전`;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AppHeader title="스타일 분석" showBack />

      <div className="screen-padding">
        {/* Sync Info */}
        <Card variant="elevated" className="mb-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                마지막 동기화
              </h3>
              <p className="text-xs text-gray-500">
                {formatDate(profile.lastSyncAt)}
              </p>
            </div>
            <Button
              variant="outline"
              size="small"
              onClick={handleSync}
              loading={syncing}
            >
              🔄 동기화
            </Button>
          </div>
        </Card>

        {/* Statistics */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            분석 통계
          </h3>
          <div className="grid grid-cols-3 gap-2">
            <StatCard
              icon="📊"
              label="총 글 수"
              value={`${profile.totalPosts}개`}
            />
            <StatCard
              icon="📝"
              label="평균 글자 수"
              value={`${profile.avgWordCount}자`}
            />
            <StatCard
              icon="📅"
              label="주간 포스팅"
              value={`${profile.postFrequency}회`}
            />
          </div>
        </div>

        {/* Style Characteristics */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            스타일 특징
          </h3>
          <Card>
            <ul className="space-y-3">
              {profile.characteristics.map((char, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-primary-500 mt-0.5">✓</span>
                  <span>{char}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Category Distribution */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            카테고리 분포
          </h3>
          <Card>
            <div className="space-y-3">
              {Object.entries(profile.categoryDistribution).map(([category, count]) => {
                const percentage = (count / profile.totalPosts) * 100;
                return (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700">{category}</span>
                      <span className="text-xs text-gray-500">{count}개 ({percentage.toFixed(0)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Common Phrases */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            자주 쓰는 표현
          </h3>
          <Card>
            <div className="flex flex-wrap gap-2">
              {profile.commonPhrases.map((phrase, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                >
                  {phrase}
                </span>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Analyzed Posts */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            최근 분석된 글
          </h3>
          <div className="space-y-2">
            {profile.recentPosts.map((post) => (
              <Card
                key={post.id}
                onClick={() => router.push(`/editor/${post.id}`)}
                className="cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900">
                    {post.title}
                  </h4>
                  <span className="text-xs text-gray-500">
                    {formatDate(new Date(post.analyzedAt))}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Info Card */}
        <Card variant="outlined" className="bg-blue-50 border-blue-200">
          <div className="flex items-start gap-2">
            <span className="text-blue-500">💡</span>
            <div>
              <p className="text-sm text-blue-900 font-medium mb-1">
                AI가 학습한 스타일
              </p>
              <p className="text-xs text-blue-700">
                분석된 글이 많을수록 AI가 더 정확하게 당신의 스타일을 재현합니다.
                블로그 동기화를 통해 최신 글을 계속 분석해보세요!
              </p>
            </div>
          </div>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}

// Stat Card Component
interface StatCardProps {
  icon: string;
  label: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) => {
  return (
    <Card className="text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-sm font-semibold text-gray-900">{value}</div>
    </Card>
  );
};
