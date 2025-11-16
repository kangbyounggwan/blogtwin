/**
 * Content Generation Service
 * AI를 활용한 블로그 컨텐츠 생성
 */

import {OpenAIService, ChatMessage} from './OpenAIService';
import {StyleAnalysisService} from './StyleAnalysisService';
import {PromptTemplates} from '@/templates/promptTemplates';
import {TextProcessor} from '@/utils/textProcessing';
import {GenerationOptions, GeneratedContent, TitleSuggestion, GenerationProgress} from '@/types/generation';
import {useAIStore} from '@/stores/aiStore';

export class ContentGenerationService {
  /**
   * 카테고리별 블로그 글 생성 (전체 프로세스)
   */
  static async generatePost(
    options: GenerationOptions,
    onProgress?: (progress: GenerationProgress) => void,
  ): Promise<GeneratedContent> {
    try {
      // 1단계: 준비
      onProgress?.({
        stage: 'preparing',
        percentage: 0,
        message: '글 생성 준비 중...',
      });

      // 사용자 스타일 프로파일 로드 (있다면)
      let stylePrompt: string | undefined;
      if (options.userStyleProfile) {
        stylePrompt = options.userStyleProfile;
      }

      // 2단계: 메인 컨텐츠 생성
      onProgress?.({
        stage: 'generating_content',
        percentage: 20,
        message: '본문 작성 중...',
      });

      const systemPrompt = PromptTemplates.getSystemPrompt(stylePrompt);
      const userPrompt = PromptTemplates.getCategoryPostPrompt({
        topic: options.topic,
        category: options.category,
        keywords: options.keywords,
        tone: options.tone,
        length: options.length,
        additionalInstructions: options.category
          ? PromptTemplates.getCategorySpecificPrompt(options.category)
          : undefined,
      });

      const messages: ChatMessage[] = [
        {role: 'system', content: systemPrompt},
        {role: 'user', content: userPrompt},
      ];

      let generatedText = '';
      let usage;

      if (options.streaming) {
        // 스트리밍 생성
        const result = await OpenAIService.generateTextStream(messages, {
          streaming: true,
          maxTokens: this.getMaxTokensByLength(options.length),
          onProgress: (chunk) => {
            generatedText += chunk;
            onProgress?.({
              stage: 'generating_content',
              percentage: 50,
              message: '본문 작성 중...',
              currentText: generatedText,
            });
          },
        });
        usage = result.usage;
      } else {
        // 일반 생성
        const result = await OpenAIService.generateText(messages, {
          maxTokens: this.getMaxTokensByLength(options.length),
        });
        generatedText = result.content;
        usage = result.usage;
      }

      // JSON 파싱
      const parsed = JSON.parse(generatedText);

      // 3단계: 후처리
      onProgress?.({
        stage: 'generating_tags',
        percentage: 80,
        message: '마무리 작업 중...',
      });

      const content = parsed.content;
      const title = parsed.title;
      const tags = parsed.tags || [];

      // 텍스트 통계
      const stats = TextProcessor.calculateStats(content);
      const readingTime = TextProcessor.estimateReadingTime(content);

      // 4단계: 완료
      onProgress?.({
        stage: 'complete',
        percentage: 100,
        message: '생성 완료!',
      });

      return {
        title,
        content,
        tags,
        category: options.category,
        wordCount: stats.wordCount,
        estimatedReadTime: readingTime,
        generatedAt: new Date().toISOString(),
        tokenUsage: usage,
      };
    } catch (error) {
      console.error('ContentGenerationService generatePost error:', error);
      throw error;
    }
  }

  /**
   * 제목 개선
   */
  static async improveTitles(
    originalTitle: string,
    content: string,
  ): Promise<TitleSuggestion[]> {
    try {
      const prompt = PromptTemplates.getTitleImprovementPrompt(originalTitle, content);

      const messages: ChatMessage[] = [
        {role: 'system', content: 'You are a creative title writer.'},
        {role: 'user', content: prompt},
      ];

      const {content: response} = await OpenAIService.generateText(messages, {
        maxTokens: 500,
      });

      const parsed = JSON.parse(response);
      return parsed.titles;
    } catch (error) {
      console.error('ContentGenerationService improveTitles error:', error);
      throw error;
    }
  }

  /**
   * 해시태그 생성
   */
  static async generateHashtags(
    title: string,
    content: string,
    count: number = 7,
  ): Promise<string[]> {
    try {
      const prompt = PromptTemplates.getHashtagPrompt(title, content, count);

      const messages: ChatMessage[] = [
        {role: 'system', content: 'You are a hashtag expert.'},
        {role: 'user', content: prompt},
      ];

      const {content: response} = await OpenAIService.generateText(messages, {
        maxTokens: 200,
      });

      const parsed = JSON.parse(response);
      return parsed.tags;
    } catch (error) {
      console.error('ContentGenerationService generateHashtags error:', error);
      throw error;
    }
  }

  /**
   * 내용 확장
   */
  static async expandContent(
    currentContent: string,
    section: string,
  ): Promise<string> {
    try {
      const prompt = PromptTemplates.getContentExpansionPrompt(currentContent, section);

      const messages: ChatMessage[] = [
        {role: 'system', content: 'You are a content writer.'},
        {role: 'user', content: prompt},
      ];

      const {content: response} = await OpenAIService.generateText(messages, {
        maxTokens: 500,
      });

      return response;
    } catch (error) {
      console.error('ContentGenerationService expandContent error:', error);
      throw error;
    }
  }

  /**
   * 어조 조정
   */
  static async adjustTone(
    content: string,
    targetTone: 'formal' | 'casual' | 'professional' | 'friendly',
  ): Promise<string> {
    try {
      const prompt = PromptTemplates.getToneAdjustmentPrompt(content, targetTone);

      const messages: ChatMessage[] = [
        {role: 'system', content: 'You are a writing style expert.'},
        {role: 'user', content: prompt},
      ];

      const {content: response} = await OpenAIService.generateText(messages, {
        maxTokens: 3000,
      });

      return response;
    } catch (error) {
      console.error('ContentGenerationService adjustTone error:', error);
      throw error;
    }
  }

  /**
   * 요약 생성
   */
  static async generateSummary(
    content: string,
    maxLength: number = 150,
  ): Promise<string> {
    try {
      const prompt = PromptTemplates.getSummaryPrompt(content, maxLength);

      const messages: ChatMessage[] = [
        {role: 'system', content: 'You are a summarization expert.'},
        {role: 'user', content: prompt},
      ];

      const {content: response} = await OpenAIService.generateText(messages, {
        maxTokens: 200,
      });

      return response;
    } catch (error) {
      console.error('ContentGenerationService generateSummary error:', error);
      throw error;
    }
  }

  /**
   * 서론 생성
   */
  static async generateIntroduction(
    topic: string,
    style?: string,
  ): Promise<string> {
    try {
      const prompt = PromptTemplates.getIntroductionPrompt(topic, style);

      const messages: ChatMessage[] = [
        {role: 'system', content: 'You are a blog writer.'},
        {role: 'user', content: prompt},
      ];

      const {content: response} = await OpenAIService.generateText(messages, {
        maxTokens: 400,
      });

      return response;
    } catch (error) {
      console.error('ContentGenerationService generateIntroduction error:', error);
      throw error;
    }
  }

  /**
   * 결론 생성
   */
  static async generateConclusion(
    content: string,
    style?: string,
  ): Promise<string> {
    try {
      const prompt = PromptTemplates.getConclusionPrompt(content, style);

      const messages: ChatMessage[] = [
        {role: 'system', content: 'You are a blog writer.'},
        {role: 'user', content: prompt},
      ];

      const {content: response} = await OpenAIService.generateText(messages, {
        maxTokens: 300,
      });

      return response;
    } catch (error) {
      console.error('ContentGenerationService generateConclusion error:', error);
      throw error;
    }
  }

  /**
   * 길이별 최대 토큰 수
   */
  private static getMaxTokensByLength(length?: 'short' | 'medium' | 'long'): number {
    const tokenLimits = {
      short: 1500,
      medium: 2500,
      long: 4000,
    };

    return tokenLimits[length || 'medium'];
  }

  /**
   * 사용자 스타일을 적용한 글 생성
   */
  static async generateWithUserStyle(
    userId: string,
    options: GenerationOptions,
    onProgress?: (progress: GenerationProgress) => void,
  ): Promise<GeneratedContent> {
    try {
      // 사용자 스타일 프로파일 로드
      const profile = await StyleAnalysisService.getUserStyleProfile(userId);

      let stylePrompt: string | undefined;
      if (profile) {
        stylePrompt = StyleAnalysisService.convertProfileToPrompt(profile);
      }

      // 스타일 적용하여 생성
      return await this.generatePost(
        {
          ...options,
          userStyleProfile: stylePrompt,
        },
        onProgress,
      );
    } catch (error) {
      console.error('ContentGenerationService generateWithUserStyle error:', error);
      // 스타일 로드 실패 시 기본 생성으로 폴백
      return await this.generatePost(options, onProgress);
    }
  }
}
