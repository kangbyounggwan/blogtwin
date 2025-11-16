"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { AppHeader } from '@/components/layout/AppHeader';
import { BottomNav } from '@/components/layout/BottomNav';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function SettingsPage() {
  const router = useRouter();

  const handleLogout = () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AppHeader title="설정" showBack />

      <div className="screen-padding">
        {/* Profile Section */}
        <Card variant="elevated" className="mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-2xl">
              👤
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">사용자</h3>
              <p className="text-sm text-gray-500">로그인 후 정보가 표시됩니다</p>
            </div>
          </div>
        </Card>

        {/* Config Status */}
        {!isSupabaseConfigured() && (
          <Card variant="outlined" className="mb-4 border-warning-300 bg-warning-50">
            <h3 className="font-semibold text-warning-900 mb-2">
              ⚠️ 환경 설정 필요
            </h3>
            <p className="text-sm text-warning-700 mb-3">
              실제 기능을 사용하려면 Supabase와 API를 설정하세요.
            </p>
            <a
              href="/setup"
              className="text-sm text-warning-900 font-semibold underline"
            >
              설정 가이드 보기 →
            </a>
          </Card>
        )}

        {/* Blog Connection */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            블로그 연동
          </h3>
          <div className="space-y-2">
            <SettingItem
              icon="N"
              iconBg="bg-[#03C75A]"
              title="네이버 블로그"
              subtitle="연동됨"
              onClick={() => router.push('/blog-connect')}
            />
            <SettingItem
              icon="🅣"
              iconBg="bg-[#FF6B00]"
              title="티스토리"
              subtitle="연동 안 됨"
              onClick={() => router.push('/blog-connect')}
            />
          </div>
        </div>

        {/* AI Settings */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            AI 설정
          </h3>
          <div className="space-y-2">
            <SettingItem
              icon="🎨"
              title="기본 스타일 강도"
              subtitle="80%"
            />
            <SettingItem
              icon="📝"
              title="기본 글자 수"
              subtitle="1500자"
            />
          </div>
        </div>

        {/* App Settings */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            앱 설정
          </h3>
          <div className="space-y-2">
            <SettingItem
              icon="🔔"
              title="알림"
              subtitle="켜짐"
            />
            <SettingItem
              icon="🌙"
              title="다크 모드"
              subtitle="끄짐"
            />
          </div>
        </div>

        {/* Info */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            정보
          </h3>
          <div className="space-y-2">
            <SettingItem
              icon="📄"
              title="이용약관"
            />
            <SettingItem
              icon="🔒"
              title="개인정보처리방침"
            />
            <SettingItem
              icon="ℹ️"
              title="앱 버전"
              subtitle="v0.1.0 (데모)"
            />
          </div>
        </div>

        {/* Logout */}
        <Button
          variant="outline"
          size="large"
          fullWidth
          onClick={handleLogout}
          className="text-error-500 border-error-500 hover:bg-error-50"
        >
          로그아웃
        </Button>

        <div className="mt-4 text-center">
          <button className="text-sm text-gray-500 hover:text-error-500">
            회원 탈퇴
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

// Setting Item Component
interface SettingItemProps {
  icon: string;
  iconBg?: string;
  title: string;
  subtitle?: string;
  onClick?: () => void;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  iconBg = 'bg-gray-100',
  title,
  subtitle,
  onClick,
}) => {
  return (
    <Card
      onClick={onClick}
      className={onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}
    >
      <div className="flex items-center gap-3">
        <div className={`${iconBg} text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold`}>
          {icon}
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-gray-900">{title}</h4>
          {subtitle && (
            <p className="text-xs text-gray-500">{subtitle}</p>
          )}
        </div>
        {onClick && (
          <div className="text-gray-400">→</div>
        )}
      </div>
    </Card>
  );
};
