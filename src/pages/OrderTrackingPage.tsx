import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  AlertCircle, 
  MessageCircle, 
  ShieldCheck, 
  Calendar, 
  ChevronRight,
  Copy,
  Check,
  ArrowLeft
} from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { CustomerOrder, OrderStatus } from '../types/orders';
import { maskCustomerName, maskPhoneNumber, maskAddress } from '../utils/privacyUtils';

interface OrderTrackingPageProps {
  onNavigate: (page: string, productId?: string) => void;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({ onNavigate }) => {
  const { orders, searchOrder, announcement } = useOrders();
  const [inputQuery, setInputQuery] = useState('');
  const [currentOrder, setCurrentOrder] = useState<CustomerOrder | null>(orders[0] || null);
  const [searched, setSearched] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const phone = announcement?.whatsappNumber?.replace(/[^0-9]/g, '') || '8801305273979';

  useEffect(() => {
    if (orders.length > 0) {
      if (!inputQuery) {
        setInputQuery(orders[0].id);
        setCurrentOrder(orders[0]);
      } else if (currentOrder) {
        const updated = orders.find(o => o.id === currentOrder.id);
        if (updated) setCurrentOrder(updated);
      }
    }
  }, [orders]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const result = await searchOrder(inputQuery);
    setCurrentOrder(result);
    setSearched(true);
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'placed':
        return { label: 'Order Received', bg: 'bg-amber-50 text-amber-800 border-amber-200', icon: Clock };
      case 'confirmed':
        return { label: 'Verified & Confirmed', bg: 'bg-blue-50 text-blue-800 border-blue-200', icon: CheckCircle2 };
      case 'processing':
        return { label: 'Packaging at Hub', bg: 'bg-purple-50 text-purple-800 border-purple-200', icon: Package };
      case 'shipped':
        return { label: 'In Transit with Courier', bg: 'bg-indigo-50 text-indigo-800 border-indigo-200', icon: Truck };
      case 'out_for_delivery':
        return { label: 'Out for Delivery Today', bg: 'bg-white text-[#FF2D8D] border-[#F2D3E2]', icon: Truck };
      case 'delivered':
        return { label: 'Delivered & Paid', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', icon: CheckCircle2 };
      case 'cancelled':
        return { label: 'Order Cancelled', bg: 'bg-rose-50 text-rose-800 border-rose-200', icon: AlertCircle };
      default:
        return { label: 'Processing', bg: 'bg-gray-50 text-gray-800 border-gray-200', icon: Clock };
    }
  };

  return (
    <div className="bg-white min-h-[85vh] py-8 sm:py-16 px-4 sm:px-6 lg:px-8 text-[#1E141D]">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Back Link & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-xs font-bold text-[#5E3F54] hover:text-[#1E141D] transition-colors cursor-pointer self-start"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <span className="px-3.5 py-1.5 bg-white text-[#FF2D8D] font-black text-xs uppercase tracking-wider rounded-full border border-[#F2D3E2] self-start sm:self-auto shadow-sm">
            ⚡ Live Courier Tracking • No Login Required
          </span>
        </div>

        {/* Hero Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1E141D] tracking-tight">
            Track Your <span className="text-[#FF2D8D]">BODYBOND</span> Parcel
          </h1>
          <p className="text-xs sm:text-sm text-[#5E3F54] max-w-lg mx-auto font-medium">
            Enter your Order ID (e.g. BD-892415) or the phone number used during Cash on Delivery checkout.
          </p>
        </div>

        {/* Tracking Search Card */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-md border border-[#F2D3E2]">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Enter Order ID (e.g. BD-892415) or Phone Number"
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-[#F2D3E2] rounded-2xl text-xs sm:text-sm font-medium text-[#1E141D] placeholder:text-[#7A5E70]/50 focus:outline-none focus:border-[#FF2D8D] transition-all"
              />
              <Search className="w-5 h-5 text-[#FF2D8D] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            <button
              type="submit"
              className="px-7 py-3.5 bg-[#FF2D8D] hover:bg-[#E61B78] text-white font-black text-xs sm:text-sm rounded-2xl shadow-md shadow-[#FF2D8D]/25 transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
            >
              <span>Track Parcel</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Tracking Details View */}
        {currentOrder ? (
          <div className="space-y-6">
            {/* Status & ETA Card */}
            <div className="bg-white text-[#1E141D] rounded-3xl p-5 sm:p-8 shadow-md border border-[#F2D3E2] relative overflow-hidden space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#F2D3E2]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-xs text-[#5E3F54] uppercase font-bold tracking-wider">Order ID</span>
                    <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-xl border border-[#F2D3E2]">
                      <span className="font-mono font-black text-sm sm:text-base text-[#FF2D8D]">{currentOrder.id}</span>
                      <button
                        onClick={() => handleCopyId(currentOrder.id)}
                        className="text-[#7A5E70] hover:text-[#1E141D] p-0.5 cursor-pointer"
                        title="Copy Order ID"
                      >
                        {copiedId ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-[#5E3F54]">
                    Placed: {new Date(currentOrder.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {/* Status Badge */}
                {(() => {
                  const badge = getStatusBadge(currentOrder.status);
                  const Icon = badge.icon;
                  return (
                    <div className={`px-4 py-2 rounded-full border text-xs sm:text-sm font-black flex items-center gap-2 self-start sm:self-auto ${badge.bg}`}>
                      <Icon className="w-4 h-4" />
                      <span>{badge.label}</span>
                    </div>
                  );
                })()}
              </div>

              {/* Delivery Partner & ETA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-white p-4 rounded-2xl border border-[#F2D3E2] space-y-1">
                  <span className="text-[11px] font-bold text-[#5E3F54] uppercase tracking-wider block">Estimated Delivery</span>
                  <p className="text-xs sm:text-sm font-black text-[#1E141D] flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#FF2D8D]" />
                    {currentOrder.estimatedDeliveryDate}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-[#F2D3E2] space-y-1">
                  <span className="text-[11px] font-bold text-[#5E3F54] uppercase tracking-wider block">Courier Partner</span>
                  <div className="flex items-center justify-between">
                    <p className="text-xs sm:text-sm font-black text-[#1E141D] flex items-center gap-2">
                      <Truck className="w-4 h-4 text-emerald-600" />
                      {currentOrder.courierName || 'Steadfast Courier'}
                    </p>
                    {currentOrder.courierTrackingCode && (
                      <span className="font-mono text-xs text-[#1E141D] bg-white px-2.5 py-1 rounded-lg border border-[#F2D3E2]">
                        {currentOrder.courierTrackingCode}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="pt-2 space-y-4">
                <h3 className="font-black text-xs uppercase tracking-widest text-[#FF2D8D]">
                  Live Tracking Milestones
                </h3>

                <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#F2D3E2]">
                  {currentOrder.timeline.map((event, idx) => {
                    const isDone = event.completed;
                    const isLatest = isDone && (idx === currentOrder.timeline.filter(e => e.completed).length - 1);

                    return (
                      <div key={idx} className="relative group">
                        <div 
                          className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
                            isDone 
                              ? isLatest
                                ? 'bg-[#FF2D8D] border-[#FF2D8D] text-white shadow-md shadow-[#FF2D8D]/30 scale-110'
                                : 'bg-emerald-500 border-emerald-500 text-white' 
                              : 'bg-white border-[#F2D3E2] text-[#7A5E70]'
                          }`}
                        >
                          {isDone ? <Check className="w-3 h-3 stroke-[3]" /> : idx + 1}
                        </div>

                        <div className={`space-y-0.5 ${isDone ? 'text-[#1E141D]' : 'text-[#7A5E70]'}`}>
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <h4 className={`text-xs sm:text-sm font-bold ${isLatest ? 'text-[#FF2D8D]' : ''}`}>
                              {event.title}
                            </h4>
                            <span className="text-[11px] text-[#5E3F54] font-mono">
                              {event.timestamp}
                            </span>
                          </div>
                          <p className="text-xs text-[#5E3F54] leading-relaxed font-medium">
                            {event.description}
                          </p>
                          {event.location && (
                            <div className="flex items-center gap-1 text-[11px] text-emerald-700 pt-0.5">
                              <MapPin className="w-3 h-3" />
                              <span>{event.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Parcel Details & Customer Support Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Items Card */}
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#F2D3E2] shadow-md space-y-4">
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#1E141D]">
                  Items in Parcel ({currentOrder.items.reduce((s, i) => s + i.quantity, 0)})
                </h3>
                <div className="space-y-2.5">
                  {currentOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2.5 rounded-2xl bg-white border border-[#F2D3E2]">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover bg-white flex-shrink-0 border border-[#F2D3E2]"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-[#1E141D] truncate">{item.name}</p>
                        <p className="text-xs text-[#5E3F54]">
                          Qty: {item.quantity} × ৳{item.priceNZD}
                        </p>
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-[#FF2D8D]">
                        ৳{item.quantity * item.priceNZD}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-[#F2D3E2] space-y-1.5 text-xs text-[#5E3F54]">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="text-[#1E141D] font-semibold">৳{currentOrder.subtotalBDT}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee:</span>
                    <span className="text-[#1E141D] font-semibold">৳{currentOrder.deliveryFeeBDT}</span>
                  </div>
                  {currentOrder.discountBDT > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Discount:</span>
                      <span>-৳{currentOrder.discountBDT}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-[#F2D3E2] text-sm font-black text-[#1E141D]">
                    <span>Total Cash On Delivery:</span>
                    <span className="text-[#FF2D8D] text-base font-black">৳{currentOrder.totalBDT}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Location & Support */}
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#F2D3E2] shadow-md space-y-4 flex flex-col justify-between">
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#1E141D]">
                      Destination & Recipient
                    </h3>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                      🔒 Privacy Protected
                    </span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white border border-[#F2D3E2] space-y-1.5 text-xs">
                    <p className="font-black text-sm text-[#1E141D]">{maskCustomerName(currentOrder.customerName)}</p>
                    <p className="text-[#5E3F54] flex items-center gap-2 font-medium">
                      <Phone className="w-3.5 h-3.5 text-[#7A5E70]" />
                      {maskPhoneNumber(currentOrder.customerPhone)}
                    </p>
                    <p className="text-[#5E3F54] flex items-start gap-2 pt-0.5 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#FF2D8D] flex-shrink-0 mt-0.5" />
                      <span>{maskAddress(currentOrder.address, currentOrder.city)}</span>
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-[#F2D3E2] text-xs text-[#5E3F54] space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-[#1E141D]">
                      <ShieldCheck className="w-4 h-4 text-[#FF2D8D]" />
                      <span>Cash On Delivery Handover</span>
                    </div>
                    <p className="text-[11px] text-[#5E3F54] leading-relaxed font-medium">
                      Our rider will call prior to delivery. Please ensure exact cash (৳{currentOrder.totalBDT}) is ready.
                    </p>
                  </div>
                </div>

                <a
                  href={`https://wa.me/${phone}?text=${encodeURIComponent(`Hello Bodybond Support! I am inquiring regarding my order ID: ${currentOrder.id}.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20ba56] text-white font-black text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 transition-all cursor-pointer min-h-[44px]"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Support for this Order</span>
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-10 text-center border border-[#F2D3E2] space-y-4 shadow-md">
            <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto text-rose-500">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="font-black text-base text-[#1E141D]">Order Not Found</h3>
              <p className="text-xs text-[#5E3F54] font-medium">
                We could not find an active order for "{inputQuery}". Please check your Order ID or contact support.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

