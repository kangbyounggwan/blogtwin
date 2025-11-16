/**
 * BlogTwin Constants
 * 모든 상수를 한 곳에서 export
 */

import {
  NAVER_CLIENT_ID,
  NAVER_CLIENT_SECRET,
  NAVER_REDIRECT_URI,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  OPENAI_API_KEY,
} from '@env';

export * from './colors';
export * from './typography';
export * from './spacing';

/**
 * App Configuration
 */
export const Config = {
  appName: 'BlogTwin',
  appVersion: '0.1.0',
  apiTimeout: 30000, // 30초
  maxImageSize: 10 * 1024 * 1024, // 10MB
  maxImagesPerPost: 10,
  defaultPostLength: 1500,
  styleAnalysisMonths: 2,

  // Naver OAuth Configuration (from .env)
  NAVER_CLIENT_ID,
  NAVER_CLIENT_SECRET,
  NAVER_REDIRECT_URI,

  // Supabase Configuration (from .env)
  SUPABASE_URL,
  SUPABASE_ANON_KEY,

  // OpenAI Configuration (from .env)
  OPENAI_API_KEY,
} as const;

/**
 * OAuth Redirect URIs
 */
export const OAuthConfig = {
  redirectScheme: 'blogtwin',
  tistory: {
    redirectUri: 'blogtwin://oauth/tistory',
    authUrl: 'https://www.tistory.com/oauth/authorize',
    tokenUrl: 'https://www.tistory.com/oauth/access_token',
  },
  naver: {
    redirectUri: 'blogtwin://oauth/naver',
    authUrl: 'https://nid.naver.com/oauth2.0/authorize',
    tokenUrl: 'https://nid.naver.com/oauth2.0/token',
  },
} as const;

/**
 * Route Names
 */
export const Routes = {
  // Auth Stack
  Splash: 'Splash',
  Onboarding: 'Onboarding',

  // Main Stack
  Main: 'Main',
  BlogConnection: 'BlogConnection',

  // Tab Navigator
  Home: 'Home',
  CreatePost: 'CreatePost',
  MyPosts: 'MyPosts',
  Settings: 'Settings',

  // Post Creation
  CategoryPost: 'CategoryPost',
  PhotoPost: 'PhotoPost',
  PostEditor: 'PostEditor',
  PostPreview: 'PostPreview',

  // Analysis
  StyleAnalysis: 'StyleAnalysis',
  BlogAnalysis: 'BlogAnalysis',
} as const;

/**
 * Storage Keys
 */
export const StorageKeys = {
  hasSeenOnboarding: '@blogtwin:hasSeenOnboarding',
  userTheme: '@blogtwin:theme',
  blogConnections: '@blogtwin:blogConnections',
  openaiApiKey: '@blogtwin:openaiApiKey',
  styleProfile: '@blogtwin:styleProfile',
  drafts: '@blogtwin:drafts',

  // Naver OAuth
  NAVER_TOKEN: '@blogtwin:naver:token',
  NAVER_OAUTH_STATE: '@blogtwin:naver:oauth:state',
  NAVER_PROFILE: '@blogtwin:naver:profile',
  NAVER_BLOG_INFO: '@blogtwin:naver:blog',
} as const;

/**
 * Blog Platforms
 */
export const BlogPlatforms = {
  tistory: {
    id: 'tistory',
    name: '티스토리',
    color: '#FF6B00',
    icon: '🅣',
  },
  naver: {
    id: 'naver',
    name: '네이버 블로그',
    color: '#03C75A',
    icon: 'N',
  },
  velog: {
    id: 'velog',
    name: 'Velog',
    color: '#20C997',
    icon: 'V',
  },
} as const;

/**
 * Animation Durations (ms)
 */
export const AnimationDuration = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;
