import React, { useState } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Film,
  Sparkles,
  RefreshCw,
  Check,
  Play,
  ShieldCheck,
  Lock,
  Unlock,
  Key,
  Eye,
  EyeOff,
  LogOut,
  AlertTriangle,
  Layers,
  Video,
  Package,
  Tag,
  Sliders,
  ShoppingBag,
  DollarSign,
  Plus,
  Trash2
} from 'lucide-react';
import { useMedia } from '../context/MediaContext';
import { useOrders } from '../context/OrderContext';
import { readMediaFile } from '../utils/mediaUtils';
import { saveVideoBlob } from '../utils/videoStorage';
import { isMediaItemVideo } from '../utils/videoHelpers';
import { AdminOrdersTab } from './admin/AdminOrdersTab';
import { AdminCouponsTab } from './admin/AdminCouponsTab';
import { AdminStoreSettingsTab } from './admin/AdminStoreSettingsTab';
import { UniversalVideoPlayer } from './UniversalVideoPlayer';

export const AdminPanelModal: React.FC = () => {
  const { orders } = useOrders();
  const {
    isAdminOpen,
    closeAdmin,
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
    updateConfidenceSlide,
    updateHeroBanner,
    updateWelcomeImage,
    updateFeaturedGlueImage,
    updateFollowUsImage,
    setAutoPlayVideos,
    resetToDefaults,
    resetVideoReels,
    isAdminAuthenticated,
    verifyAdminPassword,
    changeAdminPassword,
    logoutAdmin
  } = useMedia();

  // Password Lock Screen State
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Change Password State inside Panel
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChangeMessage, setPasswordChangeMessage] = useState<string | null>(null);

  // Tabs: Default to 'orders' so admin immediately sees real orders & stats!
  const [activeTab, setActiveTab] = useState<'orders' | 'coupons' | 'settings' | 'products' | 'videos' | 'banners' | 'security'>('orders');
  const [selectedProductSubTab, setSelectedProductSubTab] = useState<'glue' | 'nips'>('glue');

  const pendingOrdersCount = orders.filter(o => o.status === 'placed').length;

  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  // Quick inputs for manual URL typing
  const [customUrls, setCustomUrls] = useState<{ [key: string]: string }>({});

  if (!isAdminOpen) return null;

  const showNotification = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const showError = (msg: string) => {
    setErrorToast(msg);
    setTimeout(() => setErrorToast(null), 4000);
  };

  // Password submission handler
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) {
      setPasswordError('অনুগ্রহ করে পাসওয়ার্ড দিন');
      return;
    }

    const isValid = verifyAdminPassword(passwordInput);
    if (isValid) {
      setPasswordError(null);
      setPasswordInput('');
      showNotification('পাসওয়ার্ড সঠিক হয়েছে! স্বাগতম অ্যাডমিন প্যানেলে।');
    } else {
      setPasswordError('ভুল পাসওয়ার্ড! অনুগ্রহ করে সঠিক পাসওয়ার্ড দিন।');
    }
  };

  // Handle Changing Admin Password
  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.trim().length < 4) {
      setPasswordChangeMessage('পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordChangeMessage('দুটি পাসওয়ার্ড মিলছে না!');
      return;
    }

    const success = await changeAdminPassword(newPassword.trim());
    if (success) {
      setPasswordChangeMessage('✓ পাসওয়ার্ড সফলভাবে ক্লাউডে সংরক্ষিত হয়েছে! সব ডিভাইসে এখন এই নতুন পাসওয়ার্ড দিয়ে লগইন হবে।');
      setNewPassword('');
      setConfirmPassword('');
      showNotification('অ্যাডমিন পাসওয়ার্ড সফলভাবে আপডেট হয়েছে!');
    } else {
      setPasswordChangeMessage('পাসওয়ার্ড পরিবর্তনে সমস্যা হয়েছে');
    }
  };

  // Handle Photo or Video File Upload for Glue Gallery
  const handlePhotoFileUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      if (file.type.startsWith('video/')) {
        const blobUrl = await saveVideoBlob(`gallery-video-${index}`, file);
        updateGalleryImage(index, blobUrl, undefined, 'video');
        showNotification(`গ্যালারি ভিডিও #${index + 1} সফলভাবে আপলোড হয়েছে!`);
      } else {
        const dataUrl = await readMediaFile(file);
        updateGalleryImage(index, dataUrl, undefined, 'image');
        showNotification(`গ্যালারি ছবি #${index + 1} আপলোড সফল হয়েছে!`);
      }
    } catch (err: any) {
      showError(err.message || 'মিডিয়া আপলোডে সমস্যা হয়েছে');
    } finally {
      setIsProcessing(false);
      e.target.value = '';
    }
  };

  // Handle Photo File Upload for Nips Gallery
  const handleNipsFileUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      const dataUrl = await readMediaFile(file);
      updateNipsImage(index, dataUrl);
      showNotification(`Nip Cover Photo #${index + 1} আপলোড সফল হয়েছে!`);
    } catch (err: any) {
      showError(err.message || 'Failed to process image');
    } finally {
      setIsProcessing(false);
      e.target.value = '';
    }
  };

  // Handle Video File Upload safely with IndexedDB
  const handleVideoFileUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      const reel = videoReels[index];
      const blobUrl = await saveVideoBlob(reel.id, file);
      updateVideoReel(index, { videoUrl: blobUrl, hasCustomBlob: true });
      showNotification(`Video Reel #${index + 1} সফলভাবে আপলোড হয়েছে!`);
    } catch (err: any) {
      showError(err.message || 'Failed to upload video');
    } finally {
      setIsProcessing(false);
      e.target.value = '';
    }
  };

  // Handle Video Poster / Thumbnail Upload
  const handlePosterFileUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      const dataUrl = await readMediaFile(file);
      updateVideoReel(index, { poster: dataUrl });
      showNotification(`Reel #${index + 1} থাম্বনেইল কভার ফটো আপডেট হয়েছে!`);
    } catch (err: any) {
      showError(err.message || 'Failed to process poster');
    } finally {
      setIsProcessing(false);
      e.target.value = '';
    }
  };

  // Handle Single Image Section Uploads (Hero, Welcome, Featured, FollowUs)
  const handleGenericImageUpload = async (
    target: 'hero' | 'welcome' | 'featured' | 'followUs',
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      const dataUrl = await readMediaFile(file);
      if (target === 'hero') updateHeroBanner(dataUrl);
      if (target === 'welcome') updateWelcomeImage(dataUrl);
      if (target === 'featured') updateFeaturedGlueImage(dataUrl);
      if (target === 'followUs') updateFollowUsImage(dataUrl);
      showNotification('ছবিটি সফলভাবে আপডেট হয়েছে!');
    } catch (err: any) {
      showError(err.message || 'Failed to process image');
    } finally {
      setIsProcessing(false);
      e.target.value = '';
    }
  };

  // Handle Confidence Slide Photo Upload
  const handleSlideFileUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      const dataUrl = await readMediaFile(file);
      updateConfidenceSlide(index, dataUrl);
      showNotification(`Confidence Slide #${index + 1} ছবি আপডেট হয়েছে!`);
    } catch (err: any) {
      showError(err.message || 'Failed to process image');
    } finally {
      setIsProcessing(false);
      e.target.value = '';
    }
  };

  // =========================================================================
  // 1. PASSWORD LOCK SCREEN (Shown when not authenticated)
  // =========================================================================
  if (!isAdminAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-[#121216] border border-[#2B2B35] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          {/* Close button */}
          <button
            onClick={closeAdmin}
            className="absolute top-4 right-4 p-2 text-[#888888] hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Security Header */}
          <div className="text-center space-y-2 pt-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FF2D8D]/15 border border-[#FF2D8D]/30 flex items-center justify-center text-[#FF2D8D] shadow-lg shadow-[#FF2D8D]/10">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              অ্যাডমিন প্যানেল সিকিউরিটি
            </h2>
            <p className="text-xs text-[#999999] max-w-xs mx-auto">
              ওয়েবসাইটের সব ছবি, ভিডিও ও ব্যানার পরিচালনার জন্য আপনার সিক্রেট পাসওয়ার্ড দিন।
            </p>
          </div>

          {/* Password Form */}
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#CCCCCC]">
                অ্যাডমিন পাসওয়ার্ড (Password):
              </label>
              <div className="relative">
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  required
                  placeholder="পাসওয়ার্ড লিখুন..."
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setPasswordError(null);
                  }}
                  className="w-full px-4 py-3 bg-[#1A1A22] border border-[#333342] focus:border-[#FF2D8D] rounded-xl text-sm text-white placeholder-[#666666] focus:outline-none transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-white"
                >
                  {passwordVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {passwordError && (
                <p className="text-xs text-rose-400 flex items-center gap-1 font-medium pt-1">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{passwordError}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#FF2D8D] hover:bg-[#E0267B] active:bg-[#b81d63] text-white rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all shadow-lg hover:shadow-[#FF2D8D]/25 cursor-pointer flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>প্যানেলে প্রবেশ করুন</span>
            </button>
          </form>

          <div className="text-center">
            <button
              onClick={closeAdmin}
              className="text-xs text-[#777777] hover:text-white transition-colors underline cursor-pointer"
            >
              ওয়েবসাইটে ফিরে যান
            </button>
          </div>

        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. MAIN AUTHENTICATED ADMIN PANEL
  // =========================================================================
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      <div className="relative w-full max-w-4xl bg-[#121216] border border-[#262630] rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col h-[94dvh] sm:h-[88vh] overflow-hidden">

        {/* Modal Header */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-[#24242B] bg-[#16161A] flex items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#FF2D8D] text-white flex items-center justify-center font-black text-sm shadow-md flex-shrink-0">
              B
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-black text-white truncate">
                BODYBOND Control Panel
              </h2>
              <p className="text-[10px] sm:text-xs text-[#888888] truncate flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>সব ছবি, ভিডিও ও সেটিংস পরিবর্তন করুন</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Logout / Lock Button */}
            <button
              onClick={logoutAdmin}
              className="px-2.5 py-1.5 bg-[#1F1F28] hover:bg-rose-950/40 text-[#CCCCCC] hover:text-rose-300 border border-[#333342] hover:border-rose-800/50 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="লগআউট করে প্যানেল লক করুন"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">লগআউট</span>
            </button>

            {/* Close Button */}
            <button
              onClick={closeAdmin}
              className="p-1.5 sm:p-2 rounded-xl text-[#888888] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close Admin Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="bg-emerald-950/90 border-b border-emerald-700/60 px-4 py-2 text-xs text-emerald-200 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{successToast}</span>
            </div>
            <button onClick={() => setSuccessToast(null)} className="text-emerald-400">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Error Toast */}
        {errorToast && (
          <div className="bg-rose-950/90 border-b border-rose-700/60 px-4 py-2 text-xs text-rose-200 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>{errorToast}</span>
            </div>
            <button onClick={() => setErrorToast(null)} className="text-rose-400">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-[#24242B] bg-[#141418] px-3 sm:px-6 gap-1 sm:gap-2 flex-shrink-0 overflow-x-auto scrollbar-none py-1.5">
          
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-[#FF2D8D] text-white shadow-md'
                : 'text-[#888888] hover:text-white hover:bg-[#1E1E26]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>কাস্টমার অর্ডার্স</span>
            {pendingOrdersCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-black rounded-full bg-amber-400 text-black ml-0.5 animate-pulse">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'coupons'
                ? 'bg-[#FF2D8D] text-white shadow-md'
                : 'text-[#888888] hover:text-white hover:bg-[#1E1E26]'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>কুপন ও প্রোমো</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-[#FF2D8D] text-white shadow-md'
                : 'text-[#888888] hover:text-white hover:bg-[#1E1E26]'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>ডেলিভারি ফি ও সেটিংস</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-[#FF2D8D] text-white shadow-md'
                : 'text-[#888888] hover:text-white hover:bg-[#1E1E26]'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>প্রোডাক্ট ছবি</span>
          </button>

          <button
            onClick={() => setActiveTab('videos')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'videos'
                ? 'bg-[#FF2D8D] text-white shadow-md'
                : 'text-[#888888] hover:text-white hover:bg-[#1E1E26]'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>সব ভিডিও ও অটো-প্লে</span>
          </button>

          <button
            onClick={() => setActiveTab('banners')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'banners'
                ? 'bg-[#FF2D8D] text-white shadow-md'
                : 'text-[#888888] hover:text-white hover:bg-[#1E1E26]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>ব্যানার ও অন্যান্য ছবি</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'security'
                ? 'bg-[#FF2D8D] text-white shadow-md'
                : 'text-[#888888] hover:text-white hover:bg-[#1E1E26]'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>পাসওয়ার্ড পরিবর্তন</span>
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 space-y-4 sm:space-y-6">

          {/* ================================================================= */}
          {/* TAB: CUSTOMER ORDERS & LIVE PARCEL MANAGEMENT */}
          {/* ================================================================= */}
          {activeTab === 'orders' && (
            <AdminOrdersTab 
              onShowNotification={showNotification} 
              onShowError={showError} 
            />
          )}

          {/* ================================================================= */}
          {/* TAB: COUPONS & PROMO CODES */}
          {/* ================================================================= */}
          {activeTab === 'coupons' && (
            <AdminCouponsTab 
              onShowNotification={showNotification} 
              onShowError={showError} 
            />
          )}

          {/* ================================================================= */}
          {/* TAB: STORE SETTINGS & DELIVERY CHARGES */}
          {/* ================================================================= */}
          {activeTab === 'settings' && (
            <AdminStoreSettingsTab 
              onShowNotification={showNotification} 
              onShowError={showError} 
            />
          )}

          {/* ================================================================= */}
          {/* TAB 1: PRODUCT PHOTOS (GLUE & NIPPLE COVERS) */}
          {/* ================================================================= */}
          {activeTab === 'products' && (
            <div className="space-y-4 sm:space-y-5">
              
              {/* Sub-tab selection */}
              <div className="flex items-center gap-2 p-1.5 bg-[#181820] border border-[#2B2B38] rounded-xl">
                <button
                  onClick={() => setSelectedProductSubTab('glue')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    selectedProductSubTab === 'glue'
                      ? 'bg-[#FF2D8D] text-white shadow-md'
                      : 'text-[#888888] hover:text-white'
                  }`}
                >
                  Bodybond Glue (৬টি ছবি)
                </button>
                <button
                  onClick={() => setSelectedProductSubTab('nips')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    selectedProductSubTab === 'nips'
                      ? 'bg-[#FF2D8D] text-white shadow-md'
                      : 'text-[#888888] hover:text-white'
                  }`}
                >
                  Bodybond Nip Covers (৩টি ছবি)
                </button>
              </div>

              {/* Glue Gallery Photos */}
              {selectedProductSubTab === 'glue' && (
                <div className="space-y-3">
                  <div className="p-2.5 sm:p-3 bg-[#1A1A22] rounded-xl border border-[#2B2B38] text-xs text-[#BBBBBB] flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-[#FF2D8D] flex-shrink-0 mt-0.5" />
                    <div className="text-[11px] sm:text-xs">
                      <strong className="text-white block font-semibold mb-0.5">
                        Bodybond Glue প্রোডাক্ট গ্যালারি:
                      </strong>
                      মোবাইল বা কম্পিউটার থেকে সরাসরি ছবি আপলোড করুন অথবা যেকোনো ইমেজের লিংক পেস্ট করুন।
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                    {galleryImages.map((img, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-[#18181E] border border-[#2B2B35] space-y-2.5 flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-[#FF2D8D] uppercase tracking-wider">
                              Glue Photo #{idx + 1}
                            </span>
                            <div className="flex items-center gap-1.5">
                              {idx === 0 && (
                                <span className="text-[9px] bg-[#FF2D8D] text-white font-extrabold px-1.5 py-0.5 rounded">
                                  Main Display
                                </span>
                              )}
                              {galleryImages.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm(`Glue Photo #${idx + 1} মুছে ফেলতে চান?`)) {
                                      deleteGalleryImage(idx);
                                      showNotification(`Glue Photo #${idx + 1} মুছে ফেলা হয়েছে!`);
                                    }
                                  }}
                                  className="p-1 rounded text-gray-400 hover:text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
                                  title="ছবি মুছে ফেলুন"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>

                          {isMediaItemVideo(img) ? (
                            <div className="aspect-square w-full rounded-lg overflow-hidden bg-black border border-[#2E2E3C] relative group flex items-center justify-center">
                              <video 
                                src={img.videoUrl || img.src} 
                                className="w-full h-full object-cover" 
                                muted 
                                playsInline 
                              />
                              <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-[#FF2D8D] text-white text-[9px] font-bold flex items-center gap-1 shadow">
                                <Play className="w-2.5 h-2.5 fill-current" />
                                <span>ভিডিও</span>
                              </div>
                            </div>
                          ) : (
                            <div className="aspect-square w-full rounded-lg overflow-hidden bg-black border border-[#2E2E3C] relative group">
                              <img src={img.src} alt={img.caption} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                            </div>
                          )}

                          <input
                            type="text"
                            value={img.caption}
                            onChange={(e) => updateGalleryImage(idx, img.src, e.target.value, isMediaItemVideo(img) ? 'video' : 'image')}
                            className="w-full px-2 py-1 bg-[#121217] border border-[#2E2E3C] rounded-lg text-xs text-white focus:outline-none focus:border-[#FF2D8D]"
                            placeholder="ছবির বা ভিডিওর ক্যাপশন লিখুন..."
                          />
                        </div>

                        <div className="space-y-1.5 pt-1">
                          <label className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg bg-[#262633] hover:bg-[#323244] active:bg-[#38384d] text-xs font-bold text-white transition-colors cursor-pointer border border-[#3A3A4C]">
                            <Upload className="w-3.5 h-3.5 text-[#FF2D8D]" />
                            <span>Upload Photo</span>
                            <input
                              type="file"
                              accept="image/*,video/*"
                              className="hidden"
                              onChange={(e) => handlePhotoFileUpload(idx, e)}
                            />
                          </label>

                          <div className="flex gap-1.5">
                            <input
                              type="url"
                              placeholder="বা ছবির লিংক পেস্ট করুন"
                              value={customUrls[`glue-${idx}`] || ''}
                              onChange={(e) =>
                                setCustomUrls((prev) => ({ ...prev, [`glue-${idx}`]: e.target.value }))
                              }
                              className="w-full px-2 py-1 bg-[#121217] border border-[#2E2E3C] rounded-lg text-xs text-white focus:outline-none focus:border-[#FF2D8D]"
                            />
                            <button
                              onClick={() => {
                                const url = customUrls[`glue-${idx}`]?.trim();
                                if (url) {
                                  const isVid = isMediaItemVideo({ src: url });
                                  updateGalleryImage(idx, url, undefined, isVid ? 'video' : 'image');
                                  showNotification(`Gallery #${idx + 1} আপডেট হয়েছে!`);
                                  setCustomUrls((prev) => ({ ...prev, [`glue-${idx}`]: '' }));
                                }
                              }}
                              className="px-2.5 py-1 bg-[#FF2D8D] text-white rounded-lg text-xs font-bold cursor-pointer"
                            >
                              Set
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Add Photo Card */}
                    <button
                      type="button"
                      onClick={() => {
                        addGalleryImage();
                        showNotification('নতুন ছবির স্লট যোগ করা হয়েছে! এবার আপনি ছবি আপলোড করতে পারেন।');
                      }}
                      className="min-h-[220px] rounded-xl border-2 border-dashed border-[#FF2D8D]/40 hover:border-[#FF2D8D] bg-[#18181E]/60 hover:bg-[#18181E] transition-all flex flex-col items-center justify-center gap-2 p-5 text-center cursor-pointer group"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#FF2D8D]/20 group-hover:bg-[#FF2D8D]/30 flex items-center justify-center text-[#FF2D8D]">
                        <Plus className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-xs text-white block">
                          + নতুন ছবি যোগ করুন
                        </span>
                        <span className="text-[10px] text-gray-400 block pt-0.5">
                          গ্যালারিতে অতিরিক্ত ছবি আপলোড করতে ক্লিক করুন
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Nipple Covers Gallery Photos */}
              {selectedProductSubTab === 'nips' && (
                <div className="space-y-3">
                  <div className="p-2.5 sm:p-3 bg-[#1A1A22] rounded-xl border border-[#2B2B38] text-xs text-[#BBBBBB] flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-[#FF2D8D] flex-shrink-0 mt-0.5" />
                    <div className="text-[11px] sm:text-xs">
                      <strong className="text-white block font-semibold mb-0.5">
                        Bodybond Nip Covers প্রোডাক্টের ৩টি ছবি:
                      </strong>
                      হোমপেজ ও প্রোডাক্ট পেজের নিপল কভারের ছবি পরিবর্তন করতে পারেন।
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    {nipsImages.map((img, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-[#18181E] border border-[#2B2B35] space-y-2.5 flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <span className="text-xs font-black text-[#FF2D8D] uppercase tracking-wider">
                            Nip Cover Photo #{idx + 1}
                          </span>

                          <div className="aspect-square w-full rounded-lg overflow-hidden bg-black border border-[#2E2E3C]">
                            <img src={img.src} alt={img.caption} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                          </div>

                          <input
                            type="text"
                            value={img.caption}
                            onChange={(e) => updateNipsImage(idx, img.src, e.target.value)}
                            className="w-full px-2 py-1 bg-[#121217] border border-[#2E2E3C] rounded-lg text-xs text-white focus:outline-none focus:border-[#FF2D8D]"
                            placeholder="ক্যাপশন..."
                          />
                        </div>

                        <div className="space-y-1.5 pt-1">
                          <label className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg bg-[#262633] hover:bg-[#323244] active:bg-[#38384d] text-xs font-bold text-white transition-colors cursor-pointer border border-[#3A3A4C]">
                            <Upload className="w-3.5 h-3.5 text-[#FF2D8D]" />
                            <span>Upload Nips Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleNipsFileUpload(idx, e)}
                            />
                          </label>

                          <div className="flex gap-1.5">
                            <input
                              type="url"
                              placeholder="ছবির লিংক..."
                              value={customUrls[`nips-${idx}`] || ''}
                              onChange={(e) =>
                                setCustomUrls((prev) => ({ ...prev, [`nips-${idx}`]: e.target.value }))
                              }
                              className="w-full px-2 py-1 bg-[#121217] border border-[#2E2E3C] rounded-lg text-xs text-white focus:outline-none focus:border-[#FF2D8D]"
                            />
                            <button
                              onClick={() => {
                                const url = customUrls[`nips-${idx}`]?.trim();
                                if (url) {
                                  updateNipsImage(idx, url);
                                  showNotification(`Nip Cover Photo #${idx + 1} আপডেট হয়েছে!`);
                                  setCustomUrls((prev) => ({ ...prev, [`nips-${idx}`]: '' }));
                                }
                              }}
                              className="px-2.5 py-1 bg-[#FF2D8D] text-white rounded-lg text-xs font-bold cursor-pointer"
                            >
                              Set
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 2: VIDEOS & AUTOPLAY CONTROL */}
          {/* ================================================================= */}
          {activeTab === 'videos' && (
            <div className="space-y-4 sm:space-y-5">
              
              {/* 🌟 USER QUESTION DIRECT ANSWER & TOGGLE: Video Auto-Play Control */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#181824] to-[#201824] border border-[#382E3E] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-[#FF2D8D]" />
                      <h3 className="text-sm sm:text-base font-black text-white">
                        ওয়েবসাইটে ঢুকলে ভিডিও অটোমেটিক প্লে (Auto-Play) সেটিংস
                      </h3>
                    </div>
                    <p className="text-xs text-[#BBBBBB]">
                      ভিজিটর ওয়েবসাইটে ঢুকলে ভিডিওগুলো কি স্বয়ংক্রিয়ভাবে চলতে থাকবে?
                    </p>
                  </div>

                  {/* Toggle Switch */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      onClick={() => {
                        setAutoPlayVideos(!autoPlayVideos);
                        showNotification(
                          !autoPlayVideos 
                            ? 'ভিডিও অটো-প্লে চালু করা হয়েছে! (ওয়েবসাইটে ঢুকলে নিজ থেকেই চলবে)' 
                            : 'ভিডিও অটো-প্লে বন্ধ করা হয়েছে! (ক্লিক করলে প্লে হবে)'
                        );
                      }}
                      className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors cursor-pointer ${
                        autoPlayVideos ? 'bg-[#FF2D8D]' : 'bg-[#333342]'
                      }`}
                    >
                      <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                          autoPlayVideos ? 'translate-x-9' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <span className="text-xs font-black uppercase text-white min-w-[55px]">
                      {autoPlayVideos ? 'চালু (ON)' : 'বন্ধ (OFF)'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 text-[11px] text-[#999999] leading-relaxed">
                  💡 <strong className="text-white">ব্যাখ্যা:</strong> আধুনিক ব্রাউজারে মোবাইল ও ল্যাপটপে সাউন্ডলেস (Muted) অবস্থায় ভিডিও স্বয়ংক্রিয়ভাবে চলতে থাকে। আপনি চাইলে ওপরের সুইচ দিয়ে এটি যেকোনো সময় চালু বা বন্ধ করতে পারেন।
                </div>
              </div>

              {/* Video Reels Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {videoReels.map((reel, idx) => (
                  <div
                    key={reel.id}
                    className="p-3.5 sm:p-4 rounded-xl bg-[#18181E] border border-[#2B2B35] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-[#FF2D8D] uppercase tracking-wider">
                        Reel #{idx + 1}: {reel.title}
                      </span>
                      <span className="text-[10px] bg-[#FF2D8D]/20 text-[#FF2D8D] font-bold px-2 py-0.5 rounded">
                        {reel.badge}
                      </span>
                    </div>

                    {/* Video / Poster Preview */}
                    <div className="relative aspect-[9/16] w-28 mx-auto rounded-xl overflow-hidden bg-black border border-[#2E2E3C] shadow-md">
                      <img
                        src={reel.poster}
                        alt={reel.title}
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      {reel.videoUrl && (
                        <div className="absolute inset-0 w-full h-full">
                          <UniversalVideoPlayer
                            videoUrl={reel.videoUrl}
                            poster={reel.poster}
                            autoPlay={true}
                            loop={true}
                            muted={true}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>

                    {/* Inputs & Controls */}
                    <div className="space-y-2 text-xs">
                      
                      {/* Video Source Info */}
                      <div className="p-3 bg-[#FF2D8D]/10 border border-[#FF2D8D]/30 rounded-lg">
                        <p className="text-[11px] text-white/80 font-medium">
                          <span className="text-[#FF2D8D] font-bold">ভিডিও আপলোড:</span> এই ভিডিওটি প্রজেক্টের <code className="bg-black/50 px-1 py-0.5 rounded text-white text-[10px]">public/video{idx + 1}.mp4</code> ফাইল থেকে সরাসরি প্লে হচ্ছে। 
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          ভিডিও পরিবর্তন করতে বাম পাশের <strong>File Explorer</strong> থেকে <code>public</code> ফোল্ডারে <code>video{idx + 1}.mp4</code> নামে আপনার ভিডিওটি আপলোড করুন। এটি অটোমেটিক্যালি সবার জন্য আপডেট হয়ে যাবে (লিংকের কোনো ঝামেলা নেই)।
                        </p>
                      </div>

                      {/* Poster / Thumbnail Change */}
                      <div>
                        <label className="block text-[10px] text-[#888888] font-bold mb-1">
                          কভার ছবি / থাম্বনেইল (Cover Thumbnail):
                        </label>
                        <label className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg bg-[#262633] hover:bg-[#323244] active:bg-[#38384d] text-xs font-semibold text-[#CCCCCC] transition-colors cursor-pointer border border-[#3A3A4C]">
                          <ImageIcon className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                          <span>ভিডিও থাম্বনেইল পরিবর্তন করুন</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handlePosterFileUpload(idx, e)}
                          />
                        </label>
                      </div>

                      {/* Title & Badge */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-[#888888] block mb-0.5">Title</label>
                          <input
                            type="text"
                            value={reel.title}
                            onChange={(e) => updateVideoReel(idx, { title: e.target.value })}
                            className="w-full px-2 py-1 bg-[#121217] border border-[#2E2E3C] rounded-lg text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-[#888888] block mb-0.5">Badge Text</label>
                          <input
                            type="text"
                            value={reel.badge}
                            onChange={(e) => updateVideoReel(idx, { badge: e.target.value })}
                            className="w-full px-2 py-1 bg-[#121217] border border-[#2E2E3C] rounded-lg text-xs text-white"
                          />
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 3: BANNERS & PAGE SECTIONS */}
          {/* ================================================================= */}
          {activeTab === 'banners' && (
            <div className="space-y-4 sm:space-y-6">
              
              <div className="p-3 bg-[#1A1A22] rounded-xl border border-[#2B2B38] text-xs text-[#BBBBBB] flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#FF2D8D] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold mb-0.5">
                    ওয়েবসাইটের সব ব্যানার ও ব্যাকগ্রাউন্ড ফটো:
                  </strong>
                  হোমপেজের মেইন হিরো ব্যানার, ৩ ফ্রেন্ডস ফটো, ইনস্ট্যান্ট-বাই ফটো, ফলো-আস ব্যাকগ্রাউন্ড ও কনফিডেন্স স্লাইডার পরিবর্তন করুন।
                </div>
              </div>

              {/* 1. Homepage Main Hero Banner */}
              <div className="p-4 rounded-xl bg-[#18181E] border border-[#2B2B35] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#FF2D8D] uppercase tracking-wider">
                    ১. Homepage Main Hero Banner (উপরের প্রধান ব্যানার)
                  </span>
                </div>

                <div className="aspect-[16/7] w-full rounded-xl overflow-hidden bg-black border border-[#2E2E3C]">
                  <img src={heroBanner} alt="Hero Banner" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <label className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#262633] hover:bg-[#323244] text-xs font-bold text-white transition-colors cursor-pointer border border-[#3A3A4C]">
                    <Upload className="w-3.5 h-3.5 text-[#FF2D8D]" />
                    <span>Upload New Hero Banner</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleGenericImageUpload('hero', e)}
                    />
                  </label>

                  <div className="flex flex-1 gap-1.5">
                    <input
                      type="url"
                      placeholder="বা ব্যানারের ছবি লিংক দিন..."
                      value={customUrls['hero'] || ''}
                      onChange={(e) => setCustomUrls((prev) => ({ ...prev, hero: e.target.value }))}
                      className="w-full px-2.5 py-1.5 bg-[#121217] border border-[#2E2E3C] rounded-lg text-xs text-white"
                    />
                    <button
                      onClick={() => {
                        const url = customUrls['hero']?.trim();
                        if (url) {
                          updateHeroBanner(url);
                          showNotification('Hero Banner আপডেট হয়েছে!');
                          setCustomUrls((prev) => ({ ...prev, hero: '' }));
                        }
                      }}
                      className="px-3 py-1.5 bg-[#FF2D8D] text-white rounded-lg text-xs font-bold"
                    >
                      Set
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. Welcome Section Photo (3 Girls) */}
              <div className="p-4 rounded-xl bg-[#18181E] border border-[#2B2B35] space-y-3">
                <span className="text-xs font-black text-[#FF2D8D] uppercase tracking-wider">
                  ২. Welcome Section Photo (ওয়েলকাম সেকশনের ছবি)
                </span>

                <div className="aspect-[16/9] max-h-56 w-full rounded-xl overflow-hidden bg-black border border-[#2E2E3C]">
                  <img src={welcomeImage} alt="Welcome Section" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <label className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#262633] hover:bg-[#323244] text-xs font-bold text-white transition-colors cursor-pointer border border-[#3A3A4C]">
                    <Upload className="w-3.5 h-3.5 text-[#FF2D8D]" />
                    <span>Upload Welcome Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleGenericImageUpload('welcome', e)}
                    />
                  </label>

                  <div className="flex flex-1 gap-1.5">
                    <input
                      type="url"
                      placeholder="বা ছবির লিংক পেস্ট করুন..."
                      value={customUrls['welcome'] || ''}
                      onChange={(e) => setCustomUrls((prev) => ({ ...prev, welcome: e.target.value }))}
                      className="w-full px-2.5 py-1.5 bg-[#121217] border border-[#2E2E3C] rounded-lg text-xs text-white"
                    />
                    <button
                      onClick={() => {
                        const url = customUrls['welcome']?.trim();
                        if (url) {
                          updateWelcomeImage(url);
                          showNotification('Welcome Photo আপডেট হয়েছে!');
                          setCustomUrls((prev) => ({ ...prev, welcome: '' }));
                        }
                      }}
                      className="px-3 py-1.5 bg-[#FF2D8D] text-white rounded-lg text-xs font-bold"
                    >
                      Set
                    </button>
                  </div>
                </div>
              </div>

              {/* 3. Featured Instant-Buy Glue Photo */}
              <div className="p-4 rounded-xl bg-[#18181E] border border-[#2B2B35] space-y-3">
                <span className="text-xs font-black text-[#FF2D8D] uppercase tracking-wider">
                  ৩. Featured Instant-Buy Photo (MAX HOLD সেকশন ছবি)
                </span>

                <div className="aspect-[16/9] max-h-56 w-full rounded-xl overflow-hidden bg-black border border-[#2E2E3C]">
                  <img src={featuredGlueImage} alt="Featured Glue" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <label className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#262633] hover:bg-[#323244] text-xs font-bold text-white transition-colors cursor-pointer border border-[#3A3A4C]">
                    <Upload className="w-3.5 h-3.5 text-[#FF2D8D]" />
                    <span>Upload Featured Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleGenericImageUpload('featured', e)}
                    />
                  </label>

                  <div className="flex flex-1 gap-1.5">
                    <input
                      type="url"
                      placeholder="বা ছবির লিংক পেস্ট করুন..."
                      value={customUrls['featured'] || ''}
                      onChange={(e) => setCustomUrls((prev) => ({ ...prev, featured: e.target.value }))}
                      className="w-full px-2.5 py-1.5 bg-[#121217] border border-[#2E2E3C] rounded-lg text-xs text-white"
                    />
                    <button
                      onClick={() => {
                        const url = customUrls['featured']?.trim();
                        if (url) {
                          updateFeaturedGlueImage(url);
                          showNotification('Featured Glue Photo আপডেট হয়েছে!');
                          setCustomUrls((prev) => ({ ...prev, featured: '' }));
                        }
                      }}
                      className="px-3 py-1.5 bg-[#FF2D8D] text-white rounded-lg text-xs font-bold"
                    >
                      Set
                    </button>
                  </div>
                </div>
              </div>

              {/* 4. Follow Us Collage Background Photo */}
              <div className="p-4 rounded-xl bg-[#18181E] border border-[#2B2B35] space-y-3">
                <span className="text-xs font-black text-[#FF2D8D] uppercase tracking-wider">
                  ৪. Follow Us Background Photo (সোশ্যাল মিডিয়া ব্যাকগ্রাউন্ড)
                </span>

                <div className="aspect-[16/7] max-h-48 w-full rounded-xl overflow-hidden bg-black border border-[#2E2E3C]">
                  <img src={followUsImage} alt="Follow Us Collage" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <label className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#262633] hover:bg-[#323244] text-xs font-bold text-white transition-colors cursor-pointer border border-[#3A3A4C]">
                    <Upload className="w-3.5 h-3.5 text-[#FF2D8D]" />
                    <span>Upload Background Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleGenericImageUpload('followUs', e)}
                    />
                  </label>

                  <div className="flex flex-1 gap-1.5">
                    <input
                      type="url"
                      placeholder="বা ছবির লিংক পেস্ট করুন..."
                      value={customUrls['followUs'] || ''}
                      onChange={(e) => setCustomUrls((prev) => ({ ...prev, followUs: e.target.value }))}
                      className="w-full px-2.5 py-1.5 bg-[#121217] border border-[#2E2E3C] rounded-lg text-xs text-white"
                    />
                    <button
                      onClick={() => {
                        const url = customUrls['followUs']?.trim();
                        if (url) {
                          updateFollowUsImage(url);
                          showNotification('Follow Us Background আপডেট হয়েছে!');
                          setCustomUrls((prev) => ({ ...prev, followUs: '' }));
                        }
                      }}
                      className="px-3 py-1.5 bg-[#FF2D8D] text-white rounded-lg text-xs font-bold"
                    >
                      Set
                    </button>
                  </div>
                </div>
              </div>

              {/* 5. Confidence Slides */}
              <div className="space-y-3">
                <span className="text-xs font-black text-[#FF2D8D] uppercase tracking-wider block">
                  ৫. Model Confidence Carousel Slides (২টি স্লাইড)
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {confidenceSlides.map((slide, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 sm:p-4 rounded-xl bg-[#18181E] border border-[#2B2B35] space-y-3"
                    >
                      <span className="text-xs font-black text-white uppercase tracking-wider">
                        Slide #{idx + 1}
                      </span>

                      <div className="aspect-[4/3] w-full rounded-lg overflow-hidden bg-black border border-[#2E2E3C]">
                        <img src={slide.img} alt={slide.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      </div>

                      <div className="space-y-2">
                        <label className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg bg-[#262633] hover:bg-[#323244] text-xs font-bold text-white transition-colors cursor-pointer border border-[#3A3A4C]">
                          <Upload className="w-3.5 h-3.5 text-[#FF2D8D]" />
                          <span>Upload Slide Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleSlideFileUpload(idx, e)}
                          />
                        </label>

                        <input
                          type="text"
                          value={slide.title}
                          onChange={(e) => updateConfidenceSlide(idx, slide.img, e.target.value, slide.desc)}
                          className="w-full px-2.5 py-1.5 bg-[#121217] border border-[#2E2E3C] rounded-lg text-xs text-white"
                          placeholder="Headline..."
                        />

                        <textarea
                          rows={2}
                          value={slide.desc}
                          onChange={(e) => updateConfidenceSlide(idx, slide.img, slide.title, e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-[#121217] border border-[#2E2E3C] rounded-lg text-xs text-white"
                          placeholder="Description..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 4: SECURITY & PASSWORD CHANGE */}
          {/* ================================================================= */}
          {activeTab === 'security' && (
            <div className="max-w-md mx-auto space-y-6 py-4">
              
              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-[#FF2D8D]/20 text-[#FF2D8D] flex items-center justify-center shadow-lg">
                  <Key className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-white">অ্যাডমিন পাসওয়ার্ড পরিবর্তন</h3>
                <p className="text-xs text-[#999999]">
                  প্যানেলের নিরাপত্তা নিশ্চিত করতে আপনার নিজের পছন্দমতো একটি নতুন পাসওয়ার্ড সেট করুন।
                </p>
              </div>

              <form onSubmit={handleChangePasswordSubmit} className="space-y-4 p-5 rounded-2xl bg-[#181820] border border-[#2B2B38]">
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#CCCCCC] block">নতুন পাসওয়ার্ড (New Password):</label>
                  <input
                    type="password"
                    required
                    placeholder="কমপক্ষে ৪ অক্ষরের পাসওয়ার্ড..."
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121217] border border-[#2E2E3C] focus:border-[#FF2D8D] rounded-xl text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#CCCCCC] block">পাসওয়ার্ড নিশ্চিত করুন (Confirm Password):</label>
                  <input
                    type="password"
                    required
                    placeholder="পুনরায় পাসওয়ার্ড লিখুন..."
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121217] border border-[#2E2E3C] focus:border-[#FF2D8D] rounded-xl text-xs text-white focus:outline-none"
                  />
                </div>

                {passwordChangeMessage && (
                  <div className="p-3 bg-[#241A28] border border-[#522543] rounded-xl text-xs text-pink-200">
                    {passwordChangeMessage}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-[#FF2D8D] hover:bg-[#E0267B] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>পাসওয়ার্ড সেভ করুন</span>
                </button>
              </form>

            </div>
          )}

        </div>

        {/* Modal Footer Bar */}
        <div className="px-4 py-3 sm:px-5 sm:py-3.5 border-t border-[#24242B] bg-[#16161A] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 flex-shrink-0">
          <button
            onClick={() => {
              resetToDefaults();
              showNotification('সব মিডিয়া ফ্যাক্টরি ডিফল্টে ফিরে গেছে!');
            }}
            className="text-xs text-[#888888] hover:text-red-400 flex items-center justify-center sm:justify-start gap-1.5 py-2 sm:py-1.5 px-2 rounded-lg hover:bg-red-950/30 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset All to Defaults (আগের ছবিতে ফিরুন)</span>
          </button>

          <button
            onClick={closeAdmin}
            className="w-full sm:w-auto py-2.5 sm:py-2 px-6 bg-[#FF2D8D] hover:bg-[#E0267B] active:bg-[#b81d63] text-white rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all shadow-lg hover:shadow-[#FF2D8D]/25 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Save & View Store</span>
          </button>
        </div>

      </div>
    </div>
  );
};
