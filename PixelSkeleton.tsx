import React, { useState } from 'react';
import { Loader2, Gamepad2, Sparkles } from 'lucide-react';

interface PixelImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  loadingText?: string;
  aspectRatio?: string;
}

export function PixelImageWithSkeleton({
  src,
  alt,
  className = '',
  containerClassName = '',
  loadingText = 'LOADING ASSET...',
  aspectRatio = 'aspect-square',
  ...props
}: PixelImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-[#090b12] ${aspectRatio} ${containerClassName}`}>
      {/* Pixel Skeleton / Loading Animation Overlay */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0d0f18] p-4 text-center select-none overflow-hidden border border-white/5">
          {/* Retro scanline effect */}
          <div className="absolute inset-0 bg-[radial-[#1a1e30]_1px,transparent_1px] [background-size:8px_8px] opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-accent-blue)]/10 to-transparent h-[200%] animate-[scan_2s_linear_infinite]" />

          {/* Pulsing retro box */}
          <div className="relative mb-3 flex items-center justify-center p-3 rounded bg-black/60 border border-[var(--color-accent-blue)]/40 shadow-[0_0_15px_rgba(0,240,255,0.2)] animate-pulse">
            <Gamepad2 className="w-6 h-6 text-[var(--color-accent-blue)] animate-bounce" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-[var(--color-accent-yellow)] animate-ping" />
          </div>

          {/* Pixel animated text */}
          <div className="flex items-center gap-1.5 text-[var(--color-accent-blue)] font-pixel text-[11px] tracking-wider uppercase animate-pulse">
            <span>{loadingText}</span>
            <span className="inline-block w-1.5 h-3 bg-[var(--color-accent-blue)] animate-blink" />
          </div>

          <div className="mt-2 w-24 h-1.5 bg-black/80 rounded-full overflow-hidden border border-white/10 p-0.5">
            <div className="h-full bg-[var(--color-accent-blue)] rounded-full animate-[progress_1.5s_ease-in-out_infinite]" />
          </div>
        </div>
      )}

      {/* Fallback Error State */}
      {hasError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#121420] text-center p-4 text-gray-500 font-pixel text-xs border border-red-500/30">
          <Sparkles className="w-5 h-5 text-gray-600 mb-1" />
          <span>ASSET UNLOADED</span>
        </div>
      )}

      {/* The Actual Image */}
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setIsLoaded(true);
          setHasError(true);
        }}
        className={`${className} transition-opacity duration-500 ${
          isLoaded && !hasError ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
    </div>
  );
}

export function PixelSkeletonCard() {
  return (
    <div className="bg-[#12141d] rounded-xl border border-white/10 overflow-hidden relative p-0 flex flex-col animate-pulse">
      {/* Top Image Skeleton */}
      <div className="aspect-square bg-[#0d0f18] relative flex flex-col items-center justify-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-[#1e2338]_1px,transparent_1px] [background-size:6px_6px]" />
        <div className="w-10 h-10 rounded bg-white/5 border border-white/10 flex items-center justify-center mb-2">
          <Loader2 className="w-5 h-5 text-gray-600 animate-spin" />
        </div>
        <span className="font-pixel text-[10px] text-gray-500 tracking-wider">LOADING ITEM...</span>
      </div>

      {/* Content Skeleton */}
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-start gap-2">
          <div className="h-4 bg-white/10 rounded w-2/3" />
          <div className="h-4 bg-[var(--color-accent-yellow)]/20 rounded w-1/4" />
        </div>
        <div className="h-3 bg-white/5 rounded w-1/2" />
        <div className="flex gap-2 pt-2">
          <div className="h-5 w-8 bg-white/10 rounded" />
          <div className="h-5 w-8 bg-white/10 rounded" />
          <div className="h-5 w-8 bg-white/10 rounded" />
        </div>
      </div>
    </div>
  );
}
