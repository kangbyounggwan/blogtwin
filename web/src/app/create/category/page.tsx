"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppHeader } from '@/components/layout/AppHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingOverlay } from '@/components/ui/LoadingSpinner';

interface GenerationProgress {
  step: string;
  percentage: number;
}

const steps = [
  '주제 분석 중...',
  '콘텐츠 구조 생성 중...',
  '본문 작성 중...',
  '스타일 적용 중...',
];

export default function CategoryPostPage() {
  const router = useRouter();
  const [category, setCategory] = useState('travel');
  const [topic, setTopic] = useState('');
  const [wordCount, setWordCount] = useState(1500);
  const [styleStrength, setStyleStrength] = useState(80);
  const [useEmoji, setUseEmoji] = useState(true);
  const [useHashtags, setUseHashtags] = useState(false);

  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState<GenerationProgress>({
    step: '',
    percentage: 0,
  });

  const [generatedPost, setGeneratedPost] = useState<any>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      alert('주제를 입력해주세요');
      return;
    }

    try {
      setGenerating(true);
      setGeneratedPost(null);

      // Simulate AI generation with progress
      for (let i = 0; i < steps.length; i++) {
        setProgress({
          step: steps[i],
          percentage: Math.floor(((i + 1) / steps.length) * 100),
        });
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      // Mock generated post
      const mockPost = {
        title: `${topic} - AI가 작성한 글`,
        content: `안녕하세요~ 오늘은 ${topic}에 대해 이야기해보려고 해요!\n\n첫 번째로...`,
        tags: ['#' + topic, '#여행', '#일상'],
        wordCount: wordCount,
      };

      setGeneratedPost(mockPost);
      setGenerating(false);
    } catch (err: any) {
      console.error('Generation error:', err);
      alert('글 생성 중 오류가 발생했습니다');
      setGenerating(false);
    }
  };

  const handleRegenerate = () => {
    setGeneratedPost(null);
    handleGenerate();
  };

  const handleEdit = () => {
    // TODO: Save post and go to editor
    router.push('/editor/new');
  };

  const handlePublish = () => {
    // TODO: Save post and go to publish settings
    router.push('/publish/new');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      <AppHeader title="카테고리별 글 작성" showBack />

      <div className="screen-padding">
        {!generating && !generatedPost && (
          <div className="space-y-6">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                카테고리
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="travel">여행</option>
                <option value="food">맛집</option>
                <option value="daily">일상</option>
                <option value="tech">기술</option>
                <option value="review">리뷰</option>
              </select>
            </div>

            {/* Topic */}
            <Input
              label="주제/키워드"
              placeholder="예: 제주도 카페 투어"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />

            {/* Word Count Slider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                목표 글자 수
              </label>
              <input
                type="range"
                min="500"
                max="3000"
                step="100"
                value={wordCount}
                onChange={(e) => setWordCount(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>500</span>
                <span className="font-semibold text-primary-500">{wordCount}자</span>
                <span>3000</span>
              </div>
            </div>

            {/* Style Strength */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                스타일 적용
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={styleStrength}
                onChange={(e) => setStyleStrength(Number(e.target.value))}
                className="w-full"
              />
              <p className="text-sm text-gray-600 mt-1">
                내 스타일 {styleStrength}%
              </p>
            </div>

            {/* Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                추가 옵션
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={useEmoji}
                    onChange={(e) => setUseEmoji(e.target.checked)}
                    className="w-4 h-4 text-primary-500"
                  />
                  <span className="text-sm text-gray-700">이모지 사용</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={useHashtags}
                    onChange={(e) => setUseHashtags(e.target.checked)}
                    className="w-4 h-4 text-primary-500"
                  />
                  <span className="text-sm text-gray-700">해시태그 자동 생성</span>
                </label>
              </div>
            </div>

            <Button
              variant="primary"
              size="large"
              fullWidth
              onClick={handleGenerate}
              disabled={!topic.trim()}
            >
              AI 글 작성 시작
            </Button>
          </div>
        )}

        {generating && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4 animate-bounce">🤖</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              AI가 글을 작성하고 있습니다
            </h2>

            <div className="max-w-md mx-auto mb-6">
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>

              <div className="space-y-2 text-left">
                {steps.map((step, index) => {
                  const currentStepIndex = steps.indexOf(progress.step);
                  const isCompleted = index < currentStepIndex;
                  const isCurrent = index === currentStepIndex;

                  return (
                    <div
                      key={step}
                      className={`flex items-center gap-2 ${
                        isCompleted ? 'text-success-600' : isCurrent ? 'text-primary-500' : 'text-gray-400'
                      }`}
                    >
                      {isCompleted && '✅'}
                      {isCurrent && '🔄'}
                      {!isCompleted && !isCurrent && '⏳'}
                      <span className="text-sm">{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <p className="text-sm text-gray-500">예상 완료 시간: 약 30초</p>

            <Button
              variant="outline"
              size="small"
              onClick={() => setGenerating(false)}
              className="mt-4"
            >
              취소
            </Button>
          </div>
        )}

        {generatedPost && (
          <div>
            {/* Action Buttons */}
            <div className="flex gap-2 mb-4">
              <Button variant="outline" size="small" onClick={handleEdit}>
                📝 편집
              </Button>
              <Button variant="outline" size="small" onClick={handleRegenerate}>
                🔄 재생성
              </Button>
              <Button variant="primary" size="small" onClick={handlePublish} className="flex-1">
                ✓ 발행
              </Button>
            </div>

            {/* Preview */}
            <Card variant="elevated">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {generatedPost.title}
              </h2>
              <div className="border-t border-gray-200 my-4" />
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 whitespace-pre-line">
                  {generatedPost.content}
                </p>
              </div>
              <div className="border-t border-gray-200 my-4" />
              <div className="space-y-2 text-sm text-gray-600">
                <p>카테고리: {category}</p>
                <p>태그: {generatedPost.tags.join(' ')}</p>
                <p>글자 수: {generatedPost.wordCount}자</p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
