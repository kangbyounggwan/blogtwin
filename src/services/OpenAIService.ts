/**
 * OpenAI Service
 * GPT-4 및 GPT-4 Vision API 통합
 */

import OpenAI from 'openai';
import {Config} from '@/constants';
import {CacheService} from './CacheService';
import crypto from 'crypto';

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: Config.OPENAI_API_KEY,
});

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ImageAnalysisResult {
  description: string;
  objects: string[];
  mood: string;
  suggestedTitle?: string;
  suggestedContent?: string;
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCost: number;
}

export interface GenerationOptions {
  temperature?: number;
  maxTokens?: number;
  streaming?: boolean;
  onProgress?: (chunk: string) => void;
}

export class OpenAIService {
  /**
   * Generate cache key from messages
   */
  private static generateCacheKey(messages: ChatMessage[], options: any = {}): string {
    const data = JSON.stringify({messages, options});
    return crypto.createHash('md5').update(data).digest('hex');
  }

  /**
   * GPT-4 텍스트 생성 (non-streaming) with caching
   */
  static async generateText(
    messages: ChatMessage[],
    options: GenerationOptions = {},
  ): Promise<{content: string; usage: TokenUsage}> {
    // Check cache for non-streaming requests
    if (!options.streaming) {
      const cacheKey = `openai_text_${this.generateCacheKey(messages, options)}`;
      const cached = await CacheService.get<{content: string; usage: TokenUsage}>(cacheKey);
      if (cached) {
        console.log('[OpenAIService] Cache hit for generateText');
        return cached;
      }
    }
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 2000,
        stream: false,
      });

      const content = response.choices[0]?.message?.content || '';
      const usage = this.calculateUsage(response.usage);

      // 로깅
      this.logRequest('gpt-4', messages, content, usage);

      // Cache the result (TTL: 1 hour)
      if (!options.streaming) {
        const cacheKey = `openai_text_${this.generateCacheKey(messages, options)}`;
        await CacheService.set(cacheKey, {content, usage}, {
          ttl: 60 * 60 * 1000, // 1 hour
          persist: true,
        });
      }

      return {content, usage};
    } catch (error) {
      console.error('OpenAI generateText error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * GPT-4 텍스트 생성 (streaming)
   */
  static async generateTextStream(
    messages: ChatMessage[],
    options: GenerationOptions,
  ): Promise<{content: string; usage: TokenUsage}> {
    try {
      const stream = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 2000,
        stream: true,
      });

      let fullContent = '';

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content || '';
        if (delta) {
          fullContent += delta;
          options.onProgress?.(delta);
        }
      }

      // Streaming에서는 usage 정보가 제공되지 않으므로 추정
      const estimatedUsage = this.estimateTokenUsage(messages, fullContent);

      this.logRequest('gpt-4-stream', messages, fullContent, estimatedUsage);

      return {content: fullContent, usage: estimatedUsage};
    } catch (error) {
      console.error('OpenAI generateTextStream error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * GPT-4 Vision 이미지 분석
   */
  static async analyzeImage(
    imageUrl: string,
    prompt: string = '이 이미지를 자세히 설명해주세요.',
  ): Promise<ImageAnalysisResult> {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {type: 'text', text: prompt},
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                },
              },
            ],
          },
        ],
        max_tokens: 1000,
      });

      const content = response.choices[0]?.message?.content || '';

      // 결과 파싱
      const result: ImageAnalysisResult = {
        description: content,
        objects: this.extractObjects(content),
        mood: this.extractMood(content),
      };

      const usage = this.calculateUsage(response.usage);
      this.logRequest('gpt-4-vision', [{role: 'user', content: prompt}], content, usage);

      return result;
    } catch (error) {
      console.error('OpenAI analyzeImage error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * 이미지 기반 블로그 글 생성
   */
  static async generatePostFromImage(
    imageUrl: string,
    userStyle?: string,
  ): Promise<{title: string; content: string; usage: TokenUsage}> {
    try {
      // 1단계: 이미지 분석
      const analysis = await this.analyzeImage(
        imageUrl,
        '이 이미지에서 보이는 것들을 자세히 설명하고, 분위기와 특징을 파악해주세요.',
      );

      // 2단계: 블로그 글 생성
      const styleInstruction = userStyle
        ? `다음은 사용자의 글쓰기 스타일입니다:\n${userStyle}\n\n이 스타일을 참고하여 글을 작성해주세요.`
        : '친근하고 자연스러운 블로그 글 스타일로 작성해주세요.';

      const messages: ChatMessage[] = [
        {
          role: 'system',
          content: `당신은 블로그 글 작성 전문가입니다. ${styleInstruction}`,
        },
        {
          role: 'user',
          content: `다음 이미지 분석 결과를 바탕으로 블로그 포스팅을 작성해주세요:

이미지 설명: ${analysis.description}

요구사항:
1. 매력적인 제목을 만들어주세요
2. 자연스러운 도입부로 시작하세요
3. 이미지에 대한 설명을 본문에 녹여내세요
4. 감정과 느낌을 표현하세요
5. 독자에게 공감을 이끌어내세요

JSON 형식으로 응답해주세요:
{
  "title": "제목",
  "content": "본문 내용"
}`,
        },
      ];

      const {content, usage} = await this.generateText(messages, {maxTokens: 2500});

      // JSON 파싱
      const parsed = JSON.parse(content);

      return {
        title: parsed.title,
        content: parsed.content,
        usage,
      };
    } catch (error) {
      console.error('OpenAI generatePostFromImage error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * 카테고리별 블로그 글 생성
   */
  static async generatePostByCategory(
    category: string,
    topic: string,
    userStyle?: string,
    options: GenerationOptions = {},
  ): Promise<{title: string; content: string; usage: TokenUsage}> {
    try {
      const styleInstruction = userStyle
        ? `다음은 사용자의 글쓰기 스타일입니다:\n${userStyle}\n\n이 스타일을 완벽하게 모방하여 글을 작성해주세요.`
        : '친근하고 자연스러운 블로그 글 스타일로 작성해주세요.';

      const messages: ChatMessage[] = [
        {
          role: 'system',
          content: `당신은 블로그 글 작성 전문가입니다. ${styleInstruction}`,
        },
        {
          role: 'user',
          content: `카테고리: ${category}
주제: ${topic}

위 주제로 블로그 포스팅을 작성해주세요.

요구사항:
1. 카테고리에 맞는 매력적인 제목
2. 독자의 관심을 끄는 도입부
3. 구체적이고 유용한 내용
4. 자연스러운 문체와 흐름
5. 적절한 문단 구분

JSON 형식으로 응답해주세요:
{
  "title": "제목",
  "content": "본문 내용 (마크다운 형식)"
}`,
        },
      ];

      const {content, usage} = options.streaming
        ? await this.generateTextStream(messages, options)
        : await this.generateText(messages, {maxTokens: 3000});

      // JSON 파싱
      const parsed = JSON.parse(content);

      return {
        title: parsed.title,
        content: parsed.content,
        usage,
      };
    } catch (error) {
      console.error('OpenAI generatePostByCategory error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * 토큰 사용량 계산
   */
  private static calculateUsage(usage: any): TokenUsage {
    const promptTokens = usage?.prompt_tokens || 0;
    const completionTokens = usage?.completion_tokens || 0;
    const totalTokens = usage?.total_tokens || 0;

    // GPT-4 가격 (2024년 기준)
    // Input: $0.03 / 1K tokens
    // Output: $0.06 / 1K tokens
    const estimatedCost =
      (promptTokens / 1000) * 0.03 + (completionTokens / 1000) * 0.06;

    return {
      promptTokens,
      completionTokens,
      totalTokens,
      estimatedCost,
    };
  }

  /**
   * 토큰 사용량 추정 (streaming용)
   */
  private static estimateTokenUsage(messages: ChatMessage[], completion: string): TokenUsage {
    // 간단한 토큰 추정 (실제로는 tiktoken 라이브러리 사용 권장)
    const estimateTokens = (text: string) => Math.ceil(text.length / 4);

    const promptText = messages.map(m => m.content).join(' ');
    const promptTokens = estimateTokens(promptText);
    const completionTokens = estimateTokens(completion);
    const totalTokens = promptTokens + completionTokens;

    const estimatedCost =
      (promptTokens / 1000) * 0.03 + (completionTokens / 1000) * 0.06;

    return {
      promptTokens,
      completionTokens,
      totalTokens,
      estimatedCost,
    };
  }

  /**
   * 이미지 분석 결과에서 객체 추출
   */
  private static extractObjects(description: string): string[] {
    // 간단한 구현 - 실제로는 더 정교한 파싱 필요
    const keywords = ['사람', '동물', '건물', '자동차', '나무', '꽃', '음식'];
    return keywords.filter(keyword => description.includes(keyword));
  }

  /**
   * 이미지 분석 결과에서 분위기 추출
   */
  private static extractMood(description: string): string {
    const moodKeywords = {
      happy: ['밝은', '행복', '즐거운', '화사한'],
      calm: ['평화로운', '고요한', '차분한', '여유로운'],
      dramatic: ['극적인', '강렬한', '인상적인'],
      cozy: ['아늑한', '따뜻한', '편안한'],
    };

    for (const [mood, keywords] of Object.entries(moodKeywords)) {
      if (keywords.some(keyword => description.includes(keyword))) {
        return mood;
      }
    }

    return 'neutral';
  }

  /**
   * 요청/응답 로깅
   */
  private static logRequest(
    model: string,
    messages: ChatMessage[],
    response: string,
    usage: TokenUsage,
  ): void {
    console.log('OpenAI Request:', {
      model,
      timestamp: new Date().toISOString(),
      promptLength: messages.reduce((sum, m) => sum + m.content.length, 0),
      responseLength: response.length,
      usage,
    });

    // TODO: Supabase에 로그 저장
  }

  /**
   * 에러 처리
   */
  private static handleError(error: any): Error {
    if (error?.error?.type === 'insufficient_quota') {
      return new Error('OpenAI API 할당량이 부족합니다. API 키를 확인해주세요.');
    }

    if (error?.error?.type === 'invalid_request_error') {
      return new Error('잘못된 요청입니다. 파라미터를 확인해주세요.');
    }

    if (error?.status === 429) {
      return new Error('요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.');
    }

    return new Error(`OpenAI API 오류: ${error?.message || '알 수 없는 오류'}`);
  }

  /**
   * 재시도 로직
   */
  static async retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
  ): Promise<T> {
    let lastError: Error | undefined;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;

        // Rate limit 에러가 아니면 재시도하지 않음
        if (!(error as any)?.status === 429) {
          throw error;
        }

        // 지수 백오프
        const delay = Math.pow(2, i) * 1000;
        console.log(`Retrying after ${delay}ms... (attempt ${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError || new Error('Max retries exceeded');
  }
}
