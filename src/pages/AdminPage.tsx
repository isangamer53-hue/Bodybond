import React, { useState } from 'react';
import {
  Film,
  Sparkles,
  RefreshCw,
  Check,
  Play,
  ShieldCheck,
  Lock,
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
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  HelpCircle,
  Menu,
  X
} from 'lucide-react';
import { useMedia } from '../context/MediaContext';
import { useOrders } from '../context/OrderContext';
import { readMediaFile } from '../utils/mediaUtils';
import { saveVideoBlob } from '../utils/videoStorage';
import { AdminOrdersTab } from '../components/admin/AdminOrdersTab';
import { AdminCouponsTab } from '../components/admin/AdminCouponsTab';
import { AdminStoreSettingsTab } from '../components/admin/AdminStoreSettingsTab';
import { UniversalVideoPlayer } from '../components/UniversalVideoPlayer';
import { VideoReelItem } from '../types';

interface AdminPageProps {
  onNavigate: (page: string, productId?: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const { orders } = useOrders();
  const {
    videoReels,
    galleryImages,
    nipsImages,
    confidenceSlides,
    heroBanner,
    welcomeImage,
    featuredGlueImage,
    followUsImage,
    autoPlayVideos,
    updateVideoReel,
    addVideoReel,
    deleteVideoReel,
    moveVideoReel,
    updateGalleryImage,
    updateNipsImage,
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

  // Login Gate State
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Active Tab & Mobile Drawer State
  const [activeTab, setActiveTab] = useState<'orders' | 'coupons' | 'settings' | 'photos' | 'security'>('orders');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedPhotoSubTab, setSelectedPhotoSubTab] = useState<'glue' | 'nips' | 'banners'>('glue');

  // New Video Reel Modal / Form State
  const [isAddingReel, setIsAddingReel] = useState(false);
  const [newReelTitle, setNewReelTitle] = useState('');
  const [newReelBadge, setNewReelBadge] = useState('');
  const [newReelAuthor, setNewReelAuthor] = useState('@bodybond.bd');
  const [newReelDesc, setNewReelDesc] = useState('');
  const [newReelVideoUrl, setNewReelVideoUrl] = useState('');
  const [newReelPosterUrl, setNewReelPosterUrl] = useState('');

  // Change Password State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChangeMessage, setPasswordChangeMessage] = useState<string | null>(null);

  // Notifications
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const [customUrls, setCustomUrls] = useState<{ [key: string]: string }>({});

  const showNotification = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const showError = (msg: string) => {
    setErrorToast(msg);
    setTimeout(() => setErrorToast(null), 4000);
  };

  // Login Form Submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) {
      setPasswordError('অনুগ্রহ করে অ্যাডমিন পাসওয়ার্ড লিখুন');
      return;
    }

    const isValid = verifyAdminPassword(passwordInput);
    if (isValid) {
      setPasswordError(null);
      setPasswordInput('');
      showNotification('✅ অ্যাডমিন প্যানেলে সফলভাবে লগইন হয়েছে!');
    } else {
      setPasswordError('ভুল পাসওয়ার্ড! অনুগ্রহ করে সঠিক পাসওয়ার্ড দিন।');
    }
  };

  // Video File Upload Handler
  const handleVideoFileUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      showNotification('ভিডিও আপলোড প্রসেস হচ্ছে... একটু অপেক্ষা করুন');
      const reelId = videoReels[index]?.id || `reel-${Date.now()}`;
      await saveVideoBlob(reelId, file);
      const objectUrl = URL.createObjectURL(file);

      updateVideoReel(index, {
        videoUrl: objectUrl,
        hasCustomBlob: true
      });

      showNotification(`✅ Video Reel #${index + 1} সফলভাবে আপলোড ও সেভ হয়েছে!`);
    } catch (err) {
      showError('ভিডিও ফাইল আপলোড ব্যর্থ হয়েছে। ফাইল সাইজ বা ফরম্যাট চেক করুন।');
    }
    e.target.value = '';
  };

  // Poster File Upload Handler
  const handlePosterFileUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await readMediaFile(file);
      updateVideoReel(index, { poster: dataUrl });
      showNotification(`✅ Video Reel #${index + 1} থাম্বনেইল সফলভাবে আপডেট হয়েছে!`);
    } catch (err) {
      showError('থাম্বনেইল ছবি আপলোড ব্যর্থ হয়েছে।');
    }
    e.target.value = '';
  };

  // Add New Video Reel
  const handleCreateNewReel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReelTitle.trim()) {
      showError('অনুগ্রহ করে ভিডিওর একটি নাম দিন');
      return;
    }

    const newReel: VideoReelItem = {
      id: `reel-${Date.now()}`,
      title: newReelTitle.trim(),
      badge: (newReelBadge.trim() || newReelTitle.trim()).toUpperCase(),
      author: newReelAuthor.trim() || '@bodybond.bd',
      description: newReelDesc.trim() || 'Real Bodybond skin adhesive application test.',
      poster: newReelPosterUrl.trim() || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=500&q=80',
      videoUrl: newReelVideoUrl.trim() || 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-posing-in-a-white-dress-in-a-studio-41477-large.mp4'
    };

    addVideoReel(newReel);
    showNotification('🎉 নতুন ভিডিও রিল সফলভাবে যোগ করা হয়েছে!');
    setIsAddingReel(false);
    setNewReelTitle('');
    setNewReelBadge('');
    setNewReelAuthor('@bodybond.bd');
    setNewReelDesc('');
    setNewReelVideoUrl('');
    setNewReelPosterUrl('');
  };

  // Pending orders
  const pendingOrdersCount = orders.filter(o => o.status === 'placed').length;

  // =========================================================================
  // VIEW 1: LOGIN GATE (WHEN NOT AUTHENTICATED)
  // =========================================================================
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A0710] text-white flex flex-col justify-between p-4 sm:p-6 selection:bg-[#A855F7] selection:text-white">
        {/* Top bar back button */}
        <div className="max-w-4xl w-full mx-auto flex items-center justify-between py-2">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1A1224] border border-[#2B1B3D] text-xs font-bold text-[#D8B4FE] hover:text-white hover:bg-[#251A33] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>ওয়েবসাইটে ফিরে যান (Back to Website)</span>
          </button>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#A855F7] bg-[#A855F7]/10 px-2.5 py-1 rounded-full border border-[#A855F7]/20">
            Secure Admin Gateway
          </span>
        </div>

        {/* Login Box */}
        <div className="max-w-md w-full mx-auto my-auto py-8">
          <div className="bg-[#130E1D] border-2 border-[#A855F7]/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
            {/* Top decorative glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#A855F7]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#C084FC]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              {/* Brand Header */}
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#9333EA] to-[#C084FC] flex items-center justify-center mx-auto shadow-lg shadow-[#A855F7]/30 text-white mb-3">
                  <Lock className="w-8 h-8 stroke-[2.2]" />
                </div>
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-2xl font-black tracking-tight text-white">BODY</span>
                  <span className="text-2xl font-black tracking-tight text-white">BOND</span>
                </div>
                <p className="text-xs font-black uppercase tracking-widest text-[#C084FC]">
                  Admin Dashboard Portal
                </p>
                <p className="text-xs text-[#9CA3AF] leading-relaxed">
                  ভিডিও রিলস, অর্ডার, কুপন ও স্টোর সেটিংস পরিবর্তন করতে অ্যাডমিন পাসওয়ার্ড দিন।
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                    অ্যাডমিন পাসওয়ার্ড (Admin Password)
                  </label>
                  <div className="relative">
                    <input
                      type={passwordVisible ? 'text' : 'password'}
                      value={passwordInput}
                      onChange={(e) => {
                        setPasswordInput(e.target.value);
                        setPasswordError(null);
                      }}
                      placeholder="পাসওয়ার্ড লিখুন..."
                      autoFocus
                      className="w-full px-4 py-3.5 bg-[#0D0914] border border-[#2E1E45] rounded-xl text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#A855F7] pr-11 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {passwordVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordError && (
                    <div className="flex items-center gap-1.5 text-xs text-rose-400 mt-2 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
                      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{passwordError}</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-[#9333EA] to-[#A855F7] hover:from-[#8B5CF6] hover:to-[#C084FC] text-white font-black text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#A855F7]/30 cursor-pointer active:scale-[0.99]"
                >
                  লগইন করুন (Enter Dashboard)
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="text-center py-4 text-xs text-gray-500">
          Bodybond Bangladesh • Authorized Management System
        </div>
      </div>
    );
  }

  // Navigation Items Definition
  const sidebarNavItems = [
    {
      id: 'orders' as const,
      title: 'অর্ডারসমূহ',
      subtitle: 'Customer Orders',
      icon: Package,
      badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} নতুন` : `${orders.length} টি`,
      badgeStyle: pendingOrdersCount > 0 ? 'bg-amber-500 text-black font-black animate-pulse' : 'bg-[#22163A] text-gray-300'
    },
    {
      id: 'photos' as const,
      title: 'ছবি ও ব্যানার',
      subtitle: 'Gallery & Banners',
      icon: ImageIcon,
      badgeStyle: 'bg-[#22163A] text-pink-300'
    },
    {
      id: 'coupons' as const,
      title: 'কুপন কোড',
      subtitle: 'Discount Coupons',
      icon: Tag,
      badgeStyle: 'bg-[#22163A] text-emerald-300'
    },
    {
      id: 'settings' as const,
      title: 'স্টোর সেটিংস',
      subtitle: 'Delivery & Config',
      icon: Sliders,
      badgeStyle: 'bg-[#22163A] text-blue-300'
    },
    {
      id: 'security' as const,
      title: 'পাসওয়ার্ড',
      subtitle: 'Security & Password',
      icon: Key,
      badgeStyle: 'bg-[#22163A] text-yellow-300'
    }
  ];

  // =========================================================================
  // VIEW 2: FULL-FEATURED STANDALONE ADMIN PAGE
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#0A0711] text-white flex flex-col lg:flex-row selection:bg-[#A855F7] selection:text-white">
      
      {/* Toast Notification Banner */}
      {successToast && (
        <div className="fixed top-4 right-4 left-4 sm:left-auto z-50 bg-[#16A34A] text-white font-bold text-xs sm:text-sm px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-emerald-400/50 animate-bounce">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>{successToast}</span>
        </div>
      )}
      {errorToast && (
        <div className="fixed top-4 right-4 left-4 sm:left-auto z-50 bg-[#DC2626] text-white font-bold text-xs sm:text-sm px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-rose-400/50">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{errorToast}</span>
        </div>
      )}

      {/* MOBILE HEADER (Top bar on small screens) */}
      <header className="lg:hidden sticky top-0 z-40 bg-[#120D1D]/95 backdrop-blur-md border-b border-[#25173A] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2.5 rounded-xl bg-[#1C142C] border border-[#30214B] text-gray-200 hover:text-white active:scale-95 transition-transform cursor-pointer"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5 text-[#C084FC]" />
          </button>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black tracking-tight text-white">BODYBOND</span>
              <span className="text-[10px] font-black uppercase bg-[#A855F7]/20 text-[#C084FC] px-2 py-0.5 rounded-full border border-[#A855F7]/30">
                Admin
              </span>
            </div>
            <p className="text-[11px] font-bold text-gray-300">
              {sidebarNavItems.find(item => item.id === activeTab)?.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {pendingOrdersCount > 0 && (
            <button
              onClick={() => setActiveTab('orders')}
              className="px-2.5 py-1 rounded-full bg-amber-500 text-black font-black text-[10px] animate-pulse flex items-center gap-1 cursor-pointer"
            >
              <Package className="w-3 h-3" />
              <span>{pendingOrdersCount} টি নতুন</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('home')}
            className="p-2 rounded-xl bg-[#1C142C] text-gray-300 hover:text-white border border-[#30214B] cursor-pointer"
            title="ওয়েবসাইটে ফিরে যান"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* MOBILE QUICK TAB SWITCHER BAR (Sticky beneath top bar) */}
      <div className="lg:hidden bg-[#150E22] border-b border-[#25173A] px-3 py-2 flex overflow-x-auto scrollbar-none gap-2">
        {sidebarNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer flex-shrink-0 ${
                isActive
                  ? 'bg-gradient-to-r from-[#9333EA] to-[#A855F7] text-white shadow-md'
                  : 'bg-[#1C132E] text-gray-300 hover:text-white border border-[#2B1B42]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#C084FC]'}`} />
              <span>{item.title}</span>
              {item.id === 'orders' && pendingOrdersCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              )}
            </button>
          );
        })}
      </div>

      {/* BACKDROP OVERLAY FOR MOBILE SIDEBAR */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 lg:hidden transition-opacity"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR NAVIGATION (Desktop Sticky & Mobile Slide-out Drawer) */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 lg:z-30 h-screen w-72 bg-[#110D1A] border-r border-[#241738] flex flex-col justify-between transition-transform duration-300 ease-in-out flex-shrink-0
        ${mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="p-5 border-b border-[#231538] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#9333EA] to-[#C084FC] flex items-center justify-center text-white shadow-lg shadow-[#A855F7]/30">
              <Lock className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-1">
                <span>BODY</span>
                <span>BOND</span>
              </h2>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                Admin Console
              </span>
            </div>
          </div>

          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden p-2 rounded-xl bg-[#1C142C] text-gray-400 hover:text-white border border-[#30214B] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Store Health Status */}
        <div className="px-4 py-3 mx-3 my-3 bg-[#171025] rounded-2xl border border-[#2B1B42] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-extrabold text-emerald-400">স্টোর সক্রিয় (Active)</span>
          </div>
          <span className="text-[10px] font-mono text-gray-400 bg-black/40 px-2 py-0.5 rounded">
            v2.4
          </span>
        </div>

        {/* Sidebar Navigation Items */}
        <nav className="px-3 space-y-1.5 flex-1 overflow-y-auto scrollbar-none py-2">
          {sidebarNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer group ${
                  isActive
                    ? 'bg-gradient-to-r from-[#9333EA] to-[#A855F7] text-white shadow-lg shadow-[#A855F7]/25 border border-[#C084FC]/30'
                    : 'text-gray-300 hover:text-white hover:bg-[#1C132E]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-2 rounded-xl transition-colors ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#191129] text-[#C084FC] group-hover:bg-[#25193B]'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-left min-w-0">
                    <span className="block truncate font-black">{item.title}</span>
                    <span className={`block text-[10px] font-normal truncate ${isActive ? 'text-purple-100' : 'text-gray-500'}`}>
                      {item.subtitle}
                    </span>
                  </div>
                </div>

                {item.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold flex-shrink-0 ${item.badgeStyle}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Bottom Footer Actions */}
        <div className="p-4 border-t border-[#231538] space-y-2.5 bg-[#0C0814]">
          <button
            onClick={() => onNavigate('product', 'bodybond-glue')}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#171025] hover:bg-[#221736] text-[#C084FC] hover:text-white text-xs font-bold transition-all border border-[#2D1D45] cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>প্রোডাক্ট পেজ ভিজিট করুন</span>
          </button>

          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              onClick={() => onNavigate('home')}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#171025] hover:bg-[#221736] text-gray-300 hover:text-white text-xs font-bold transition-colors border border-[#2D1D45] cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>ওয়েবসাইট</span>
            </button>

            <button
              onClick={() => {
                logoutAdmin();
                showNotification('লগআউট সম্পন্ন হয়েছে');
              }}
              className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-bold transition-colors border border-rose-500/30 cursor-pointer flex items-center gap-1.5"
              title="লগআউট করুন"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>লগআউট</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT WORKSPACE */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        
        {/* DESKTOP TOP HEADER BAR */}
        <header className="hidden lg:flex sticky top-0 z-20 bg-[#110D1A]/95 backdrop-blur-md border-b border-[#241738] px-8 py-4 items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-white flex items-center gap-2">
              <span>{sidebarNavItems.find(item => item.id === activeTab)?.title}</span>
              <span className="text-xs font-normal text-gray-400">
                ({sidebarNavItems.find(item => item.id === activeTab)?.subtitle})
              </span>
            </h1>
            <p className="text-xs text-gray-400">
              Bodybond Official Admin & Content Management Console
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-[#171025] border border-[#2B1B42] text-xs font-bold text-gray-300 flex items-center gap-2">
              <Package className="w-3.5 h-3.5 text-amber-400" />
              <span>মোট অর্ডার: <strong className="text-white font-mono">{orders.length}</strong></span>
              {pendingOrdersCount > 0 && (
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-black">
                  {pendingOrdersCount} টি নতুন
                </span>
              )}
            </div>

            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1A122A] hover:bg-[#251A3B] text-gray-200 hover:text-white text-xs font-bold transition-all border border-[#2E1F47] cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>ওয়েবসাইটে ফিরে যান</span>
            </button>
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-grow max-w-7xl w-full mx-auto">

        {/* ========================================================================= */}
        {/* TAB 1 CONTENT: ORDERS */}
        {/* ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="bg-[#140E20] border border-[#2B1B3D] rounded-3xl p-4 sm:p-7 shadow-xl">
            <AdminOrdersTab
              onShowNotification={showNotification}
              onShowError={showError}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3 CONTENT: COUPONS */}
        {/* ========================================================================= */}
        {activeTab === 'coupons' && (
          <div className="bg-[#140E20] border border-[#2B1B3D] rounded-3xl p-4 sm:p-7 shadow-xl">
            <AdminCouponsTab
              onShowNotification={showNotification}
              onShowError={showError}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4 CONTENT: STORE SETTINGS & SHIPPING */}
        {/* ========================================================================= */}
        {activeTab === 'settings' && (
          <div className="bg-[#140E20] border border-[#2B1B3D] rounded-3xl p-4 sm:p-7 shadow-xl">
            <AdminStoreSettingsTab
              onShowNotification={showNotification}
              onShowError={showError}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5 CONTENT: PHOTOS & BANNERS */}
        {/* ========================================================================= */}
        {activeTab === 'photos' && (
          <div className="space-y-6">
            <div className="bg-[#140E20] border border-[#2B1B3D] rounded-3xl p-5 sm:p-7 space-y-4">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  ওয়েবসাইট ছবি ও ব্যানার ম্যানেজমেন্ট
                </h2>
                <p className="text-xs sm:text-sm text-gray-300">
                  হোমপেইজের ব্যানার, ওয়েলকাম সেকশন ও প্রোডাক্ট গ্যালারির ছবিগুলো পরিবর্তন করুন।
                </p>
              </div>

              {/* Sub tabs */}
              <div className="flex gap-2 border-b border-[#26173B] pb-3">
                <button
                  onClick={() => setSelectedPhotoSubTab('glue')}
                  className={`px-4 py-2 rounded-xl text-xs font-black cursor-pointer ${
                    selectedPhotoSubTab === 'glue' ? 'bg-[#A855F7] text-white' : 'bg-[#1D142E] text-gray-400'
                  }`}
                >
                  Bodybond Glue গ্যালারি
                </button>
                <button
                  onClick={() => setSelectedPhotoSubTab('nips')}
                  className={`px-4 py-2 rounded-xl text-xs font-black cursor-pointer ${
                    selectedPhotoSubTab === 'nips' ? 'bg-[#A855F7] text-white' : 'bg-[#1D142E] text-gray-400'
                  }`}
                >
                  Seamless Nips গ্যালারি
                </button>
                <button
                  onClick={() => setSelectedPhotoSubTab('banners')}
                  className={`px-4 py-2 rounded-xl text-xs font-black cursor-pointer ${
                    selectedPhotoSubTab === 'banners' ? 'bg-[#A855F7] text-white' : 'bg-[#1D142E] text-gray-400'
                  }`}
                >
                  সাইট ব্যানার ও ফিচারড ছবি
                </button>
              </div>

              {/* Bodybond Glue Gallery Images */}
              {selectedPhotoSubTab === 'glue' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                  {galleryImages.map((img, idx) => (
                    <div key={idx} className="bg-[#1C142B] p-3 rounded-2xl border border-[#2F1E4A] space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-gray-300">
                          <span className="text-[#C084FC]">ছবি #{idx + 1} {idx === 0 && '(মেইন ডিসপ্লে)'}</span>
                          <span className="text-[10px] text-gray-400 truncate max-w-[120px]">{img.caption}</span>
                        </div>
                        <div className="aspect-square rounded-xl overflow-hidden bg-black border border-[#2F1E4A]">
                          <img src={img.src} alt={img.caption} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        </div>
                        <input
                          type="text"
                          value={img.caption}
                          onChange={(e) => updateGalleryImage(idx, img.src, e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-[#120B1F] border border-[#2F1E4A] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#C084FC]"
                          placeholder="ছবির ক্যাপশন লিখুন..."
                        />
                      </div>
                      <div className="space-y-2 pt-1">
                        <label className="inline-flex items-center justify-center gap-1.5 w-full py-2 bg-[#281A3E] hover:bg-[#342252] text-xs font-bold text-white rounded-xl cursor-pointer border border-[#3F2B61] transition-colors">
                          <Upload className="w-3.5 h-3.5 text-[#C084FC]" />
                          <span>ফাইল আপলোড করুন</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                try {
                                  const dataUrl = await readMediaFile(file);
                                  updateGalleryImage(idx, dataUrl);
                                  showNotification(`ছবি #${idx + 1} সফলভাবে পরিবর্তন ও সেভ হয়েছে!`);
                                } catch (err) {
                                  showError('ছবি প্রসেস করতে ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
                                }
                              }
                            }}
                          />
                        </label>
                        <div className="flex gap-1.5">
                          <input
                            type="url"
                            placeholder="বা ছবির লিংক পেস্ট করুন"
                            value={customUrls[`glue-${idx}`] || ''}
                            onChange={(e) => setCustomUrls(prev => ({ ...prev, [`glue-${idx}`]: e.target.value }))}
                            className="w-full px-2.5 py-1.5 bg-[#120B1F] border border-[#2F1E4A] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#C084FC]"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const url = customUrls[`glue-${idx}`];
                              if (url && url.trim()) {
                                updateGalleryImage(idx, url.trim());
                                showNotification(`ছবি #${idx + 1} লিংক থেকে সফলভাবে সেভ হয়েছে!`);
                                setCustomUrls(prev => ({ ...prev, [`glue-${idx}`]: '' }));
                              }
                            }}
                            className="px-3 py-1.5 bg-[#A855F7] hover:bg-[#9333EA] text-xs font-black text-white rounded-xl cursor-pointer transition-colors"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Seamless Nips Gallery Images */}
              {selectedPhotoSubTab === 'nips' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                  {nipsImages.map((img, idx) => (
                    <div key={idx} className="bg-[#1C142B] p-3 rounded-2xl border border-[#2F1E4A] space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-gray-300">
                          <span className="text-[#C084FC]">Nips ছবি #{idx + 1}</span>
                          <span className="text-[10px] text-gray-400 truncate max-w-[120px]">{img.caption}</span>
                        </div>
                        <div className="aspect-square rounded-xl overflow-hidden bg-black border border-[#2F1E4A]">
                          <img src={img.src} alt={img.caption} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        </div>
                        <input
                          type="text"
                          value={img.caption}
                          onChange={(e) => updateNipsImage(idx, img.src, e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-[#120B1F] border border-[#2F1E4A] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#C084FC]"
                          placeholder="ছবির ক্যাপশন লিখুন..."
                        />
                      </div>
                      <div className="space-y-2 pt-1">
                        <label className="inline-flex items-center justify-center gap-1.5 w-full py-2 bg-[#281A3E] hover:bg-[#342252] text-xs font-bold text-white rounded-xl cursor-pointer border border-[#3F2B61] transition-colors">
                          <Upload className="w-3.5 h-3.5 text-[#C084FC]" />
                          <span>ফাইল আপলোড করুন</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                try {
                                  const dataUrl = await readMediaFile(file);
                                  updateNipsImage(idx, dataUrl);
                                  showNotification(`Nips ছবি #${idx + 1} সফলভাবে পরিবর্তন ও সেভ হয়েছে!`);
                                } catch (err) {
                                  showError('ছবি প্রসেস করতে ব্যর্থ হয়েছে।');
                                }
                              }
                            }}
                          />
                        </label>
                        <div className="flex gap-1.5">
                          <input
                            type="url"
                            placeholder="বা ছবির লিংক পেস্ট করুন"
                            value={customUrls[`nips-${idx}`] || ''}
                            onChange={(e) => setCustomUrls(prev => ({ ...prev, [`nips-${idx}`]: e.target.value }))}
                            className="w-full px-2.5 py-1.5 bg-[#120B1F] border border-[#2F1E4A] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#C084FC]"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const url = customUrls[`nips-${idx}`];
                              if (url && url.trim()) {
                                updateNipsImage(idx, url.trim());
                                showNotification(`Nips ছবি #${idx + 1} লিংক থেকে সফলভাবে সেভ হয়েছে!`);
                                setCustomUrls(prev => ({ ...prev, [`nips-${idx}`]: '' }));
                              }
                            }}
                            className="px-3 py-1.5 bg-[#A855F7] hover:bg-[#9333EA] text-xs font-black text-white rounded-xl cursor-pointer transition-colors"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Banners & Highlights */}
              {selectedPhotoSubTab === 'banners' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  
                  {/* Hero Banner */}
                  <div className="bg-[#1C142B] p-4 rounded-2xl border border-[#2F1E4A] space-y-3">
                    <span className="text-xs font-bold text-white block">হিরো ব্যানার (Main Top Banner)</span>
                    <div className="aspect-video rounded-xl overflow-hidden bg-black border border-[#2F1E4A]">
                      <img src={heroBanner} alt="Hero Banner" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-2">
                      <label className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 bg-[#281A3E] hover:bg-[#342252] text-xs font-bold text-white rounded-xl cursor-pointer border border-[#3F2B61] transition-colors">
                        <Upload className="w-3.5 h-3.5 text-[#C084FC]" />
                        <span>নতুন ব্যানার ফাইল আপলোড করুন</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const dataUrl = await readMediaFile(file);
                                updateHeroBanner(dataUrl);
                                showNotification('হিরো ব্যানার সফলভাবে পরিবর্তন হয়েছে!');
                              } catch (err) {
                                showError('ছবি প্রসেস করতে ব্যর্থ হয়েছে।');
                              }
                            }
                          }}
                        />
                      </label>
                      <div className="flex gap-1.5">
                        <input
                          type="url"
                          placeholder="বা ব্যানারের ইমেজ লিংক পেস্ট করুন"
                          value={customUrls['hero'] || ''}
                          onChange={(e) => setCustomUrls(prev => ({ ...prev, hero: e.target.value }))}
                          className="w-full px-2.5 py-1.5 bg-[#120B1F] border border-[#2F1E4A] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#C084FC]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const url = customUrls['hero'];
                            if (url && url.trim()) {
                              updateHeroBanner(url.trim());
                              showNotification('হিরো ব্যানার সফলভাবে পরিবর্তন হয়েছে!');
                              setCustomUrls(prev => ({ ...prev, hero: '' }));
                            }
                          }}
                          className="px-3 py-1.5 bg-[#A855F7] hover:bg-[#9333EA] text-xs font-black text-white rounded-xl cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Welcome Section Image */}
                  <div className="bg-[#1C142B] p-4 rounded-2xl border border-[#2F1E4A] space-y-3">
                    <span className="text-xs font-bold text-white block">ওয়েলকাম ফটো (Welcome Section Photo)</span>
                    <div className="aspect-video rounded-xl overflow-hidden bg-black border border-[#2F1E4A]">
                      <img src={welcomeImage} alt="Welcome" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-2">
                      <label className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 bg-[#281A3E] hover:bg-[#342252] text-xs font-bold text-white rounded-xl cursor-pointer border border-[#3F2B61] transition-colors">
                        <Upload className="w-3.5 h-3.5 text-[#C084FC]" />
                        <span>নতুন ফটো ফাইল আপলোড করুন</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const dataUrl = await readMediaFile(file);
                                updateWelcomeImage(dataUrl);
                                showNotification('ওয়েলকাম ফটো সফলভাবে পরিবর্তন হয়েছে!');
                              } catch (err) {
                                showError('ছবি প্রসেস করতে ব্যর্থ হয়েছে।');
                              }
                            }
                          }}
                        />
                      </label>
                      <div className="flex gap-1.5">
                        <input
                          type="url"
                          placeholder="বা ফটোর ইমেজ লিংক পেস্ট করুন"
                          value={customUrls['welcome'] || ''}
                          onChange={(e) => setCustomUrls(prev => ({ ...prev, welcome: e.target.value }))}
                          className="w-full px-2.5 py-1.5 bg-[#120B1F] border border-[#2F1E4A] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#C084FC]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const url = customUrls['welcome'];
                            if (url && url.trim()) {
                              updateWelcomeImage(url.trim());
                              showNotification('ওয়েলকাম ফটো সফলভাবে পরিবর্তন হয়েছে!');
                              setCustomUrls(prev => ({ ...prev, welcome: '' }));
                            }
                          }}
                          className="px-3 py-1.5 bg-[#A855F7] hover:bg-[#9333EA] text-xs font-black text-white rounded-xl cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              )}

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6 CONTENT: SECURITY & PASSWORD */}
        {/* ========================================================================= */}
        {activeTab === 'security' && (
          <div className="max-w-md mx-auto bg-[#140E20] border border-[#2B1B3D] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-[#A855F7]/20 flex items-center justify-center mx-auto text-[#C084FC] mb-2">
                <Key className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-black text-white">অ্যাডমিন পাসওয়ার্ড পরিবর্তন</h2>
              <p className="text-xs text-gray-400">
                ভবিষ্যতে প্যানেলে লগইনের জন্য আপনার সুবিধাজনক যেকোনো নতুন পাসওয়ার্ড সেট করুন।
              </p>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!newPassword.trim()) {
                  showError('অনুগ্রহ করে নতুন পাসওয়ার্ড লিখুন');
                  return;
                }
                if (newPassword.trim().length < 4) {
                  showError('পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে');
                  return;
                }
                if (newPassword !== confirmPassword) {
                  showError('পাসওয়ার্ড দুটি মিলছে না! পুনরায় চেক করুন।');
                  return;
                }
                const res = await changeAdminPassword(newPassword.trim());
                if (res) {
                  showNotification('✅ ক্লাউড ডাটাবেজে পাসওয়ার্ড সফলভাবে সংরক্ষিত হয়েছে! সব ডিভাইসেই এখন এই নতুন পাসওয়ার্ড দিয়ে লগইন হবে।');
                  setNewPassword('');
                  setConfirmPassword('');
                  setPasswordChangeMessage('পাসওয়ার্ড সফলভাবে ক্লাউডে সংরক্ষিত হয়েছে! সব ডিভাইসে এই পাসওয়ার্ড কার্যকর হবে।');
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  নতুন পাসওয়ার্ড (New Password)
                </label>
                <input
                  type="password"
                  placeholder="কমপক্ষে ৪টি অক্ষর বা সংখ্যা..."
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#0D0914] border border-[#2E1E45] rounded-xl text-xs text-white focus:outline-none focus:border-[#A855F7]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  পাসওয়ার্ড নিশ্চিত করুন (Confirm Password)
                </label>
                <input
                  type="password"
                  placeholder="আবারও একই পাসওয়ার্ড লিখুন..."
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#0D0914] border border-[#2E1E45] rounded-xl text-xs text-white focus:outline-none focus:border-[#A855F7]"
                />
              </div>

              {passwordChangeMessage && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 font-bold text-center">
                  {passwordChangeMessage}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#9333EA] to-[#A855F7] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg cursor-pointer transition-all"
              >
                পাসওয়ার্ড সংরক্ষণ করুন (Save Password)
              </button>
            </form>
          </div>
        )}

        </main>
      </div>

    </div>
  );
};
