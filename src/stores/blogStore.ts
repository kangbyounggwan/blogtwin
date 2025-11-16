/**
 * Blog Connection Store
 * Zustand를 사용한 블로그 연동 상태 관리
 */

import {create} from 'zustand';
import {NaverProfile} from '@/types/naver';

interface BlogConnection {
  platform: 'naver';
  isConnected: boolean;
  profile: NaverProfile | null;
  connectedAt: number | null;
}

interface BlogStore {
  // State
  naverConnection: BlogConnection;
  isLoading: boolean;
  error: string | null;

  // Actions
  setNaverConnection: (profile: NaverProfile) => void;
  disconnectNaver: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  naverConnection: {
    platform: 'naver' as const,
    isConnected: false,
    profile: null,
    connectedAt: null,
  },
  isLoading: false,
  error: null,
};

export const useBlogStore = create<BlogStore>((set) => ({
  ...initialState,

  setNaverConnection: (profile: NaverProfile) =>
    set({
      naverConnection: {
        platform: 'naver',
        isConnected: true,
        profile,
        connectedAt: Date.now(),
      },
      error: null,
    }),

  disconnectNaver: () =>
    set({
      naverConnection: {
        platform: 'naver',
        isConnected: false,
        profile: null,
        connectedAt: null,
      },
    }),

  setLoading: (loading: boolean) => set({isLoading: loading}),

  setError: (error: string | null) => set({error}),

  reset: () => set(initialState),
}));
