import React, { useState } from 'react';
import { getOptimizedImageUrl } from '../utils/imageUtils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  quality?: number;
  priority?: boolean;
  className?: string;
  containerClassName?: string;
}

export default function OptimizedImage({
  src,
  alt,
  width = 600,
  quality = 75,
  priority = false,
  className = '',
  containerClassName = '',
  ...rest
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const optimizedSrc = getOptimizedImageUrl(src, width, quality);

  // Default fallback image if original link is broken
  const fallbackSrc = 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format,compress&fm=webp&w=600&q=70';

  return (
    <div className={`relative overflow-hidden ${containerClassName || 'w-full h-full'}`}>
      {/* Shimmering Skeleton Loader while image is downloading */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 animate-pulse z-10" />
      )}

      {/* Actual Image */}
      <img
        src={hasError ? fallbackSrc : optimizedSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
        }}
        className={`w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        {...rest}
      />
    </div>
  );
}
