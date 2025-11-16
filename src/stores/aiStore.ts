/**
 * AI Store
 * AI 생성 관련 상태 관리
 */

import {create} from 'zustand';
import {GeneratedPost} from '@/types/openai';

interface AIStore {
  // State
  isGenerating: boolean;
  currentGeneratedPost: GeneratedPost | null;
  generationProgress: string;
  totalTokensUsed: number;
  totalCost: number;
  error: string | null;

  // Actions
  setGenerating: (generating: boolean) => void;
  setCurrentPost: (post: GeneratedPost | null) => void;
  setProgress: (progress: string) => void;
  addTokenUsage: (tokens: number, cost: number) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  isGenerating: false,
  currentGeneratedPost: null,
  generationProgress: '',
  totalTokensUsed: 0,
  totalCost: 0,
  error: null,
};

export const useAIStore = create<AIStore>((set) => ({
  ...initialState,

  setGenerating: (generating: boolean) => set({isGenerating: generating}),

  setCurrentPost: (post: GeneratedPost | null) => set({currentGeneratedPost: post}),

  setProgress: (progress: string) => set({generationProgress: progress}),

  addTokenUsage: (tokens: number, cost: number) =>
    set((state) => ({
      totalTokensUsed: state.totalTokensUsed + tokens,
      totalCost: state.totalCost + cost,
    })),

  setError: (error: string | null) => set({error}),

  reset: () => set(initialState),
}));
