import React, { useState } from 'react';
import { 
  Tag, 
  Plus, 
  Trash2, 
  Check, 
  AlertCircle, 
  Percent, 
  ToggleLeft, 
  ToggleRight
} from 'lucide-react';
import { useOrders } from '../../context/OrderContext';

interface AdminCouponsTabProps {
  onShowNotification: (msg: string) => void;
  onShowError: (msg: string) => void;
}

export const AdminCouponsTab: React.FC<AdminCouponsTabProps> = ({ onShowNotification, onShowError }) => {
  const { coupons, addCoupon, toggleCouponStatus, deleteCoupon } = useOrders();
  const [deleteConfirmCouponId, setDeleteConfirmCouponId] = useState<string | null>(null);

  const [newCode, setNewCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number>(10);
  const [description, setDescription] = useState('');
  const [minSpendBDT, setMinSpendBDT] = useState<number>(0);

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = newCode.trim().toUpperCase();
    if (!cleanCode) {
      onShowError('Please enter a coupon code');
      return;
    }

    if (coupons.some(c => c.code.toUpperCase() === cleanCode)) {
      onShowError(`Coupon code "${cleanCode}" already exists!`);
      return;
    }

    addCoupon({
      code: cleanCode,
      discountPercent: Number(discountPercent),
      description: description.trim() || `${discountPercent}% Off Discount`,
      minSpendBDT: Number(minSpendBDT) || 0,
      isActive: true
    });

    onShowNotification(`Coupon code "${cleanCode}" created successfully!`);
    setNewCode('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      
      {/* Create New Coupon Form */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#181820] border border-[#2B2B38] space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#FF2D8D]/15 text-[#FF2D8D] flex items-center justify-center">
            <Plus className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-white">Create New Coupon / Promo Code</h3>
            <p className="text-xs text-gray-400">Offer percentage discounts to drive store conversions</p>
          </div>
        </div>

        <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-300 block">Coupon Code *</label>
            <input
              type="text"
              required
              placeholder="e.g. SAVE20, EID2026"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 bg-[#121217] border border-[#2E2E3C] focus:border-[#FF2D8D] rounded-xl text-xs text-white font-mono uppercase focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-300 block">Discount Percentage (%) *</label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="90"
                required
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#121217] border border-[#2E2E3C] focus:border-[#FF2D8D] rounded-xl text-xs text-white focus:outline-none pr-8"
              />
              <Percent className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-300 block">Min. Order Amount (৳ BDT)</label>
            <input
              type="number"
              min="0"
              placeholder="0 (No minimum)"
              value={minSpendBDT || ''}
              onChange={(e) => setMinSpendBDT(Number(e.target.value))}
              className="w-full px-3 py-2 bg-[#121217] border border-[#2E2E3C] focus:border-[#FF2D8D] rounded-xl text-xs text-white focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-bold text-gray-300 block">Short Description / Campaign Note</label>
            <input
              type="text"
              placeholder="e.g. Special festive 20% discount on all orders"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-[#121217] border border-[#2E2E3C] focus:border-[#FF2D8D] rounded-xl text-xs text-white focus:outline-none"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#FF2D8D] hover:bg-[#E0267B] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Coupon</span>
            </button>
          </div>

        </form>
      </div>

      {/* Coupons List Table / Cards */}
      <div className="space-y-3">
        <h4 className="text-xs font-extrabold uppercase tracking-widest text-gray-400">
          Active Store Coupons ({coupons.length})
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              className={`p-4 rounded-2xl border transition-all space-y-3 ${
                coupon.isActive 
                  ? 'bg-[#181820] border-[#2B2B38] hover:border-[#3E3E4F]' 
                  : 'bg-[#141418] border-[#22222A] opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-black text-[#FF2D8D] bg-[#FF2D8D]/10 px-2.5 py-1 rounded-lg border border-[#FF2D8D]/30">
                    {coupon.code}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    {coupon.discountPercent}% OFF
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Toggle Active / Inactive */}
                  <button
                    onClick={() => {
                      toggleCouponStatus(coupon.id);
                      onShowNotification(`Coupon ${coupon.code} is now ${coupon.isActive ? 'Inactive' : 'Active'}`);
                    }}
                    className={`text-xs font-bold flex items-center gap-1 px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                      coupon.isActive ? 'text-emerald-400 hover:bg-emerald-950/40' : 'text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {coupon.isActive ? <ToggleRight className="w-5 h-5 text-emerald-400" /> : <ToggleLeft className="w-5 h-5 text-gray-500" />}
                    <span>{coupon.isActive ? 'Active' : 'Disabled'}</span>
                  </button>

                  {deleteConfirmCouponId === coupon.id ? (
                    <div className="flex items-center gap-1.5 bg-rose-500/20 border border-rose-500/40 p-1 rounded-xl">
                      <span className="text-[11px] font-bold text-rose-300 pl-1">ডিলেট?</span>
                      <button
                        onClick={() => {
                          deleteCoupon(coupon.id);
                          setDeleteConfirmCouponId(null);
                          onShowNotification(`কুপন ${coupon.code} মুছে ফেলা হয়েছে!`);
                        }}
                        className="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-lg cursor-pointer"
                      >
                        হ্যাঁ
                      </button>
                      <button
                        onClick={() => setDeleteConfirmCouponId(null)}
                        className="px-2 py-0.5 bg-gray-800 text-gray-300 text-xs font-bold rounded-lg cursor-pointer"
                      >
                        না
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmCouponId(coupon.id)}
                      className="p-1.5 text-gray-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
                      title="Delete Coupon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-xs text-gray-300">{coupon.description}</p>

              <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-[#242430]">
                <span>Min spend: <strong className="text-white">{coupon.minSpendBDT ? `৳${coupon.minSpendBDT}` : 'No minimum'}</strong></span>
                <span>Used: <strong className="text-[#FF2D8D]">{coupon.usageCount || 0} times</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
