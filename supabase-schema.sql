-- BlogTwin Supabase Database Schema
-- 이 SQL을 Supabase SQL Editor에서 실행하여 테이블 생성

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    naver_id TEXT UNIQUE,
    nickname TEXT,
    email TEXT,
    profile_image TEXT
);

-- Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    platform TEXT NOT NULL DEFAULT 'naver' CHECK (platform IN ('naver')),
    category TEXT,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE
);

-- Style Profiles Table
CREATE TABLE IF NOT EXISTS style_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    analysis_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- AI Generation Logs Table
CREATE TABLE IF NOT EXISTS ai_generation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    model TEXT NOT NULL,
    prompt_tokens INTEGER NOT NULL DEFAULT 0,
    completion_tokens INTEGER NOT NULL DEFAULT 0,
    total_tokens INTEGER NOT NULL DEFAULT 0,
    estimated_cost DECIMAL(10, 6) NOT NULL DEFAULT 0,
    success BOOLEAN NOT NULL DEFAULT true,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_user_id ON blog_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_style_profiles_user_id ON style_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_users_naver_id ON users(naver_id);
CREATE INDEX IF NOT EXISTS idx_ai_generation_logs_user_id ON ai_generation_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_generation_logs_created_at ON ai_generation_logs(created_at DESC);

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE style_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generation_logs ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own data"
    ON users FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own data"
    ON users FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update their own data"
    ON users FOR UPDATE
    USING (true);

-- Blog Posts policies
CREATE POLICY "Users can view their own posts"
    ON blog_posts FOR SELECT
    USING (true);

CREATE POLICY "Users can create their own posts"
    ON blog_posts FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update their own posts"
    ON blog_posts FOR UPDATE
    USING (true);

CREATE POLICY "Users can delete their own posts"
    ON blog_posts FOR DELETE
    USING (true);

-- Style Profiles policies
CREATE POLICY "Users can view their own style profile"
    ON style_profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can create their own style profile"
    ON style_profiles FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update their own style profile"
    ON style_profiles FOR UPDATE
    USING (true);

-- AI Generation Logs policies
CREATE POLICY "Users can view their own AI logs"
    ON ai_generation_logs FOR SELECT
    USING (true);

CREATE POLICY "Users can create their own AI logs"
    ON ai_generation_logs FOR INSERT
    WITH CHECK (true);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_style_profiles_updated_at ON style_profiles;
CREATE TRIGGER update_style_profiles_updated_at
    BEFORE UPDATE ON style_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Publish History Table
-- ============================================
CREATE TABLE IF NOT EXISTS publish_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id TEXT NOT NULL,
    platform TEXT NOT NULL CHECK (platform IN ('naver', 'tistory', 'velog')),
    title TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('draft', 'scheduled', 'publishing', 'published', 'failed')),
    published_url TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    error TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Scheduled Posts Table
-- ============================================
CREATE TABLE IF NOT EXISTS scheduled_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id TEXT NOT NULL,
    title TEXT NOT NULL,
    platform TEXT NOT NULL CHECK (platform IN ('naver', 'tistory', 'velog')),
    schedule_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_publish_history_user_id ON publish_history(user_id);
CREATE INDEX IF NOT EXISTS idx_publish_history_created_at ON publish_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_user_id ON scheduled_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_schedule_date ON scheduled_posts(schedule_date);

-- Enable RLS
ALTER TABLE publish_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_posts ENABLE ROW LEVEL SECURITY;

-- Publish History policies
CREATE POLICY "Users can view their own publish history"
    ON publish_history FOR SELECT
    USING (true);

CREATE POLICY "Users can create their own publish history"
    ON publish_history FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update their own publish history"
    ON publish_history FOR UPDATE
    USING (true);

-- Scheduled Posts policies
CREATE POLICY "Users can view their own scheduled posts"
    ON scheduled_posts FOR SELECT
    USING (true);

CREATE POLICY "Users can create their own scheduled posts"
    ON scheduled_posts FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update their own scheduled posts"
    ON scheduled_posts FOR UPDATE
    USING (true);

CREATE POLICY "Users can delete their own scheduled posts"
    ON scheduled_posts FOR DELETE
    USING (true);

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_publish_history_updated_at ON publish_history;
CREATE TRIGGER update_publish_history_updated_at
    BEFORE UPDATE ON publish_history
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert test data (optional - 개발 중에만 사용)
-- INSERT INTO users (naver_id, nickname, email) VALUES
-- ('test_naver_id', '테스트유저', 'test@example.com');
