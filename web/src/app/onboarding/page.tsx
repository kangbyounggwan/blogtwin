"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function OnboardingPage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: '📚',
      title: '블로그 스타일 학습',
      description: 'AI가 당신의 글쓰기 스타일을 분석하고 학습합니다',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: '✍️',
      title: 'AI 자동 글 작성',
      description: '주제만 입력하면 당신의 스타일로 글을 자동 작성합니다',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: '🚀',
      title: '빠른 포스팅',
      description: '사진만 올려도 자동으로 글이 작성되어 발행됩니다',
      color: 'from-pink-500 to-pink-600',
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      router.push('/login');
    }
  };

  const handleSkip = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Skip Button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={handleSkip}
          className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2"
        >
          건너뛰기
        </button>
      </div>

      {/* Slides */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div
          className={`w-32 h-32 rounded-full bg-gradient-to-br ${slides[currentSlide].color} flex items-center justify-center text-6xl mb-8 animate-bounce`}
        >
          {slides[currentSlide].icon}
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
          {slides[currentSlide].title}
        </h1>

        <p className="text-lg text-gray-600 text-center max-w-sm">
          {slides[currentSlide].description}
        </p>
      </div>

      {/* Indicators */}
      <div className="flex justify-center gap-2 mb-8">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide
                ? 'w-8 bg-primary-500'
                : 'w-2 bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="px-6 pb-8">
        <Button
          variant="primary"
          size="large"
          fullWidth
          onClick={handleNext}
        >
          {currentSlide === slides.length - 1 ? '시작하기' : '다음'}
        </Button>
      </div>
    </div>
  );
}
