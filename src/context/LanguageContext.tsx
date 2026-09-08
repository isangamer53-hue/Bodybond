import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageCode } from '../types';

export interface Translations {
  // Top Banner
  topBannerText: string;
  afterpayText: string;
  freeShippingAlert: string;

  // Nav
  navShopAll: string;
  navGlue: string;
  navNips: string;
  navHowItWorks: string;
  navReviews: string;
  navFaq: string;
  navAbout: string;

  // Badges & Actions
  bestsellerBadge: string;
  outOfStockBadge: string;
  quickAdd: string;
  addToCart: string;
  orderNowCOD: string;
  buyNow: string;
  viewDetails: string;
  secureCheckout: string;
  cashOnDelivery: string;
  freeDeliveryDhaka: string;

  // Glue Product Detail
  glueTitle: string;
  glueSubtitle: string;
  glueTagline: string;
  glueRatingText: string;
  glueShortDesc: string;
  glueFullDesc: string;
  glueFeature1: string;
  glueFeature2: string;
  glueFeature3: string;
  glueFeature4: string;
  glueFeature5: string;
  glueFeature6: string;

  // Why choose Bodybond
  whyTitle: string;
  whyPoint1Title: string;
  whyPoint1Desc: string;
  whyPoint2Title: string;
  whyPoint2Desc: string;
  whyPoint3Title: string;
  whyPoint3Desc: string;
  whyPoint4Title: string;
  whyPoint4Desc: string;

  // Checkout Modal
  checkoutTitle: string;
  checkoutSubtitle: string;
  fullNameLabel: string;
  fullNamePlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  addressLabel: string;
  addressPlaceholder: string;
  deliveryAreaLabel: string;
  insideDhaka: string;
  outsideDhaka: string;
  orderNotesLabel: string;
  orderNotesPlaceholder: string;
  orderSummaryTitle: string;
  subtotalLabel: string;
  deliveryFeeLabel: string;
  totalPayableLabel: string;
  confirmOrderBtn: string;
  whatsappOrderBtn: string;
  codNotice: string;
  orderSuccessTitle: string;
  orderSuccessDesc: string;
  orderSuccessInstructions: string;
  continueShoppingBtn: string;

  // Bag/Cart Drawer
  cartTitle: string;
  cartEmptyTitle: string;
  cartEmptyDesc: string;
  proceedToCheckout: string;
  estimatedTotal: string;

  // Trust Badges
  trustBadge1: string;
  trustBadge2: string;
  trustBadge3: string;
}

const TRANSLATIONS_EN: Translations = {
  topBannerText: '🚚 Cash On Delivery Available Nationwide • Pay Upon Delivery',
  afterpayText: 'Cash on Delivery',
  freeShippingAlert: '🎉 Free Delivery Nationwide on orders of 2 or more items!',

  navShopAll: 'Shop All',
  navGlue: 'Bodybond Glue',
  navNips: 'Nipple Covers (Sold Out)',
  navHowItWorks: 'How To Use',
  navReviews: 'Reviews',
  navFaq: 'FAQs',
  navAbout: 'About Us',

  bestsellerBadge: '#1 Viral Fashion Glue in BD',
  outOfStockBadge: 'Sold Out',
  quickAdd: 'Add To Cart',
  addToCart: 'Add To Bag',
  orderNowCOD: 'Order Now (Cash On Delivery)',
  buyNow: 'Buy Now',
  viewDetails: 'View Details',
  secureCheckout: '100% Guaranteed Delivery',
  cashOnDelivery: 'Cash On Delivery (Pay upon delivery)',
  freeDeliveryDhaka: 'Fast Home Delivery Nationwide',

  glueTitle: 'Bodybond Body Adhesive Glue (20ml)',
  glueSubtitle: 'Premium body glue designed to hold outfits securely on skin',
  glueTagline: 'Wear any deep-neck blouse, saree, or western dress with zero fear of slips.',
  glueRatingText: '4.9 Rating (2,548+ Verified Reviews)',
  glueShortDesc: 'Invisible, sweat-resistant, & skin-friendly. Leaves no stains on fabric or skin. Washes off easily with plain water.',
  glueFullDesc: 'Tired of fashion tape peeling off mid-party? Bodybond Liquid Body Glue delivers 12+ hours of invisible, sweat-proof hold. Formulated with Aloe Vera & Hyaluronic Acid to keep your skin smooth with zero irritation. Essential for weddings, parties, and everyday wear!',
  glueFeature1: '🔥 12+ Hours Long-Lasting & Sweat-Proof Hold',
  glueFeature2: '👗 Completely Invisible on Clothes & Skin, Zero Stains',
  glueFeature3: '💧 Washes Off Effortlessly With Plain Water',
  glueFeature4: '🌿 Enriched with Aloe Vera & Hyaluronic Acid',
  glueFeature5: '✨ 20ml Bottle Provides 50+ Applications (Lasts 5-7 Months)',
  glueFeature6: '🛡️ Dermatologist Tested & Safe For All Skin Types',

  whyTitle: 'Why Bodybond Beats Double-Sided Tape',
  whyPoint1Title: 'Zero-Slip Hold',
  whyPoint1Desc: 'Dance, walk, or celebrate freely — your outfit stays firmly in place.',
  whyPoint2Title: 'Skin-Friendly Formula',
  whyPoint2Desc: 'No pulling or irritation. Safe even for sensitive skin.',
  whyPoint3Title: 'Stain-Free Removal',
  whyPoint3Desc: 'Leaves zero marks on silk, chiffon, or georgette. Rinses clean with water.',
  whyPoint4Title: 'Travel-Friendly Roll-On',
  whyPoint4Desc: 'Compact bottle fits easily into any handbag or vanity purse.',

  checkoutTitle: 'Cash On Delivery Checkout',
  checkoutSubtitle: 'Fill in your delivery details below to confirm your order',
  fullNameLabel: 'Full Name *',
  fullNamePlaceholder: 'e.g. Sumaiya Islam',
  phoneLabel: 'Phone Number *',
  phonePlaceholder: 'e.g. 017XXXXXXXX or 018XXXXXXXX',
  addressLabel: 'Full Delivery Address *',
  addressPlaceholder: 'House/Holding No, Road, Area, District',
  deliveryAreaLabel: 'Select Delivery Zone *',
  insideDhaka: 'Inside Dhaka City (৳60 delivery fee)',
  outsideDhaka: 'Outside Dhaka City (৳120 delivery fee)',
  orderNotesLabel: 'Order Notes / Instructions (Optional)',
  orderNotesPlaceholder: 'Special delivery timing or notes...',
  orderSummaryTitle: 'Order Summary',
  subtotalLabel: 'Product Price',
  deliveryFeeLabel: 'Delivery Charge',
  totalPayableLabel: 'Total Payable Amount',
  confirmOrderBtn: 'Confirm Order (Cash On Delivery)',
  whatsappOrderBtn: 'Order Via WhatsApp',
  codNotice: '💡 Pay cash to the delivery agent when your package arrives. No advance payment required!',
  orderSuccessTitle: 'Thank You! Order Received',
  orderSuccessDesc: 'Our team is preparing your package. We will call you shortly to confirm.',
  orderSuccessInstructions: 'Delivery agent will arrive within 2-3 days. Please inspect and pay upon delivery.',
  continueShoppingBtn: 'Continue Shopping',

  cartTitle: 'Your Shopping Bag',
  cartEmptyTitle: 'Your bag is empty',
  cartEmptyDesc: 'Explore Bodybond viral body glue and stay confident all day.',
  proceedToCheckout: 'Checkout with Cash On Delivery',
  estimatedTotal: 'Estimated Total',

  trustBadge1: '2-3 Days Home Delivery Nationwide',
  trustBadge2: '100% Authentic Quality',
  trustBadge3: 'Pay Cash When Received'
};

const TRANSLATIONS_BN: Translations = TRANSLATIONS_EN;

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  toggleLanguage: () => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>('en');

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState('en');
    try {
      localStorage.setItem('bodybond_lang', 'en');
    } catch (e) {
      console.error(e);
    }
  };

  const toggleLanguage = () => {
    setLanguageState('en');
  };

  // Full site strictly in English
  const t = TRANSLATIONS_EN;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
