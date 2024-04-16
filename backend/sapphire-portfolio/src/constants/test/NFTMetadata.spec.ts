import {
  isStandardERC721Metadata,
  standardERC721Metadata,
} from '../NFTMetadata';

describe('NFTMetadata', () => {
  describe('isStandardERC721Metadata', () => {
    it('should return true for valid standardERC721Metadata', () => {
      const validMetadata: standardERC721Metadata = {
        name: 'Test',
        description: 'Test Description',
        image: 'https://test.com/image.png',
        attributes: ['attr1', 'attr2'],
      };

      expect(isStandardERC721Metadata(validMetadata)).toBe(true);
    });

    it('should return false for invalid standardERC721Metadata', () => {
      const invalidMetadata = {
        name: 'Test',
        description: 'Test Description',
        image: 'https://test.com/image.png',
        attributes: ['attr1', 2], // Invalid attribute
      };

      expect(isStandardERC721Metadata(invalidMetadata)).toBe(false);
    });

    it('should return false for missing properties in standardERC721Metadata', () => {
      const missingProperties = {
        name: 'Test',
        description: 'Test Description',
        // Missing image property
        attributes: ['attr1', 'attr2'],
      };

      expect(isStandardERC721Metadata(missingProperties)).toBe(false);
    });
  });
});
