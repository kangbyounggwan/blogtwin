/**
 * Supabase Client Configuration
 * Supabase 데이터베이스 및 인증 클라이언트
 */

import {createClient} from '@supabase/supabase-js';
import {SUPABASE_URL, SUPABASE_ANON_KEY} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Supabase 클라이언트 생성
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

/**
 * Database Types (예시)
 * Supabase에서 자동 생성된 타입으로 교체 가능
 */

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          created_at: string;
          naver_id?: string;
          nickname?: string;
          email?: string;
          profile_image?: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          naver_id?: string;
          nickname?: string;
          email?: string;
          profile_image?: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          naver_id?: string;
          nickname?: string;
          email?: string;
          profile_image?: string;
        };
      };
      blog_posts: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          status: 'draft' | 'published';
          platform: 'naver';
          category?: string;
          tags?: string[];
          created_at: string;
          updated_at: string;
          published_at?: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content: string;
          status?: 'draft' | 'published';
          platform: 'naver';
          category?: string;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
          published_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          content?: string;
          status?: 'draft' | 'published';
          platform?: 'naver';
          category?: string;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
          published_at?: string;
        };
      };
      style_profiles: {
        Row: {
          id: string;
          user_id: string;
          analysis_data: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          analysis_data: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          analysis_data?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
