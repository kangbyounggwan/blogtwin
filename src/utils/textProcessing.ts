/**
 * Text Processing Utilities
 * 블로그 글 전처리 및 텍스트 분석 유틸리티
 */

export interface TextStats {
  totalLength: number;
  wordCount: number;
  sentenceCount: number;
  paragraphCount: number;
  averageWordLength: number;
  averageSentenceLength: number;
}

export class TextProcessor {
  /**
   * HTML 태그 제거
   */
  static removeHtmlTags(text: string): string {
    return text.replace(/<[^>]*>/g, '');
  }

  /**
   * 특수 문자 정제 (필요한 문장부호는 유지)
   */
  static cleanSpecialChars(text: string): string {
    // URL 제거
    text = text.replace(/https?:\/\/[^\s]+/g, '');

    // 이메일 제거
    text = text.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '');

    // 연속된 공백을 하나로
    text = text.replace(/\s+/g, ' ');

    return text.trim();
  }

  /**
   * 블로그 글 전처리
   */
  static preprocessBlogPost(content: string): string {
    let processed = content;

    // HTML 태그 제거
    processed = this.removeHtmlTags(processed);

    // 특수 문자 정제
    processed = this.cleanSpecialChars(processed);

    return processed;
  }

  /**
   * 문장 분리
   */
  static splitIntoSentences(text: string): string[] {
    // 한국어 문장 종결 부호: . ! ?
    const sentences = text.split(/[.!?]+\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    return sentences;
  }

  /**
   * 단락 분리
   */
  static splitIntoParagraphs(text: string): string[] {
    return text.split(/\n+/)
      .map(p => p.trim())
      .filter(p => p.length > 0);
  }

  /**
   * 단어 분리 (간단한 공백 기반)
   */
  static splitIntoWords(text: string): string[] {
    return text.split(/\s+/)
      .filter(word => word.length > 0);
  }

  /**
   * 텍스트 통계 계산
   */
  static calculateStats(text: string): TextStats {
    const sentences = this.splitIntoSentences(text);
    const paragraphs = this.splitIntoParagraphs(text);
    const words = this.splitIntoWords(text);

    const totalLength = text.length;
    const wordCount = words.length;
    const sentenceCount = sentences.length;
    const paragraphCount = paragraphs.length;

    const averageWordLength = wordCount > 0
      ? words.reduce((sum, word) => sum + word.length, 0) / wordCount
      : 0;

    const averageSentenceLength = sentenceCount > 0
      ? wordCount / sentenceCount
      : 0;

    return {
      totalLength,
      wordCount,
      sentenceCount,
      paragraphCount,
      averageWordLength,
      averageSentenceLength,
    };
  }

  /**
   * 텍스트 요약 (앞부분 추출)
   */
  static extractExcerpt(text: string, maxLength: number = 200): string {
    if (text.length <= maxLength) {
      return text;
    }

    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');

    if (lastSpace > 0) {
      return truncated.substring(0, lastSpace) + '...';
    }

    return truncated + '...';
  }

  /**
   * 주요 키워드 추출 (빈도 기반)
   */
  static extractKeywords(text: string, topN: number = 10): Array<{word: string; count: number}> {
    const words = this.splitIntoWords(text.toLowerCase());

    // 불용어 (간단한 버전)
    const stopwords = new Set([
      '이', '그', '저', '것', '수', '등', '및', '을', '를', '의', '가', '은', '는',
      '에', '에서', '으로', '로', '과', '와', '한', '하다', '있다', '되다', '하는',
      '있는', '되는', '이다', '그리고', '하지만', '그래서', '또한', '또는',
    ]);

    // 단어 빈도 계산
    const wordFreq = new Map<string, number>();
    words.forEach(word => {
      if (word.length > 1 && !stopwords.has(word)) {
        wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
      }
    });

    // 빈도순 정렬
    const sorted = Array.from(wordFreq.entries())
      .map(([word, count]) => ({word, count}))
      .sort((a, b) => b.count - a.count)
      .slice(0, topN);

    return sorted;
  }

  /**
   * 문장 길이 분포
   */
  static getSentenceLengthDistribution(text: string): {
    short: number;  // < 10 words
    medium: number; // 10-20 words
    long: number;   // > 20 words
  } {
    const sentences = this.splitIntoSentences(text);

    let short = 0;
    let medium = 0;
    let long = 0;

    sentences.forEach(sentence => {
      const wordCount = this.splitIntoWords(sentence).length;
      if (wordCount < 10) {
        short++;
      } else if (wordCount <= 20) {
        medium++;
      } else {
        long++;
      }
    });

    const total = sentences.length || 1;
    return {
      short: (short / total) * 100,
      medium: (medium / total) * 100,
      long: (long / total) * 100,
    };
  }

  /**
   * 읽기 시간 추정 (분)
   */
  static estimateReadingTime(text: string): number {
    const words = this.splitIntoWords(text);
    const wordsPerMinute = 200; // 한국어 평균 읽기 속도
    return Math.ceil(words.length / wordsPerMinute);
  }

  /**
   * 여러 글에서 공통 패턴 추출
   */
  static findCommonPatterns(posts: string[]): {
    commonWords: string[];
    averageLength: number;
    commonStructure: string;
  } {
    // 모든 글의 키워드 추출
    const allKeywords = posts.flatMap(post =>
      this.extractKeywords(post, 20).map(k => k.word)
    );

    // 공통 단어 찾기
    const wordFreq = new Map<string, number>();
    allKeywords.forEach(word => {
      wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
    });

    const commonWords = Array.from(wordFreq.entries())
      .filter(([_, count]) => count >= posts.length * 0.3) // 30% 이상 등장
      .map(([word]) => word)
      .slice(0, 10);

    // 평균 길이
    const totalWords = posts.reduce((sum, post) =>
      sum + this.splitIntoWords(post).length, 0
    );
    const averageLength = Math.round(totalWords / posts.length);

    // 구조 패턴 (간단한 분류)
    const avgParagraphs = posts.reduce((sum, post) =>
      sum + this.splitIntoParagraphs(post).length, 0
    ) / posts.length;

    let commonStructure = '';
    if (avgParagraphs < 3) {
      commonStructure = '짧고 간결한 구조';
    } else if (avgParagraphs < 7) {
      commonStructure = '적당한 길이의 구조';
    } else {
      commonStructure = '긴 글 구조';
    }

    return {
      commonWords,
      averageLength,
      commonStructure,
    };
  }
}
