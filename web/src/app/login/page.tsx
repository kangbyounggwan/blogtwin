"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

const NAVER_CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
const NAVER_REDIRECT_URI = typeof window !== 'undefined'
  ? `${window.location.origin}/auth/callback`
  : '';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleNaverLogin = async () => {
    setLoading(true);

    // Check if Naver API is configured
    if (!NAVER_CLIENT_ID) {
      alert('네이버 OAuth가 설정되지 않았습니다.\n.env.local 파일에 NEXT_PUBLIC_NAVER_CLIENT_ID와 NAVER_CLIENT_SECRET을 설정하세요.');
      setLoading(false);
      return;
    }

    // Real Naver OAuth
    const state = Math.random().toString(36).substring(7);
    sessionStorage.setItem('oauth_state', state);

    const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${encodeURIComponent(NAVER_REDIRECT_URI)}&state=${state}`;

    window.location.href = naverAuthUrl;
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

          {/* Configuration Warning */}
          {!NAVER_CLIENT_ID && (
            <div className="mb-4 p-3 bg-error-50 border border-error-200 rounded-md">
              <p className="text-sm text-error-700 font-semibold">
                ⚠️ 네이버 OAuth가 설정되지 않았습니다
              </p>
              <p className="text-xs text-error-600 mt-1">
                .env.local 파일을 생성하고 환경 변수를 설정하세요.
              </p>
            </div>
          )}

          {/* Naver Login Button */}
          <Button
            variant="primary"
            size="large"
            fullWidth
            loading={loading}
            onClick={handleNaverLogin}
            className="mb-4 bg-[#03C75A] hover:bg-[#02b350]"
            disabled={!NAVER_CLIENT_ID}
          >
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl font-bold">N</span>
              <span>네이버로 로그인</span>
            </div>
          </Button>
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
