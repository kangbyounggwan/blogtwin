import { supabase } from './supabase';
import type { User, BlogPost, StyleProfile, AIGenerationLog } from './supabase';

// ====================================
// User Service
// ====================================

export const userService = {
  /**
   * Get or create user by Naver ID
   */
  async getOrCreateUser(naverProfile: {
    id: string;
    nickname: string;
    email?: string;
    profile_image?: string;
  }): Promise<User | null> {
    if (!supabase) return null;

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('naver_id', naverProfile.id)
      .single();

    if (existingUser) {
      return existingUser;
    }

    // Create new user
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        naver_id: naverProfile.id,
        nickname: naverProfile.nickname,
        email: naverProfile.email,
        profile_image: naverProfile.profile_image,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      return null;
    }

    return newUser;
  },

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<User | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }

    return data;
  },

  /**
   * Update user profile
   */
  async updateUser(
    userId: string,
    updates: Partial<Omit<User, 'id' | 'created_at'>>
  ): Promise<User | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      return null;
    }

    return data;
  },
};

// ====================================
// Blog Post Service
// ====================================

export const blogPostService = {
  /**
   * Get all posts for a user
   */
  async getUserPosts(userId: string): Promise<BlogPost[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
      return [];
    }

    return data || [];
  },

  /**
   * Get posts by status
   */
  async getPostsByStatus(
    userId: string,
    status: 'draft' | 'published'
  ): Promise<BlogPost[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('user_id', userId)
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts by status:', error);
      return [];
    }

    return data || [];
  },

  /**
   * Get post by ID
   */
  async getPostById(postId: string): Promise<BlogPost | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', postId)
      .single();

    if (error) {
      console.error('Error fetching post:', error);
      return null;
    }

    return data;
  },

  /**
   * Create new post
   */
  async createPost(
    userId: string,
    post: Omit<BlogPost, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ): Promise<BlogPost | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        user_id: userId,
        ...post,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating post:', error);
      return null;
    }

    return data;
  },

  /**
   * Update post
   */
  async updatePost(
    postId: string,
    updates: Partial<
      Omit<BlogPost, 'id' | 'user_id' | 'created_at' | 'updated_at'>
    >
  ): Promise<BlogPost | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('blog_posts')
      .update(updates)
      .eq('id', postId)
      .select()
      .single();

    if (error) {
      console.error('Error updating post:', error);
      return null;
    }

    return data;
  },

  /**
   * Delete post
   */
  async deletePost(postId: string): Promise<boolean> {
    if (!supabase) return false;

    const { error } = await supabase.from('blog_posts').delete().eq('id', postId);

    if (error) {
      console.error('Error deleting post:', error);
      return false;
    }

    return true;
  },

  /**
   * Publish post
   */
  async publishPost(postId: string): Promise<BlogPost | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        status: 'published',
        published_at: new Date().toISOString(),
      })
      .eq('id', postId)
      .select()
      .single();

    if (error) {
      console.error('Error publishing post:', error);
      return null;
    }

    return data;
  },
};

// ====================================
// Style Profile Service
// ====================================

export const styleProfileService = {
  /**
   * Get user's style profile
   */
  async getStyleProfile(userId: string): Promise<StyleProfile | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('style_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      // Profile doesn't exist yet
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error fetching style profile:', error);
      return null;
    }

    return data;
  },

  /**
   * Create or update style profile
   */
  async upsertStyleProfile(
    userId: string,
    analysisData: StyleProfile['analysis_data']
  ): Promise<StyleProfile | null> {
    if (!supabase) return null;

    const { data, error} = await supabase
      .from('style_profiles')
      .upsert(
        {
          user_id: userId,
          analysis_data: analysisData,
        },
        {
          onConflict: 'user_id',
        }
      )
      .select()
      .single();

    if (error) {
      console.error('Error upserting style profile:', error);
      return null;
    }

    return data;
  },
};

// ====================================
// AI Generation Log Service
// ====================================

export const aiLogService = {
  /**
   * Log AI generation usage
   */
  async logGeneration(
    userId: string,
    log: Omit<AIGenerationLog, 'id' | 'user_id' | 'created_at'>
  ): Promise<AIGenerationLog | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('ai_generation_logs')
      .insert({
        user_id: userId,
        ...log,
      })
      .select()
      .single();

    if (error) {
      console.error('Error logging AI generation:', error);
      return null;
    }

    return data;
  },

  /**
   * Get user's AI usage stats
   */
  async getUserStats(userId: string): Promise<{
    totalGenerations: number;
    totalTokens: number;
    totalCost: number;
  }> {
    if (!supabase) {
      return { totalGenerations: 0, totalTokens: 0, totalCost: 0 };
    }

    const { data, error } = await supabase
      .from('ai_generation_logs')
      .select('total_tokens, estimated_cost')
      .eq('user_id', userId)
      .eq('success', true);

    if (error) {
      console.error('Error fetching AI stats:', error);
      return { totalGenerations: 0, totalTokens: 0, totalCost: 0 };
    }

    const totalGenerations = data.length;
    const totalTokens = data.reduce((sum, log) => sum + log.total_tokens, 0);
    const totalCost = data.reduce((sum, log) => sum + parseFloat(log.estimated_cost || '0'), 0);

    return { totalGenerations, totalTokens, totalCost };
  },
};

