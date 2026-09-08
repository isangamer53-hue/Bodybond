import React, { useRef, useEffect } from 'react';
import { parseVideoSource } from '../utils/videoHelpers';

interface UniversalVideoPlayerProps {
  videoUrl?: string;
  poster?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  className?: string;
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
  onLoadedData,
  onClick,
}) => {
  const parsed = parseVideoSource(videoUrl);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Robust HTML5 video autoplay handling for Chromium, Safari & Mobile
  useEffect(() => {
    const video = videoRef.current;
    if (!video || parsed.isEmbed) return;

    // Browsers strictly enforce muted property on DOM node
    if (muted) {
      video.defaultMuted = true;
      video.muted = true;
    }

    if (autoPlay) {
      video.defaultMuted = true;
      video.muted = true;

      const attemptPlay = () => {
        if (!video) return;
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // If browser autoplay policy held it back, retry when metadata/canplay is ready
            const handleReady = () => {
              video.play().catch(() => {});
              video.removeEventListener('canplay', handleReady);
            };
            video.addEventListener('canplay', handleReady);
          });
        }
      };

      attemptPlay();

      // Also trigger as soon as data or metadata is loaded
      video.addEventListener('loadedmetadata', attemptPlay, { once: true });
      video.addEventListener('loadeddata', attemptPlay, { once: true });

      // First-touch fallback for mobile Safari / strict power-saving modes
      const handleFirstInteraction = () => {
        if (videoRef.current && videoRef.current.paused) {
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
  }, [autoPlay, muted, parsed.src, parsed.isEmbed]);

  // If it's an embed (YouTube Shorts / standard YouTube / Vimeo / Google Drive / TikTok)
  if (parsed.isEmbed && parsed.embedUrl) {
    // Append autoplay parameters if autoPlay is requested
    let embedSrc = parsed.embedUrl;
    if (autoPlay && !embedSrc.includes('autoplay=1')) {
      embedSrc += (embedSrc.includes('?') ? '&' : '?') + 'autoplay=1&mute=1&playsinline=1';
    }

    return (
      <div className={`relative overflow-hidden w-full h-full bg-black ${className}`} onClick={onClick}>
        <iframe
          src={embedSrc}
          title="Video Player"
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
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      controls={controls}
      playsInline
      preload="auto"
      onLoadedData={onLoadedData}
      onClick={onClick}
      className={className}
    />
  );
};
