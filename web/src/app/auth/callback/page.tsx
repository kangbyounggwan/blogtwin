"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoadingOverlay } from '@/components/ui/LoadingSpinner';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      const code = searchParams?.get('code');
      const state = searchParams?.get('state');
      const storedState = sessionStorage.getItem('oauth_state');

      // Verify state
      if (state !== storedState) {
        throw new Error('Invalid state parameter');
      }

      if (!code) {
        throw new Error('No authorization code received');
      }

      // Exchange code for token via your backend API
      const response = await fetch('/api/auth/naver/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, state }),
      });

      if (!response.ok) {
        throw new Error('Failed to exchange code for token');
      }

      const { user, session } = await response.json();

      // Set Supabase session
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      });

      if (sessionError) throw sessionError;

      // Clear state
      sessionStorage.removeItem('oauth_state');

      // Check if user needs to connect blog
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('naver_id', user.id)
        .single();

      if (!existingUser) {
        // New user - go to blog connection
        router.push('/blog-connect');
      } else {
        // Existing user - go to dashboard
        router.push('/dashboard');
      }
    } catch (err: any) {
      console.error('Auth callback error:', err);
      setError(err.message || 'Authentication failed');
      setTimeout(() => router.push('/login'), 3000);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            로그인 실패
          </h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">잠시 후 로그인 페이지로 이동합니다...</p>
        </div>
      </div>
    );
  }

  return <LoadingOverlay message="로그인 처리 중..." />;
}
