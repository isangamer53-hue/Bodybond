import { OutfitStyle } from '../types';

export const OUTFIT_STYLES: OutfitStyle[] = [
  {
    id: 'plunge',
    name: 'Plunge & Deep V-Neck',
    iconName: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
    description: 'Blazers, deep-V cocktail dresses, and low-cut evening gowns with gaping gaps.',
    challenge: 'Fabric pulling away when you bend forward or turn, exposing chest area.',
    recommendation: 'Bodybond Glue along both lapel borders + Seamless Nips.',
    recommendedProductId: 'bodybond-glue',
    tip: 'Apply 3-4 pea-sized dots along the interior hem of the plunge neckline, wait 20s for tackiness, then press against skin.'
  },
  {
    id: 'backless',
    name: 'Backless & Cowl Slip',
    iconName: 'HeartHandshake',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    description: 'Silk slip dresses, open-back halter tops, and low scoop back silhouettes.',
    challenge: 'Zero bra support and risk of sides gaping or slipping off shoulders.',
    recommendation: 'Bodybond Glue + Bodybond Nip Covers in your skin tone.',
    recommendedProductId: 'bodybond-nips-seamless',
    tip: 'Anchor the side seams right below your armpits with Bodybond Glue to stop slipping, and pop on Bodybond Nips.'
  },
  {
    id: 'strapless',
    name: 'Strapless & Bandeau',
    iconName: 'ShieldCheck',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
    description: 'Tube tops, strapless corset dresses, and sweetheart necklines.',
    challenge: 'Constantly having to pull up your top every 5 minutes on the dance floor.',
    recommendation: 'Bodybond Glue applied along top perimeter band.',
    recommendedProductId: 'bodybond-glue',
    tip: 'Run a thin continuous line of glue along the internal silicone or fabric band. Press for 30s. It will stay anchored 12+ hours!'
  },
  {
    id: 'sheer-mesh',
    name: 'Sheer Mesh & Baby Tees',
    iconName: 'Flame',
    image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80',
    description: 'Ultra-thin white cotton, see-through mesh party tops, and crochet knitwear.',
    challenge: 'Visible bra lines or desiring smooth zero-ridge coverage.',
    recommendation: 'Bodybond Nip Covers in your shade match.',
    recommendedProductId: 'bodybond-nips-seamless',
    tip: 'Press firmly from the center outward. Matte silicone disappears invisibly under sheer fabrics.'
  },
  {
    id: 'high-slit',
    name: 'High Slit & Cutouts',
    iconName: 'Scissors',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
    description: 'Thigh-high dress slits, asymmetric waist cutouts, and wrap skirts.',
    challenge: 'Wind gust causing wardrobe malfunction or dress flaps blowing open.',
    recommendation: 'Bodybond Glue anchor points.',
    recommendedProductId: 'bodybond-glue',
    tip: 'Anchor the upper edge of the slit 2 inches above the desired fold against your leg skin.'
  }
];
