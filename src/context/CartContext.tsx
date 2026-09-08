import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, CurrencyCode, Product } from '../types';
import { CURRENCY_RATES, PRODUCTS } from '../data/products';

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  addToCart: (product: Product, quantity?: number, shade?: string, size?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotalNZD: number;
  discountCode: string;
  appliedDiscount: number; // percentage e.g. 0.1 for 10%
  applyDiscountCode: (code: string) => { success: boolean; message: string };
  removeDiscountCode: () => void;
  freeShippingThresholdNZD: number;
  freeShippingRemainingNZD: number;
  isFreeShippingUnlocked: boolean;
  formatPrice: (priceNZD: number) => string;
  convertPrice: (priceNZD: number) => number;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD_NZD = 2500;

const sanitizeCartItem = (item: CartItem): CartItem => {
  if (item.productId === 'bodybond-glue' || item.id.includes('bodybond-glue')) {
    const is30ml = item.selectedSize === '30ml' || item.id.includes('30ml');
    if (is30ml) {
      return {
        ...item,
        name: 'Bodybond Glue (30ml)',
        priceNZD: 1350,
        selectedSize: '30ml',
      };
    } else {
      return {
        ...item,
        name: 'Bodybond Glue (20ml)',
        priceNZD: 1250,
        selectedSize: '20ml',
      };
    }
  }
  return item;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('bodybond_cart') || localStorage.getItem('bodibond_cart');
      if (saved) {
        const parsed: CartItem[] = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed.map(sanitizeCartItem) : [];
      }
      return [];
    } catch {
      return [];
    }
  });

  const [currency, setCurrency] = useState<CurrencyCode>(() => {
    try {
      const saved = localStorage.getItem('bodybond_currency') || localStorage.getItem('bodibond_currency');
      return (saved as CurrencyCode) || 'BDT';
    } catch {
      return 'BDT';
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('bodybond_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('bodybond_currency', currency);
    } catch (e) {
      console.error(e);
    }
  }, [currency]);

  const addToCart = (product: Product, quantity = 1, shade?: string, size?: string) => {
    let effectiveSize = size;
    let unitPrice = product.priceNZD;
    let displayName = product.name;

    if (product.id === 'bodybond-glue') {
      effectiveSize = size || '20ml';
      if (effectiveSize === '30ml') {
        unitPrice = 1350;
        displayName = 'Bodybond Glue (30ml)';
      } else {
        effectiveSize = '20ml';
        unitPrice = 1250;
        displayName = 'Bodybond Glue (20ml)';
      }
    }

    const shadeKey = shade ? `-${shade}` : '';
    const sizeKey = effectiveSize ? `-${effectiveSize}` : '';
    const cartItemId = `${product.id}${shadeKey}${sizeKey}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + quantity, priceNZD: unitPrice, name: displayName, selectedSize: effectiveSize }
            : item
        );
      } else {
        return [
          ...prev,
          {
            id: cartItemId,
            productId: product.id,
            name: displayName,
            priceNZD: unitPrice,
            image: product.images[0],
            quantity,
            selectedShade: shade,
            selectedSize: effectiveSize,
          },
        ];
      }
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const subtotalNZD = cart.reduce((acc, item) => acc + item.priceNZD * item.quantity, 0);

  const isFreeShippingUnlocked = subtotalNZD >= FREE_SHIPPING_THRESHOLD_NZD;
  const freeShippingRemainingNZD = Math.max(0, FREE_SHIPPING_THRESHOLD_NZD - subtotalNZD);

  const applyDiscountCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'WELCOME10' || cleanCode === 'BODYBOND10' || cleanCode === 'BODY10') {
      setDiscountCode(cleanCode);
      setAppliedDiscount(0.10);
      return { success: true, message: '১০% কুপন ডিসকাউন্ট সফলভাবে যুক্ত হয়েছে!' };
    } else if (cleanCode === 'TIKTOK15') {
      setDiscountCode(cleanCode);
      setAppliedDiscount(0.15);
      return { success: true, message: '১৫% TikTok VIP ডিসকাউন্ট সফলভাবে যুক্ত হয়েছে!' };
    } else if (cleanCode === 'BESTIE20' || cleanCode === 'BESTIE') {
      setDiscountCode(cleanCode);
      setAppliedDiscount(0.20);
      return { success: true, message: '২০% Bestie ডিসকাউন্ট সফলভাবে যুক্ত হয়েছে!' };
    } else {
      return { success: false, message: 'অবৈধ কুপন কোড! "WELCOME10" বা "BODY10" চেষ্টা করুন।' };
    }
  };

  const removeDiscountCode = () => {
    setDiscountCode('');
    setAppliedDiscount(0);
  };

  const convertPrice = (priceNZD: number): number => {
    const safePrice = typeof priceNZD === 'number' && !isNaN(priceNZD) ? priceNZD : 0;
    const rate = CURRENCY_RATES[currency]?.rate || 1.0;
    return safePrice * rate;
  };

  const formatPrice = (priceNZD: number): string => {
    const safePrice = typeof priceNZD === 'number' && !isNaN(priceNZD) ? priceNZD : 0;
    const currencyInfo = CURRENCY_RATES[currency] || CURRENCY_RATES.BDT;
    const converted = safePrice * currencyInfo.rate;
    if (currency === 'BDT') {
      return `${currencyInfo.symbol}${Math.round(converted).toLocaleString('en-US')}`;
    }
    return `${currencyInfo.symbol}${converted.toFixed(2)} ${currencyInfo.code}`;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        openDrawer: () => setIsCartOpen(true),
        closeDrawer: () => setIsCartOpen(false),
        currency,
        setCurrency,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotalNZD,
        discountCode,
        appliedDiscount,
        applyDiscountCode,
        removeDiscountCode,
        freeShippingThresholdNZD: FREE_SHIPPING_THRESHOLD_NZD,
        freeShippingRemainingNZD,
        isFreeShippingUnlocked,
        formatPrice,
        convertPrice,
        quickViewProduct,
        setQuickViewProduct,
        isSearchOpen,
        setIsSearchOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
