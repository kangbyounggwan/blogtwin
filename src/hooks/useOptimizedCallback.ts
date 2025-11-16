/**
 * Optimized Callback Hooks
 * React performance optimization hooks
 */

import {useCallback, useRef, useEffect, DependencyList} from 'react';
import {debounce, throttle} from '@utils/requestQueue';

/**
 * Debounced callback hook
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: DependencyList = [],
): T {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback(
    debounce((...args: Parameters<T>) => {
      return callbackRef.current(...args);
    }, delay) as T,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps,
  );
}

/**
 * Throttled callback hook
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  limit: number,
  deps: DependencyList = [],
): T {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback(
    throttle((...args: Parameters<T>) => {
      return callbackRef.current(...args);
    }, limit) as T,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps,
  );
}

/**
 * Memoized callback that doesn't change between renders
 */
export function useStableCallback<T extends (...args: any[]) => any>(
  callback: T,
): T {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback((...args: Parameters<T>) => {
    return callbackRef.current(...args);
  }, []) as T;
}
