/**
 * AI Log Service
 * AI 사용 로그 및 통계 관리
 */

import {supabase} from '@/lib/supabase';
import {AIGenerationLog, AIUsageStats} from '@/types/openai';

export class AILogService {
  /**
   * AI 생성 로그 저장
   */
  static async createLog(
    userId: string,
    logData: {
      model: string;
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
      estimatedCost: number;
      success: boolean;
      errorMessage?: string;
    },
  ): Promise<void> {
    try {
      const {error} = await supabase.from('ai_generation_logs').insert({
        user_id: userId,
        model: logData.model,
        prompt_tokens: logData.promptTokens,
        completion_tokens: logData.completionTokens,
        total_tokens: logData.totalTokens,
        estimated_cost: logData.estimatedCost,
        success: logData.success,
        error_message: logData.errorMessage,
      });

      if (error) throw error;
    } catch (error) {
      console.error('AILogService createLog error:', error);
      // 로그 저장 실패는 치명적이지 않으므로 에러를 throw하지 않음
    }
  }

  /**
   * 사용자의 AI 사용 통계 조회
   */
  static async getUserStats(userId: string): Promise<AIUsageStats> {
    try {
      const {data, error} = await supabase
        .from('ai_generation_logs')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      if (!data || data.length === 0) {
        return {
          totalRequests: 0,
          totalTokens: 0,
          totalCost: 0,
          successRate: 0,
          averageTokensPerRequest: 0,
        };
      }

      const totalRequests = data.length;
      const successfulRequests = data.filter((log) => log.success).length;
      const totalTokens = data.reduce((sum, log) => sum + log.total_tokens, 0);
      const totalCost = data.reduce((sum, log) => sum + log.estimated_cost, 0);

      return {
        totalRequests,
        totalTokens,
        totalCost,
        successRate: (successfulRequests / totalRequests) * 100,
        averageTokensPerRequest: totalTokens / totalRequests,
      };
    } catch (error) {
      console.error('AILogService getUserStats error:', error);
      throw error;
    }
  }

  /**
   * 최근 로그 조회
   */
  static async getRecentLogs(userId: string, limit: number = 10): Promise<AIGenerationLog[]> {
    try {
      const {data, error} = await supabase
        .from('ai_generation_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', {ascending: false})
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('AILogService getRecentLogs error:', error);
      throw error;
    }
  }

  /**
   * 특정 기간의 비용 합계
   */
  static async getCostByPeriod(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    try {
      const {data, error} = await supabase
        .from('ai_generation_logs')
        .select('estimated_cost')
        .eq('user_id', userId)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (error) throw error;

      return data?.reduce((sum, log) => sum + log.estimated_cost, 0) || 0;
    } catch (error) {
      console.error('AILogService getCostByPeriod error:', error);
      throw error;
    }
  }
}
