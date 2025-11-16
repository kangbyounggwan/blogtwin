/**
 * Image Processing Tests
 */

import {
  ImageProcessor,
  ImageValidator,
  ImageInfo,
} from '../imageProcessing';

describe('ImageProcessor', () => {
  describe('getImageMetadata', () => {
    it('should return correct metadata for landscape image', () => {
      const imageInfo: ImageInfo = {
        uri: 'test.jpg',
        width: 1920,
        height: 1080,
      };

      const metadata = ImageProcessor.getImageMetadata(imageInfo);

      expect(metadata.orientation).toBe('landscape');
      expect(metadata.aspectRatio).toBeCloseTo(1.78, 2);
    });

    it('should return correct metadata for portrait image', () => {
      const imageInfo: ImageInfo = {
        uri: 'test.jpg',
        width: 1080,
        height: 1920,
      };

      const metadata = ImageProcessor.getImageMetadata(imageInfo);

      expect(metadata.orientation).toBe('portrait');
      expect(metadata.aspectRatio).toBeCloseTo(0.56, 2);
    });

    it('should return correct metadata for square image', () => {
      const imageInfo: ImageInfo = {
        uri: 'test.jpg',
        width: 1080,
        height: 1080,
      };

      const metadata = ImageProcessor.getImageMetadata(imageInfo);

      expect(metadata.orientation).toBe('square');
      expect(metadata.aspectRatio).toBe(1);
    });
  });

  describe('isFileSizeValid', () => {
    it('should return true for valid file size', () => {
      const imageInfo: ImageInfo = {
        uri: 'test.jpg',
        fileSize: 5 * 1024 * 1024, // 5MB
      };

      expect(ImageProcessor.isFileSizeValid(imageInfo, 10)).toBe(true);
    });

    it('should return false for oversized file', () => {
      const imageInfo: ImageInfo = {
        uri: 'test.jpg',
        fileSize: 15 * 1024 * 1024, // 15MB
      };

      expect(ImageProcessor.isFileSizeValid(imageInfo, 10)).toBe(false);
    });

    it('should return true when file size is not available', () => {
      const imageInfo: ImageInfo = {
        uri: 'test.jpg',
      };

      expect(ImageProcessor.isFileSizeValid(imageInfo, 10)).toBe(true);
    });
  });

  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(ImageProcessor.formatFileSize(0)).toBe('0 Bytes');
      expect(ImageProcessor.formatFileSize(500)).toBe('500 Bytes');
    });

    it('should format KB correctly', () => {
      expect(ImageProcessor.formatFileSize(1024)).toBe('1 KB');
      expect(ImageProcessor.formatFileSize(2048)).toBe('2 KB');
    });

    it('should format MB correctly', () => {
      expect(ImageProcessor.formatFileSize(1024 * 1024)).toBe('1 MB');
      expect(ImageProcessor.formatFileSize(5 * 1024 * 1024)).toBe('5 MB');
    });
  });

  describe('suggestImagePlacement', () => {
    it('should suggest full-width for landscape panorama', () => {
      const metadata = {
        orientation: 'landscape' as const,
        aspectRatio: 2.5,
        estimatedFileSize: 0,
        format: 'jpeg',
      };

      const result = ImageProcessor.suggestImagePlacement(metadata);

      expect(result.placement).toBe('full-width');
    });

    it('should suggest centered for portrait', () => {
      const metadata = {
        orientation: 'portrait' as const,
        aspectRatio: 0.6,
        estimatedFileSize: 0,
        format: 'jpeg',
      };

      const result = ImageProcessor.suggestImagePlacement(metadata);

      expect(result.placement).toBe('centered');
    });
  });

  describe('extractFileName', () => {
    it('should extract filename from URL', () => {
      const uri = 'https://example.com/path/to/image.jpg';
      expect(ImageProcessor.extractFileName(uri)).toBe('image.jpg');
    });

    it('should return default filename for invalid URL', () => {
      const uri = 'invalid';
      expect(ImageProcessor.extractFileName(uri)).toBe('image.jpg');
    });
  });

  describe('getMimeType', () => {
    it('should return correct mime type for jpg', () => {
      expect(ImageProcessor.getMimeType('test.jpg')).toBe('image/jpeg');
      expect(ImageProcessor.getMimeType('test.jpeg')).toBe('image/jpeg');
    });

    it('should return correct mime type for png', () => {
      expect(ImageProcessor.getMimeType('test.png')).toBe('image/png');
    });

    it('should return default mime type for unknown extension', () => {
      expect(ImageProcessor.getMimeType('test.unknown')).toBe('image/jpeg');
    });
  });

  describe('suggestGridLayout', () => {
    it('should suggest 1x1 grid for single image', () => {
      const result = ImageProcessor.suggestGridLayout(1);
      expect(result.columns).toBe(1);
      expect(result.rows).toBe(1);
      expect(result.layout).toBe('grid');
    });

    it('should suggest 2x1 grid for 2 images', () => {
      const result = ImageProcessor.suggestGridLayout(2);
      expect(result.columns).toBe(2);
      expect(result.rows).toBe(1);
    });

    it('should suggest 2x2 grid for 4 images', () => {
      const result = ImageProcessor.suggestGridLayout(4);
      expect(result.columns).toBe(2);
      expect(result.rows).toBe(2);
    });

    it('should suggest carousel for 7+ images', () => {
      const result = ImageProcessor.suggestGridLayout(7);
      expect(result.layout).toBe('carousel');
    });
  });
});

describe('ImageValidator', () => {
  describe('isSupportedFormat', () => {
    it('should return true for supported formats', () => {
      expect(ImageValidator.isSupportedFormat('test.jpg')).toBe(true);
      expect(ImageValidator.isSupportedFormat('test.png')).toBe(true);
      expect(ImageValidator.isSupportedFormat('test.gif')).toBe(true);
    });

    it('should return false for unsupported formats', () => {
      expect(ImageValidator.isSupportedFormat('test.bmp')).toBe(false);
      expect(ImageValidator.isSupportedFormat('test.tiff')).toBe(false);
    });

    it('should be case insensitive', () => {
      expect(ImageValidator.isSupportedFormat('test.JPG')).toBe(true);
      expect(ImageValidator.isSupportedFormat('test.PNG')).toBe(true);
    });
  });

  describe('isValidUri', () => {
    it('should return true for HTTP URLs', () => {
      expect(ImageValidator.isValidUri('http://example.com/image.jpg')).toBe(true);
      expect(ImageValidator.isValidUri('https://example.com/image.jpg')).toBe(true);
    });

    it('should return true for file URLs', () => {
      expect(ImageValidator.isValidUri('file:///path/to/image.jpg')).toBe(true);
    });

    it('should return false for empty string', () => {
      expect(ImageValidator.isValidUri('')).toBe(false);
    });

    it('should return true for non-empty string (relative path)', () => {
      expect(ImageValidator.isValidUri('path/to/image.jpg')).toBe(true);
    });
  });

  describe('isImageCountValid', () => {
    it('should return true for count within range', () => {
      expect(ImageValidator.isImageCountValid(5, 1, 10)).toBe(true);
    });

    it('should return false for count below minimum', () => {
      expect(ImageValidator.isImageCountValid(0, 1, 10)).toBe(false);
    });

    it('should return false for count above maximum', () => {
      expect(ImageValidator.isImageCountValid(11, 1, 10)).toBe(false);
    });

    it('should accept count at boundaries', () => {
      expect(ImageValidator.isImageCountValid(1, 1, 10)).toBe(true);
      expect(ImageValidator.isImageCountValid(10, 1, 10)).toBe(true);
    });
  });
});
