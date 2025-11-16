/**
 * Style Analysis Types
 */

export interface StyleProfile {
  id: string;
  userId: string;
  analyzedAt: string;

  // 기본 통계
  statistics: {
    totalPosts: number;
    totalWords: number;
    averagePostLength: number;
    averageSentenceLength: number;
    averageParagraphLength: number;
  };

  // 어조 및 스타일
  tone: {
    formality: number; // 0-100 (격식체 vs 반말)
    emotion: number; // 0-100 (객관적 vs 감성적)
    energy: number; // 0-100 (차분함 vs 활발함)
    humor: number; // 0-100 (진지함 vs 유머러스함)
  };

  // 문체 특징
  writingStyle: {
    sentenceStructure: 'simple' | 'complex' | 'mixed';
    paragraphStyle: 'short' | 'medium' | 'long';
    vocabularyLevel: 'casual' | 'standard' | 'advanced';
    punctuationUsage: string[]; // 자주 사용하는 문장부호
  };

  // 주제 및 카테고리
  topics: {
    category: string;
    percentage: number;
    keywords: string[];
  }[];

  // 자주 사용하는 표현
  commonExpressions: {
    openings: string[]; // 시작 표현
    transitions: string[]; // 전환 표현
    conclusions: string[]; // 마무리 표현
    fillers: string[]; // 자주 쓰는 부사/접속사
  };

  // GPT가 분석한 종합 평가
  aiSummary: {
    overallStyle: string;
    strengths: string[];
    uniqueTraits: string[];
    recommendations: string[];
  };
}

export interface AnalysisResult {
  profile: StyleProfile;
  rawAnalysis: string;
  samplePosts: {
    title: string;
    excerpt: string;
    analysis: string;
  }[];
}

export interface StyleAnalysisRequest {
  userId: string;
  posts: {
    title: string;
    content: string;
    category?: string;
    publishedDate?: string;
  }[];
}
