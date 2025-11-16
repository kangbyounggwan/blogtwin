"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  showMenu?: boolean;
  showNotifications?: boolean;
  showSettings?: boolean;
  onMenuClick?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title = 'BlogTwin',
  showBack = false,
  showMenu = false,
  showNotifications = false,
  showSettings = false,
  onMenuClick,
}) => {
  const router = useRouter();

  return (
    <header className="app-header">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => router.back()}
            className="text-2xl text-gray-700 hover:text-gray-900 active:scale-90 transition-transform"
          >
            ←
          </button>
        )}
        {showMenu && (
          <button
            onClick={onMenuClick}
            className="text-2xl text-gray-700 hover:text-gray-900 active:scale-90 transition-transform"
          >
            ☰
          </button>
        )}
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        {showNotifications && (
          <button
            onClick={() => router.push('/notifications')}
            className="text-xl text-gray-700 hover:text-gray-900 active:scale-90 transition-transform relative"
          >
            🔔
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-error-500 rounded-full"></span>
          </button>
        )}
        {showSettings && (
          <button
            onClick={() => router.push('/settings')}
            className="text-xl text-gray-700 hover:text-gray-900 active:scale-90 transition-transform"
          >
            ⚙️
          </button>
        )}
      </div>
    </header>
  );
};
