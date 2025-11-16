/**
 * Naver Blog API Types
 */

// OAuth Types
export interface NaverOAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  state: string;
}

export interface NaverTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface NaverTokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

// Naver Profile Types
export interface NaverProfile {
  id: string;
  nickname: string;
  profile_image?: string;
  email?: string;
  name?: string;
  birthday?: string;
  birthyear?: string;
  gender?: 'M' | 'F' | 'U';
  age?: string;
  mobile?: string;
}

export interface NaverProfileResponse {
  resultcode: string;
  message: string;
  response: NaverProfile;
}

// Naver Blog Types
export interface NaverBlogInfo {
  blogId: string;
  blogName: string;
  blogUrl: string;
  profileImage?: string;
}

export interface NaverBlogPost {
  logNo: string;
  title: string;
  contents: string;
  categoryNo?: string;
  publishDate: string;
  modifyDate?: string;
  thumbnailUrl?: string;
  tags?: string[];
}

export interface NaverBlogCategory {
  categoryNo: string;
  categoryName: string;
  postCount: number;
}

// API Response Types
export interface NaverApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// OAuth Error Types
export interface NaverOAuthError {
  error: string;
  error_description: string;
}
