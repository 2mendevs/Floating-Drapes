/**
 * Image optimization utility for Floating Drapes
 * Transforms image URLs (Unsplash, etc.) into modern WebP format with optimal dimensions and compression.
 */
export function getOptimizedImageUrl(url: string, width = 600, quality = 75): string {
  if (!url || typeof url !== 'string') return url;

  // Check if it's an Unsplash URL
  if (url.includes('images.unsplash.com')) {
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.set('auto', 'format,compress');
      urlObj.searchParams.set('fm', 'webp');
      urlObj.searchParams.set('w', width.toString());
      urlObj.searchParams.set('q', quality.toString());
      if (!urlObj.searchParams.has('fit')) {
        urlObj.searchParams.set('fit', 'crop');
      }
      return urlObj.toString();
    } catch (e) {
      // String manipulation fallback
      const baseUrl = url.split('?')[0];
      return `${baseUrl}?auto=format,compress&fm=webp&w=${width}&q=${quality}&fit=crop`;
    }
  }

  return url;
}
