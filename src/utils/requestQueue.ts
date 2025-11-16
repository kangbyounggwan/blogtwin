/**
 * Request Queue
 * API 요청 큐 관리 및 rate limiting
 */

interface QueuedRequest<T> {
  id: string;
  execute: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (error: any) => void;
  priority: number;
}

class RequestQueueClass {
  private queue: QueuedRequest<any>[] = [];
  private processing = false;
  private requestCount = 0;
  private readonly MAX_REQUESTS_PER_MINUTE = 60;
  private readonly REQUEST_INTERVAL = 1000; // 1 second between requests
  private lastRequestTime = 0;

  /**
   * Add request to queue
   */
  async enqueue<T>(
    execute: () => Promise<T>,
    priority: number = 0
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const id = Math.random().toString(36).substring(7);

      this.queue.push({
        id,
        execute,
        resolve,
        reject,
        priority,
      });

      // Sort by priority (higher priority first)
      this.queue.sort((a, b) => b.priority - a.priority);

      // Start processing if not already processing
      if (!this.processing) {
        this.processQueue();
      }
    });
  }

  /**
   * Process queue
   */
  private async processQueue(): Promise<void> {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;

    while (this.queue.length > 0) {
      // Rate limiting: wait if necessary
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;

      if (timeSinceLastRequest < this.REQUEST_INTERVAL) {
        await new Promise(resolve =>
          setTimeout(resolve, this.REQUEST_INTERVAL - timeSinceLastRequest)
        );
      }

      // Check requests per minute limit
      if (this.requestCount >= this.MAX_REQUESTS_PER_MINUTE) {
        console.warn('[RequestQueue] Rate limit reached, waiting 1 minute...');
        await new Promise(resolve => setTimeout(resolve, 60000));
        this.requestCount = 0;
      }

      const request = this.queue.shift();
      if (!request) continue;

      try {
        this.lastRequestTime = Date.now();
        this.requestCount++;

        const result = await request.execute();
        request.resolve(result);
      } catch (error) {
        request.reject(error);
      }
    }

    this.processing = false;
  }

  /**
   * Clear queue
   */
  clear(): void {
    this.queue.forEach(request => {
      request.reject(new Error('Queue cleared'));
    });
    this.queue = [];
    this.processing = false;
  }

  /**
   * Get queue status
   */
  getStatus(): {
    queueLength: number;
    processing: boolean;
    requestCount: number;
  } {
    return {
      queueLength: this.queue.length,
      processing: this.processing,
      requestCount: this.requestCount,
    };
  }
}

export const RequestQueue = new RequestQueueClass();

/**
 * Debounce function for reducing duplicate requests
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for limiting request frequency
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
