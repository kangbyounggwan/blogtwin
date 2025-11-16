/**
 * AI Assistant Service
 * 글 작성 중 AI 어시스턴트 기능을 제공하는 서비스
 */

import {OpenAIService} from './OpenAIService';
import {ChatMessage} from '@types/openai';

export interface PolishResult {
  originalText: string;
  polishedText: string;
  changes: string[];
}

export interface SpellCheckResult {
  hasErrors: boolean;
  corrections: Array<{
    original: string;
    corrected: string;
    reason: string;
  }>;
  correctedText: string;
}

export interface SuggestionResult {
  suggestions: string[];
  reasoning: string;
}

export interface ImprovementResult {
  improved: string;
  improvements: string[];
}

/**
 * AI 어시스턴트 서비스
 */
export class AIAssistantService {
  /**
   * 문장 다듬기
   * 선택한 문장이나 문단을 더 자연스럽고 읽기 좋게 개선
   */
  static async polishSentence(
    text: string,
    style?: string,
  ): Promise<PolishResult> {
    const systemPrompt = `당신은 전문 에디터입니다. 주어진 문장을 더 자연스럽고 읽기 좋게 다듬어주세요.
${style ? `\n사용자의 글쓰기 스타일: ${style}` : ''}

다음 규칙을 따라주세요:
1. 원문의 의미를 변경하지 않습니다
2. 더 자연스러운 표현으로 개선합니다
3. 불필요한 반복을 제거합니다
4. 문장 구조를 개선합니다
5. 가독성을 높입니다

JSON 형식으로 응답해주세요:
{
  "polishedText": "다듬어진 문장",
  "changes": ["변경 사항 1", "변경 사항 2"]
}`;

    const messages: ChatMessage[] = [
      {role: 'system', content: systemPrompt},
      {role: 'user', content: text},
    ];

    try {
      const response = await OpenAIService.generateText(messages, {
        temperature: 0.3,
        maxTokens: 1000,
      });

      const result = JSON.parse(response.content);

      return {
        originalText: text,
        polishedText: result.polishedText,
        changes: result.changes || [],
      };
    } catch (error) {
      console.error('Failed to polish sentence:', error);
      throw new Error('문장 다듬기에 실패했습니다.');
    }
  }

  /**
   * 맞춤법 및 문법 검사
   */
  static async checkSpelling(text: string): Promise<SpellCheckResult> {
    const systemPrompt = `당신은 맞춤법 및 문법 검사 전문가입니다. 주어진 텍스트의 맞춤법과 문법 오류를 찾아 수정해주세요.

다음을 확인해주세요:
1. 맞춤법 오류
2. 띄어쓰기 오류
3. 문법 오류
4. 잘못된 표현

JSON 형식으로 응답해주세요:
{
  "hasErrors": true/false,
  "corrections": [
    {
      "original": "원래 표현",
      "corrected": "수정된 표현",
      "reason": "수정 이유"
    }
  ],
  "correctedText": "전체 수정된 텍스트"
}`;

    const messages: ChatMessage[] = [
      {role: 'system', content: systemPrompt},
      {role: 'user', content: text},
    ];

    try {
      const response = await OpenAIService.generateText(messages, {
        temperature: 0.1,
        maxTokens: 1500,
      });

      const result = JSON.parse(response.content);

      return {
        hasErrors: result.hasErrors || false,
        corrections: result.corrections || [],
        correctedText: result.correctedText || text,
      };
    } catch (error) {
      console.error('Failed to check spelling:', error);
      throw new Error('맞춤법 검사에 실패했습니다.');
    }
  }

  /**
   * 다음 문단 제안
   * 현재 내용을 분석하여 다음에 올 문단을 제안
   */
  static async suggestNextParagraph(
    currentContent: string,
    topic: string,
  ): Promise<SuggestionResult> {
    const systemPrompt = `당신은 블로그 글쓰기 어시스턴트입니다. 현재까지 작성된 내용을 분석하여 다음 문단에 어떤 내용을 쓰면 좋을지 3가지 제안을 해주세요.

제안은 다음과 같아야 합니다:
1. 글의 흐름을 자연스럽게 이어갈 수 있어야 함
2. 주제와 관련이 있어야 함
3. 독자에게 가치 있는 내용이어야 함

JSON 형식으로 응답해주세요:
{
  "suggestions": ["제안 1", "제안 2", "제안 3"],
  "reasoning": "이러한 제안을 한 이유"
}`;

    const userMessage = `주제: ${topic}\n\n현재 내용:\n${currentContent}`;

    const messages: ChatMessage[] = [
      {role: 'system', content: systemPrompt},
      {role: 'user', content: userMessage},
    ];

    try {
      const response = await OpenAIService.generateText(messages, {
        temperature: 0.7,
        maxTokens: 800,
      });

      const result = JSON.parse(response.content);

      return {
        suggestions: result.suggestions || [],
        reasoning: result.reasoning || '',
      };
    } catch (error) {
      console.error('Failed to suggest next paragraph:', error);
      throw new Error('문단 제안에 실패했습니다.');
    }
  }

  /**
   * 표현 개선
   * 지루하거나 반복적인 표현을 더 풍부하고 다양하게 개선
   */
  static async improveExpression(text: string): Promise<ImprovementResult> {
    const systemPrompt = `당신은 글쓰기 전문가입니다. 주어진 텍스트의 표현을 더 풍부하고 다양하게 개선해주세요.

개선 사항:
1. 진부한 표현을 신선한 표현으로
2. 반복되는 단어를 다양한 동의어로
3. 평범한 표현을 더 생동감 있게
4. 추상적인 표현을 구체적으로

JSON 형식으로 응답해주세요:
{
  "improved": "개선된 텍스트",
  "improvements": ["개선 사항 1", "개선 사항 2"]
}`;

    const messages: ChatMessage[] = [
      {role: 'system', content: systemPrompt},
      {role: 'user', content: text},
    ];

    try {
      const response = await OpenAIService.generateText(messages, {
        temperature: 0.5,
        maxTokens: 1000,
      });

      const result = JSON.parse(response.content);

      return {
        improved: result.improved || text,
        improvements: result.improvements || [],
      };
    } catch (error) {
      console.error('Failed to improve expression:', error);
      throw new Error('표현 개선에 실패했습니다.');
    }
  }

  /**
   * 내용 확장
   * 짧은 문장이나 아이디어를 더 자세하고 풍부하게 확장
   */
  static async expandContent(
    text: string,
    targetLength?: 'short' | 'medium' | 'long',
  ): Promise<string> {
    const lengthGuide = {
      short: '50-100단어 정도',
      medium: '150-250단어 정도',
      long: '300-500단어 정도',
    };

    const systemPrompt = `당신은 콘텐츠 작성 전문가입니다. 주어진 짧은 내용을 ${
      lengthGuide[targetLength || 'medium']
    }로 확장해주세요.

확장 시 다음을 포함하세요:
1. 구체적인 예시나 사례
2. 추가 설명과 상세 정보
3. 독자가 궁금해할 만한 내용
4. 실용적인 팁이나 조언

자연스럽고 읽기 좋은 문단으로 작성해주세요.`;

    const messages: ChatMessage[] = [
      {role: 'system', content: systemPrompt},
      {role: 'user', content: text},
    ];

    try {
      const response = await OpenAIService.generateText(messages, {
        temperature: 0.7,
        maxTokens: 1500,
      });

      return response.content;
    } catch (error) {
      console.error('Failed to expand content:', error);
      throw new Error('내용 확장에 실패했습니다.');
    }
  }

  /**
   * 요약 생성
   * 긴 문단을 핵심만 담은 짧은 요약으로 압축
   */
  static async summarize(
    text: string,
    maxLength?: number,
  ): Promise<string> {
    const systemPrompt = `당신은 전문 에디터입니다. 주어진 텍스트를 ${
      maxLength || 100
    }자 이내로 요약해주세요.

요약 시 다음을 지켜주세요:
1. 핵심 내용만 포함
2. 중요하지 않은 세부사항은 제외
3. 원문의 주요 메시지 유지
4. 간결하고 명확하게

요약된 텍스트만 반환해주세요.`;

    const messages: ChatMessage[] = [
      {role: 'system', content: systemPrompt},
      {role: 'user', content: text},
    ];

    try {
      const response = await OpenAIService.generateText(messages, {
        temperature: 0.3,
        maxTokens: 500,
      });

      return response.content;
    } catch (error) {
      console.error('Failed to summarize:', error);
      throw new Error('요약에 실패했습니다.');
    }
  }

  /**
   * 톤 조정
   * 글의 톤을 목적에 맞게 조정 (격식/캐주얼/전문적/친근함)
   */
  static async adjustTone(
    text: string,
    targetTone: 'formal' | 'casual' | 'professional' | 'friendly',
  ): Promise<string> {
    const toneDescriptions = {
      formal: '격식 있고 공손한',
      casual: '편안하고 자연스러운',
      professional: '전문적이고 신뢰감 있는',
      friendly: '친근하고 따뜻한',
    };

    const systemPrompt = `당신은 글쓰기 전문가입니다. 주어진 텍스트를 ${toneDescriptions[targetTone]} 톤으로 다시 작성해주세요.

톤 조정 시 주의사항:
1. 원문의 핵심 내용과 의미는 유지
2. ${toneDescriptions[targetTone]} 어투와 표현 사용
3. 대상 독자에 맞는 적절한 단어 선택
4. 자연스럽고 일관성 있게

조정된 텍스트만 반환해주세요.`;

    const messages: ChatMessage[] = [
      {role: 'system', content: systemPrompt},
      {role: 'user', content: text},
    ];

    try {
      const response = await OpenAIService.generateText(messages, {
        temperature: 0.5,
        maxTokens: 1000,
      });

      return response.content;
    } catch (error) {
      console.error('Failed to adjust tone:', error);
      throw new Error('톤 조정에 실패했습니다.');
    }
  }

  /**
   * 제목 개선
   * 본문 내용을 분석하여 더 매력적인 제목 제안
   */
  static async improveTitleFromContent(
    content: string,
    currentTitle?: string,
  ): Promise<string[]> {
    const systemPrompt = `당신은 블로그 제목 전문가입니다. 주어진 본문 내용을 분석하여 매력적인 제목 5개를 제안해주세요.

제목 작성 원칙:
1. 클릭을 유도하는 매력적인 표현
2. 본문의 핵심 내용 반영
3. SEO에 유리한 키워드 포함
4. 20-40자 길이
5. 호기심을 자극하는 표현

JSON 배열로 5개의 제목을 반환해주세요:
["제목1", "제목2", "제목3", "제목4", "제목5"]`;

    const userMessage = currentTitle
      ? `현재 제목: ${currentTitle}\n\n본문:\n${content.substring(0, 1000)}`
      : `본문:\n${content.substring(0, 1000)}`;

    const messages: ChatMessage[] = [
      {role: 'system', content: systemPrompt},
      {role: 'user', content: userMessage},
    ];

    try {
      const response = await OpenAIService.generateText(messages, {
        temperature: 0.8,
        maxTokens: 500,
      });

      const titles = JSON.parse(response.content);
      return Array.isArray(titles) ? titles : [response.content];
    } catch (error) {
      console.error('Failed to improve title:', error);
      throw new Error('제목 개선에 실패했습니다.');
    }
  }

  /**
   * SEO 키워드 추천
   * 본문 내용을 분석하여 SEO에 유리한 키워드 추천
   */
  static async suggestSEOKeywords(
    content: string,
    count: number = 10,
  ): Promise<string[]> {
    const systemPrompt = `당신은 SEO 전문가입니다. 주어진 블로그 글 내용을 분석하여 SEO에 효과적인 키워드 ${count}개를 추천해주세요.

키워드 선정 기준:
1. 본문 내용과 관련성이 높음
2. 검색량이 있을 만한 키워드
3. 롱테일 키워드 포함
4. 자연스럽게 삽입 가능한 키워드

JSON 배열로 키워드만 반환해주세요:
["키워드1", "키워드2", ...]`;

    const messages: ChatMessage[] = [
      {role: 'system', content: systemPrompt},
      {role: 'user', content: content.substring(0, 1500)},
    ];

    try {
      const response = await OpenAIService.generateText(messages, {
        temperature: 0.5,
        maxTokens: 300,
      });

      const keywords = JSON.parse(response.content);
      return Array.isArray(keywords) ? keywords.slice(0, count) : [];
    } catch (error) {
      console.error('Failed to suggest SEO keywords:', error);
      throw new Error('SEO 키워드 추천에 실패했습니다.');
    }
  }
}
