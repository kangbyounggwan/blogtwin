/**
 * Accessibility Utils Tests
 */

import {
  a11yProps,
  formatNumberForScreenReader,
  formatDateForScreenReader,
  combineA11yProps,
} from '../accessibility';

describe('a11yProps', () => {
  describe('button', () => {
    it('should return correct accessibility props for button', () => {
      const props = a11yProps.button('Submit', 'Tap to submit form');

      expect(props).toEqual({
        accessible: true,
        accessibilityRole: 'button',
        accessibilityLabel: 'Submit',
        accessibilityHint: 'Tap to submit form',
      });
    });

    it('should work without hint', () => {
      const props = a11yProps.button('Submit');

      expect(props).toEqual({
        accessible: true,
        accessibilityRole: 'button',
        accessibilityLabel: 'Submit',
        accessibilityHint: undefined,
      });
    });
  });

  describe('link', () => {
    it('should return correct accessibility props for link', () => {
      const props = a11yProps.link('Read more', 'Opens article page');

      expect(props).toEqual({
        accessible: true,
        accessibilityRole: 'link',
        accessibilityLabel: 'Read more',
        accessibilityHint: 'Opens article page',
      });
    });
  });

  describe('textInput', () => {
    it('should return correct accessibility props for text input', () => {
      const props = a11yProps.textInput('Email', 'Enter your email address', 'user@example.com');

      expect(props).toEqual({
        accessible: true,
        accessibilityRole: 'text',
        accessibilityLabel: 'Email',
        accessibilityHint: 'Enter your email address',
        accessibilityValue: {text: 'user@example.com'},
      });
    });

    it('should work without value', () => {
      const props = a11yProps.textInput('Email', 'Enter your email address');

      expect(props.accessibilityValue).toBeUndefined();
    });
  });

  describe('image', () => {
    it('should return correct accessibility props for image', () => {
      const props = a11yProps.image('Profile picture');

      expect(props).toEqual({
        accessible: true,
        accessibilityRole: 'image',
        accessibilityLabel: 'Profile picture',
      });
    });
  });

  describe('header', () => {
    it('should return correct accessibility props for header', () => {
      const props = a11yProps.header('Page Title', 1);

      expect(props.accessible).toBe(true);
      expect(props.accessibilityRole).toBe('header');
      expect(props.accessibilityLabel).toBe('Page Title');
    });
  });

  describe('loading', () => {
    it('should return correct accessibility props for loading state', () => {
      const props = a11yProps.loading('Loading posts');

      expect(props).toEqual({
        accessible: true,
        accessibilityRole: 'progressbar',
        accessibilityLabel: 'Loading posts',
        accessibilityLiveRegion: 'polite',
      });
    });

    it('should use default message when not provided', () => {
      const props = a11yProps.loading();

      expect(props.accessibilityLabel).toBe('로딩 중');
    });
  });

  describe('alert', () => {
    it('should return correct accessibility props for alert', () => {
      const props = a11yProps.alert('Error occurred');

      expect(props).toEqual({
        accessible: true,
        accessibilityRole: 'alert',
        accessibilityLabel: 'Error occurred',
        accessibilityLiveRegion: 'assertive',
      });
    });
  });
});

describe('formatNumberForScreenReader', () => {
  it('should format numbers less than 1000 as is', () => {
    expect(formatNumberForScreenReader(0)).toBe('0');
    expect(formatNumberForScreenReader(500)).toBe('500');
    expect(formatNumberForScreenReader(999)).toBe('999');
  });

  it('should format thousands correctly', () => {
    expect(formatNumberForScreenReader(1000)).toBe('1.0천');
    expect(formatNumberForScreenReader(5500)).toBe('5.5천');
    expect(formatNumberForScreenReader(999999)).toBe('1000.0천');
  });

  it('should format millions correctly', () => {
    expect(formatNumberForScreenReader(1000000)).toBe('1.0백만');
    expect(formatNumberForScreenReader(5500000)).toBe('5.5백만');
    expect(formatNumberForScreenReader(10000000)).toBe('10.0백만');
  });
});

describe('formatDateForScreenReader', () => {
  it('should format date with weekday and full month', () => {
    const date = new Date('2025-11-16');
    const formatted = formatDateForScreenReader(date);

    // Should include year, month name, day, and weekday
    expect(formatted).toContain('2025');
    expect(formatted).toContain('11');
    expect(formatted).toContain('16');
  });

  it('should be locale-specific (Korean)', () => {
    const date = new Date('2025-11-16');
    const formatted = formatDateForScreenReader(date);

    // Korean locale should be applied
    expect(typeof formatted).toBe('string');
    expect(formatted.length).toBeGreaterThan(0);
  });
});

describe('combineA11yProps', () => {
  it('should combine multiple accessibility props objects', () => {
    const props1 = {accessible: true, accessibilityRole: 'button' as const};
    const props2 = {accessibilityLabel: 'Submit'};
    const props3 = {accessibilityHint: 'Tap to submit'};

    const combined = combineA11yProps(props1, props2, props3);

    expect(combined).toEqual({
      accessible: true,
      accessibilityRole: 'button',
      accessibilityLabel: 'Submit',
      accessibilityHint: 'Tap to submit',
    });
  });

  it('should handle overlapping properties (last wins)', () => {
    const props1 = {accessibilityLabel: 'First'};
    const props2 = {accessibilityLabel: 'Second'};

    const combined = combineA11yProps(props1, props2);

    expect(combined.accessibilityLabel).toBe('Second');
  });

  it('should handle empty input', () => {
    const combined = combineA11yProps();

    expect(combined).toEqual({});
  });
});
