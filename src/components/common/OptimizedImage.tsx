/**
 * Optimized Image Component
 * Lazy loading, progressive loading, 메모리 최적화
 */

import React, {useState, useEffect, useRef} from 'react';
import {
  Image,
  View,
  StyleSheet,
  ActivityIndicator,
  ImageProps,
  ImageURISource,
  Platform,
} from 'react-native';
import {Colors} from '@constants';

interface OptimizedImageProps extends Omit<ImageProps, 'source'> {
  source: ImageURISource | number;
  placeholder?: ImageURISource | number;
  lazyLoad?: boolean;
  progressive?: boolean;
  cachePolicy?: 'memory' | 'disk' | 'memory-disk';
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
  onError?: (error: any) => void;
  fallbackImage?: ImageURISource | number;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  source,
  placeholder,
  lazyLoad = true,
  progressive = true,
  cachePolicy = 'memory-disk',
  style,
  onLoadStart,
  onLoadEnd,
  onError,
  fallbackImage,
  ...restProps
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(!lazyLoad);
  const [loadedSource, setLoadedSource] = useState<ImageURISource | number | null>(
    placeholder || null
  );
  const viewRef = useRef<View>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    // Lazy loading: observe visibility
    if (lazyLoad) {
      const timer = setTimeout(() => {
        if (isMounted.current) {
          setIsVisible(true);
        }
      }, 100);

      return () => {
        clearTimeout(timer);
        isMounted.current = false;
      };
    }

    return () => {
      isMounted.current = false;
    };
  }, [lazyLoad]);

  useEffect(() => {
    if (isVisible && !hasError) {
      loadImage();
    }
  }, [isVisible, source]);

  const loadImage = () => {
    if (typeof source === 'number') {
      // Local image (require())
      setLoadedSource(source);
      setIsLoading(false);
      return;
    }

    // Remote image with progressive loading
    if (progressive && placeholder) {
      // First show placeholder
      setLoadedSource(placeholder);
      setIsLoading(true);

      // Then load full image
      Image.prefetch((source as ImageURISource).uri || '')
        .then(() => {
          if (isMounted.current) {
            setLoadedSource(source);
            setIsLoading(false);
            onLoadEnd?.();
          }
        })
        .catch(error => {
          console.error('[OptimizedImage] Load error:', error);
          if (isMounted.current) {
            setHasError(true);
            setIsLoading(false);
            onError?.(error);

            if (fallbackImage) {
              setLoadedSource(fallbackImage);
            }
          }
        });
    } else {
      // Direct loading
      setLoadedSource(source);
    }
  };

  const handleLoadStart = () => {
    setIsLoading(true);
    onLoadStart?.();
  };

  const handleLoadEnd = () => {
    if (isMounted.current) {
      setIsLoading(false);
      onLoadEnd?.();
    }
  };

  const handleError = (error: any) => {
    if (isMounted.current) {
      setHasError(true);
      setIsLoading(false);
      onError?.(error);

      if (fallbackImage) {
        setLoadedSource(fallbackImage);
      }
    }
  };

  if (!isVisible) {
    return (
      <View ref={viewRef} style={[styles.placeholder, style]}>
        <ActivityIndicator size="small" color={Colors.primary.main} />
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {loadedSource && (
        <Image
          {...restProps}
          source={loadedSource}
          style={[StyleSheet.absoluteFill, style]}
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
          onError={handleError}
          resizeMode={restProps.resizeMode || 'cover'}
          // Platform-specific optimizations
          {...(Platform.OS === 'android' && {
            fadeDuration: 300,
          })}
          {...(Platform.OS === 'ios' && {
            defaultSource: typeof placeholder === 'number' ? placeholder : undefined,
          })}
        />
      )}

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color={Colors.primary.main} />
        </View>
      )}

      {hasError && !fallbackImage && (
        <View style={styles.errorContainer}>
          <ActivityIndicator size="small" color={Colors.error.main} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: Colors.grey[100],
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.grey[100],
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.grey[100],
  },
});
