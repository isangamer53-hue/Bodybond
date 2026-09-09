import React, { useState, useMemo } from 'react';
import { 
  Star, 
  Check, 
  Search, 
  Filter, 
  Camera, 
  ThumbsUp, 
  Sparkles, 
  ShieldCheck, 
  MessageSquare,
  Plus,
  Heart,
  CheckCircle2,
  X
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ReviewsPageProps {
  onNavigate: (page: string, productId?: string) => void;
}

interface UserSubmittedReview {
  id: string;
  name: string;
  location: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  productName: string;
  outfitWorn?: string;
  verified: boolean;
  likes: number;
  hasPhoto?: boolean;
}

const INITIAL_REVIEWS: UserSubmittedReview[] = [
  {
    id: 'rev-1',
    name: 'Farzana Chowdhury',
    location: 'Dhanmondi, Dhaka',
    rating: 5,
    date: '2 din age',
    title: 'Biyer anusthane puro 6 ghanta nechechi - ektu-o kholeni!',
    body: 'Ami shotti khub chintay chilam karon shadharon fashion tape ghame khule jeto. Kintu Bodybond Body Glue magicer moto kaj koreche! Backless georgette blouse e kono bra charai ekdom perfect support peyechi. Protyekta apur eta thaka dorkar!',
    productName: 'Bodybond Body Glue (20ml)',
    outfitWorn: 'Deep Backless Blouse',
    verified: true,
    likes: 48,
    hasPhoto: true
  },
  {
    id: 'rev-2',
    name: 'Sadia Afrin',
    location: 'Gulshan 2, Dhaka',
    rating: 5,
    date: '1 shoptaho age',
    title: 'Safety piner kono futo ba tan chara sharir achol atke thake',
    body: 'Dami silk sharite safety pin dile fete ba futo hoye nosto hoye jeto. Bodybond e matro 2 fota dile kadher shathe shundor lege thake ebong pore halka gorom panite dhulei chole jay!',
    productName: 'Bodybond Body Glue (20ml)',
    outfitWorn: 'Benarasi & Katan Saree',
    verified: true,
    likes: 42,
    hasPhoto: true
  },
  {
    id: 'rev-3',
    name: 'Nusrat Jahan',
    location: 'Uttara Sector 7, Dhaka',
    rating: 5,
    date: '2 shoptaho age',
    title: 'Nipple covers gulo t-shirt & kurtite darun invisible',
    body: 'Silicone ta khub-i soft ebong skin er shathe mishe jay. Thin linen shirt ba blouser nich diye ektu-o bujha jay na. Full marks!',
    productName: 'Bodybond Seamless Nipple Covers (Sold Out)',
    outfitWorn: 'Western Tops & Kurti',
    verified: true,
    likes: 67,
    hasPhoto: true
  },
  {
    id: 'rev-4',
    name: 'Tanjila Rahman',
    location: 'Khulshi, Chittagong',
    rating: 5,
    date: '3 shoptaho age',
    title: 'Sensitive skin eo kono rash ba chulkani hoyni',
    body: 'Amar skin khub-i sensitive. Aloe Vera thakay tolar por skin e kono lal dag ba jalapora chilo na. Delivery-o matro 2 dine peyechi Cash on Delivery te.',
    productName: 'Bodybond Body Glue (20ml)',
    outfitWorn: 'Off Shoulder Gown',
    verified: true,
    likes: 31,
    hasPhoto: false
  },
  {
    id: 'rev-5',
    name: 'Sharmin Sultana',
    location: 'Sylhet Sadar',
    rating: 5,
    date: '1 mash age',
    title: 'Silk & satin posake kono dag fele na!',
    body: 'Amar shobcheye boro bhoy chilo dami posake dag bosbe kina. Halka kushum gorom panite dhowar shathe shathei aatha chole gese. Tape er moto kono nongra aathalo bhab thake na.',
    productName: 'Bodybond Body Glue (20ml)',
    outfitWorn: 'Satin Party Dress',
    verified: true,
    likes: 25,
    hasPhoto: true
  },
  {
    id: 'rev-6',
    name: 'Mehrin Islam',
    location: 'Mirpur DOHS, Dhaka',
    rating: 5,
    date: '1 mash age',
    title: 'Seamless nipple covers gulo shompurno invisible',
    body: 'Patla linen shirt ba blouser nich diye ektu-o bujha jay na. Edge gulo khub-i patla tay kono gol ring dekha jay na. Super product!',
    productName: 'Bodybond Seamless Nipple Covers (Sold Out)',
    outfitWorn: 'White Shirt & Kameez',
    verified: true,
    likes: 54,
    hasPhoto: false
  }
];

export const ReviewsPage: React.FC<ReviewsPageProps> = ({ onNavigate }) => {
  const isBn = false;

  const [reviewsList, setReviewsList] = useState<UserSubmittedReview[]>(INITIAL_REVIEWS);
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [filterPhotosOnly, setFilterPhotosOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showWriteModal, setShowWriteModal] = useState(false);

  // New review form state
  const [newRating, setNewRating] = useState(5);
  const [newName, setNewName] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newProduct, setNewProduct] = useState('Bodybond Body Glue (20ml)');
  const [newOutfit, setNewOutfit] = useState('Saree Blouse & Party Dress');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const filteredReviews = useMemo(() => {
    return reviewsList.filter((rev) => {
      if (filterRating !== 'all' && rev.rating !== filterRating) return false;
      if (filterPhotosOnly && !rev.hasPhoto) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const text = `${rev.name} ${rev.title} ${rev.body} ${rev.productName} ${rev.location} ${rev.outfitWorn || ''}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });
  }, [reviewsList, filterRating, filterPhotosOnly, searchQuery]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newTitle || !newBody) return;

    const newRev: UserSubmittedReview = {
      id: `rev-${Date.now()}`,
      name: newName,
      location: newLocation || 'Dhaka, Bangladesh',
      rating: newRating,
      date: 'Just now',
      title: newTitle,
      body: newBody,
      productName: newProduct,
      outfitWorn: newOutfit,
      verified: true,
      likes: 1,
      hasPhoto: false
    };

    setReviewsList([newRev, ...reviewsList]);
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setShowWriteModal(false);
      setNewName('');
      setNewLocation('');
      setNewTitle('');
      setNewBody('');
    }, 1500);
  };

  return (
    <div className="bg-white min-h-screen pb-24 text-[#1E141D] relative overflow-hidden">
      {/* Header Banner */}
      <div className="bg-white border-b border-[#F2D3E2] py-12 sm:py-16 px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#F2D3E2] text-xs font-bold text-[#FF2D8D] tracking-wider uppercase shadow-sm">
            <Heart className="w-3.5 h-3.5 fill-[#FF2D8D]" />
            <span>2,500+ Verified Customer Reviews</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1E141D] tracking-tight">
            Real Customer <span className="text-[#FF2D8D]">Love & Reviews</span>
          </h1>
          
          <p className="text-xs sm:text-sm text-[#5E3F54] max-w-xl mx-auto font-medium">
            See why women across Bangladesh trust Bodybond for saree blouses, deep necks, and party outfits.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mt-10">
        
        {/* Rating Breakdown & Stats Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#F2D3E2] shadow-md mb-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left Score */}
            <div className="md:col-span-4 text-center md:text-left md:border-r border-[#F2D3E2] md:pr-8 space-y-2">
              <div className="text-5xl sm:text-6xl font-black text-[#1E141D]">
                4.9
              </div>
              <div className="flex justify-center md:justify-start text-[#FF2D8D] gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#FF2D8D] text-[#FF2D8D]" />
                ))}
              </div>
              <p className="text-xs font-semibold text-[#5E3F54]">
                Based on 2,548 verified customer ratings
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 text-[11px] font-bold">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>99.4% Recommend to a Friend</span>
              </div>
            </div>

            {/* Middle Rating Bars */}
            <div className="md:col-span-5 space-y-2.5">
              {[
                { stars: 5, pct: 95, count: '2,415' },
                { stars: 4, pct: 4, count: '108' },
                { stars: 3, pct: 1, count: '23' },
                { stars: 2, pct: 0, count: '2' },
                { stars: 1, pct: 0, count: '0' },
              ].map((bar) => (
                <div key={bar.stars} className="flex items-center gap-3 text-xs text-[#5E3F54]">
                  <span className="w-14 font-semibold">{bar.stars} Stars</span>
                  <div className="flex-1 h-2.5 bg-white border border-[#F2D3E2] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#FF2D8D] rounded-full" 
                      style={{ width: `${bar.pct}%` }} 
                    />
                  </div>
                  <span className="w-12 text-right text-[11px] text-[#1E141D] font-bold">{bar.count}</span>
                </div>
              ))}
            </div>

            {/* Right Action */}
            <div className="md:col-span-3 text-center md:text-right space-y-3">
              <button
                onClick={() => setShowWriteModal(true)}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#FF2D8D] hover:bg-[#E61B78] text-white text-xs font-bold uppercase tracking-wider rounded-2xl transition-all shadow-md shadow-[#FF2D8D]/25 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
              >
                <Plus className="w-4 h-4" />
                <span>Write A Review</span>
              </button>
              <p className="text-[11px] text-[#7A5E70]">
                Verified buyer reviews help other women shop with confidence.
              </p>
            </div>

          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          
          {/* Rating filter pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setFilterRating('all')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                filterRating === 'all'
                  ? 'bg-[#FF2D8D] text-white shadow-md shadow-[#FF2D8D]/25'
                  : 'bg-white text-[#5E3F54] border border-[#F2D3E2] hover:bg-white'
              }`}
            >
              All Ratings
            </button>
            <button
              onClick={() => setFilterRating(5)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                filterRating === 5
                  ? 'bg-[#FF2D8D] text-white shadow-md shadow-[#FF2D8D]/25'
                  : 'bg-white text-[#5E3F54] border border-[#F2D3E2] hover:bg-white'
              }`}
            >
              <span>★ 5 Stars</span>
            </button>
            <button
              onClick={() => setFilterPhotosOnly(!filterPhotosOnly)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                filterPhotosOnly
                  ? 'bg-[#FF2D8D] text-white shadow-md shadow-[#FF2D8D]/25'
                  : 'bg-white text-[#5E3F54] border border-[#F2D3E2] hover:bg-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>With Photos</span>
            </button>
          </div>

          {/* Search reviews input */}
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FF2D8D]" />
            <input
              type="text"
              placeholder="Search reviews (e.g. saree, blouse)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#F2D3E2] rounded-2xl text-xs text-[#1E141D] placeholder:text-[#7A5E70]/70 focus:outline-none focus:border-[#FF2D8D] shadow-sm"
            />
          </div>

        </div>

        {/* Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((rev) => (
            <div 
              key={rev.id}
              className="bg-white rounded-3xl p-6 border border-[#F2D3E2] shadow-md flex flex-col justify-between space-y-4 hover:border-[#FF2D8D] hover:shadow-xl transition-all group"
            >
              <div className="space-y-3">
                {/* Rating & Date */}
                <div className="flex items-center justify-between">
                  <div className="flex text-[#FF2D8D] gap-0.5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#FF2D8D] text-[#FF2D8D]" />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#7A5E70]">{rev.date}</span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-sm text-[#1E141D] leading-snug group-hover:text-[#FF2D8D] transition-colors">
                  "{rev.title}"
                </h3>

                {/* Body */}
                <p className="text-xs text-[#5E3F54] leading-relaxed font-medium">
                  {rev.body}
                </p>

                {/* Product & Outfit badges */}
                <div className="pt-1 flex flex-wrap items-center gap-1.5 text-[11px]">
                  <span className="px-2.5 py-1 bg-white border border-[#F2D3E2] rounded-lg text-[#FF2D8D] font-semibold">
                    {rev.productName}
                  </span>
                  {rev.outfitWorn && (
                    <span className="px-2 py-0.5 bg-white text-[#5E3F54] rounded-lg border border-[#F2D3E2]">
                      👗 {rev.outfitWorn}
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Author & Verified Badge */}
              <div className="pt-4 border-t border-[#F2D3E2] flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-[#1E141D]">{rev.name}</div>
                  <div className="text-[10px] text-[#7A5E70]">{rev.location}</div>
                </div>

                {rev.verified && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>Verified Buyer</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Write a Review Modal Form */}
      {showWriteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#F2D3E2] shadow-2xl relative text-[#1E141D] animate-in zoom-in-95">
            
            {submittedSuccess ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-[#1E141D]">
                  Thank You For Your Review!
                </h3>
                <p className="text-xs text-[#5E3F54]">
                  Your review has been published.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#F2D3E2]">
                  <h3 className="text-xl font-bold text-[#1E141D]">
                    Share Your Experience
                  </h3>
                  <button 
                    type="button" 
                    onClick={() => setShowWriteModal(false)}
                    className="p-1 text-[#7A5E70] hover:text-[#1E141D] rounded-full bg-white border border-[#F2D3E2]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Rating selection */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1E141D] block">Overall Rating *</label>
                  <div className="flex gap-1 text-[#FF2D8D]">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setNewRating(s)}
                        className="p-1 cursor-pointer"
                      >
                        <Star className={`w-6 h-6 ${s <= newRating ? 'fill-[#FF2D8D]' : 'text-gray-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#1E141D] block">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sumaiya Islam"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#F2D3E2] rounded-xl text-[#1E141D] placeholder:text-[#7A5E70]/50 focus:outline-none focus:border-[#FF2D8D]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#1E141D] block">Location *</label>
                    <input
                      type="text"
                      placeholder="e.g. Banani, Dhaka"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#F2D3E2] rounded-xl text-[#1E141D] placeholder:text-[#7A5E70]/50 focus:outline-none focus:border-[#FF2D8D]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1E141D] block">Product Used</label>
                  <select
                    value={newProduct}
                    onChange={(e) => setNewProduct(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#F2D3E2] rounded-xl text-[#1E141D] focus:outline-none focus:border-[#FF2D8D]"
                  >
                    <option value="Bodybond Body Glue (20ml)">Bodybond Body Glue (20ml)</option>
                    <option value="Bodybond Seamless Nipple Covers (Sold Out)">Bodybond Seamless Nipple Covers (Sold Out)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1E141D] block">Review Headline *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Held firmly all evening!"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#F2D3E2] rounded-xl text-[#1E141D] placeholder:text-[#7A5E70]/50 focus:outline-none focus:border-[#FF2D8D]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1E141D] block">Review Comments *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Tell us what outfit you wore and how long it lasted..."
                    value={newBody}
                    onChange={(e) => setNewBody(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#F2D3E2] rounded-xl text-[#1E141D] placeholder:text-[#7A5E70]/50 focus:outline-none focus:border-[#FF2D8D]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#FF2D8D] hover:bg-[#E61B78] text-white text-xs font-bold uppercase tracking-wider rounded-2xl transition-all cursor-pointer shadow-md shadow-[#FF2D8D]/25"
                >
                  Submit Verified Review
                </button>
              </form>
            )}

          </div>
        </div>
      )}
    </div>
  );
};
