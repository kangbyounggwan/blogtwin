/**
 * Accessibility Utilities
 * 접근성 개선을 위한 유틸리티 함수들
 */

import {AccessibilityInfo, Platform} from 'react-native';

/**
 * Accessibility Props Generator
 * 컴포넌트에 적용할 접근성 props를 생성
 */
export const a11yProps = {
  /**
   * Button accessibility props
   */
  button: (label: string, hint?: string) => ({
    accessible: true,
    accessibilityRole: 'button' as const,
    accessibilityLabel: label,
    accessibilityHint: hint,
  }),

  /**
   * Link accessibility props
   */
  link: (label: string, hint?: string) => ({
    accessible: true,
    accessibilityRole: 'link' as const,
    accessibilityLabel: label,
    accessibilityHint: hint,
  }),

  /**
   * Text input accessibility props
   */
  textInput: (label: string, hint?: string, value?: string) => ({
    accessible: true,
    accessibilityRole: 'text' as const,
    accessibilityLabel: label,
    accessibilityHint: hint,
    accessibilityValue: value ? {text: value} : undefined,
  }),

  /**
   * Image accessibility props
   */
  image: (label: string) => ({
    accessible: true,
    accessibilityRole: 'image' as const,
    accessibilityLabel: label,
  }),

  /**
   * Header accessibility props
   */
  header: (label: string, level?: number) => ({
    accessible: true,
    accessibilityRole: 'header' as const,
    accessibilityLabel: label,
    ...(Platform.OS === 'ios' && level && {
      accessibilityTraits: ['header'],
    }),
  }),

  /**
   * Loading state accessibility props
   */
  loading: (message?: string) => ({
    accessible: true,
    accessibilityRole: 'progressbar' as const,
    accessibilityLabel: message || '로딩 중',
    accessibilityLiveRegion: 'polite' as const,
  }),

  /**
   * Alert accessibility props
   */
  alert: (message: string) => ({
    accessible: true,
    accessibilityRole: 'alert' as const,
    accessibilityLabel: message,
    accessibilityLiveRegion: 'assertive' as const,
  }),
};

/**
 * Screen Reader Announcement
 * 스크린 리더로 메시지 읽기
 */
export const announceForAccessibility = (message: string): void => {
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    AccessibilityInfo.announceForAccessibility(message);
  }
};

/**
 * Check if screen reader is enabled
 */
export const isScreenReaderEnabled = async (): Promise<boolean> => {
  try {
    return await AccessibilityInfo.isScreenReaderEnabled();
  } catch (error) {
    console.error('Error checking screen reader:', error);
    return false;
  }
};

/**
 * Set accessibility focus
 */
export const setAccessibilityFocus = (reactTag: number): void => {
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    AccessibilityInfo.setAccessibilityFocus(reactTag);
  }
};

/**
 * Accessibility State Helper
 */
export const a11yState = {
  disabled: {accessibilityState: {disabled: true}},
  selected: {accessibilityState: {selected: true}},
  checked: {accessibilityState: {checked: true}},
  unchecked: {accessibilityState: {checked: false}},
  expanded: {accessibilityState: {expanded: true}},
  collapsed: {accessibilityState: {expanded: false}},
  busy: {accessibilityState: {busy: true}},
};

/**
 * Combine accessibility props
 */
export const combineA11yProps = (...props: any[]) => {
  return Object.assign({}, ...props);
};

/**
 * Format number for screen reader
 */
export const formatNumberForScreenReader = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}백만`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}천`;
  }
  return num.toString();
};

/**
 * Format date for screen reader
 */
export const formatDateForScreenReader = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  };
  return date.toLocaleDateString('ko-KR', options);
};

/**
 * Accessibility Hook - Listen to screen reader state changes
 */
export const useScreenReaderStatus = (
  callback: (enabled: boolean) => void
): void => {
  const checkScreenReader = async () => {
    const enabled = await isScreenReaderEnabled();
    callback(enabled);
  };

  // Initial check
  checkScreenReader();

  // Listen for changes
  const subscription = AccessibilityInfo.addEventListener(
    'screenReaderChanged',
    callback
  );

  // Cleanup
  return () => {
    subscription?.remove();
  };
};
