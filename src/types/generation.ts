/**
 * Content Generation Types
 */

export interface GenerationOptions {
  topic: string;
  category?: string;
  keywords?: string[];
  tone?: 'formal' | 'casual' | 'professional' | 'friendly';
  length?: 'short' | 'medium' | 'long';
  includeImages?: boolean;
  streaming?: boolean;
  userStyleProfile?: string;
}

export interface GeneratedContent {
  title: string;
  content: string;
  tags: string[];
  category?: string;
  wordCount: number;
  estimatedReadTime: number;
  generatedAt: string;
  tokenUsage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    estimatedCost: number;
  };
}

export interface TitleSuggestion {
  title: string;
  reason: string;
}

export interface ContentSection {
  type: 'introduction' | 'body' | 'conclusion';
  content: string;
}

export interface GenerationProgress {
  stage: 'preparing' | 'generating_title' | 'generating_content' | 'generating_tags' | 'complete';
  percentage: number;
  message: string;
  currentText?: string;
}
