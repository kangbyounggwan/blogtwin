"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AppHeader } from '@/components/layout/AppHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingOverlay } from '@/components/ui/LoadingSpinner';

export default function PublishSettingsPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params?.id as string;

  const [publishTime, setPublishTime] = useState<'now' | 'scheduled'>('now');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [category, setCategory] = useState('일상');
  const [allowComments, setAllowComments] = useState(true);
  const [publishing, setPublishing] = useState(false);

  const handlePublish = async () => {
    setPublishing(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setPublishing(false);

    // Show success and redirect
    alert('글이 성공적으로 발행되었습니다!');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      <AppHeader title="발행 설정" showBack />

      <div className="screen-padding">
        {/* Post Preview Card */}
        <Card variant="elevated" className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            제주도 여행 후기
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            제주도 여행이 정말 좋았어요! 첫 번째로 방문한 곳은...
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
            <span>📝 1,234자</span>
            <span>•</span>
            <span>🏷️ #제주도 #여행</span>
          </div>
        </Card>

        {/* Publish Time */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            발행 시간
          </label>
          <div className="space-y-2">
            <Card
              onClick={() => setPublishTime('now')}
              className={`cursor-pointer transition-all ${
                publishTime === 'now'
                  ? 'border-2 border-primary-500 bg-primary-50'
                  : 'border border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  publishTime === 'now'
                    ? 'border-primary-500'
                    : 'border-gray-300'
                }`}>
                  {publishTime === 'now' && (
                    <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">즉시 발행</h4>
                  <p className="text-xs text-gray-500">지금 바로 블로그에 발행됩니다</p>
                </div>
              </div>
            </Card>

            <Card
              onClick={() => setPublishTime('scheduled')}
              className={`cursor-pointer transition-all ${
                publishTime === 'scheduled'
                  ? 'border-2 border-primary-500 bg-primary-50'
                  : 'border border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  publishTime === 'scheduled'
                    ? 'border-primary-500'
                    : 'border-gray-300'
                }`}>
                  {publishTime === 'scheduled' && (
                    <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">예약 발행</h4>
                  <p className="text-xs text-gray-500">원하는 시간에 자동으로 발행됩니다</p>
                </div>
              </div>
            </Card>
          </div>

          {publishTime === 'scheduled' && (
            <Card variant="outlined" className="mt-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">날짜</label>
                  <Input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">시간</label>
                  <Input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                  />
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Visibility */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            공개 설정
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setVisibility('public')}
              className={`flex-1 py-3 px-4 rounded-md border-2 transition-all ${
                visibility === 'public'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 text-gray-700'
              }`}
            >
              <div className="font-semibold">전체 공개</div>
              <div className="text-xs text-gray-500">누구나 볼 수 있습니다</div>
            </button>
            <button
              onClick={() => setVisibility('private')}
              className={`flex-1 py-3 px-4 rounded-md border-2 transition-all ${
                visibility === 'private'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 text-gray-700'
              }`}
            >
              <div className="font-semibold">비공개</div>
              <div className="text-xs text-gray-500">나만 볼 수 있습니다</div>
            </button>
          </div>
        </div>

        {/* Category */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            카테고리
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="일상">일상</option>
            <option value="여행">여행</option>
            <option value="맛집">맛집</option>
            <option value="IT/기술">IT/기술</option>
            <option value="패션/뷰티">패션/뷰티</option>
            <option value="운동/건강">운동/건강</option>
          </select>
        </div>

        {/* Comments Setting */}
        <div className="mb-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">댓글 허용</h4>
                <p className="text-xs text-gray-500">독자들이 댓글을 달 수 있습니다</p>
              </div>
              <button
                onClick={() => setAllowComments(!allowComments)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  allowComments ? 'bg-primary-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    allowComments ? 'right-0.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          </Card>
        </div>

        {/* Platform Info */}
        <Card variant="outlined" className="mb-6 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-[#03C75A] rounded-lg flex items-center justify-center text-white font-bold">
              N
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-900">네이버 블로그</h4>
              <p className="text-xs text-gray-600 mt-1">
                myblog.naver.com/username 에 발행됩니다
              </p>
            </div>
          </div>
        </Card>

        {/* Publish Button */}
        <Button
          variant="primary"
          size="large"
          fullWidth
          onClick={handlePublish}
          disabled={publishTime === 'scheduled' && (!scheduledDate || !scheduledTime)}
        >
          {publishTime === 'now' ? '지금 발행하기' : '예약 발행하기'}
        </Button>

        {/* Cancel Button */}
        <Button
          variant="outline"
          size="large"
          fullWidth
          onClick={() => router.back()}
          className="mt-3"
        >
          취소
        </Button>
      </div>

      {/* Loading Overlay */}
      {publishing && <LoadingOverlay message="블로그에 발행하는 중..." />}
    </div>
  );
}
