import { getBaseUrl } from './url';

describe('url utils', () => {
  describe('getBaseUrl', () => {
    test('should extract base URL from organization URL', () => {
      // Arrange
      const urls = [
        'https://dev.azure.com/org-name',
        'https://dev.azure.com/org-name/project',
        'http://dev.azure.com/org-name',
        'https://custom-server.com/org-name',
      ];

      // Act & Assert
      expect(getBaseUrl(urls[0])).toBe('https://dev.azure.com');
      expect(getBaseUrl(urls[1])).toBe('https://dev.azure.com');
      expect(getBaseUrl(urls[2])).toBe('http://dev.azure.com');
      expect(getBaseUrl(urls[3])).toBe('https://custom-server.com');
    });

    test('should throw error for invalid URLs', () => {
      // Arrange
      const invalidUrls = [
        'invalid-url',
        'not-a-url/org-name',
        '',
        'http://',
        'https://',
      ];

      // Act & Assert
      invalidUrls.forEach((url) => {
        expect(() => getBaseUrl(url)).toThrow(
          'Invalid organization URL format',
        );
      });
    });
  });
});
