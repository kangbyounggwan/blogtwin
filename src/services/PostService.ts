/**
 * Post Service
 * Supabase를 통한 블로그 포스트 데이터 관리
 */

import {supabase} from '@/lib/supabase';

export interface BlogPost {
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
}

export class PostService {
  /**
   * 새 포스트 생성 (초안)
   */
  static async createPost(
    userId: string,
    postData: {
      title: string;
      content: string;
      category?: string;
      tags?: string[];
    },
  ): Promise<BlogPost> {
    try {
      const {data, error} = await supabase
        .from('blog_posts')
        .insert({
          user_id: userId,
          title: postData.title,
          content: postData.content,
          category: postData.category,
          tags: postData.tags,
          status: 'draft',
          platform: 'naver',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('PostService createPost error:', error);
      throw error;
    }
  }

  /**
   * 포스트 업데이트
   */
  static async updatePost(
    postId: string,
    updates: Partial<Omit<BlogPost, 'id' | 'user_id' | 'created_at'>>,
  ): Promise<BlogPost> {
    try {
      const {data, error} = await supabase
        .from('blog_posts')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', postId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('PostService updatePost error:', error);
      throw error;
    }
  }

  /**
   * 포스트 발행
   */
  static async publishPost(postId: string): Promise<BlogPost> {
    try {
      const {data, error} = await supabase
        .from('blog_posts')
        .update({
          status: 'published',
          published_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', postId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('PostService publishPost error:', error);
      throw error;
    }
  }

  /**
   * 사용자의 모든 포스트 조회
   */
  static async getUserPosts(
    userId: string,
    status?: 'draft' | 'published',
  ): Promise<BlogPost[]> {
    try {
      let query = supabase
        .from('blog_posts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', {ascending: false});

      if (status) {
        query = query.eq('status', status);
      }

      const {data, error} = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('PostService getUserPosts error:', error);
      throw error;
    }
  }

  /**
   * 포스트 ID로 조회
   */
  static async getPostById(postId: string): Promise<BlogPost | null> {
    try {
      const {data, error} = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', postId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      return data;
    } catch (error) {
      console.error('PostService getPostById error:', error);
      throw error;
    }
  }

  /**
   * 포스트 삭제
   */
  static async deletePost(postId: string): Promise<void> {
    try {
      const {error} = await supabase.from('blog_posts').delete().eq('id', postId);

      if (error) throw error;
    } catch (error) {
      console.error('PostService deletePost error:', error);
      throw error;
    }
  }

  /**
   * 최근 포스트 조회 (limit)
   */
  static async getRecentPosts(userId: string, limit: number = 10): Promise<BlogPost[]> {
    try {
      const {data, error} = await supabase
        .from('blog_posts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', {ascending: false})
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('PostService getRecentPosts error:', error);
      throw error;
    }
  }
}
