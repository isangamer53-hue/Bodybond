import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Phone, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  XCircle, 
  Trash2, 
  MessageCircle, 
  Copy, 
  Check, 
  Save,
  Eye,
  EyeOff,
  Shield
} from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { CustomerOrder, OrderStatus } from '../../types/orders';
import { maskCustomerName, maskPhoneNumber, maskAddress } from '../../utils/privacyUtils';

interface AdminOrdersTabProps {
  onShowNotification: (msg: string) => void;
  onShowError: (msg: string) => void;
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; border: string }> = {
  placed: { label: 'Pending Verification', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  confirmed: { label: 'Confirmed', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  processing: { label: 'Packaging', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  shipped: { label: 'In Courier / Shipped', color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/30' },
  out_for_delivery: { label: 'Out For Delivery', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
  delivered: { label: 'Delivered (Paid)', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  cancelled: { label: 'Cancelled', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30' }
};

export const AdminOrdersTab: React.FC<AdminOrdersTabProps> = ({ onShowNotification, onShowError }) => {
  const { orders, updateOrderStatus, deleteOrder } = useOrders();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isPrivacyMasked, setIsPrivacyMasked] = useState<boolean>(false);
  const [deleteConfirmOrderId, setDeleteConfirmOrderId] = useState<string | null>(null);

  // Per-order editing states for courier code & notes
  const [editingCourier, setEditingCourier] = useState<{ [orderId: string]: { name: string; code: string; notes: string } }>({});

  // Copy order ID helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    onShowNotification(`Order ID ${text} copied to clipboard!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter orders
  const filteredOrders = orders.filter(ord => {
    const matchesSearch = 
      ord.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerPhone.includes(searchQuery) ||
      ord.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ord.courierTrackingCode && ord.courierTrackingCode.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || ord.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalOrders = orders.length;
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((acc, curr) => acc + (curr.totalBDT || 0), 0);
  const pendingCount = orders.filter(o => o.status === 'placed').length;
  const inTransitCount = orders.filter(o => o.status === 'shipped' || o.status === 'processing' || o.status === 'out_for_delivery').length;
  const deliveredCount = orders.filter(o => o.status === 'delivered').length;

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    const currentOrd = orders.find(o => o.id === orderId);
    if (!currentOrd) return;
    
    const courierData = editingCourier[orderId] || {
      name: currentOrd.courierName || 'Steadfast Courier',
      code: currentOrd.courierTrackingCode || '',
      notes: currentOrd.adminNotes || ''
    };

    updateOrderStatus(orderId, newStatus, courierData.name, courierData.code, courierData.notes);
    onShowNotification(`Order ${orderId} status changed to ${STATUS_CONFIG[newStatus]?.label || newStatus}`);
  };

  const handleSaveCourier = (orderId: string) => {
    const currentOrd = orders.find(o => o.id === orderId);
    if (!currentOrd) return;

    const data = editingCourier[orderId];
    if (!data) return;

    updateOrderStatus(orderId, currentOrd.status, data.name, data.code, data.notes);
    onShowNotification(`Courier details saved for ${orderId}`);
  };

  const handleDelete = (orderId: string) => {
    deleteOrder(orderId);
    setDeleteConfirmOrderId(null);
    onShowNotification(`অর্ডার ${orderId} মুছে ফেলা হয়েছে!`);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3">
        <div className="p-3 sm:p-4 rounded-2xl bg-[#181820] border border-[#2B2B38] space-y-1">
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
            <span>Total Orders</span>
            <Package className="w-4 h-4 text-[#FF2D8D]" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-white">{totalOrders}</p>
          <p className="text-[10px] text-gray-500">All recorded orders</p>
        </div>

        <div className="p-3 sm:p-4 rounded-2xl bg-[#181820] border border-[#2B2B38] space-y-1">
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
            <span>Total Sales</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-emerald-400">৳{totalRevenue.toLocaleString()}</p>
          <p className="text-[10px] text-gray-500">Confirmed & Delivered</p>
        </div>

        <div className="p-3 sm:p-4 rounded-2xl bg-[#181820] border border-[#2B2B38] space-y-1">
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
            <span>Pending Call</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-amber-400">{pendingCount}</p>
          <p className="text-[10px] text-gray-500">Requires verification</p>
        </div>

        <div className="p-3 sm:p-4 rounded-2xl bg-[#181820] border border-[#2B2B38] space-y-1">
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
            <span>In Transit</span>
            <Truck className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-indigo-400">{inTransitCount}</p>
          <p className="text-[10px] text-gray-500">With courier partner</p>
        </div>

        <div className="col-span-2 sm:col-span-1 p-3 sm:p-4 rounded-2xl bg-[#181820] border border-[#2B2B38] space-y-1">
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
            <span>Delivered</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-white">{deliveredCount}</p>
          <p className="text-[10px] text-gray-500">Completed shipments</p>
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="p-4 rounded-2xl bg-[#181820] border border-[#2B2B38] space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Order ID (e.g. BD-892415), Customer Name, Phone, or City..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#121217] border border-[#2E2E3C] focus:border-[#FF2D8D] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <XCircle className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Privacy Mask Toggle Button */}
          <button
            onClick={() => {
              setIsPrivacyMasked(!isPrivacyMasked);
              onShowNotification(isPrivacyMasked ? 'Privacy mask turned OFF' : 'Privacy mask turned ON (Customer IDs & info masked)');
            }}
            className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
              isPrivacyMasked
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                : 'bg-[#121217] text-gray-400 hover:text-white border-[#2E2E3C]'
            }`}
            title="Toggle customer details privacy mask"
          >
            {isPrivacyMasked ? <EyeOff className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4" />}
            <span>{isPrivacyMasked ? 'Masked (Privacy Mode)' : 'Hide IDs / Mask Info'}</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {['all', 'placed', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#FF2D8D] text-white shadow-md'
                  : 'bg-[#121217] text-gray-400 hover:text-white border border-[#2E2E3C]'
              }`}
            >
              {st === 'all' ? `All (${orders.length})` : st === 'placed' ? 'Pending' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-[#181820] border border-[#2B2B38] rounded-2xl space-y-3">
            <Package className="w-10 h-10 mx-auto text-gray-600" />
            <p className="text-sm font-bold text-gray-300">No orders match your filter</p>
            <p className="text-xs text-gray-500">Try searching with a different term or clear filters.</p>
          </div>
        ) : (
          filteredOrders.map((ord) => {
            const statusStyle = STATUS_CONFIG[ord.status] || STATUS_CONFIG.placed;
            const courierState = editingCourier[ord.id] || {
              name: ord.courierName || 'Steadfast Courier',
              code: ord.courierTrackingCode || '',
              notes: ord.adminNotes || ''
            };

            // Clean phone for WhatsApp / Direct call
            const cleanPhone = ord.customerPhone.replace(/[^0-9]/g, '');
            const waPhone = cleanPhone.startsWith('880') ? cleanPhone : cleanPhone.startsWith('0') ? `88${cleanPhone}` : `880${cleanPhone}`;
            const waMessage = encodeURIComponent(
              `Hello ${ord.customerName}! This is BODYBOND Bangladesh regarding your order ${ord.id} (Amount: ৳${ord.totalBDT}, Cash on Delivery). We are ready to dispatch your parcel. Is your address: ${ord.address}, ${ord.city} correct?`
            );

            const displayId = isPrivacyMasked ? `${ord.id.slice(0, 4)}****` : ord.id;
            const displayName = isPrivacyMasked ? maskCustomerName(ord.customerName) : ord.customerName;
            const displayPhone = isPrivacyMasked ? maskPhoneNumber(ord.customerPhone) : ord.customerPhone;
            const displayAddress = isPrivacyMasked ? maskAddress(ord.address, ord.city) : ord.address;

            return (
              <div
                key={ord.id}
                className="p-4 sm:p-5 rounded-2xl bg-[#181820] border border-[#2B2B38] space-y-4 hover:border-[#3D3D4E] transition-all"
              >
                {/* Order Top Strip */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-[#262632]">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono text-sm font-black text-[#FF2D8D] bg-[#FF2D8D]/10 px-2.5 py-1 rounded-lg border border-[#FF2D8D]/20 flex items-center gap-1.5">
                      {displayId}
                      <button
                        onClick={() => handleCopy(ord.id, ord.id)}
                        className="text-gray-400 hover:text-white"
                        title="Copy Order ID"
                      >
                        {copiedId === ord.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </span>

                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(ord.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    </span>

                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#141419] border border-[#333342] text-gray-300">
                      {ord.zone === 'inside_dhaka' ? '📍 Inside Dhaka (৳60)' : '🚚 Outside Dhaka (৳120)'}
                    </span>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <select
                      value={ord.status}
                      onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider border cursor-pointer focus:outline-none transition-all ${statusStyle.bg} ${statusStyle.color} ${statusStyle.border}`}
                    >
                      <option value="placed" className="bg-[#181820] text-amber-400">⏳ Pending Call / Placed</option>
                      <option value="confirmed" className="bg-[#181820] text-blue-400">✓ Confirmed</option>
                      <option value="processing" className="bg-[#181820] text-purple-400">📦 Packaging</option>
                      <option value="shipped" className="bg-[#181820] text-indigo-400">🚚 In Courier / Shipped</option>
                      <option value="out_for_delivery" className="bg-[#181820] text-cyan-400">🛵 Out For Delivery</option>
                      <option value="delivered" className="bg-[#181820] text-emerald-400">🎉 Delivered (Paid)</option>
                      <option value="cancelled" className="bg-[#181820] text-rose-400">✖ Cancelled</option>
                    </select>

                    {deleteConfirmOrderId === ord.id ? (
                      <div className="flex items-center gap-1.5 bg-rose-500/20 border border-rose-500/40 p-1 rounded-xl">
                        <span className="text-[11px] font-bold text-rose-300 pl-1">ডিলেট?</span>
                        <button
                          onClick={() => handleDelete(ord.id)}
                          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-black text-xs rounded-lg cursor-pointer shadow transition-all"
                        >
                          হ্যাঁ
                        </button>
                        <button
                          onClick={() => setDeleteConfirmOrderId(null)}
                          className="px-2 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-xs rounded-lg cursor-pointer"
                        >
                          না
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmOrderId(ord.id)}
                        className="p-2 text-gray-400 hover:text-rose-400 bg-[#121217] hover:bg-rose-950/30 border border-[#2E2E3C] hover:border-rose-500/40 rounded-xl transition-all cursor-pointer active:scale-95"
                        title="অর্ডার ডিলেট করুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Customer Details & Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  
                  {/* Column 1: Customer Contact & Direct Actions */}
                  <div className="space-y-2 p-3 rounded-xl bg-[#131318] border border-[#242430]">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 block">
                      Customer Contact
                    </span>
                    <div className="space-y-1">
                      <p className="font-extrabold text-white text-sm">{displayName}</p>
                      <p className="text-gray-300 font-mono flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#FF2D8D]" />
                        {displayPhone}
                      </p>
                    </div>

                    {/* Quick Call & WhatsApp Action Buttons */}
                    <div className="flex items-center gap-2 pt-1.5">
                      <a
                        href={`tel:${ord.customerPhone}`}
                        className="flex-1 py-1.5 px-2 bg-[#2B2B38] hover:bg-[#3D3D4E] text-white rounded-lg text-center font-bold flex items-center justify-center gap-1 transition-colors"
                      >
                        <Phone className="w-3 h-3 text-emerald-400" />
                        <span>Call</span>
                      </a>
                      <a
                        href={`https://wa.me/${waPhone}?text=${waMessage}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-1.5 px-2 bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] rounded-lg text-center font-bold flex items-center justify-center gap-1 transition-colors"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  {/* Column 2: Destination Address */}
                  <div className="space-y-2 p-3 rounded-xl bg-[#131318] border border-[#242430]">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 block">
                      Delivery Destination
                    </span>
                    <div className="space-y-1">
                      <p className="text-gray-200 leading-relaxed flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#FF2D8D] flex-shrink-0 mt-0.5" />
                        <span>{displayAddress}</span>
                      </p>
                      <p className="text-gray-400 font-semibold pl-5">
                        City: <strong className="text-white">{ord.city}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Column 3: Items Ordered & Payable */}
                  <div className="space-y-2 p-3 rounded-xl bg-[#131318] border border-[#242430]">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 block">
                      Payable Summary (COD)
                    </span>
                    <div className="space-y-1">
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-gray-300">
                          <span className="truncate max-w-[150px]">{item.name} {item.selectedSize ? `(${item.selectedSize})` : ''} x{item.quantity}</span>
                          <span className="font-semibold text-white">৳{(item.priceNZD * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="border-t border-[#262632] pt-1.5 mt-1.5 space-y-0.5 text-[11px]">
                        <div className="flex justify-between text-gray-400">
                          <span>Delivery Fee:</span>
                          <span>৳{ord.deliveryFeeBDT}</span>
                        </div>
                        {ord.discountBDT > 0 && (
                          <div className="flex justify-between text-emerald-400">
                            <span>Discount:</span>
                            <span>-৳{ord.discountBDT}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-white font-extrabold text-sm pt-0.5">
                          <span>Total Payable:</span>
                          <span className="text-[#FF2D8D]">৳{ord.totalBDT.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Courier Assignment & Admin Tracking Info */}
                <div className="p-3 rounded-xl bg-[#16161D] border border-[#2A2A38] flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 text-xs">
                  <div className="flex items-center gap-1.5 text-gray-400 flex-shrink-0 font-bold">
                    <Truck className="w-3.5 h-3.5 text-[#FF2D8D]" />
                    <span>Courier Info:</span>
                  </div>

                  <input
                    type="text"
                    placeholder="Courier Partner (e.g. Steadfast, Pathao, RedX)"
                    value={courierState.name}
                    onChange={(e) => {
                      setEditingCourier(prev => ({
                        ...prev,
                        [ord.id]: {
                          ...courierState,
                          name: e.target.value
                        }
                      }));
                    }}
                    className="px-3 py-1.5 bg-[#121217] border border-[#2E2E3C] focus:border-[#FF2D8D] rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none flex-1"
                  />

                  <input
                    type="text"
                    placeholder="Consignment / Tracking Code (e.g. ST-782910)"
                    value={courierState.code}
                    onChange={(e) => {
                      setEditingCourier(prev => ({
                        ...prev,
                        [ord.id]: {
                          ...courierState,
                          code: e.target.value
                        }
                      }));
                    }}
                    className="px-3 py-1.5 bg-[#121217] border border-[#2E2E3C] focus:border-[#FF2D8D] rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none flex-1 font-mono"
                  />

                  <button
                    onClick={() => handleSaveCourier(ord.id)}
                    className="py-1.5 px-3 bg-[#FF2D8D] hover:bg-[#E0267B] text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer flex-shrink-0"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Courier</span>
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
