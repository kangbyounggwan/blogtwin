"use client";

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface NavItem {
  icon: string;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: '🏠', label: '홈', path: '/dashboard' },
  { icon: '📄', label: '내 글', path: '/posts' },
  { icon: '⚙️', label: '설정', path: '/settings' },
];

export const BottomNav: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            className={`
              flex flex-col items-center justify-center gap-1 py-2 px-4
              transition-all duration-150
              ${isActive ? 'text-primary-500' : 'text-gray-500'}
              active:scale-95
            `}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
