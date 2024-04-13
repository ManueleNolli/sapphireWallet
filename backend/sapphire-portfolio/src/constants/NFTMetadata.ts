export type standardERC721Metadata = {
  name: string;
  description: string;
  image: string;
  attributes: string[];
};

// Define a type guard function to check if an object matches standardERC721Metadata
export function isStandardERC721Metadata(
  object: any,
): object is standardERC721Metadata {
  return (
    typeof object.name === 'string' &&
    typeof object.description === 'string' &&
    typeof object.image === 'string' &&
    Array.isArray(object.attributes) &&
    object.attributes.every((attr: any) => typeof attr === 'string')
  );
}
