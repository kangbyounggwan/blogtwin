"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleNaverLogin = async () => {
    setLoading(true);

    // Demo mode - just redirect to dashboard
    setTimeout(() => {
      router.push('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">✍️</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">BlogTwin</h1>
          <p className="text-gray-600">AI가 블로그 글을 작성합니다</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            환영합니다!
          </h2>
          <p className="text-gray-600 text-center mb-8">
            AI가 당신의 스타일로 블로그 글을 작성합니다
          </p>

          {/* Demo Mode Notice */}
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-700">
              💡 데모 모드: 클릭하면 바로 대시보드로 이동합니다
            </p>
          </div>

          {/* Naver Login Button */}
          <Button
            variant="primary"
            size="large"
            fullWidth
            loading={loading}
            onClick={handleNaverLogin}
            className="mb-4 bg-[#03C75A] hover:bg-[#02b350]"
          >
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl font-bold">N</span>
              <span>네이버로 계속하기 (데모)</span>
            </div>
          </Button>

          {/* Info Text */}
          <p className="text-xs text-gray-500 text-center mt-6">
            실제 네이버 로그인을 사용하려면 환경 변수를 설정하세요
          </p>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl mb-1">📚</div>
            <p className="text-xs text-gray-600">스타일 학습</p>
          </div>
          <div>
            <div className="text-2xl mb-1">✍️</div>
            <p className="text-xs text-gray-600">자동 작성</p>
          </div>
          <div>
            <div className="text-2xl mb-1">📸</div>
            <p className="text-xs text-gray-600">사진 포스팅</p>
          </div>
        </div>
      </div>
    </div>
  );
}
