/**
 * Style Analysis Service
 * GPT-4를 활용한 블로그 글쓰기 스타일 분석
 */

import {OpenAIService, ChatMessage} from './OpenAIService';
import {TextProcessor} from '@/utils/textProcessing';
import {StyleProfile, AnalysisResult, StyleAnalysisRequest} from '@/types/style';
import {supabase} from '@/lib/supabase';

export class StyleAnalysisService {
  /**
   * 블로그 글 스타일 분석 (전체 프로세스)
   */
  static async analyzeWritingStyle(
    request: StyleAnalysisRequest,
  ): Promise<AnalysisResult> {
    try {
      // 1단계: 텍스트 전처리
      const processedPosts = request.posts.map(post => ({
        ...post,
        content: TextProcessor.preprocessBlogPost(post.content),
      }));

      // 2단계: 통계 분석
      const statistics = this.calculateStatistics(processedPosts);

      // 3단계: GPT-4 스타일 분석
      const aiAnalysis = await this.performAIAnalysis(processedPosts);

      // 4단계: 카테고리별 특징 추출
      const topics = this.extractTopicFeatures(processedPosts);

      // 5단계: 공통 표현 추출
      const commonExpressions = this.extractCommonExpressions(processedPosts);

      // 6단계: 스타일 프로파일 생성
      const profile: StyleProfile = {
        id: '', // Supabase에서 자동 생성
        userId: request.userId,
        analyzedAt: new Date().toISOString(),
        statistics,
        tone: aiAnalysis.tone,
        writingStyle: aiAnalysis.writingStyle,
        topics,
        commonExpressions,
        aiSummary: aiAnalysis.summary,
      };

      // 7단계: Supabase에 저장
      await this.saveStyleProfile(profile);

      // 8단계: 샘플 포스트 분석
      const samplePosts = processedPosts.slice(0, 3).map(post => ({
        title: post.title,
        excerpt: TextProcessor.extractExcerpt(post.content, 150),
        analysis: this.analyzeSinglePost(post.content),
      }));

      return {
        profile,
        rawAnalysis: aiAnalysis.rawText,
        samplePosts,
      };
    } catch (error) {
      console.error('StyleAnalysisService analyzeWritingStyle error:', error);
      throw error;
    }
  }

  /**
   * 통계 분석
   */
  private static calculateStatistics(
    posts: Array<{title: string; content: string}>,
  ) {
    const allContents = posts.map(p => p.content).join(' ');
    const stats = TextProcessor.calculateStats(allContents);

    const totalPosts = posts.length;
    const totalWords = stats.wordCount;
    const averagePostLength = Math.round(totalWords / totalPosts);

    const allSentences = posts.flatMap(p =>
      TextProcessor.splitIntoSentences(p.content)
    );
    const allSentenceWords = allSentences.map(s =>
      TextProcessor.splitIntoWords(s).length
    );
    const averageSentenceLength = Math.round(
      allSentenceWords.reduce((a, b) => a + b, 0) / allSentenceWords.length
    );

    const allParagraphs = posts.flatMap(p =>
      TextProcessor.splitIntoParagraphs(p.content)
    );
    const allParagraphWords = allParagraphs.map(p =>
      TextProcessor.splitIntoWords(p).length
    );
    const averageParagraphLength = Math.round(
      allParagraphWords.reduce((a, b) => a + b, 0) / allParagraphWords.length
    );

    return {
      totalPosts,
      totalWords,
      averagePostLength,
      averageSentenceLength,
      averageParagraphLength,
    };
  }

  /**
   * GPT-4 AI 스타일 분석
   */
  private static async performAIAnalysis(
    posts: Array<{title: string; content: string}>,
  ) {
    // 분석을 위한 샘플 추출 (최대 5개)
    const samples = posts.slice(0, 5);
    const sampleTexts = samples.map((p, i) =>
      `[글 ${i + 1}] ${p.title}\n${TextProcessor.extractExcerpt(p.content, 300)}`
    ).join('\n\n');

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `당신은 글쓰기 스타일 분석 전문가입니다. 블로그 글을 분석하여 작성자의 고유한 스타일을 파악하고, 이를 JSON 형식으로 정리해주세요.`,
      },
      {
        role: 'user',
        content: `다음 블로그 글들을 분석하여 작성자의 글쓰기 스타일을 파악해주세요:

${sampleTexts}

다음 형식의 JSON으로 응답해주세요:
{
  "tone": {
    "formality": 0-100 (격식체일수록 높음),
    "emotion": 0-100 (감성적일수록 높음),
    "energy": 0-100 (활발할수록 높음),
    "humor": 0-100 (유머러스할수록 높음)
  },
  "writingStyle": {
    "sentenceStructure": "simple|complex|mixed",
    "paragraphStyle": "short|medium|long",
    "vocabularyLevel": "casual|standard|advanced",
    "punctuationUsage": ["자주 사용하는 문장부호들"]
  },
  "summary": {
    "overallStyle": "전체적인 글쓰기 스타일 요약",
    "strengths": ["강점1", "강점2", "강점3"],
    "uniqueTraits": ["독특한 특징1", "독특한 특징2"],
    "recommendations": ["개선 제안1", "개선 제안2"]
  }
}`,
      },
    ];

    const {content} = await OpenAIService.generateText(messages, {
      maxTokens: 2000,
      temperature: 0.3, // 일관성을 위해 낮은 temperature
    });

    // JSON 파싱
    const parsed = JSON.parse(content);

    return {
      tone: parsed.tone,
      writingStyle: parsed.writingStyle,
      summary: parsed.summary,
      rawText: content,
    };
  }

  /**
   * 카테고리별 특징 추출
   */
  private static extractTopicFeatures(
    posts: Array<{title: string; content: string; category?: string}>,
  ) {
    // 카테고리별 그룹화
    const categoryMap = new Map<string, typeof posts>();
    posts.forEach(post => {
      const category = post.category || '기타';
      if (!categoryMap.has(category)) {
        categoryMap.set(category, []);
      }
      categoryMap.get(category)!.push(post);
    });

    // 각 카테고리별 키워드 추출
    const topics = Array.from(categoryMap.entries()).map(([category, categoryPosts]) => {
      const allText = categoryPosts.map(p => p.content).join(' ');
      const keywords = TextProcessor.extractKeywords(allText, 5).map(k => k.word);
      const percentage = (categoryPosts.length / posts.length) * 100;

      return {
        category,
        percentage: Math.round(percentage),
        keywords,
      };
    });

    return topics.sort((a, b) => b.percentage - a.percentage);
  }

  /**
   * 공통 표현 추출
   */
  private static extractCommonExpressions(
    posts: Array<{content: string}>,
  ) {
    const openings: string[] = [];
    const transitions: string[] = [];
    const conclusions: string[] = [];
    const fillers: string[] = [];

    posts.forEach(post => {
      const paragraphs = TextProcessor.splitIntoParagraphs(post.content);

      // 시작 표현 (첫 문장)
      if (paragraphs.length > 0) {
        const firstSentence = TextProcessor.splitIntoSentences(paragraphs[0])[0];
        if (firstSentence && firstSentence.length < 50) {
          openings.push(firstSentence);
        }
      }

      // 마무리 표현 (마지막 문장)
      if (paragraphs.length > 0) {
        const lastParagraph = paragraphs[paragraphs.length - 1];
        const sentences = TextProcessor.splitIntoSentences(lastParagraph);
        const lastSentence = sentences[sentences.length - 1];
        if (lastSentence && lastSentence.length < 50) {
          conclusions.push(lastSentence);
        }
      }
    });

    // 빈도 높은 표현 추출 (간단한 구현)
    const getTopExpressions = (arr: string[], limit: number = 3) => {
      const freq = new Map<string, number>();
      arr.forEach(expr => {
        freq.set(expr, (freq.get(expr) || 0) + 1);
      });
      return Array.from(freq.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([expr]) => expr);
    };

    return {
      openings: getTopExpressions(openings),
      transitions: ['그런데', '하지만', '그래서'], // 추후 실제 분석으로 대체
      conclusions: getTopExpressions(conclusions),
      fillers: ['정말', '너무', '매우'], // 추후 실제 분석으로 대체
    };
  }

  /**
   * 단일 포스트 분석
   */
  private static analyzeSinglePost(content: string): string {
    const stats = TextProcessor.calculateStats(content);
    const sentenceDist = TextProcessor.getSentenceLengthDistribution(content);
    const readingTime = TextProcessor.estimateReadingTime(content);

    return `총 ${stats.wordCount}단어, 평균 문장 길이 ${stats.averageSentenceLength.toFixed(1)}단어, 예상 읽기 시간 ${readingTime}분. 짧은 문장 ${sentenceDist.short.toFixed(0)}%, 중간 ${sentenceDist.medium.toFixed(0)}%, 긴 문장 ${sentenceDist.long.toFixed(0)}%.`;
  }

  /**
   * 스타일 프로파일 Supabase에 저장
   */
  private static async saveStyleProfile(profile: StyleProfile): Promise<void> {
    try {
      const {data, error} = await supabase
        .from('style_profiles')
        .upsert({
          user_id: profile.userId,
          analysis_data: {
            statistics: profile.statistics,
            tone: profile.tone,
            writingStyle: profile.writingStyle,
            topics: profile.topics,
            commonExpressions: profile.commonExpressions,
            aiSummary: profile.aiSummary,
          },
        })
        .select()
        .single();

      if (error) throw error;

      // ID 업데이트
      profile.id = data.id;
    } catch (error) {
      console.error('StyleAnalysisService saveStyleProfile error:', error);
      throw error;
    }
  }

  /**
   * 저장된 스타일 프로파일 조회
   */
  static async getUserStyleProfile(userId: string): Promise<StyleProfile | null> {
    try {
      const {data, error} = await supabase
        .from('style_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      const analysisData = data.analysis_data;

      return {
        id: data.id,
        userId: data.user_id,
        analyzedAt: data.created_at,
        statistics: analysisData.statistics,
        tone: analysisData.tone,
        writingStyle: analysisData.writingStyle,
        topics: analysisData.topics,
        commonExpressions: analysisData.commonExpressions,
        aiSummary: analysisData.aiSummary,
      };
    } catch (error) {
      console.error('StyleAnalysisService getUserStyleProfile error:', error);
      throw error;
    }
  }

  /**
   * 스타일 프로파일을 프롬프트 형식으로 변환
   */
  static convertProfileToPrompt(profile: StyleProfile): string {
    return `[작성자 스타일 프로파일]

기본 통계:
- 평균 글 길이: ${profile.statistics.averagePostLength}단어
- 평균 문장 길이: ${profile.statistics.averageSentenceLength}단어
- 평균 문단 길이: ${profile.statistics.averageParagraphLength}단어

어조 특성:
- 격식성: ${profile.tone.formality}/100
- 감성도: ${profile.tone.emotion}/100
- 활기: ${profile.tone.energy}/100
- 유머: ${profile.tone.humor}/100

문체:
- 문장 구조: ${profile.writingStyle.sentenceStructure}
- 문단 스타일: ${profile.writingStyle.paragraphStyle}
- 어휘 수준: ${profile.writingStyle.vocabularyLevel}

전체 스타일: ${profile.aiSummary.overallStyle}

고유한 특징:
${profile.aiSummary.uniqueTraits.map(t => `- ${t}`).join('\n')}

자주 사용하는 시작 표현:
${profile.commonExpressions.openings.map(o => `- "${o}"`).join('\n')}

자주 사용하는 마무리 표현:
${profile.commonExpressions.conclusions.map(c => `- "${c}"`).join('\n')}
`;
  }
}
