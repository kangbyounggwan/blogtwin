import { createClient } from '@supabase/supabase-js';

// Check if Supabase is configured
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== '' &&
    supabaseAnonKey !== '' &&
    supabaseUrl.startsWith('http')
  );
};

// Only create client if properly configured
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

// Types
export interface User {
  id: string;
  naver_id: string;
  nickname: string;
  email: string;
  profile_image: string;
  created_at: string;
}

export interface BlogPost {
  id: string;
  user_id: string;
  title: string;
  content: string;
  status: 'draft' | 'published';
  platform: 'naver';
  category: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface StyleProfile {
  id: string;
  user_id: string;
  analysis_data: {
    totalPosts: number;
    avgWordCount: number;
    postFrequency: number;
    characteristics: string[];
    categoryDistribution: { [key: string]: number };
    commonPhrases: string[];
  };
  created_at: string;
  updated_at: string;
}

export interface AIGenerationLog {
  id: string;
  user_id: string;
  model: string;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  estimated_cost: number;
  success: boolean;
  error_message: string | null;
  created_at: string;
}
