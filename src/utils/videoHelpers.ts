/**
 * Helper to process any video URL (direct MP4, YouTube, Vimeo, TikTok, Google Drive, Streamable, etc.)
 * Returns whether it's an embeddable iframe or a direct HTML5 video source.
 */

export interface ProcessedVideo {
  type: 'html5' | 'youtube' | 'vimeo' | 'tiktok' | 'iframe' | 'blob';
  src: string;
  embedUrl?: string;
  isEmbed: boolean;
}

export function parseVideoSource(url: string | undefined | null): ProcessedVideo {
  if (!url || !url.trim()) {
    return {
      type: 'html5',
      src: '',
      isEmbed: false,
    };
  }

  const clean = url.trim();

  // 1. Blob / Data URL
  if (clean.startsWith('blob:') || clean.startsWith('data:video')) {
    return {
      type: 'blob',
      src: clean,
      isEmbed: false,
    };
  }

  // 2. YouTube Shorts or standard YouTube URL
  // Matches: youtube.com/watch?v=XYZ, youtu.be/XYZ, youtube.com/shorts/XYZ, youtube.com/embed/XYZ
  const ytMatch = clean.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      type: 'youtube',
      src: clean,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&playsinline=1&controls=1&rel=0`,
      isEmbed: true,
    };
  }

  // 3. Vimeo
  // Matches: vimeo.com/123456789
  const vimeoMatch = clean.match(/(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)([0-9]+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    const videoId = vimeoMatch[1];
    return {
      type: 'vimeo',
      src: clean,
      embedUrl: `https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1&loop=1&autopause=0`,
      isEmbed: true,
    };
  }

  // 4. Google Drive video preview link
  // Matches any Google Drive file URL format:
  // - drive.google.com/file/d/FILE_ID/view
  // - drive.google.com/file/u/0/d/FILE_ID/view
  // - drive.google.com/open?id=FILE_ID
  // - drive.google.com/uc?id=FILE_ID
  // - docs.google.com/file/d/FILE_ID
  const gdriveMatch = clean.match(/(?:drive\.google\.com\/(?:file\/(?:u\/\d+\/)?d\/|open\?id=|uc\?.*id=)|docs\.google\.com\/file\/d\/)([a-zA-Z0-9_-]+)/i);
  if (gdriveMatch && gdriveMatch[1]) {
    const fileId = gdriveMatch[1];
    return {
      type: 'iframe',
      src: clean,
      embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
      isEmbed: true,
    };
  }

  // 5. TikTok embed link if provided
  if (clean.includes('tiktok.com/embed/')) {
    return {
      type: 'tiktok',
      src: clean,
      embedUrl: clean,
      isEmbed: true,
    };
  }

  // 6. Direct MP4, WebM, MOV, or generic URL for standard HTML5 <video>
  return {
    type: 'html5',
    src: clean,
    isEmbed: false,
  };
}

export function isMediaItemVideo(item?: { src?: string; type?: string; videoUrl?: string } | null): boolean {
  if (!item) return false;
  if (item.type === 'video') return true;
  if (item.videoUrl && item.videoUrl.trim().length > 0) return true;
  const src = (item.src || '').toLowerCase();
  return (
    src.endsWith('.mp4') ||
    src.endsWith('.webm') ||
    src.endsWith('.mov') ||
    src.includes('youtube.com') ||
    src.includes('youtu.be') ||
    src.includes('tiktok.com') ||
    src.includes('vimeo.com') ||
    src.includes('drive.google.com') ||
    src.includes('docs.google.com') ||
    src.startsWith('data:video/')
  );
}

export function isGoogleDriveUrl(url?: string | null): boolean {
  if (!url) return false;
  return url.includes('drive.google.com') || url.includes('docs.google.com');
}
