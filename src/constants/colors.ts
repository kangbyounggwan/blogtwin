/**
 * BlogTwin Color System
 * 앱 전체에서 사용되는 색상 정의
 */

export const Colors = {
  // Primary Colors (브랜드 컬러)
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', // Main primary
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },

  // Secondary Colors (보조 컬러)
  secondary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7', // Main secondary
    600: '#9333ea',
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
  },

  // Success (성공)
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a',
  },

  // Warning (경고)
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
  },

  // Error (에러)
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
  },

  // Info (정보)
  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
  },

  // Grayscale (회색조)
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  // Platform Specific
  tistory: '#FF6B00',
  naver: '#03C75A',
  velog: '#20C997',

  // Light Theme
  light: {
    background: '#ffffff',
    surface: '#f9fafb',
    card: '#ffffff',
    text: {
      primary: '#111827',
      secondary: '#6b7280',
      disabled: '#9ca3af',
    },
    border: '#e5e7eb',
    divider: '#f3f4f6',
    placeholder: '#9ca3af',
  },

  // Dark Theme
  dark: {
    background: '#111827',
    surface: '#1f2937',
    card: '#374151',
    text: {
      primary: '#f9fafb',
      secondary: '#d1d5db',
      disabled: '#6b7280',
    },
    border: '#4b5563',
    divider: '#374151',
    placeholder: '#6b7280',
  },

  // Common (테마 무관)
  common: {
    white: '#ffffff',
    black: '#000000',
    transparent: 'transparent',
  },
};

export type ColorScheme = 'light' | 'dark';

/**
 * 테마에 따른 색상 반환
 */
export const getThemeColors = (scheme: ColorScheme) => {
  return scheme === 'dark' ? Colors.dark : Colors.light;
};
