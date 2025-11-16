/**
 * Memory Manager
 * 메모리 사용량 모니터링 및 최적화
 */

import {AppState, AppStateStatus} from 'react-native';
import {CacheService} from '@services/CacheService';

class MemoryManagerClass {
  private listeners: Set<() => void> = new Set();
  private appStateSubscription: any;
  private memoryWarningThreshold = 0.8; // 80% of available memory

  constructor() {
    this.init();
  }

  /**
   * Initialize memory manager
   */
  private init(): void {
    // Monitor app state changes
    this.appStateSubscription = AppState.addEventListener(
      'change',
      this.handleAppStateChange.bind(this),
    );

    // Set up periodic cleanup
    this.schedulePeriodicCleanup();
  }

  /**
   * Handle app state changes
   */
  private handleAppStateChange(nextAppState: AppStateStatus): void {
    if (nextAppState === 'background') {
      console.log('[MemoryManager] App backgrounded, cleaning up...');
      this.cleanup();
    }

    if (nextAppState === 'inactive') {
      console.log('[MemoryManager] App inactive, releasing resources...');
      this.releaseNonCriticalResources();
    }
  }

  /**
   * Schedule periodic cleanup
   */
  private schedulePeriodicCleanup(): void {
    // Clean up every 10 minutes
    setInterval(() => {
      console.log('[MemoryManager] Periodic cleanup triggered');
      this.cleanup();
    }, 10 * 60 * 1000);
  }

  /**
   * Clean up memory
   */
  async cleanup(): Promise<void> {
    // Clear expired cache
    CacheService.cleanupMemory();

    // Notify listeners
    this.listeners.forEach(listener => listener());

    // Force garbage collection (if available in development)
    if (__DEV__ && global.gc) {
      global.gc();
      console.log('[MemoryManager] Garbage collection triggered');
    }
  }

  /**
   * Release non-critical resources
   */
  private releaseNonCriticalResources(): void {
    // Clear image cache
    CacheService.invalidatePattern('image_');

    // Clear old AI responses
    CacheService.invalidatePattern('openai_');
  }

  /**
   * Register cleanup listener
   */
  registerCleanupListener(listener: () => void): () => void {
    this.listeners.add(listener);

    // Return unregister function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Get memory stats
   */
  getStats(): {
    cacheStats: {memoryEntries: number; memorySize: number};
  } {
    return {
      cacheStats: CacheService.getStats(),
    };
  }

  /**
   * Clear all caches
   */
  async clearAllCaches(): Promise<void> {
    await CacheService.clear();
    console.log('[MemoryManager] All caches cleared');
  }

  /**
   * Dispose (cleanup subscriptions)
   */
  dispose(): void {
    this.appStateSubscription?.remove();
    this.listeners.clear();
  }
}

export const MemoryManager = new MemoryManagerClass();

/**
 * React Hook for memory cleanup on unmount
 */
export function useMemoryCleanup(cleanup: () => void): void {
  const unregister = MemoryManager.registerCleanupListener(cleanup);

  // Cleanup on unmount
  return unregister;
}
