/**
 * User Service
 * Supabase를 통한 사용자 데이터 관리
 */

import {supabase} from '@/lib/supabase';
import {NaverProfile} from '@/types/naver';

export interface User {
  id: string;
  created_at: string;
  naver_id?: string;
  nickname?: string;
  email?: string;
  profile_image?: string;
}

export class UserService {
  /**
   * 네이버 프로필로 사용자 생성 또는 업데이트
   */
  static async upsertUserFromNaver(naverProfile: NaverProfile): Promise<User> {
    try {
      const userData = {
        naver_id: naverProfile.id,
        nickname: naverProfile.nickname,
        email: naverProfile.email,
        profile_image: naverProfile.profile_image,
      };

      // naver_id로 기존 사용자 찾기
      const {data: existingUser, error: findError} = await supabase
        .from('users')
        .select('*')
        .eq('naver_id', naverProfile.id)
        .single();

      if (findError && findError.code !== 'PGRST116') {
        // PGRST116 = Row not found (정상)
        throw findError;
      }

      if (existingUser) {
        // 기존 사용자 업데이트
        const {data, error} = await supabase
          .from('users')
          .update(userData)
          .eq('id', existingUser.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // 새 사용자 생성
        const {data, error} = await supabase
          .from('users')
          .insert(userData)
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    } catch (error) {
      console.error('UserService upsertUserFromNaver error:', error);
      throw error;
    }
  }

  /**
   * 사용자 ID로 조회
   */
  static async getUserById(userId: string): Promise<User | null> {
    try {
      const {data, error} = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }

      return data;
    } catch (error) {
      console.error('UserService getUserById error:', error);
      throw error;
    }
  }

  /**
   * 네이버 ID로 조회
   */
  static async getUserByNaverId(naverId: string): Promise<User | null> {
    try {
      const {data, error} = await supabase
        .from('users')
        .select('*')
        .eq('naver_id', naverId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      return data;
    } catch (error) {
      console.error('UserService getUserByNaverId error:', error);
      throw error;
    }
  }

  /**
   * 사용자 정보 업데이트
   */
  static async updateUser(
    userId: string,
    updates: Partial<Omit<User, 'id' | 'created_at'>>,
  ): Promise<User> {
    try {
      const {data, error} = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('UserService updateUser error:', error);
      throw error;
    }
  }

  /**
   * 사용자 삭제
   */
  static async deleteUser(userId: string): Promise<void> {
    try {
      const {error} = await supabase.from('users').delete().eq('id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('UserService deleteUser error:', error);
      throw error;
    }
  }
}
