/**
 * Publish Service
 * 블로그 글 발행 서비스
 */

import {
  PublishRequest,
  PublishResult,
  PublishHistory,
  PublishValidation,
  PublishStatus,
  ScheduledPost,
} from '@types/publish';
import {supabase} from '@lib/supabase';

/**
 * 발행 서비스
 *
 * 참고: 네이버 블로그는 공식 API로 글 작성을 지원하지 않습니다.
 * 현재는 발행 준비, 검증, 히스토리 관리 기능을 제공하며,
 * 실제 발행은 다음 방법 중 하나를 사용해야 합니다:
 *
 * 1. 네이버 블로그 모바일 웹뷰 사용
 * 2. 클립보드 복사 → 수동 붙여넣기
 * 3. 네이버 스마트에디터 연동 (비공식)
 */
export class PublishService {
  /**
   * 발행 전 검증
   */
  static validatePublish(request: PublishRequest): PublishValidation {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 제목 검증
    if (!request.title || request.title.trim().length === 0) {
      errors.push('제목을 입력해주세요.');
    } else if (request.title.length > 100) {
      errors.push('제목은 100자 이내로 입력해주세요.');
    }

    // 내용 검증
    if (!request.content || request.content.trim().length === 0) {
      errors.push('내용을 입력해주세요.');
    } else if (request.content.length < 100) {
      warnings.push('내용이 너무 짧습니다. 100자 이상 권장합니다.');
    }

    // 태그 검증
    if (request.settings.tags && request.settings.tags.length > 10) {
      warnings.push('태그는 10개 이하를 권장합니다.');
    }

    // 예약 발행 검증
    if (request.settings.scheduleDate) {
      const now = new Date();
      if (request.settings.scheduleDate <= now) {
        errors.push('예약 시간은 현재 시간 이후여야 합니다.');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * 발행 준비 (현재는 검증 및 히스토리 생성)
   */
  static async preparePublish(request: PublishRequest): Promise<PublishResult> {
    try {
      // 검증
      const validation = this.validatePublish(request);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.errors.join('\n'),
        };
      }

      // 예약 발행인 경우
      if (request.settings.scheduleDate) {
        await this.schedulePublish(request);
        return {
          success: true,
          error: '예약 발행이 등록되었습니다.',
        };
      }

      // 발행 히스토리 생성
      const history = await this.createPublishHistory({
        postId: request.postId,
        platform: request.settings.platform,
        title: request.title,
        status: 'publishing',
      });

      // 네이버 블로그는 공식 API가 없으므로 안내 메시지 반환
      if (request.settings.platform === 'naver') {
        return {
          success: false,
          error: 'naver_manual_required',
        };
      }

      return {
        success: true,
        publishedAt: new Date(),
      };
    } catch (error) {
      console.error('Prepare publish error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '발행 준비 중 오류가 발생했습니다.',
      };
    }
  }

  /**
   * 발행 히스토리 생성
   */
  static async createPublishHistory(
    data: Pick<PublishHistory, 'postId' | 'platform' | 'title' | 'status'>,
  ): Promise<PublishHistory> {
    const now = new Date();
    const history: Omit<PublishHistory, 'id'> = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    const {data: result, error} = await supabase
      .from('publish_history')
      .insert(history)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create publish history: ${error.message}`);
    }

    return result;
  }

  /**
   * 발행 히스토리 업데이트
   */
  static async updatePublishHistory(
    id: string,
    updates: Partial<Pick<PublishHistory, 'status' | 'publishedUrl' | 'publishedAt' | 'error'>>,
  ): Promise<void> {
    const {error} = await supabase
      .from('publish_history')
      .update({
        ...updates,
        updatedAt: new Date(),
      })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to update publish history: ${error.message}`);
    }
  }

  /**
   * 발행 히스토리 조회
   */
  static async getPublishHistory(
    userId: string,
    limit: number = 20,
  ): Promise<PublishHistory[]> {
    const {data, error} = await supabase
      .from('publish_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', {ascending: false})
      .limit(limit);

    if (error) {
      throw new Error(`Failed to get publish history: ${error.message}`);
    }

    return data || [];
  }

  /**
   * 예약 발행 등록
   */
  static async schedulePublish(request: PublishRequest): Promise<ScheduledPost> {
    if (!request.settings.scheduleDate) {
      throw new Error('예약 시간이 지정되지 않았습니다.');
    }

    const scheduledPost: Omit<ScheduledPost, 'id'> = {
      postId: request.postId,
      title: request.title,
      platform: request.settings.platform,
      scheduleDate: request.settings.scheduleDate,
      status: 'pending',
      createdAt: new Date(),
    };

    const {data, error} = await supabase
      .from('scheduled_posts')
      .insert(scheduledPost)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to schedule publish: ${error.message}`);
    }

    return data;
  }

  /**
   * 예약 발행 목록 조회
   */
  static async getScheduledPosts(userId: string): Promise<ScheduledPost[]> {
    const {data, error} = await supabase
      .from('scheduled_posts')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'pending')
      .order('schedule_date', {ascending: true});

    if (error) {
      throw new Error(`Failed to get scheduled posts: ${error.message}`);
    }

    return data || [];
  }

  /**
   * 예약 발행 취소
   */
  static async cancelScheduledPost(id: string): Promise<void> {
    const {error} = await supabase
      .from('scheduled_posts')
      .update({status: 'cancelled'})
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to cancel scheduled post: ${error.message}`);
    }
  }

  /**
   * HTML을 네이버 블로그용 마크업으로 변환
   */
  static convertToNaverMarkup(html: string): string {
    // 기본 HTML 태그를 네이버 블로그가 지원하는 형식으로 변환
    let converted = html;

    // 이미지 태그 처리
    converted = converted.replace(
      /<img([^>]*)src="([^"]*)"([^>]*)>/g,
      '<img$1src="$2"$3 data-ke-mobilestyle="widthOrigin" />',
    );

    // 코드 블록 처리
    converted = converted.replace(
      /<pre><code>(.*?)<\/code><\/pre>/gs,
      '<pre class="ke-code">$1</pre>',
    );

    return converted;
  }

  /**
   * 클립보드용 텍스트 생성 (수동 붙여넣기용)
   */
  static generateClipboardText(request: PublishRequest): string {
    const {title, content, settings} = request;

    let text = `${title}\n\n${content}\n\n`;

    if (settings.tags && settings.tags.length > 0) {
      text += `\n태그: ${settings.tags.join(', ')}`;
    }

    if (settings.category) {
      text += `\n카테고리: ${settings.category}`;
    }

    return text;
  }

  /**
   * 발행 통계 조회
   */
  static async getPublishStats(userId: string): Promise<{
    total: number;
    published: number;
    failed: number;
    scheduled: number;
  }> {
    const {data: history} = await supabase
      .from('publish_history')
      .select('status')
      .eq('user_id', userId);

    const {data: scheduled} = await supabase
      .from('scheduled_posts')
      .select('status')
      .eq('user_id', userId)
      .eq('status', 'pending');

    const total = history?.length || 0;
    const published = history?.filter(h => h.status === 'published').length || 0;
    const failed = history?.filter(h => h.status === 'failed').length || 0;
    const scheduledCount = scheduled?.length || 0;

    return {
      total,
      published,
      failed,
      scheduled: scheduledCount,
    };
  }
}
