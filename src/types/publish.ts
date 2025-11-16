/**
 * Publishing Types
 * 발행 관련 타입 정의
 */

export type PublishPlatform = 'naver' | 'tistory' | 'velog';
export type PublishStatus = 'draft' | 'scheduled' | 'publishing' | 'published' | 'failed';
export type PublishVisibility = 'public' | 'private' | 'protected';

export interface PublishSettings {
  platform: PublishPlatform;
  visibility: PublishVisibility;
  category?: string;
  tags?: string[];
  allowComments: boolean;
  allowShare: boolean;
  scheduleDate?: Date;
  thumbnailUrl?: string;
}

export interface PublishRequest {
  postId: string;
  title: string;
  content: string;
  settings: PublishSettings;
}

export interface PublishResult {
  success: boolean;
  publishedUrl?: string;
  error?: string;
  publishedAt?: Date;
}

export interface PublishHistory {
  id: string;
  postId: string;
  platform: PublishPlatform;
  title: string;
  status: PublishStatus;
  publishedUrl?: string;
  publishedAt?: Date;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScheduledPost {
  id: string;
  postId: string;
  title: string;
  platform: PublishPlatform;
  scheduleDate: Date;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: Date;
}

export interface PublishValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ImageUploadOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

export interface UploadedImage {
  id: string;
  url: string;
  thumbnailUrl?: string;
  width: number;
  height: number;
  size: number;
  uploadedAt: Date;
}
