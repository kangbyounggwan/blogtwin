"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppHeader } from '@/components/layout/AppHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';
import { LoadingOverlay } from '@/components/ui/LoadingSpinner';

export default function PhotoPostPage() {
  const router = useRouter();
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [category, setCategory] = useState('daily');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [autoDescription, setAutoDescription] = useState(true);
  const [memo, setMemo] = useState('');

  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newPhotos = [...selectedPhotos, ...files].slice(0, 10);
      setSelectedPhotos(newPhotos);
    }
  };

  const removePhoto = (index: number) => {
    setSelectedPhotos(selectedPhotos.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    if (selectedPhotos.length === 0) {
      alert('사진을 선택해주세요');
      return;
    }

    try {
      // 1. Upload photos
      setUploading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setUploading(false);

      // 2. Analyze photos
      setAnalyzing(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAnalyzing(false);

      // 3. Generate post
      setGenerating(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setGenerating(false);

      // Success - redirect to editor
      router.push('/editor/new');
    } catch (err: any) {
      alert('글 생성 중 오류가 발생했습니다');
      setUploading(false);
      setAnalyzing(false);
      setGenerating(false);
    }
  };

  const wordCounts = {
    short: 300,
    medium: 1000,
    long: 2000,
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      <AppHeader title="사진으로 포스팅" showBack />

      <div className="screen-padding">
        {/* Photo Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            사진 선택 (최대 10장)
          </label>

          <div className="grid grid-cols-4 gap-2">
            {selectedPhotos.map((photo, index) => (
              <div key={index} className="relative aspect-square">
                <img
                  src={URL.createObjectURL(photo)}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover rounded-md"
                />
                <button
                  onClick={() => removePhoto(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-error-500 text-white rounded-full flex items-center justify-center text-sm font-bold"
                >
                  ×
                </button>
              </div>
            ))}

            {selectedPhotos.length < 10 && (
              <label className="aspect-square border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
                <span className="text-3xl text-gray-400">📷</span>
                <span className="text-xs text-gray-500 mt-1">+</span>
              </label>
            )}
          </div>
        </div>

        {/* Auto Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            사진 설명 자동 생성
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                checked={autoDescription}
                onChange={() => setAutoDescription(true)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">켜기</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={!autoDescription}
                onChange={() => setAutoDescription(false)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">끄기</span>
            </label>
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
            <option value="daily">일상</option>
            <option value="travel">여행</option>
            <option value="food">맛집</option>
          </select>
        </div>

        {/* Length */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            글 길이
          </label>
          <div className="flex gap-2">
            {(['short', 'medium', 'long'] as const).map((len) => (
              <button
                key={len}
                onClick={() => setLength(len)}
                className={`flex-1 py-3 rounded-md border-2 transition-all ${
                  length === len
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 text-gray-700 hover:border-primary-300'
                }`}
              >
                <div className="font-semibold">
                  {len === 'short' && '짧게'}
                  {len === 'medium' && '보통'}
                  {len === 'long' && '길게'}
                </div>
                <div className="text-xs text-gray-500">
                  {wordCounts[len]}자
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Memo */}
        <div className="mb-6">
          <Textarea
            label="추가 메모 (선택사항)"
            placeholder="오늘 날씨가 정말 좋았어요"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            rows={3}
          />
        </div>

        {/* Generate Button */}
        <Button
          variant="primary"
          size="large"
          fullWidth
          onClick={handleGenerate}
          disabled={selectedPhotos.length === 0}
        >
          글 생성하기
        </Button>
      </div>

      {/* Loading Overlays */}
      {uploading && <LoadingOverlay message="사진을 업로드하는 중..." />}
      {analyzing && <LoadingOverlay message="AI가 사진을 분석하는 중..." />}
      {generating && <LoadingOverlay message="글을 작성하는 중..." />}
    </div>
  );
}
