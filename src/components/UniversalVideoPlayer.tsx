import React, { useRef, useEffect, useState } from 'react';
import { parseVideoSource } from '../utils/videoHelpers';

interface UniversalVideoPlayerProps {
  videoUrl?: string;
  poster?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  className?: string;
  preload?: 'none' | 'metadata' | 'auto';
  onLoadedData?: () => void;
  onClick?: () => void;
}

export const UniversalVideoPlayer: React.FC<UniversalVideoPlayerProps> = ({
  videoUrl,
  poster,
  autoPlay = false,
  loop = true,
  muted = true,
  controls = false,
  className = 'w-full h-full object-cover',
  preload = 'metadata',
  onLoadedData,
  onClick,
}) => {
  const parsed = parseVideoSource(videoUrl);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInViewport, setIsInViewport] = useState(false);

  // Viewport IntersectionObserver to play only when visible
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !('IntersectionObserver' in window)) {
      setIsInViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    observer.observe(video);
    return () => {
      observer.disconnect();
    };
  }, []);

  // Robust HTML5 video autoplay handling for Chromium, Safari & Mobile
  useEffect(() => {
    const video = videoRef.current;
    if (!video || parsed.isEmbed) return;

    // Browsers strictly enforce muted property on DOM node
    if (muted) {
      video.defaultMuted = true;
      video.muted = true;
    }

    if (autoPlay && isInViewport) {
      video.defaultMuted = true;
      video.muted = true;

      const attemptPlay = () => {
        if (!video) return;
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            const handleReady = () => {
              video.play().catch(() => {});
              video.removeEventListener('canplay', handleReady);
            };
            video.addEventListener('canplay', handleReady);
          });
        }
      };

      attemptPlay();

      video.addEventListener('loadedmetadata', attemptPlay, { once: true });
      video.addEventListener('loadeddata', attemptPlay, { once: true });

      const handleFirstInteraction = () => {
        if (videoRef.current && videoRef.current.paused && isInViewport) {
          videoRef.current.play().catch(() => {});
        }
      };
      window.addEventListener('touchstart', handleFirstInteraction, { once: true, passive: true });
      window.addEventListener('click', handleFirstInteraction, { once: true, passive: true });

      return () => {
        video.removeEventListener('loadedmetadata', attemptPlay);
        video.removeEventListener('loadeddata', attemptPlay);
        window.removeEventListener('touchstart', handleFirstInteraction);
        window.removeEventListener('click', handleFirstInteraction);
      };
    } else {
      video.pause();
    }
  }, [autoPlay, muted, parsed.src, parsed.isEmbed, isInViewport]);

  // If it's an embed (YouTube Shorts / standard YouTube / Vimeo / Google Drive / TikTok)
  if (parsed.isEmbed && parsed.embedUrl) {
    let embedSrc = parsed.embedUrl;
    if (autoPlay && isInViewport && !embedSrc.includes('autoplay=1')) {
      embedSrc += (embedSrc.includes('?') ? '&' : '?') + 'autoplay=1&mute=1&playsinline=1';
    }

    return (
      <div className={`relative overflow-hidden w-full h-full bg-black ${className}`} onClick={onClick}>
        <iframe
          src={embedSrc}
          title="Video Player"
          loading="lazy"
          className="w-full h-full border-0 absolute inset-0 pointer-events-auto"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  // HTML5 native video (MP4, WebM, Blob, Direct CDN URL)
  return (
    <video
      ref={videoRef}
      src={parsed.src || undefined}
      poster={poster}
      autoPlay={autoPlay && isInViewport}
      loop={loop}
      muted={muted}
      controls={controls}
      playsInline
      preload={preload}
      onLoadedData={onLoadedData}
      onClick={onClick}
      className={className}
    />
  );
};
