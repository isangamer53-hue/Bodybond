import { Product, CurrencyRate } from '../types';

export const CURRENCY_RATES: Record<string, CurrencyRate> = {
  BDT: { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka (BDT)', rate: 1.0, flag: '🇧🇩' },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar (USD)', rate: 0.0084, flag: '🇺🇸' },
  NZD: { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar (NZD)', rate: 0.014, flag: '🇳🇿' },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar (AUD)', rate: 0.013, flag: '🇦🇺' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound (GBP)', rate: 0.0066, flag: '🇬🇧' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro (EUR)', rate: 0.0078, flag: '🇪🇺' },
  CAD: { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar (CAD)', rate: 0.011, flag: '🇨🇦' },
};

export const NIP_SHADES = [
  { id: 'fair', name: 'Fair / Porcelain', colorHex: '#F6DBCB' },
  { id: 'honey', name: 'Honey / Sand', colorHex: '#E2B897' },
  { id: 'warm-tan', name: 'Warm Tan / Caramel', colorHex: '#C68B59' },
  { id: 'mocha', name: 'Mocha / Bronze', colorHex: '#8D5837' },
  { id: 'espresso', name: 'Rich Espresso', colorHex: '#4E2F1D' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'bodybond-glue',
    slug: 'bodybond-glue-20ml',
    name: 'Bodybond Glue (20ml)',
    subtitle: 'The Pro-Grade Wardrobe Adhesive',
    tagline: 'Locks outfits into place. 0 slips, 100% skin safe, stain-free rinse off.',
    priceNZD: 1250,
    compareAtPriceNZD: 1650,
    rating: 4.9,
    reviewCount: 1428,
    badge: 'BESTSELLER',
    category: 'glue',
    isBestSeller: true,
    isViral: true,
    inStock: true,
    shortDescription: 'The ultimate invisible liquid adhesive that sticks fabric directly to skin. Sweat-resistant, moves with your body, and washes off cleanly in warm water.',
    description: 'Tired of useless fashion tape that loses its stick after 10 minutes? Bodybond Glue is our signature pro-grade liquid adhesive designed to keep plunging tops, strapless dresses, open backs, and high slits completely locked down all night. Infused with skin-soothing Aloe Vera and Hyaluronic Acid, it flexes naturally with body movements without pulling skin or leaving sticky residue on precious garments.',
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1000&q=80'
    ],
    features: [
      '12+ hour sweat & dance-proof hold',
      'Invisible on all skin tones and fabric colors',
      'Machine-washable & 100% stain-free on fabrics',
      'Skin-nourishing Aloe Vera + Hyaluronic Acid formula',
      'Up to 5-7 months supply (50+ applications per 20ml tube)',
      'Easy painless removal with warm water and mild soap'
    ],
    ingredients: [
      'Aqua Water (Pure Hydration Base)',
      'Glycerin (Moisture retainer)',
      'Aloe Vera Extract (Soothes and calms skin)',
      'Hyaluronic Acid (Protects skin barrier)',
      'Pro-Vitamin B5 (Nourishes)',
      'VP/VA Copolymer (Medical-grade skin adhesive flexible polymer)',
      'Sorbic Acid (Eco-preservative for freshness)',
      'Antioxidant Vitamin E Complex'
    ],
    howToUse: [
      'Ensure skin is clean, dry, and free of body lotions or oils.',
      'Dab a small drop of Bodybond Glue onto your skin or fabric edge.',
      'Allow 15-20 seconds to become slightly tacky.',
      'Press garment firmly against skin for 20-30 seconds to lock hold.',
      'To remove: Gently lift clothing away and wash off skin with warm water & soap. Machine wash garment as normal.'
    ]
  },
  {
    id: 'bodybond-nips-seamless',
    slug: 'bodybond-seamless-nipple-covers',
    name: 'Bodybond Seamless Nipple Covers',
    subtitle: 'Ultra-Thin Matte Silicone Pasties',
    tagline: '100% invisible under sheer, tight, and white garments. 8cm wide coverage.',
    priceNZD: 990,
    compareAtPriceNZD: 1200,
    rating: 4.8,
    reviewCount: 529,
    badge: 'SOLD OUT',
    category: 'nips',
    inStock: false,
    shades: NIP_SHADES,
    sizes: ['Standard (8cm)', 'Large (10cm)'],
    shortDescription: 'Tapered micro-edges with a matte anti-shine finish for complete smooth concealment under the sheerest fabrics.',
    description: 'Engineered for seamless invisibility under backless wedding gowns, satin slips, sheer crochet, and bodycon dresses. Our ultra-thin tapered perimeter melts into your skin tone with zero ridge outlines or flash photography shine.',
    images: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1000&q=80'
    ],
    features: [
      'Featherlight micro-edge tapering for zero outlines',
      'Matte anti-reflective finish (camera flash proof)',
      'Waterproof & sweatproof for beach clubs & festivals',
      'Washable and reusable 30+ times',
      'Eco-friendly silicone material'
    ],
    ingredients: [
      'Medical Grade Soft Silicone',
      'Hypoallergenic Pressure-Sensitive Adhesive'
    ],
    howToUse: [
      'Center the dome over the nipple and smooth outwards.',
      'Warm with your palms for 10 seconds to activate the bond.',
      'Wash with mild liquid soap and let air dry.'
    ]
  }
];

