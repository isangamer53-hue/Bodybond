import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { GalleryMediaItem, VideoReelItem, ConfidenceSlideItem, MediaConfig } from '../types';
import { loadVideoBlobUrl, clearAllVideoBlobs } from '../utils/videoStorage';

const STORAGE_KEY = 'bodybond_custom_media_v2';
const PASSWORD_STORAGE_KEY = 'bodybond_admin_secret_pass';
export const DEFAULT_ADMIN_PASSWORD = 'admin123';

export const DEFAULT_GALLERY_IMAGES: GalleryMediaItem[] = [
  {
    src: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=85',
    caption: 'Max Hold Application'
  },
  {
    src: '/images/how_to_use_guide.jpg',
    caption: 'Secure Hold In Secs (How To Use)'
  },
  {
    src: '/images/how_to_remove_guide.jpg',
    caption: 'Easy Removal Process (How To Remove)'
  },
  {
    src: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=85',
    caption: 'Party & Festival Proof'
  },
  {
    src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85',
    caption: 'Halter & Plunge Hold'
  },
  {
    src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
    caption: 'Silk & Satin Friendly'
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
  updateGalleryImage: (index: number, newSrc: string, newCaption?: string) => void;
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
          if (parsed.galleryImages) setGalleryImages(parsed.galleryImages);
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

            if (gal.exists()) setGalleryImages(gal.data().galleryImages);
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
    if (isAdminAuthenticated) {
      unsubs = [
        onSnapshot(doc(db, 'settings', 'media_gallery'), (s) => s.exists() && setGalleryImages(s.data().galleryImages)),
        onSnapshot(doc(db, 'settings', 'media_nips'), (s) => s.exists() && setNipsImages(s.data().nipsImages)),
        onSnapshot(doc(db, 'settings', 'media_reels'), (s) => s.exists() && setVideoReels(s.data().videoReels)),
        onSnapshot(doc(db, 'settings', 'media_banners'), (s) => {
          if (s.exists()) {
            const d = s.data();
            if (d.heroBanner) setHeroBanner(d.heroBanner);
            if (d.welcomeImage) setWelcomeImage(d.welcomeImage);
            if (d.confidenceSlides) setConfidenceSlides(d.confidenceSlides);
          }
        })
      ];
    }

    return () => unsubs.forEach(fn => fn());
  }, [isAdminAuthenticated]);

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
      const safeReels = newReels.map((reel) => ({
        ...reel,
        videoUrl: reel.videoUrl.startsWith('blob:') ? '' : (reel.videoUrl.startsWith('data:video') ? '' : reel.videoUrl)
      }));

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
      await Promise.allSettled([
        setDoc(doc(db, 'settings', 'media_gallery'), { galleryImages: newGallery }),
        setDoc(doc(db, 'settings', 'media_nips'), { nipsImages: newNips }),
        setDoc(doc(db, 'settings', 'media_reels'), { videoReels: safeReels }),
        setDoc(doc(db, 'settings', 'media_banners'), {
          confidenceSlides: newSlides,
          heroBanner: newHero,
          welcomeImage: newWelcome,
          featuredGlueImage: newFeatured,
          followUsImage: newFollow,
          autoPlayVideos: newAutoplay
        })
      ]);
    } catch (e) {
      console.warn('Failed to save media config:', e);
    }
  };

  const updateGalleryImage = (index: number, newSrc: string, newCaption?: string) => {
    setGalleryImages((prev) => {
      const updated = [...prev];
      if (index >= 0 && index < updated.length) {
        updated[index] = {
          ...updated[index],
          src: newSrc,
          caption: newCaption !== undefined ? newCaption : updated[index].caption
        };
      } else {
        updated[index] = {
          src: newSrc,
          caption: newCaption || `Photo #${index + 1}`
        };
      }
      try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...stored, galleryImages: updated }));
      } catch (e) {
        console.warn('localStorage save warning:', e);
      }
      setHasCustomChanges(true);
      setDoc(doc(db, 'settings', 'media_gallery'), { galleryImages: updated }).catch((err) => {
        console.error('Firestore save gallery error:', err);
      });
      return updated;
    });
  };

  const updateNipsImage = (index: number, newSrc: string, newCaption?: string) => {
    setNipsImages((prev) => {
      const updated = [...prev];
      if (index >= 0 && index < updated.length) {
        updated[index] = {
          ...updated[index],
          src: newSrc,
          caption: newCaption !== undefined ? newCaption : updated[index].caption
        };
      } else {
        updated[index] = {
          src: newSrc,
          caption: newCaption || `Photo #${index + 1}`
        };
      }
      try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...stored, nipsImages: updated }));
      } catch (e) {
        console.warn('localStorage save warning:', e);
      }
      setHasCustomChanges(true);
      setDoc(doc(db, 'settings', 'media_nips'), { nipsImages: updated }).catch((err) => {
        console.error('Firestore save nips error:', err);
      });
      return updated;
    });
  };

  const updateVideoReel = (index: number, updates: Partial<VideoReelItem>) => {
    setVideoReels((prev) => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = {
          ...updated[index],
          ...updates
        };
      }
      const safeReels = updated.map((reel) => ({
        ...reel,
        videoUrl: reel.videoUrl.startsWith('blob:') ? '' : (reel.videoUrl.startsWith('data:video') ? '' : reel.videoUrl)
      }));
      try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...stored, videoReels: safeReels }));
      } catch (e) {
        console.warn('localStorage save warning:', e);
      }
      setHasCustomChanges(true);
      setDoc(doc(db, 'settings', 'media_reels'), { videoReels: safeReels }).catch((err) => {
        console.error('Firestore save reel error:', err);
      });
      return updated;
    });
  };

  const addVideoReel = (newReel: VideoReelItem) => {
    setVideoReels((prev) => {
      const updated = [...prev, newReel];
      const safeReels = updated.map((reel) => ({
        ...reel,
        videoUrl: reel.videoUrl.startsWith('blob:') ? '' : (reel.videoUrl.startsWith('data:video') ? '' : reel.videoUrl)
      }));
      try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...stored, videoReels: safeReels }));
      } catch (e) {
        console.warn('localStorage save warning:', e);
      }
      setHasCustomChanges(true);
      setDoc(doc(db, 'settings', 'media_reels'), { videoReels: safeReels }).catch((err) => {
        console.error('Firestore add reel error:', err);
      });
      return updated;
    });
  };

  const deleteVideoReel = (index: number) => {
    setVideoReels((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      const safeReels = updated.map((reel) => ({
        ...reel,
        videoUrl: reel.videoUrl.startsWith('blob:') ? '' : (reel.videoUrl.startsWith('data:video') ? '' : reel.videoUrl)
      }));
      try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...stored, videoReels: safeReels }));
      } catch (e) {
        console.warn('localStorage save warning:', e);
      }
      setHasCustomChanges(true);
      setDoc(doc(db, 'settings', 'media_reels'), { videoReels: safeReels }).catch((err) => {
        console.error('Firestore delete reel error:', err);
      });
      return updated;
    });
  };

  const moveVideoReel = (fromIndex: number, toIndex: number) => {
    setVideoReels((prev) => {
      if (toIndex < 0 || toIndex >= prev.length) return prev;
      const updated = [...prev];
      const [movedItem] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, movedItem);
      const safeReels = updated.map((reel) => ({
        ...reel,
        videoUrl: reel.videoUrl.startsWith('blob:') ? '' : (reel.videoUrl.startsWith('data:video') ? '' : reel.videoUrl)
      }));
      try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...stored, videoReels: safeReels }));
      } catch (e) {
        console.warn('localStorage save warning:', e);
      }
      setHasCustomChanges(true);
      setDoc(doc(db, 'settings', 'media_reels'), { videoReels: safeReels }).catch((err) => {
        console.error('Firestore move reel error:', err);
      });
      return updated;
    });
  };

  const updateConfidenceSlide = (index: number, img: string, title?: string, desc?: string) => {
    setConfidenceSlides((prev) => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = {
          ...updated[index],
          img,
          title: title || updated[index].title,
          desc: desc || updated[index].desc
        };
      }
      try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...stored, confidenceSlides: updated }));
      } catch (e) {
        console.warn('localStorage save warning:', e);
      }
      setHasCustomChanges(true);
      setDoc(doc(db, 'settings', 'media_banners'), { confidenceSlides: updated }, { merge: true }).catch((err) => {
        console.error('Firestore save slide error:', err);
      });
      return updated;
    });
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
    setDoc(doc(db, 'settings', 'media_banners'), { heroBanner: newSrc }, { merge: true }).catch((err) => {
      console.error('Firestore save hero error:', err);
    });
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
    setDoc(doc(db, 'settings', 'media_banners'), { welcomeImage: newSrc }, { merge: true }).catch((err) => {
      console.error('Firestore save welcome error:', err);
    });
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
    setDoc(doc(db, 'settings', 'media_banners'), { featuredGlueImage: newSrc }, { merge: true }).catch((err) => {
      console.error('Firestore save featured error:', err);
    });
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
    setDoc(doc(db, 'settings', 'media_banners'), { followUsImage: newSrc }, { merge: true }).catch((err) => {
      console.error('Firestore save follow error:', err);
    });
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
    setDoc(doc(db, 'settings', 'media_banners'), { autoPlayVideos: enabled }, { merge: true }).catch((err) => {
      console.error('Firestore save autoplay error:', err);
    });
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
      await Promise.allSettled([
        setDoc(doc(db, 'settings', 'media_gallery'), { galleryImages: DEFAULT_GALLERY_IMAGES }),
        setDoc(doc(db, 'settings', 'media_nips'), { nipsImages: DEFAULT_NIPS_IMAGES }),
        setDoc(doc(db, 'settings', 'media_reels'), { videoReels: DEFAULT_VIDEO_REELS }),
        setDoc(doc(db, 'settings', 'media_banners'), {
          confidenceSlides: DEFAULT_CONFIDENCE_SLIDES,
          heroBanner: DEFAULT_HERO_BANNER,
          welcomeImage: DEFAULT_WELCOME_IMAGE,
          featuredGlueImage: DEFAULT_FEATURED_GLUE_IMAGE,
          followUsImage: DEFAULT_FOLLOW_US_IMAGE,
          autoPlayVideos: true
        })
      ]);
    } catch (e) {
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
      await setDoc(doc(db, 'settings', 'security'), {
        adminPassword: cleanPass,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      return true;
    } catch (err) {
      console.error('Firestore save security password error:', err);
      return true; // Local state is already updated
    }
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
  };

  return (
    <MediaContext.Provider
      value={{
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
        openAdmin: () => setIsAdminOpen(true),
        closeAdmin: () => setIsAdminOpen(false),
        hasCustomChanges,
        isAdminAuthenticated,
        verifyAdminPassword,
        changeAdminPassword,
        logoutAdmin
      }}
    >
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

