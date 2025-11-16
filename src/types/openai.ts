/**
 * OpenAI Related Types
 */

export interface AIGenerationLog {
  id: string;
  user_id: string;
  model: string;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  estimated_cost: number;
  created_at: string;
  success: boolean;
  error_message?: string;
}

export interface AIUsageStats {
  totalRequests: number;
  totalTokens: number;
  totalCost: number;
  successRate: number;
  averageTokensPerRequest: number;
}

export interface GeneratedPost {
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  imageUrl?: string;
  generatedAt: string;
  tokenUsage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    estimatedCost: number;
  };
}
