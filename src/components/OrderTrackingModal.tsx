import React, { useState, useEffect } from 'react';
import { 
  X, 
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
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { CustomerOrder, OrderStatus } from '../types/orders';
import { maskCustomerName, maskPhoneNumber, maskAddress } from '../utils/privacyUtils';

interface OrderTrackingModalProps {
  onNavigate?: (page: string, productId?: string) => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({ onNavigate }) => {
  const { 
    isTrackingModalOpen, 
    closeTrackingModal, 
    trackingOrder, 
    trackingQuery, 
    searchOrder,
    orders,
    announcement
  } = useOrders();

  const waPhone = announcement?.whatsappNumber?.replace(/[^0-9]/g, '') || '8801305273979';

  const [inputQuery, setInputQuery] = useState(trackingQuery || '');
  const [currentOrder, setCurrentOrder] = useState<CustomerOrder | null>(trackingOrder);
  const [searched, setSearched] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    const fetchInitialOrder = async () => {
      if (isTrackingModalOpen) {
        if (trackingOrder) {
          // Find latest updated copy of trackingOrder from orders list
          const updated = orders.find(o => o.id === trackingOrder.id) || trackingOrder;
          setCurrentOrder(updated);
          setInputQuery(updated.id);
          setSearched(true);
        } else if (trackingQuery) {
          setInputQuery(trackingQuery);
          const result = await searchOrder(trackingQuery);
          setCurrentOrder(result);
          setSearched(true);
        } else if (currentOrder) {
          const updated = orders.find(o => o.id === currentOrder.id);
          if (updated) setCurrentOrder(updated);
        } else {
          // Default to latest order if available or empty
          if (orders.length > 0 && !inputQuery) {
            setInputQuery(orders[0].id);
            setCurrentOrder(orders[0]);
          }
        }
      }
    };

    fetchInitialOrder();
  }, [isTrackingModalOpen, trackingOrder, trackingQuery, searchOrder, orders]);

  if (!isTrackingModalOpen) return null;

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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
        return { label: 'Order Received', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30', icon: Clock };
      case 'confirmed':
        return { label: 'Verified & Confirmed', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30', icon: CheckCircle2 };
      case 'processing':
        return { label: 'Packaging at Hub', bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30', icon: Package };
      case 'shipped':
        return { label: 'In Transit with Courier', bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30', icon: Truck };
      case 'out_for_delivery':
        return { label: 'Out for Delivery Today', bg: 'bg-[#FF2D8D]/15 text-[#FF2D8D] border-[#FF2D8D]/40', icon: Truck };
      case 'delivered':
        return { label: 'Delivered & Paid', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', icon: CheckCircle2 };
      case 'cancelled':
        return { label: 'Order Cancelled', bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30', icon: AlertCircle };
      default:
        return { label: 'Processing', bg: 'bg-gray-500/10 text-gray-400 border-gray-500/30', icon: Clock };
    }
  };

  const getStepProgress = (status: OrderStatus) => {
    switch (status) {
      case 'placed': return 1;
      case 'confirmed': return 2;
      case 'processing': return 3;
      case 'shipped': return 4;
      case 'out_for_delivery': return 5;
      case 'delivered': return 6;
      case 'cancelled': return 0;
      default: return 1;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-[#121212] text-white rounded-3xl max-w-2xl w-full shadow-2xl border border-[#2B2B2B] overflow-hidden relative max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#262626] flex items-center justify-between bg-[#181818] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#FF2D8D]/15 border border-[#FF2D8D]/30 flex items-center justify-center text-[#FF2D8D]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg tracking-wide text-white flex items-center gap-2">
                Live Order Tracker
                <span className="text-[10px] uppercase font-bold bg-[#FF2D8D] text-white px-2 py-0.5 rounded-full">
                  No Login Required
                </span>
              </h2>
              <p className="text-[11px] text-[#A0A0A0]">
                Track Cash on Delivery parcel status across Bangladesh in real-time
              </p>
            </div>
          </div>

          <button
            onClick={closeTrackingModal}
            className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close Tracking Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar Strip */}
        <div className="p-4 sm:p-5 bg-[#141414] border-b border-[#222222] flex-shrink-0">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Enter Order ID (e.g. BD-892415) or Phone Number"
                className="w-full pl-10 pr-4 py-3 bg-[#1C1C1C] border border-[#333333] rounded-xl text-xs sm:text-sm text-white placeholder:text-[#666666] focus:outline-none focus:border-[#FF2D8D] transition-colors"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              className="px-5 py-3 bg-[#FF2D8D] hover:bg-[#E02078] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
            >
              <span>Track</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {currentOrder ? (
            <div className="space-y-6">
              {/* Order Status Summary Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#1C1C1C] to-[#161616] border border-[#2B2B2B] relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#2A2A2A]">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-[#888888] uppercase font-bold">Order Reference</span>
                      <div className="flex items-center gap-1 bg-[#262626] px-2.5 py-1 rounded-lg border border-[#383838]">
                        <span className="font-mono font-extrabold text-sm text-[#FF2D8D]">{currentOrder.id}</span>
                        <button
                          onClick={() => handleCopyId(currentOrder.id)}
                          className="text-gray-400 hover:text-white p-0.5 cursor-pointer"
                          title="Copy Order ID"
                        >
                          {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Placed on {new Date(currentOrder.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  {/* Status Pill */}
                  {(() => {
                    const badge = getStatusBadge(currentOrder.status);
                    const Icon = badge.icon;
                    return (
                      <div className={`px-3.5 py-1.5 rounded-full border text-xs font-extrabold flex items-center gap-1.5 self-start sm:self-auto ${badge.bg}`}>
                        <Icon className="w-4 h-4" />
                        <span>{badge.label}</span>
                      </div>
                    );
                  })()}
                </div>

                {/* Courier & Delivery ETA Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                  <div className="bg-[#121212] p-3 rounded-xl border border-[#262626]">
                    <span className="text-[10px] font-bold text-[#888888] uppercase block">Delivery Estimate</span>
                    <span className="text-xs sm:text-sm font-extrabold text-white flex items-center gap-1.5 mt-0.5">
                      <Calendar className="w-4 h-4 text-[#FF2D8D]" />
                      {currentOrder.estimatedDeliveryDate}
                    </span>
                  </div>

                  <div className="bg-[#121212] p-3 rounded-xl border border-[#262626]">
                    <span className="text-[10px] font-bold text-[#888888] uppercase block">Delivery Partner</span>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-xs sm:text-sm font-extrabold text-white flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-emerald-400" />
                        {currentOrder.courierName || 'Steadfast Courier'}
                      </span>
                      {currentOrder.courierTrackingCode && (
                        <span className="font-mono text-[11px] text-[#A0A0A0] bg-[#1A1817] px-2 py-0.5 rounded border border-[#333333]">
                          {currentOrder.courierTrackingCode}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual Multi-Step Timeline Progress */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#181818] border border-[#262626] space-y-4">
                <h3 className="font-extrabold text-xs sm:text-sm uppercase tracking-wider text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF2D8D] animate-ping"></span>
                  Live Fulfillment Timeline
                </h3>

                {/* Stepper Timeline List */}
                <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#2B2B2B]">
                  {currentOrder.timeline.map((event, idx) => {
                    const isDone = event.completed;
                    const isLatest = isDone && (idx === currentOrder.timeline.filter(e => e.completed).length - 1);

                    return (
                      <div key={idx} className="relative group">
                        {/* Step Marker Icon */}
                        <div 
                          className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
                            isDone 
                              ? isLatest
                                ? 'bg-[#FF2D8D] border-[#FF2D8D] text-white shadow-lg shadow-[#FF2D8D]/30 scale-110'
                                : 'bg-emerald-500 border-emerald-500 text-white' 
                              : 'bg-[#222222] border-[#444444] text-gray-500'
                          }`}
                        >
                          {isDone ? <Check className="w-3 h-3 stroke-[3]" /> : idx + 1}
                        </div>

                        {/* Event Content */}
                        <div className={`space-y-0.5 ${isDone ? 'text-white' : 'text-gray-500'}`}>
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <h4 className={`text-xs sm:text-sm font-bold ${isLatest ? 'text-[#FF2D8D]' : ''}`}>
                              {event.title}
                            </h4>
                            <span className="text-[10px] text-[#888888] font-mono">
                              {event.timestamp}
                            </span>
                          </div>
                          <p className="text-xs text-[#999999] leading-relaxed">
                            {event.description}
                          </p>
                          {event.location && (
                            <div className="flex items-center gap-1 text-[10px] text-emerald-400 pt-0.5">
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

              {/* Order Package & Delivery Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Items Ordered */}
                <div className="p-4 rounded-2xl bg-[#181818] border border-[#262626] space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#A0A0A0]">
                    Items in this Parcel ({currentOrder.items.reduce((sum, i) => sum + i.quantity, 0)})
                  </h4>
                  <div className="space-y-2.5">
                    {currentOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-2 rounded-xl bg-[#121212] border border-[#222222]">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-lg object-cover bg-black flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white truncate">{item.name}</p>
                          <p className="text-[11px] text-[#888888]">
                            Qty: {item.quantity} × ৳{item.priceNZD}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-[#FF2D8D] flex-shrink-0">
                          ৳{item.quantity * item.priceNZD}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Payment Summary */}
                  <div className="pt-2 border-t border-[#262626] space-y-1 text-xs text-[#A0A0A0]">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="text-white">৳{currentOrder.subtotalBDT}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee:</span>
                      <span className="text-white">৳{currentOrder.deliveryFeeBDT}</span>
                    </div>
                    {currentOrder.discountBDT > 0 && (
                      <div className="flex justify-between text-emerald-400">
                        <span>Discount:</span>
                        <span>-৳{currentOrder.discountBDT}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-1 border-t border-[#262626] text-sm font-extrabold text-white">
                      <span>Total Payable (COD):</span>
                      <span className="text-[#FF2D8D]">৳{currentOrder.totalBDT}</span>
                    </div>
                  </div>
                </div>

                {/* Delivery Recipient Info */}
                <div className="p-4 rounded-2xl bg-[#181818] border border-[#262626] space-y-3 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-[#A0A0A0]">
                        Delivery Destination
                      </h4>
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold">
                        🔒 Privacy Protected
                      </span>
                    </div>
                    <div className="space-y-1 text-xs">
                      <p className="font-extrabold text-white text-sm">{maskCustomerName(currentOrder.customerName)}</p>
                      <p className="text-gray-300 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        {maskPhoneNumber(currentOrder.customerPhone)}
                      </p>
                      <p className="text-gray-400 flex items-start gap-1.5 pt-1">
                        <MapPin className="w-3.5 h-3.5 text-[#FF2D8D] flex-shrink-0 mt-0.5" />
                        <span>{maskAddress(currentOrder.address, currentOrder.city)}</span>
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#121212] border border-[#262626] text-xs text-[#888888] space-y-1">
                      <div className="flex items-center gap-1.5 text-white font-bold">
                        <ShieldCheck className="w-4 h-4 text-[#FF2D8D]" />
                        <span>Cash On Delivery Policy</span>
                      </div>
                      <p className="text-[11px] text-[#A0A0A0]">
                        Please keep exact cash ready upon delivery. You may inspect the outer package before paying.
                      </p>
                    </div>
                  </div>

                  {/* 1-Click WhatsApp Support */}
                  <a
                    href={`https://wa.me/${waPhone}?text=${encodeURIComponent(`Hello Bodybond Team! I would like to inquire about my order ID: ${currentOrder.id}.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 px-3 bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer mt-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Inquire About Order on WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          ) : searched ? (
            /* No Result State */
            <div className="py-12 px-4 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="font-extrabold text-base sm:text-lg text-white">Order Not Found</h3>
                <p className="text-xs text-[#888888]">
                  We couldn't find an order matching <strong className="text-white">"{inputQuery}"</strong>. Please check your Order ID (e.g. BD-892415) or contact support.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setInputQuery(orders[0]?.id || '');
                    if (orders[0]) {
                      setCurrentOrder(orders[0]);
                      setSearched(true);
                    }
                  }}
                  className="px-4 py-2 bg-[#222222] hover:bg-[#2A2A2A] text-white text-xs font-bold rounded-xl border border-[#333333] cursor-pointer"
                >
                  Try Sample Order
                </button>
                <a
                  href={`https://wa.me/${waPhone}?text=Hello%20Bodybond!%20I%20need%20help%20tracking%20my%20order.`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-[#25D366] hover:bg-[#20ba56] text-white text-xs font-bold rounded-xl shadow cursor-pointer flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Support on WhatsApp</span>
                </a>
              </div>
            </div>
          ) : (
            /* Initial Empty State */
            <div className="py-10 text-center space-y-3">
              <Package className="w-12 h-12 text-[#FF2D8D] mx-auto opacity-70" />
              <p className="text-xs text-gray-400">
                Enter your Order ID (e.g. BD-892415) or mobile number to track delivery.
              </p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 sm:p-4 bg-[#141414] border-t border-[#222222] flex items-center justify-between text-xs text-[#777777] flex-shrink-0">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            100% Genuine Bodybond Security
          </span>
          <button
            onClick={closeTrackingModal}
            className="text-gray-300 hover:text-white font-bold text-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
