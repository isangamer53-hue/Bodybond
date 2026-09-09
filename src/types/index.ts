export type CurrencyCode = 'BDT' | 'NZD' | 'AUD' | 'USD' | 'GBP' | 'EUR' | 'CAD';

export type LanguageCode = 'bn' | 'en';

export interface CurrencyRate {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rate: number; // relative to NZD base
  flag: string;
}

export interface ProductShade {
  id: string;
  name: string;
  colorHex: string;
  image?: string;
}

export type ProductCategory = 'all' | 'glue' | 'nips' | 'kits' | 'accessories';

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  tagline: string;
  priceNZD: number;
  compareAtPriceNZD?: number;
  rating: number;
  reviewCount: number;
  badge?: string;
  category: 'glue' | 'nips' | 'kits' | 'accessories';
  description: string;
  shortDescription: string;
  images: string[];
  features: string[];
  ingredients?: string[];
  howToUse: string[];
  shades?: ProductShade[];
  sizes?: string[];
  inStock: boolean;
  isBestSeller?: boolean;
  isViral?: boolean;
}

export interface CartItem {
  id: string; // unique item cart ID (combines product id, shade, size)
  productId: string;
  name: string;
  priceNZD: number;
  image: string;
  quantity: number;
  selectedShade?: string;
  selectedSize?: string;
}

export interface Review {
  id: string;
  productId?: string;
  author: string;
  location: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  outfitWorn?: string;
  productName: string;
  image?: string;
  likes: number;
}

export interface FaqItem {
  id: string;
  category: 'Application & Hold' | 'Skin & Sensitivity' | 'Removal & Washing' | 'Shipping & Orders';
  question: string;
  answer: string;
}

export interface OutfitStyle {
  id: string;
  name: string;
  iconName: string;
  image: string;
  description: string;
  challenge: string;
  recommendation: string;
  recommendedProductId: string;
  tip: string;
}

export interface OrderDetails {
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  currency: CurrencyCode;
  customer: {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
  };
}

export interface VideoReelItem {
  id: string;
  title: string;
  badge: string;
  poster: string;
  videoUrl: string;
  author: string;
  description: string;
  hasCustomBlob?: boolean;
}

export interface GalleryMediaItem {
  src: string;
  caption: string;
  type?: 'image' | 'video';
  videoUrl?: string;
  poster?: string;
  hasCustomBlob?: boolean;
}

export interface ConfidenceSlideItem {
  img: string;
  title: string;
  desc: string;
}

export interface MediaConfig {
  galleryImages: GalleryMediaItem[];
  nipsImages?: GalleryMediaItem[];
  videoReels: VideoReelItem[];
  confidenceSlides: ConfidenceSlideItem[];
  heroBanner: string;
  welcomeImage?: string;
  featuredGlueImage?: string;
  followUsImage?: string;
  autoPlayVideos?: boolean;
}
