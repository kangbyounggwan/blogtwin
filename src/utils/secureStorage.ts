/**
 * Secure Storage Utility
 * 민감한 데이터를 암호화하여 안전하게 저장
 */

import EncryptedStorage from 'react-native-encrypted-storage';

export class SecureStorage {
  /**
   * 데이터 저장
   */
  static async setItem(key: string, value: string): Promise<void> {
    try {
      await EncryptedStorage.setItem(key, value);
    } catch (error) {
      console.error('SecureStorage setItem error:', error);
      throw new Error(`Failed to save data: ${key}`);
    }
  }

  /**
   * 데이터 조회
   */
  static async getItem(key: string): Promise<string | null> {
    try {
      return await EncryptedStorage.getItem(key);
    } catch (error) {
      console.error('SecureStorage getItem error:', error);
      return null;
    }
  }

  /**
   * 데이터 삭제
   */
  static async removeItem(key: string): Promise<void> {
    try {
      await EncryptedStorage.removeItem(key);
    } catch (error) {
      console.error('SecureStorage removeItem error:', error);
      throw new Error(`Failed to remove data: ${key}`);
    }
  }

  /**
   * 모든 데이터 삭제
   */
  static async clear(): Promise<void> {
    try {
      await EncryptedStorage.clear();
    } catch (error) {
      console.error('SecureStorage clear error:', error);
      throw new Error('Failed to clear all data');
    }
  }

  /**
   * JSON 객체 저장
   */
  static async setObject<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await this.setItem(key, jsonValue);
    } catch (error) {
      console.error('SecureStorage setObject error:', error);
      throw new Error(`Failed to save object: ${key}`);
    }
  }

  /**
   * JSON 객체 조회
   */
  static async getObject<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await this.getItem(key);
      return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('SecureStorage getObject error:', error);
      return null;
    }
  }
}
