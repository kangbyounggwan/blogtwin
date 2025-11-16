/**
 * Cache Service
 * API 응답 캐싱 및 메모리 관리
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds (default: 5 minutes)
  persist?: boolean; // Persist to AsyncStorage
  key: string;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class CacheServiceClass {
  private memoryCache: Map<string, CacheEntry<any>> = new Map();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly STORAGE_PREFIX = '@blogtwin_cache_';

  /**
   * Get cached data
   */
  async get<T>(key: string): Promise<T | null> {
    // Check memory cache first
    const memoryEntry = this.memoryCache.get(key);
    if (memoryEntry && this.isValid(memoryEntry)) {
      return memoryEntry.data as T;
    }

    // Check persistent storage
    try {
      const storageKey = this.STORAGE_PREFIX + key;
      const stored = await AsyncStorage.getItem(storageKey);
      if (stored) {
        const entry: CacheEntry<T> = JSON.parse(stored);
        if (this.isValid(entry)) {
          // Restore to memory cache
          this.memoryCache.set(key, entry);
          return entry.data;
        } else {
          // Expired, remove it
          await AsyncStorage.removeItem(storageKey);
        }
      }
    } catch (error) {
      console.error('[CacheService] Error reading from storage:', error);
    }

    return null;
  }

  /**
   * Set cached data
   */
  async set<T>(key: string, data: T, options?: Partial<CacheOptions>): Promise<void> {
    const ttl = options?.ttl || this.DEFAULT_TTL;
    const persist = options?.persist ?? false;

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
    };

    // Store in memory
    this.memoryCache.set(key, entry);

    // Store in AsyncStorage if persist is true
    if (persist) {
      try {
        const storageKey = this.STORAGE_PREFIX + key;
        await AsyncStorage.setItem(storageKey, JSON.stringify(entry));
      } catch (error) {
        console.error('[CacheService] Error writing to storage:', error);
      }
    }
  }

  /**
   * Invalidate cache
   */
  async invalidate(key: string): Promise<void> {
    this.memoryCache.delete(key);

    try {
      const storageKey = this.STORAGE_PREFIX + key;
      await AsyncStorage.removeItem(storageKey);
    } catch (error) {
      console.error('[CacheService] Error removing from storage:', error);
    }
  }

  /**
   * Invalidate all caches matching pattern
   */
  async invalidatePattern(pattern: string): Promise<void> {
    // Clear memory cache
    const keysToDelete: string[] = [];
    this.memoryCache.forEach((_, key) => {
      if (key.includes(pattern)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => this.memoryCache.delete(key));

    // Clear storage cache
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const matchingKeys = allKeys.filter(key =>
        key.startsWith(this.STORAGE_PREFIX) && key.includes(pattern)
      );
      await AsyncStorage.multiRemove(matchingKeys);
    } catch (error) {
      console.error('[CacheService] Error clearing pattern from storage:', error);
    }
  }

  /**
   * Clear all cache
   */
  async clear(): Promise<void> {
    this.memoryCache.clear();

    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const cacheKeys = allKeys.filter(key => key.startsWith(this.STORAGE_PREFIX));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error('[CacheService] Error clearing storage:', error);
    }
  }

  /**
   * Get or fetch data with caching
   */
  async getOrFetch<T>(
    key: string,
    fetcher: () => Promise<T>,
    options?: Partial<CacheOptions>
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const data = await fetcher();
    await this.set(key, data, options);
    return data;
  }

  /**
   * Batch fetch multiple items
   */
  async batchFetch<T>(
    keys: string[],
    fetcher: (missingKeys: string[]) => Promise<Map<string, T>>,
    options?: Partial<CacheOptions>
  ): Promise<Map<string, T>> {
    const results = new Map<string, T>();
    const missingKeys: string[] = [];

    // Check cache for each key
    for (const key of keys) {
      const cached = await this.get<T>(key);
      if (cached !== null) {
        results.set(key, cached);
      } else {
        missingKeys.push(key);
      }
    }

    // Fetch missing items in batch
    if (missingKeys.length > 0) {
      const fetchedData = await fetcher(missingKeys);

      // Cache the fetched data
      for (const [key, data] of fetchedData) {
        await this.set(key, data, options);
        results.set(key, data);
      }
    }

    return results;
  }

  /**
   * Check if cache entry is valid (not expired)
   */
  private isValid<T>(entry: CacheEntry<T>): boolean {
    const now = Date.now();
    return now - entry.timestamp < entry.ttl;
  }

  /**
   * Clean up expired entries from memory
   */
  cleanupMemory(): void {
    const keysToDelete: string[] = [];
    this.memoryCache.forEach((entry, key) => {
      if (!this.isValid(entry)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => this.memoryCache.delete(key));
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    memoryEntries: number;
    memorySize: number;
  } {
    return {
      memoryEntries: this.memoryCache.size,
      memorySize: JSON.stringify([...this.memoryCache.entries()]).length,
    };
  }
}

export const CacheService = new CacheServiceClass();

// Auto cleanup every 5 minutes
setInterval(() => {
  CacheService.cleanupMemory();
}, 5 * 60 * 1000);
