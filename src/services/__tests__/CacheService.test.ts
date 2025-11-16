/**
 * Cache Service Tests
 */

import {CacheService} from '../CacheService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  getAllKeys: jest.fn(),
  multiRemove: jest.fn(),
}));

describe('CacheService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear memory cache
    CacheService.cleanupMemory();
  });

  describe('get and set', () => {
    it('should store and retrieve data from memory cache', async () => {
      const testData = {name: 'Test', value: 123};

      await CacheService.set('test-key', testData);
      const result = await CacheService.get('test-key');

      expect(result).toEqual(testData);
    });

    it('should return null for non-existent key', async () => {
      const result = await CacheService.get('non-existent');

      expect(result).toBeNull();
    });

    it('should respect TTL and expire data', async () => {
      const testData = {name: 'Test'};

      await CacheService.set('test-key', testData, {ttl: 100}); // 100ms TTL

      // Should be available immediately
      const result1 = await CacheService.get('test-key');
      expect(result1).toEqual(testData);

      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 150));

      // Should be null after expiration
      const result2 = await CacheService.get('test-key');
      expect(result2).toBeNull();
    });

    it('should persist to AsyncStorage when persist option is true', async () => {
      const testData = {name: 'Test'};

      await CacheService.set('test-key', testData, {persist: true});

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@blogtwin_cache_test-key',
        expect.any(String)
      );
    });

    it('should not persist to AsyncStorage when persist option is false', async () => {
      const testData = {name: 'Test'};

      await CacheService.set('test-key', testData, {persist: false});

      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('invalidate', () => {
    it('should remove data from memory cache', async () => {
      await CacheService.set('test-key', {name: 'Test'});

      await CacheService.invalidate('test-key');

      const result = await CacheService.get('test-key');
      expect(result).toBeNull();
    });

    it('should remove data from AsyncStorage', async () => {
      await CacheService.invalidate('test-key');

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@blogtwin_cache_test-key');
    });
  });

  describe('invalidatePattern', () => {
    it('should remove all keys matching pattern from memory', async () => {
      await CacheService.set('user_1', {id: 1});
      await CacheService.set('user_2', {id: 2});
      await CacheService.set('post_1', {id: 1});

      await CacheService.invalidatePattern('user_');

      expect(await CacheService.get('user_1')).toBeNull();
      expect(await CacheService.get('user_2')).toBeNull();
      expect(await CacheService.get('post_1')).toEqual({id: 1});
    });

    it('should remove matching keys from AsyncStorage', async () => {
      (AsyncStorage.getAllKeys as jest.Mock).mockResolvedValue([
        '@blogtwin_cache_user_1',
        '@blogtwin_cache_user_2',
        '@blogtwin_cache_post_1',
      ]);

      await CacheService.invalidatePattern('user_');

      expect(AsyncStorage.multiRemove).toHaveBeenCalledWith([
        '@blogtwin_cache_user_1',
        '@blogtwin_cache_user_2',
      ]);
    });
  });

  describe('clear', () => {
    it('should clear all cache data', async () => {
      await CacheService.set('key1', {data: 1});
      await CacheService.set('key2', {data: 2});

      await CacheService.clear();

      expect(await CacheService.get('key1')).toBeNull();
      expect(await CacheService.get('key2')).toBeNull();
    });

    it('should clear all AsyncStorage cache', async () => {
      (AsyncStorage.getAllKeys as jest.Mock).mockResolvedValue([
        '@blogtwin_cache_key1',
        '@blogtwin_cache_key2',
        '@other_key',
      ]);

      await CacheService.clear();

      expect(AsyncStorage.multiRemove).toHaveBeenCalledWith([
        '@blogtwin_cache_key1',
        '@blogtwin_cache_key2',
      ]);
    });
  });

  describe('getOrFetch', () => {
    it('should return cached data if available', async () => {
      const cachedData = {name: 'Cached'};
      await CacheService.set('test-key', cachedData);

      const fetcher = jest.fn();
      const result = await CacheService.getOrFetch('test-key', fetcher);

      expect(result).toEqual(cachedData);
      expect(fetcher).not.toHaveBeenCalled();
    });

    it('should fetch and cache data if not in cache', async () => {
      const fetchedData = {name: 'Fetched'};
      const fetcher = jest.fn().mockResolvedValue(fetchedData);

      const result = await CacheService.getOrFetch('test-key', fetcher);

      expect(result).toEqual(fetchedData);
      expect(fetcher).toHaveBeenCalled();

      // Should be in cache now
      const cached = await CacheService.get('test-key');
      expect(cached).toEqual(fetchedData);
    });
  });

  describe('batchFetch', () => {
    it('should return all cached items', async () => {
      await CacheService.set('item1', {id: 1});
      await CacheService.set('item2', {id: 2});

      const fetcher = jest.fn();
      const results = await CacheService.batchFetch(['item1', 'item2'], fetcher);

      expect(results.get('item1')).toEqual({id: 1});
      expect(results.get('item2')).toEqual({id: 2});
      expect(fetcher).not.toHaveBeenCalled();
    });

    it('should fetch missing items only', async () => {
      await CacheService.set('item1', {id: 1});

      const fetcher = jest.fn().mockResolvedValue(
        new Map([['item2', {id: 2}]])
      );

      const results = await CacheService.batchFetch(['item1', 'item2'], fetcher);

      expect(results.get('item1')).toEqual({id: 1});
      expect(results.get('item2')).toEqual({id: 2});
      expect(fetcher).toHaveBeenCalledWith(['item2']);
    });
  });

  describe('getStats', () => {
    it('should return cache statistics', async () => {
      await CacheService.set('key1', {data: 'test'});
      await CacheService.set('key2', {data: 'test'});

      const stats = CacheService.getStats();

      expect(stats.memoryEntries).toBe(2);
      expect(stats.memorySize).toBeGreaterThan(0);
    });
  });

  describe('cleanupMemory', () => {
    it('should remove expired entries', async () => {
      await CacheService.set('key1', {data: 'test'}, {ttl: 100});
      await CacheService.set('key2', {data: 'test'}, {ttl: 10000});

      // Wait for first entry to expire
      await new Promise(resolve => setTimeout(resolve, 150));

      CacheService.cleanupMemory();

      expect(await CacheService.get('key1')).toBeNull();
      expect(await CacheService.get('key2')).toEqual({data: 'test'});
    });
  });
});
