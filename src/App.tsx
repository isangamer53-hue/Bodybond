import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CartProvider, useCart } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';
import { MediaProvider, useMedia } from './context/MediaContext';
import { OrderProvider, useOrders } from './context/OrderContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { SocialProofToast } from './components/SocialProofToast';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { FixedBottomTicker } from './components/MarqueeTicker';
import { Product } from './types';
import { PRODUCTS } from './data/products';

// Primary Instant-Load Pages (Eagerly imported for zero initial render delay)
import { HomePage } from './pages/HomePage';

// Secondary Lazy-Loaded Pages (Loaded on demand for optimal initial load performance)
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage').then(m => ({ default: m.ProductDetailPage })));
const ShopPage = lazy(() => import('./pages/ShopPage').then(m => ({ default: m.ShopPage })));
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage').then(m => ({ default: m.HowItWorksPage })));
const WhereToUsePage = lazy(() => import('./pages/WhereToUsePage').then(m => ({ default: m.WhereToUsePage })));
const HowToUsePage = lazy(() => import('./pages/HowToUsePage').then(m => ({ default: m.HowToUsePage })));
const HowToRemovePage = lazy(() => import('./pages/HowToRemovePage').then(m => ({ default: m.HowToRemovePage })));
const OutfitMatcherPage = lazy(() => import('./pages/OutfitMatcherPage').then(m => ({ default: m.OutfitMatcherPage })));
const ReviewsPage = lazy(() => import('./pages/ReviewsPage').then(m => ({ default: m.ReviewsPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const FaqPage = lazy(() => import('./pages/FaqPage').then(m => ({ default: m.FaqPage })));
const OrderTrackingPage = lazy(() => import('./pages/OrderTrackingPage').then(m => ({ default: m.OrderTrackingPage })));
const AdminPage = lazy(() => import('./pages/AdminPage').then(m => ({ default: m.AdminPage })));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage').then(m => ({ default: m.CheckoutPage })));

// Heavy Modals (Loaded only on user interaction)
const ProductQuickViewModal = lazy(() => import('./components/ProductQuickViewModal').then(m => ({ default: m.ProductQuickViewModal })));
const SearchModal = lazy(() => import('./components/SearchModal').then(m => ({ default: m.SearchModal })));
const CheckoutModal = lazy(() => import('./components/CheckoutModal').then(m => ({ default: m.CheckoutModal })));
const AdminPanelModal = lazy(() => import('./components/AdminPanelModal').then(m => ({ default: m.AdminPanelModal })));
const OrderTrackingModal = lazy(() => import('./components/OrderTrackingModal').then(m => ({ default: m.OrderTrackingModal })));

// Sleek minimal page loader
const PageLoadingFallback: React.FC = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4 bg-transparent text-[#1E141D]">
    <div className="w-8 h-8 border-2 border-[#FF2D8D] border-t-transparent rounded-full animate-spin" />
    <span className="text-[11px] font-bold text-[#6D4C63] tracking-widest uppercase">Loading BODYBOND...</span>
  </div>
);

function MainStore() {
  const [activePage, setActivePage] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string>('bodybond-glue');
  const { setQuickViewProduct, quickViewProduct, isSearchOpen, isCheckoutOpen } = useCart();
  const { isAdminOpen, openAdmin } = useMedia();
  const { isTrackingModalOpen } = useOrders();

  // Hash route parsing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (!hash) {
        setActivePage('home');
        return;
      }

      if (hash === 'admin' || hash === 'media-admin') {
        setActivePage('admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      if (hash.startsWith('product/') || hash.startsWith('product-detail/')) {
        const parts = hash.split('/');
        const pid = parts[1] || 'bodybond-glue';
        setSelectedProductId(pid);
        setActivePage('product-detail');
      } else if (hash === 'products' || hash === 'shop') {
        setActivePage('shop');
      } else if (hash === 'checkout' || hash === 'order' || hash === 'full-order') {
        setActivePage('checkout');
      } else if (hash === 'track' || hash === 'track-order' || hash === 'tracking') {
        setActivePage('track-order');
      } else if (hash === 'how-it-works') {
        setActivePage('how-it-works');
      } else if (hash === 'where-to-use') {
        setActivePage('where-to-use');
      } else if (hash === 'how-to-use') {
        setActivePage('how-to-use');
      } else if (hash === 'how-to-remove') {
        setActivePage('how-to-remove');
      } else if (hash === 'outfit-matcher') {
        setActivePage('outfit-matcher');
      } else if (hash === 'reviews') {
        setActivePage('reviews');
      } else if (hash === 'about') {
        setActivePage('about');
      } else if (hash === 'faq' || hash === 'faqs') {
        setActivePage('faq');
      } else {
        setActivePage('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    
    // Secret keyboard shortcut: Ctrl+Shift+A or Cmd+Shift+A to open Admin Panel
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setActivePage('admin');
        window.location.hash = 'admin';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [openAdmin]);

  const handleNavigate = (page: string, productId?: string) => {
    if (page === 'admin') {
      setActivePage('admin');
      window.location.hash = 'admin';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (page === 'checkout' || page === 'order' || page === 'full-order') {
      setActivePage('checkout');
      window.location.hash = 'checkout';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (page === 'track-order') {
      setActivePage('track-order');
      window.location.hash = 'track-order';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (page === 'product-detail' || page.startsWith('product:')) {
      const pid = productId || (page.startsWith('product:') ? page.split(':')[1] : 'bodybond-glue');
      setSelectedProductId(pid);
      setActivePage('product-detail');
      window.location.hash = `product/${pid}`;
    } else {
      setActivePage(page);
      window.location.hash = page === 'home' ? '' : page;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProductId(product.id);
    setActivePage('product-detail');
    window.location.hash = `product/${product.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dedicated Full-Page Admin View
  if (activePage === 'admin') {
    return (
      <Suspense fallback={<PageLoadingFallback />}>
        <AdminPage onNavigate={handleNavigate} />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1E141D] selection:bg-[#FF2D8D] selection:text-white pb-8 sm:pb-9">
      {/* Header */}
      <Header onNavigate={handleNavigate} activePage={activePage} onOpenAdmin={() => handleNavigate('admin')} />

      {/* Main Content Area - Discrete Pages */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage + (activePage === 'product-detail' ? `-${selectedProductId}` : '')}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="w-full"
          >
            {activePage === 'home' && (
              <HomePage 
                onNavigate={handleNavigate} 
                onSelectProduct={handleSelectProduct} 
              />
            )}

            <Suspense fallback={<PageLoadingFallback />}>
              {activePage === 'product-detail' && (
                <ProductDetailPage 
                  productId={selectedProductId}
                  onNavigate={handleNavigate}
                  onSelectProduct={handleSelectProduct}
                />
              )}

              {activePage === 'shop' && (
                <ShopPage 
                  onNavigate={handleNavigate} 
                  onSelectProduct={handleSelectProduct} 
                />
              )}

              {activePage === 'checkout' && (
                <CheckoutPage onNavigate={handleNavigate} />
              )}

              {activePage === 'track-order' && (
                <OrderTrackingPage onNavigate={handleNavigate} />
              )}

              {activePage === 'how-it-works' && (
                <HowItWorksPage onNavigate={handleNavigate} />
              )}

              {activePage === 'where-to-use' && (
                <WhereToUsePage onNavigate={handleNavigate} />
              )}

              {activePage === 'how-to-use' && (
                <HowToUsePage onNavigate={handleNavigate} />
              )}

              {activePage === 'how-to-remove' && (
                <HowToRemovePage onNavigate={handleNavigate} />
              )}

              {activePage === 'outfit-matcher' && (
                <OutfitMatcherPage onNavigate={handleNavigate} />
              )}

              {activePage === 'reviews' && (
                <ReviewsPage onNavigate={handleNavigate} />
              )}

              {activePage === 'about' && (
                <AboutPage onNavigate={handleNavigate} />
              )}

              {activePage === 'faq' && (
                <FaqPage onNavigate={handleNavigate} />
              )}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} onOpenAdmin={() => handleNavigate('admin')} />

      {/* Persistent Fixed Bottom Credibility & Social Proof Ticker */}
      <FixedBottomTicker />

      {/* Interactive Global Modals and Drawers */}
      <CartDrawer />
      <FloatingWhatsApp />

      {/* Code-split dynamic modals loaded only when opened */}
      <Suspense fallback={null}>
        {quickViewProduct && <ProductQuickViewModal />}
        {isSearchOpen && <SearchModal />}
        {isCheckoutOpen && <CheckoutModal />}
        {isAdminOpen && <AdminPanelModal />}
        {isTrackingModalOpen && <OrderTrackingModal />}
      </Suspense>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MediaProvider>
        <OrderProvider>
          <CartProvider>
            <MainStore />
          </CartProvider>
        </OrderProvider>
      </MediaProvider>
    </LanguageProvider>
  );
}

