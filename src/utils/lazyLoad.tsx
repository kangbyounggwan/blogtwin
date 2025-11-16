/**
 * Lazy Loading Utilities
 * Code splitting and lazy loading for better bundle size
 */

import React, {lazy, Suspense, ComponentType} from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {Colors} from '@constants';

/**
 * Lazy load a component with fallback
 */
export function lazyLoadComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{default: T}>,
  fallback?: React.ReactNode,
): React.FC<React.ComponentProps<T>> {
  const LazyComponent = lazy(importFunc);

  return (props: React.ComponentProps<T>) => (
    <Suspense
      fallback={
        fallback || (
          <View style={styles.fallbackContainer}>
            <ActivityIndicator size="large" color={Colors.primary.main} />
          </View>
        )
      }>
      <LazyComponent {...props} />
    </Suspense>
  );
}

/**
 * Lazy load a screen component
 */
export function lazyLoadScreen<T extends ComponentType<any>>(
  importFunc: () => Promise<{default: T}>,
): React.FC<React.ComponentProps<T>> {
  return lazyLoadComponent(importFunc);
}

/**
 * Preload a lazy component
 */
export function preloadComponent(importFunc: () => Promise<any>): void {
  // Trigger the import but don't wait for it
  importFunc().catch(err => {
    console.error('[LazyLoad] Failed to preload component:', err);
  });
}

/**
 * Batch preload multiple components
 */
export function preloadComponents(
  importFuncs: Array<() => Promise<any>>,
): void {
  importFuncs.forEach(importFunc => preloadComponent(importFunc));
}

const styles = StyleSheet.create({
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.common.white,
  },
});

/**
 * Usage example:
 *
 * // In navigator or component:
 * const LazyPostEditor = lazyLoadScreen(() => import('@screens/editor/PostEditorScreen'));
 *
 * // Preload on app start:
 * preloadComponents([
 *   () => import('@screens/editor/PostEditorScreen'),
 *   () => import('@screens/publish/PublishSettingsScreen'),
 * ]);
 */
