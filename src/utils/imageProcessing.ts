/**
 * Image Processing Utilities
 * 이미지 최적화, 압축, 변환 등을 처리하는 유틸리티
 */

import {Platform} from 'react-native';
import {CacheService} from '@services/CacheService';

export interface ImageInfo {
  uri: string;
  fileName?: string;
  fileSize?: number;
  width?: number;
  height?: number;
  type?: string;
}

export interface OptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0-1
  format?: 'jpeg' | 'png';
}

export interface ImageAnalysisMetadata {
  aspectRatio: number;
  orientation: 'landscape' | 'portrait' | 'square';
  estimatedFileSize: number;
  format: string;
}

/**
 * 이미지 최적화 및 처리 클래스
 */
export class ImageProcessor {
  /**
   * 이미지를 최적화된 크기로 리사이즈 (캐싱 포함)
   */
  static async optimizeImage(
    imageUri: string,
    options: OptimizationOptions = {},
  ): Promise<ImageInfo> {
    const {
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 0.8,
      format = 'jpeg',
    } = options;

    // Check cache first
    const cacheKey = `image_opt_${imageUri}_${maxWidth}_${maxHeight}_${quality}`;
    const cached = await CacheService.get<ImageInfo>(cacheKey);
    if (cached) {
      console.log('[ImageProcessor] Cache hit for optimized image');
      return cached;
    }

    // React Native Image Resizer를 사용하는 경우
    // 현재는 메타데이터만 반환 (실제 리사이징은 라이브러리 필요)
    const result: ImageInfo = {
      uri: imageUri,
      width: maxWidth,
      height: maxHeight,
    };

    // Cache the result (TTL: 1 hour)
    await CacheService.set(cacheKey, result, {
      ttl: 60 * 60 * 1000,
      persist: true,
    });

    return result;
  }

  /**
   * 이미지를 Base64로 인코딩 (OpenAI Vision API용)
   */
  static async encodeToBase64(imageUri: string): Promise<string> {
    try {
      // React Native FileSystem을 사용하는 경우
      // const base64 = await RNFS.readFile(imageUri, 'base64');
      // return `data:image/jpeg;base64,${base64}`;

      // 현재는 URI를 그대로 반환 (웹 URL인 경우)
      if (imageUri.startsWith('http')) {
        return imageUri;
      }

      // 로컬 파일의 경우 file:// URI 반환
      return imageUri;
    } catch (error) {
      console.error('Failed to encode image to base64:', error);
      throw new Error('이미지 인코딩에 실패했습니다.');
    }
  }

  /**
   * 이미지 메타데이터 추출
   */
  static getImageMetadata(imageInfo: ImageInfo): ImageAnalysisMetadata {
    const width = imageInfo.width || 0;
    const height = imageInfo.height || 0;
    const aspectRatio = width > 0 && height > 0 ? width / height : 1;

    let orientation: 'landscape' | 'portrait' | 'square' = 'square';
    if (aspectRatio > 1.1) {
      orientation = 'landscape';
    } else if (aspectRatio < 0.9) {
      orientation = 'portrait';
    }

    return {
      aspectRatio,
      orientation,
      estimatedFileSize: imageInfo.fileSize || 0,
      format: imageInfo.type || 'unknown',
    };
  }

  /**
   * 이미지 크기가 업로드 제한을 초과하는지 확인
   */
  static isFileSizeValid(
    imageInfo: ImageInfo,
    maxSizeInMB: number = 10,
  ): boolean {
    if (!imageInfo.fileSize) {
      return true; // 크기 정보가 없으면 통과
    }

    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    return imageInfo.fileSize <= maxSizeInBytes;
  }

  /**
   * 이미지 파일 크기를 사람이 읽을 수 있는 형식으로 변환
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * 이미지 배치 최적화 제안
   */
  static suggestImagePlacement(
    metadata: ImageAnalysisMetadata,
  ): {
    placement: 'full-width' | 'centered' | 'side-by-side';
    caption?: string;
  } {
    const {orientation, aspectRatio} = metadata;

    if (orientation === 'landscape' && aspectRatio > 1.5) {
      return {
        placement: 'full-width',
        caption: '파노라마 이미지로 전체 너비로 표시하는 것을 권장합니다.',
      };
    }

    if (orientation === 'portrait') {
      return {
        placement: 'centered',
        caption: '세로 이미지로 중앙 배치를 권장합니다.',
      };
    }

    return {
      placement: 'full-width',
      caption: '기본 전체 너비로 표시합니다.',
    };
  }

  /**
   * 다중 이미지 최적화 (배치 처리)
   */
  static async optimizeMultipleImages(
    imageUris: string[],
    options: OptimizationOptions = {},
  ): Promise<ImageInfo[]> {
    const promises = imageUris.map(uri => this.optimizeImage(uri, options));
    return Promise.all(promises);
  }

  /**
   * 이미지 URL에서 파일명 추출
   */
  static extractFileName(uri: string): string {
    const parts = uri.split('/');
    const fileName = parts[parts.length - 1];
    return fileName || 'image.jpg';
  }

  /**
   * 이미지 MIME 타입 확인
   */
  static getMimeType(uri: string): string {
    const extension = uri.split('.').pop()?.toLowerCase();

    const mimeTypes: {[key: string]: string} = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
      heic: 'image/heic',
    };

    return mimeTypes[extension || 'jpg'] || 'image/jpeg';
  }

  /**
   * 블로그 플랫폼별 이미지 최적화 설정 가져오기
   */
  static getPlatformOptimizationSettings(
    platform: 'naver' | 'tistory' | 'velog',
  ): OptimizationOptions {
    const settings: {[key: string]: OptimizationOptions} = {
      naver: {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.85,
        format: 'jpeg',
      },
      tistory: {
        maxWidth: 2048,
        maxHeight: 2048,
        quality: 0.9,
        format: 'jpeg',
      },
      velog: {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.85,
        format: 'jpeg',
      },
    };

    return settings[platform] || settings.naver;
  }

  /**
   * 이미지 배열을 그리드 레이아웃으로 정렬하기 위한 제안
   */
  static suggestGridLayout(imageCount: number): {
    columns: number;
    rows: number;
    layout: 'grid' | 'masonry' | 'carousel';
  } {
    if (imageCount === 1) {
      return {columns: 1, rows: 1, layout: 'grid'};
    }

    if (imageCount === 2) {
      return {columns: 2, rows: 1, layout: 'grid'};
    }

    if (imageCount === 3) {
      return {columns: 3, rows: 1, layout: 'grid'};
    }

    if (imageCount === 4) {
      return {columns: 2, rows: 2, layout: 'grid'};
    }

    if (imageCount <= 6) {
      return {columns: 3, rows: 2, layout: 'grid'};
    }

    // 7개 이상이면 캐러셀 추천
    return {columns: 1, rows: 1, layout: 'carousel'};
  }
}

/**
 * 이미지 검증 유틸리티
 */
export class ImageValidator {
  /**
   * 지원되는 이미지 형식인지 확인
   */
  static isSupportedFormat(uri: string): boolean {
    const supportedFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic'];
    const extension = uri.split('.').pop()?.toLowerCase();
    return extension ? supportedFormats.includes(extension) : false;
  }

  /**
   * 이미지 URI가 유효한지 확인
   */
  static isValidUri(uri: string): boolean {
    if (!uri) return false;

    // HTTP(S) URL
    if (uri.startsWith('http://') || uri.startsWith('https://')) {
      return true;
    }

    // 로컬 파일
    if (uri.startsWith('file://')) {
      return true;
    }

    // Content URI (Android)
    if (Platform.OS === 'android' && uri.startsWith('content://')) {
      return true;
    }

    // Asset 또는 상대 경로
    return uri.length > 0;
  }

  /**
   * 이미지 배열이 모두 유효한지 확인
   */
  static areAllImagesValid(uris: string[]): boolean {
    return uris.every(uri => this.isValidUri(uri) && this.isSupportedFormat(uri));
  }

  /**
   * 최소/최대 이미지 수 검증
   */
  static isImageCountValid(
    count: number,
    min: number = 1,
    max: number = 10,
  ): boolean {
    return count >= min && count <= max;
  }
}
