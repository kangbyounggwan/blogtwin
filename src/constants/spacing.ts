/**
 * BlogTwin Spacing System
 * 마진, 패딩, 간격 등에 사용되는 값들
 */

/**
 * Spacing Scale (4px 기준)
 */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
  '6xl': 80,
} as const;

/**
 * Border Radius
 */
export const BorderRadius = {
  none: 0,
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
} as const;

/**
 * Border Width
 */
export const BorderWidth = {
  none: 0,
  thin: 1,
  base: 2,
  thick: 4,
} as const;

/**
 * Shadows (Elevation)
 */
export const Shadows = {
  none: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  base: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 12},
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
} as const;

/**
 * Icon Sizes
 */
export const IconSize = {
  xs: 16,
  sm: 20,
  base: 24,
  md: 28,
  lg: 32,
  xl: 40,
  '2xl': 48,
  '3xl': 64,
} as const;

/**
 * Layout Sizes
 */
export const Layout = {
  headerHeight: 56,
  tabBarHeight: 60,
  bottomSheetHandleHeight: 20,
  maxContentWidth: 600,
  screenPadding: Spacing.base,
} as const;
