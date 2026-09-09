import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  safeSetDoc, 
  checkAndHandleFirestoreError, 
  isFirestoreQuotaExceeded 
} from '../utils/firestoreGuard';
import { GalleryMediaItem, VideoReelItem, ConfidenceSlideItem, MediaConfig } from '../types';
import { loadVideoBlobUrl, clearAllVideoBlobs } from '../utils/videoStorage';
import { isMediaItemVideo } from '../utils/videoHelpers';

const STORAGE_KEY = 'bodybond_custom_media_v2';
const PASSWORD_STORAGE_KEY = 'bodybond_admin_secret_pass';
export const DEFAULT_ADMIN_PASSWORD = 'admin123';

export const DEFAULT_GALLERY_IMAGES: GalleryMediaItem[] = [
  {
    src: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=85',
    caption: 'Max Hold Application',
    type: 'image'
  },
  {
    src: '/videos/reel-dress.mp4',
    caption: 'Live Application Demo Video',
    type: 'video',
    videoUrl: '/videos/reel-dress.mp4',
    poster: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=80'
  },
  {
    src: '/images/how_to_use_guide.jpg',
    caption: 'Secure Hold In Secs (How To Use)',
    type: 'image'
  },
  {
    src: '/images/how_to_remove_guide.jpg',
    caption: 'Easy Removal Process (How To Remove)',
    type: 'image'
  },
  {
    src: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=85',
    caption: 'Party & Festival Proof',
    type: 'image'
  },
  {
    src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85',
    caption: 'Halter & Plunge Hold',
    type: 'image'
  },
  {
    src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
    caption: 'Silk & Satin Friendly',
    type: 'image'
  },
  {
    src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
    caption: 'All-Day Sweat & Dance Proof',
    type: 'image'
  }
];

export const DEFAULT_NIPS_IMAGES: GalleryMediaItem[] = [
  {
    src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=80',
    caption: 'Seamless Micro-Tapered Edges'
  },
  {
    src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=80',
    caption: 'Waterproof & Sweatproof'
  },
  {
    src: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1000&q=80',
    caption: 'Matte Flash Photography Proof'
  }
];

export const padGallery = (list: GalleryMediaItem[]): GalleryMediaItem[] => {
  if (!Array.isArray(list) || list.length === 0) return DEFAULT_GALLERY_IMAGES;
  let copy = [...list];
  const hasVideo = copy.some((item) => isMediaItemVideo(item));
  // If the user's gallery has no video, ensure slot 1 has the video
  if (!hasVideo && DEFAULT_GALLERY_IMAGES[1]) {
    copy.splice(1, 0, DEFAULT_GALLERY_IMAGES[1]);
  }
  if (copy.length >= DEFAULT_GALLERY_IMAGES.length) return copy;
  for (let i = copy.length; i < DEFAULT_GALLERY_IMAGES.length; i++) {
    copy.push(DEFAULT_GALLERY_IMAGES[i]);
  }
  return copy;
};

export const DEFAULT_WELCOME_IMAGE = 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80';
export const DEFAULT_FEATURED_GLUE_IMAGE = 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=80';
export const DEFAULT_FOLLOW_US_IMAGE = 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=1600&q=80';
export const DEFAULT_HERO_BANNER = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1600&q=85';

export const DEFAULT_VIDEO_REELS: VideoReelItem[] = [
  {
    id: 'reel-dress',
    title: 'Keep Your Dress In Place',
    badge: 'KEEP YOUR DRESS IN PLACE',
    poster: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=500&q=80',
    videoUrl: '/assets/aistudio/videos/reel-dress.mp4',
    author: '@bodybond.bd',
    description: 'Deep V plunge & saree blouse stays locked to skin with zero wardrobe malfunctions.'
  },
  {
    id: 'reel-boob-tube',
    title: 'Keep Boob Tube In Place',
    badge: 'KEEP BOOB TUBE IN PLACE',
    poster: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=500&q=80',
    videoUrl: '/assets/aistudio/videos/reel-boob-tube.mp4',
    author: '@bodybond.style',
    description: 'Strapless & tube tops stay glued securely even while dancing in hot humid weather.'
  },
  {
    id: 'reel-tank-top',
    title: 'Keep Tank Top In Place',
    badge: 'KEEP TANK TOP IN PLACE',
    poster: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
    videoUrl: '/assets/aistudio/videos/reel-tank-top.mp4',
    author: '@fashion_dhaka',
    description: 'Stops straps and dupatta from sliding down your shoulders all day long.'
  },
  {
    id: 'reel-gym-shorts',
    title: 'Keep Gym Shorts In Place',
    badge: 'KEEP GYM SHORTS IN PLACE',
    poster: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=500&q=80',
    videoUrl: '/assets/aistudio/videos/reel-gym-shorts.mp4',
    author: '@fitness_bd',
    description: 'Prevents biker shorts and gym tights from rolling down during heavy workouts.'
  },
  {
    id: 'reel-jeans',
    title: 'Temporary Hem Your Jeans',
    badge: 'TEMPORARY HEM YOUR JEANS',
    poster: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=500&q=80',
    videoUrl: '/assets/aistudio/videos/reel-jeans.mp4',
    author: '@style_bd',
    description: 'Dragging long pants or salwars on the floor? Bodybond hems it cleanly in 30 seconds!'
  },
  {
    id: 'reel-heels',
    title: 'Keep Heel Straps In Place',
    badge: 'KEEP HEEL STRAPS IN PLACE',
    poster: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=500&q=80',
    videoUrl: '/assets/aistudio/videos/reel-heels.mp4',
    author: '@bodybond_official',
    description: 'Ankle straps sliding down all night? A tiny dab of Bodybond keeps slingbacks secure.'
  }
];

export const DEFAULT_CONFIDENCE_SLIDES: ConfidenceSlideItem[] = [
  {
    img: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=85',
    title: 'Feel Super Confident.',
    desc: 'BODYBOND Glue keeps everything in place from deep back blouses to party gowns. Move, dance, and celebrate all day & night!'
  },
  {
    img: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85',
    title: 'Sweat Proof & Dance Proof.',
    desc: 'Formulated to resist heavy sweat and high humidity in Bangladesh. Washes off cleanly with warm water.'
  }
];

interface MediaContextType {
  galleryImages: GalleryMediaItem[];
  nipsImages: GalleryMediaItem[];
  videoReels: VideoReelItem[];
  confidenceSlides: ConfidenceSlideItem[];
  heroBanner: string;
  welcomeImage: string;
  featuredGlueImage: string;
  followUsImage: string;
  autoPlayVideos: boolean;
  updateGalleryImage: (index: number, newSrc: string, newCaption?: string, type?: 'image' | 'video', poster?: string) => void;
  addGalleryImage: (item?: GalleryMediaItem) => void;
  deleteGalleryImage: (index: number) => void;
  updateNipsImage: (index: number, newSrc: string, newCaption?: string) => void;
  updateVideoReel: (index: number, updates: Partial<VideoReelItem>) => void;
  addVideoReel: (reel: VideoReelItem) => void;
  deleteVideoReel: (index: number) => void;
  moveVideoReel: (fromIndex: number, toIndex: number) => void;
  updateConfidenceSlide: (index: number, img: string, title?: string, desc?: string) => void;
  updateHeroBanner: (newSrc: string) => void;
  updateWelcomeImage: (newSrc: string) => void;
  updateFeaturedGlueImage: (newSrc: string) => void;
  updateFollowUsImage: (newSrc: string) => void;
  setAutoPlayVideos: (enabled: boolean) => void;
  resetToDefaults: () => Promise<void>;
  resetVideoReels: () => Promise<void>;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  openAdmin: () => void;
  closeAdmin: () => void;
  hasCustomChanges: boolean;

  // Password & Authentication State
  isAdminAuthenticated: boolean;
  verifyAdminPassword: (inputPassword: string) => boolean;
  changeAdminPassword: (newPassword: string) => Promise<boolean>;
  logoutAdmin: () => void;
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export const MediaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    try {
      return localStorage.getItem(PASSWORD_STORAGE_KEY) || DEFAULT_ADMIN_PASSWORD;
    } catch {
      return DEFAULT_ADMIN_PASSWORD;
    }
  });

  // Media Collections
  const [galleryImages, setGalleryImages] = useState<GalleryMediaItem[]>(DEFAULT_GALLERY_IMAGES);
  const [nipsImages, setNipsImages] = useState<GalleryMediaItem[]>(DEFAULT_NIPS_IMAGES);
  const [videoReels, setVideoReels] = useState<VideoReelItem[]>(DEFAULT_VIDEO_REELS);
  const [confidenceSlides, setConfidenceSlides] = useState<ConfidenceSlideItem[]>(DEFAULT_CONFIDENCE_SLIDES);
  const [heroBanner, setHeroBanner] = useState<string>(DEFAULT_HERO_BANNER);
  const [welcomeImage, setWelcomeImage] = useState<string>(DEFAULT_WELCOME_IMAGE);
  const [featuredGlueImage, setFeaturedGlueImage] = useState<string>(DEFAULT_FEATURED_GLUE_IMAGE);
  const [followUsImage, setFollowUsImage] = useState<string>(DEFAULT_FOLLOW_US_IMAGE);
  const [autoPlayVideos, setAutoPlayVideosState] = useState<boolean>(true);
  const [hasCustomChanges, setHasCustomChanges] = useState(false);

  // Load from Firestore / localStorage on mount
  useEffect(() => {
    // 1. Initial local load
    const loadMediaData = async () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('bodibond_custom_media_v2');
        if (saved) {
          const parsed: Partial<MediaConfig> = JSON.parse(saved);
          if (parsed.galleryImages) setGalleryImages(padGallery(parsed.galleryImages));
          if (parsed.nipsImages) setNipsImages(parsed.nipsImages);
          if (parsed.confidenceSlides) setConfidenceSlides(parsed.confidenceSlides);
          if (parsed.heroBanner) setHeroBanner(parsed.heroBanner);
          if (parsed.welcomeImage) setWelcomeImage(parsed.welcomeImage);
          if (parsed.featuredGlueImage) setFeaturedGlueImage(parsed.featuredGlueImage);
          if (parsed.followUsImage) setFollowUsImage(parsed.followUsImage);
          if (typeof parsed.autoPlayVideos === 'boolean') setAutoPlayVideosState(parsed.autoPlayVideos);

          if (parsed.videoReels && Array.isArray(parsed.videoReels)) {
            const sanitizedReels = await Promise.all(parsed.videoReels.map(async (savedItem, idx) => {
              const def = DEFAULT_VIDEO_REELS[idx] || DEFAULT_VIDEO_REELS[0];
              let finalVideoUrl = savedItem.videoUrl;
              if (savedItem.hasCustomBlob) {
                const storedBlobUrl = await loadVideoBlobUrl(savedItem.id || def.id);
                if (storedBlobUrl) finalVideoUrl = storedBlobUrl;
              }
              return { ...def, ...savedItem, videoUrl: finalVideoUrl || def.videoUrl };
            }));
            setVideoReels(sanitizedReels);
          }
          setHasCustomChanges(true);
        }

        // 2. Optimized Firestore Fetch (One-time getDoc to save quota)
        const fetchRemote = async () => {
          try {
            const [gal, nip, ban, rel, sec] = await Promise.all([
              getDoc(doc(db, 'settings', 'media_gallery')),
              getDoc(doc(db, 'settings', 'media_nips')),
              getDoc(doc(db, 'settings', 'media_banners')),
              getDoc(doc(db, 'settings', 'media_reels')),
              getDoc(doc(db, 'settings', 'security'))
            ]);

            if (gal.exists() && gal.data().galleryImages) setGalleryImages(padGallery(gal.data().galleryImages));
            if (nip.exists()) setNipsImages(nip.data().nipsImages);
            if (rel.exists()) setVideoReels(rel.data().videoReels);
            if (ban.exists()) {
              const d = ban.data();
              if (d.heroBanner) setHeroBanner(d.heroBanner);
              if (d.welcomeImage) setWelcomeImage(d.welcomeImage);
              if (d.featuredGlueImage) setFeaturedGlueImage(d.featuredGlueImage);
              if (d.followUsImage) setFollowUsImage(d.followUsImage);
              if (d.confidenceSlides) setConfidenceSlides(d.confidenceSlides);
            }
            if (sec.exists() && sec.data().adminPassword) {
              setAdminPassword(sec.data().adminPassword);
            }
          } catch (e) {
            checkAndHandleFirestoreError(e);
            console.warn('Firestore initial fetch skipped (likely quota or offline):', e);
          }
        };

        fetchRemote();
      } catch (e) {
        console.warn('Failed to load media config:', e);
      }
    };

    loadMediaData();

    // 3. Optional: Real-time sync ONLY for authenticated admins
    let unsubs: (() => void)[] = [];
    if (isAdminAuthenticated && !isFirestoreQuotaExceeded()) {
      unsubs = [
        onSnapshot(
          doc(db, 'settings', 'media_gallery'), 
          (s) => s.exists() && s.data().galleryImages && setGalleryImages(padGallery(s.data().galleryImages)),
          (err) => checkAndHandleFirestoreError(err)
        ),
        onSnapshot(
          doc(db, 'settings', 'media_nips'), 
          (s) => s.exists() && setNipsImages(s.data().nipsImages),
          (err) => checkAndHandleFirestoreError(err)
        ),
        onSnapshot(
          doc(db, 'settings', 'media_reels'), 
          (s) => s.exists() && setVideoReels(s.data().videoReels),
          (err) => checkAndHandleFirestoreError(err)
        ),
        onSnapshot(
          doc(db, 'settings', 'media_banners'), 
          (s) => {
            if (s.exists()) {
              const d = s.data();
              if (d.heroBanner) setHeroBanner(d.heroBanner);
              if (d.welcomeImage) setWelcomeImage(d.welcomeImage);
              if (d.confidenceSlides) setConfidenceSlides(d.confidenceSlides);
            }
          },
          (err) => checkAndHandleFirestoreError(err)
        )
      ];
    }

    return () => unsubs.forEach(fn => fn());
  }, [isAdminAuthenticated]);

  // Sanitizers to prevent sending local blob URLs or large objects to Firestore
  const sanitizeGalleryForRemote = (list: GalleryMediaItem[]): GalleryMediaItem[] => {
    return list.map((item) => ({
      src: item.src?.startsWith('blob:') ? '' : item.src,
      caption: item.caption || '',
      type: item.type || 'image',
      videoUrl: item.videoUrl?.startsWith('blob:') ? '' : item.videoUrl,
      poster: item.poster || undefined
    }));
  };

  const sanitizeReelsForRemote = (reels: VideoReelItem[]): VideoReelItem[] => {
    return reels.map((reel) => ({
      ...reel,
      videoUrl: (reel.videoUrl || '').startsWith('blob:') ? '' : ((reel.videoUrl || '').startsWith('data:video') ? '' : reel.videoUrl)
    }));
  };

  const debouncedSyncGallery = useCallback((items: GalleryMediaItem[]) => {
    if (isFirestoreQuotaExceeded()) return;
    safeSetDoc(doc(db, 'settings', 'media_gallery'), { galleryImages: sanitizeGalleryForRemote(items) });
  }, []);

  const debouncedSyncNips = useCallback((items: GalleryMediaItem[]) => {
    if (isFirestoreQuotaExceeded()) return;
    safeSetDoc(doc(db, 'settings', 'media_nips'), { nipsImages: sanitizeGalleryForRemote(items) });
  }, []);

  const debouncedSyncReels = useCallback((reels: VideoReelItem[]) => {
    if (isFirestoreQuotaExceeded()) return;
    safeSetDoc(doc(db, 'settings', 'media_reels'), { videoReels: sanitizeReelsForRemote(reels) });
  }, []);

  const debouncedSyncBanners = useCallback((banners: Record<string, any>) => {
    if (isFirestoreQuotaExceeded()) return;
    safeSetDoc(doc(db, 'settings', 'media_banners'), banners, { merge: true });
  }, []);

  // Save changes to localStorage AND Firestore safely in modular docs (< 1MB)
  const persistConfig = async (
    newGallery = galleryImages,
    newNips = nipsImages,
    newReels = videoReels,
    newSlides = confidenceSlides,
    newHero = heroBanner,
    newWelcome = welcomeImage,
    newFeatured = featuredGlueImage,
    newFollow = followUsImage,
    newAutoplay = autoPlayVideos
  ) => {
    try {
      const safeReels = sanitizeReelsForRemote(newReels);
      const safeGallery = sanitizeGalleryForRemote(newGallery);
      const safeNips = sanitizeGalleryForRemote(newNips);

      const config: MediaConfig = {
        galleryImages: newGallery,
        nipsImages: newNips,
        videoReels: safeReels,
        confidenceSlides: newSlides,
        heroBanner: newHero,
        welcomeImage: newWelcome,
        featuredGlueImage: newFeatured,
        followUsImage: newFollow,
        autoPlayVideos: newAutoplay
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
      setHasCustomChanges(true);

      // Save to Firebase Firestore modular collections to stay far below the 1MB document limit
      if (!isFirestoreQuotaExceeded()) {
        await Promise.allSettled([
          safeSetDoc(doc(db, 'settings', 'media_gallery'), { galleryImages: safeGallery }),
          safeSetDoc(doc(db, 'settings', 'media_nips'), { nipsImages: safeNips }),
          safeSetDoc(doc(db, 'settings', 'media_reels'), { videoReels: safeReels }),
          safeSetDoc(doc(db, 'settings', 'media_banners'), {
            confidenceSlides: newSlides,
            heroBanner: newHero,
            welcomeImage: newWelcome,
            featuredGlueImage: newFeatured,
            followUsImage: newFollow,
            autoPlayVideos: newAutoplay
          }, { merge: true })
        ]);
      }
    } catch (e) {
      checkAndHandleFirestoreError(e);
      console.warn('Failed to save media config:', e);
    }
  };

  const updateGalleryImage = (index: number, newSrc: string, newCaption?: string, type?: 'image' | 'video', poster?: string) => {
    let updatedGallery: GalleryMediaItem[] = [];
    const isVideo = type === 'video' || isMediaItemVideo({ src: newSrc, type });
    setGalleryImages((prev) => {
      const copy = [...prev];
      if (index >= 0 && index < copy.length) {
        copy[index] = {
          ...copy[index],
          src: newSrc,
          caption: newCaption !== undefined ? newCaption : copy[index].caption,
          type: isVideo ? 'video' : (type === 'image' ? 'image' : copy[index].type),
          videoUrl: isVideo ? newSrc : (type === 'image' ? undefined : copy[index].videoUrl),
          poster: poster || copy[index].poster
        };
      } else {
        copy[index] = {
          src: newSrc,
          caption: newCaption || `Photo #${index + 1}`,
          type: isVideo ? 'video' : 'image',
          videoUrl: isVideo ? newSrc : undefined,
          poster: poster
        };
      }
      updatedGallery = copy;
      return copy;
    });

    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...stored, galleryImages: updatedGallery }));
    } catch (e) {
      console.warn('localStorage save warning:', e);
    }
    setHasCustomChanges(true);
    debouncedSyncGallery(updatedGallery);
  };

  const addGalleryImage = (item?: GalleryMediaItem) => {
    const newItem: GalleryMediaItem = item || {
      src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
      caption: `Photo #${galleryImages.length + 1}`
    };
    let updatedGallery: GalleryMediaItem[] = [];
    setGalleryImages((prev) => {
      const copy = [...prev, newItem];
      updatedGallery = copy;
      return copy;
    });

    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...stored, galleryImages: updatedGallery }));
    } catch (e) {
      console.warn('localStorage save warning:', e);
    }
    setHasCustomChanges(true);
    debouncedSyncGallery(updatedGallery);
  };

  const deleteGalleryImage = (index: number) => {
    let updatedGallery: GalleryMediaItem[] = [];
    setGalleryImages((prev) => {
      if (prev.length <= 1) return prev;
      const copy = prev.filter((_, i) => i !== index);
      updatedGallery = copy;
      return copy;
    });

    if (updatedGallery.length > 0) {
      try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...stored, galleryImages: updatedGallery }));
      } catch (e) {
        console.warn('localStorage save warning:', e);
      }
      setHasCustomChanges(true);
      debouncedSyncGallery(updatedGallery);
    }
  };

  const updateNipsImage = (index: number, newSrc: string, newCaption?: string) => {
    let updatedNips: GalleryMediaItem[] = [];
    setNipsImages((prev) => {
      const copy = [...prev];
      if (index >= 0 && index < copy.length) {
        copy[index] = {
          ...copy[index],
          src: newSrc,
          caption: newCaption !== undefined ? newCaption : copy[index].caption
        };
      } else {
        copy[index] = {
          src: newSrc,
          caption: newCaption || `Photo #${index + 1}`
        };
      }
      updatedNips = copy;
      return copy;
    });

    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...stored, nipsImages: updatedNips }));
    } catch (e) {
      console.warn('localStorage save warning:', e);
    }
    setHasCustomChanges(true);
    debouncedSyncNips(updatedNips);
  };

  const updateVideoReel = (index: number, updates: Partial<VideoReelItem>) => {
    let updatedReels: VideoReelItem[] = [];
    setVideoReels((prev) => {
      const copy = [...prev];
      if (copy[index]) {
        copy[index] = {
          ...copy[index],
          ...updates
        };
      }
      updatedReels = copy;
      return copy;
    });

    const safeReels = sanitizeReelsForRemote(updatedReels);
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...stored, videoReels: safeReels }));
    } catch (e) {
      console.warn('localStorage save warning:', e);
    }
    setHasCustomChanges(true);
    debouncedSyncReels(updatedReels);
  };

  const addVideoReel = (newReel: VideoReelItem) => {
    let updatedReels: VideoReelItem[] = [];
    setVideoReels((prev) => {
      const copy = [...prev, newReel];
      updatedReels = copy;
      return copy;
    });

    const safeReels = sanitizeReelsForRemote(updatedReels);
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...stored, videoReels: safeReels }));
    } catch (e) {
      console.warn('localStorage save warning:', e);
    }
    setHasCustomChanges(true);
    debouncedSyncReels(updatedReels);
  };

  const deleteVideoReel = (index: number) => {
    let updatedReels: VideoReelItem[] = [];
    setVideoReels((prev) => {
      const copy = prev.filter((_, i) => i !== index);
      updatedReels = copy;
      return copy;
    });

    const safeReels = sanitizeReelsForRemote(updatedReels);
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...stored, videoReels: safeReels }));
    } catch (e) {
      console.warn('localStorage save warning:', e);
    }
    setHasCustomChanges(true);
    debouncedSyncReels(updatedReels);
  };

  const moveVideoReel = (fromIndex: number, toIndex: number) => {
    let updatedReels: VideoReelItem[] = [];
    setVideoReels((prev) => {
      if (toIndex < 0 || toIndex >= prev.length) return prev;
      const copy = [...prev];
      const [movedItem] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, movedItem);
      updatedReels = copy;
      return copy;
    });

    const safeReels = sanitizeReelsForRemote(updatedReels);
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...stored, videoReels: safeReels }));
    } catch (e) {
      console.warn('localStorage save warning:', e);
    }
    setHasCustomChanges(true);
    debouncedSyncReels(updatedReels);
  };

  const updateConfidenceSlide = (index: number, img: string, title?: string, desc?: string) => {
    let updatedSlides: ConfidenceSlideItem[] = [];
    setConfidenceSlides((prev) => {
      const copy = [...prev];
      if (copy[index]) {
        copy[index] = {
          ...copy[index],
          img,
          title: title || copy[index].title,
          desc: desc || copy[index].desc
        };
      }
      updatedSlides = copy;
      return copy;
    });

    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...stored, confidenceSlides: updatedSlides }));
    } catch (e) {
      console.warn('localStorage save warning:', e);
    }
    setHasCustomChanges(true);
    debouncedSyncBanners({ confidenceSlides: updatedSlides });
  };

  const updateHeroBanner = (newSrc: string) => {
    setHeroBanner(newSrc);
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...stored, heroBanner: newSrc }));
    } catch (e) {
      console.warn('localStorage save warning:', e);
    }
    setHasCustomChanges(true);
    debouncedSyncBanners({ heroBanner: newSrc });
  };

  const updateWelcomeImage = (newSrc: string) => {
    setWelcomeImage(newSrc);
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...stored, welcomeImage: newSrc }));
    } catch (e) {
      console.warn('localStorage save warning:', e);
    }
    setHasCustomChanges(true);
    debouncedSyncBanners({ welcomeImage: newSrc });
  };

  const updateFeaturedGlueImage = (newSrc: string) => {
    setFeaturedGlueImage(newSrc);
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...stored, featuredGlueImage: newSrc }));
    } catch (e) {
      console.warn('localStorage save warning:', e);
    }
    setHasCustomChanges(true);
    debouncedSyncBanners({ featuredGlueImage: newSrc });
  };

  const updateFollowUsImage = (newSrc: string) => {
    setFollowUsImage(newSrc);
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...stored, followUsImage: newSrc }));
    } catch (e) {
      console.warn('localStorage save warning:', e);
    }
    setHasCustomChanges(true);
    debouncedSyncBanners({ followUsImage: newSrc });
  };

  const setAutoPlayVideos = (enabled: boolean) => {
    setAutoPlayVideosState(enabled);
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...stored, autoPlayVideos: enabled }));
    } catch (e) {
      console.warn('localStorage save warning:', e);
    }
    setHasCustomChanges(true);
    debouncedSyncBanners({ autoPlayVideos: enabled });
  };

  const resetVideoReels = async () => {
    await clearAllVideoBlobs();
    setVideoReels(DEFAULT_VIDEO_REELS);
    persistConfig(galleryImages, nipsImages, DEFAULT_VIDEO_REELS, confidenceSlides, heroBanner, welcomeImage, featuredGlueImage, followUsImage, autoPlayVideos);
  };

  const resetToDefaults = async () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      await clearAllVideoBlobs();
    } catch (e) {
      console.warn(e);
    }
    setGalleryImages(DEFAULT_GALLERY_IMAGES);
    setNipsImages(DEFAULT_NIPS_IMAGES);
    setVideoReels(DEFAULT_VIDEO_REELS);
    setConfidenceSlides(DEFAULT_CONFIDENCE_SLIDES);
    setHeroBanner(DEFAULT_HERO_BANNER);
    setWelcomeImage(DEFAULT_WELCOME_IMAGE);
    setFeaturedGlueImage(DEFAULT_FEATURED_GLUE_IMAGE);
    setFollowUsImage(DEFAULT_FOLLOW_US_IMAGE);
    setAutoPlayVideosState(true);
    setHasCustomChanges(false);

    try {
      if (!isFirestoreQuotaExceeded()) {
        await Promise.allSettled([
          safeSetDoc(doc(db, 'settings', 'media_gallery'), { galleryImages: DEFAULT_GALLERY_IMAGES }),
          safeSetDoc(doc(db, 'settings', 'media_nips'), { nipsImages: DEFAULT_NIPS_IMAGES }),
          safeSetDoc(doc(db, 'settings', 'media_reels'), { videoReels: DEFAULT_VIDEO_REELS }),
          safeSetDoc(doc(db, 'settings', 'media_banners'), {
            confidenceSlides: DEFAULT_CONFIDENCE_SLIDES,
            heroBanner: DEFAULT_HERO_BANNER,
            welcomeImage: DEFAULT_WELCOME_IMAGE,
            featuredGlueImage: DEFAULT_FEATURED_GLUE_IMAGE,
            followUsImage: DEFAULT_FOLLOW_US_IMAGE,
            autoPlayVideos: true
          })
        ]);
      }
    } catch (e) {
      checkAndHandleFirestoreError(e);
      console.warn('Failed to reset Firestore media config:', e);
    }
  };

  // Password Verification & Updating (Cloud Firestore Synchronized across all devices)
  const verifyAdminPassword = (inputPassword: string): boolean => {
    const activePass = adminPassword || localStorage.getItem(PASSWORD_STORAGE_KEY) || DEFAULT_ADMIN_PASSWORD;
    if (inputPassword.trim() === activePass.trim()) {
      setIsAdminAuthenticated(true);
      return true;
    }
    return false;
  };

  const changeAdminPassword = async (newPassword: string): Promise<boolean> => {
    if (!newPassword || newPassword.trim().length < 3) return false;
    const cleanPass = newPassword.trim();
    setAdminPassword(cleanPass);
    try {
      localStorage.setItem(PASSWORD_STORAGE_KEY, cleanPass);
    } catch (e) {
      console.warn('localStorage save warning:', e);
    }
    try {
      await safeSetDoc(doc(db, 'settings', 'security'), {
        adminPassword: cleanPass,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      return true;
    } catch (err) {
      checkAndHandleFirestoreError(err);
      console.warn('Firestore save security password notice:', err);
      return true; // Local state is already updated
    }
  };

  const logoutAdmin = useCallback(() => {
    setIsAdminAuthenticated(false);
  }, []);

  const openAdmin = useCallback(() => setIsAdminOpen(true), []);
  const closeAdmin = useCallback(() => setIsAdminOpen(false), []);

  const contextValue = useMemo<MediaContextType>(() => ({
    galleryImages,
    nipsImages,
    videoReels,
    confidenceSlides,
    heroBanner,
    welcomeImage,
    featuredGlueImage,
    followUsImage,
    autoPlayVideos,
    updateGalleryImage,
    addGalleryImage,
    deleteGalleryImage,
    updateNipsImage,
    updateVideoReel,
    addVideoReel,
    deleteVideoReel,
    moveVideoReel,
    updateConfidenceSlide,
    updateHeroBanner,
    updateWelcomeImage,
    updateFeaturedGlueImage,
    updateFollowUsImage,
    setAutoPlayVideos,
    resetToDefaults,
    resetVideoReels,
    isAdminOpen,
    setIsAdminOpen,
    openAdmin,
    closeAdmin,
    hasCustomChanges,
    isAdminAuthenticated,
    verifyAdminPassword,
    changeAdminPassword,
    logoutAdmin
  }), [
    galleryImages,
    nipsImages,
    videoReels,
    confidenceSlides,
    heroBanner,
    welcomeImage,
    featuredGlueImage,
    followUsImage,
    autoPlayVideos,
    updateGalleryImage,
    addGalleryImage,
    deleteGalleryImage,
    updateNipsImage,
    updateVideoReel,
    addVideoReel,
    deleteVideoReel,
    moveVideoReel,
    updateConfidenceSlide,
    updateHeroBanner,
    updateWelcomeImage,
    updateFeaturedGlueImage,
    updateFollowUsImage,
    setAutoPlayVideos,
    resetToDefaults,
    resetVideoReels,
    isAdminOpen,
    openAdmin,
    closeAdmin,
    hasCustomChanges,
    isAdminAuthenticated,
    verifyAdminPassword,
    changeAdminPassword,
    logoutAdmin
  ]);

  return (
    <MediaContext.Provider value={contextValue}>
      {children}
    </MediaContext.Provider>
  );
};

export const useMedia = (): MediaContextType => {
  const context = useContext(MediaContext);
  if (!context) {
    throw new Error('useMedia must be used within a MediaProvider');
  }
  return context;
};

