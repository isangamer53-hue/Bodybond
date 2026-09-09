import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  collection, 
  onSnapshot, 
  doc, 
  query,
  orderBy,
  limit,
  getDoc,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  isFirestoreQuotaExceeded,
  setFirestoreQuotaExceeded,
  checkAndHandleFirestoreError,
  safeSetDoc,
  safeDeleteDoc
} from '../utils/firestoreGuard';
import { 
  CustomerOrder, 
  OrderStatus, 
  OrderTimelineEvent, 
  CouponCode, 
  AnnouncementConfig,
  LiveBuyerActivity 
} from '../types/orders';
import { CartItem } from '../types';
import { INITIAL_ORDERS, INITIAL_COUPONS, INITIAL_ANNOUNCEMENT } from '../data/initialOrders';
import { maskCustomerName } from '../utils/privacyUtils';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, _operationType: OperationType, _path: string | null, setQuotaExceeded?: (val: boolean) => void) {
  const isExhausted = checkAndHandleFirestoreError(error);
  if (isExhausted) {
    if (setQuotaExceeded) setQuotaExceeded(true);
    setFirestoreQuotaExceeded(true);
    console.warn('Firestore quota reached or write stream backed off. Switched to offline/local storage safely.');
    return;
  }
  const message = error instanceof Error ? error.message : String(error);
  console.warn('Firestore Operation Notice: ', message);
}

export function sanitizeFirestoreObject<T>(data: T): T {
  if (data === null || data === undefined) return data;
  if (Array.isArray(data)) {
    return data.map(item => (typeof item === 'object' && item !== null ? sanitizeFirestoreObject(item) : item)) as unknown as T;
  }
  if (typeof data === 'object') {
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        result[key] = (typeof value === 'object' && value !== null && !(value instanceof Date))
          ? sanitizeFirestoreObject(value)
          : value;
      }
    }
    return result as T;
  }
  return data;
}

const ORDERS_STORAGE_KEY = 'bodybond_orders_v2';
const COUPONS_STORAGE_KEY = 'bodybond_coupons_v2';
const ANNOUNCEMENT_STORAGE_KEY = 'bodybond_announcement_v2';

interface CreateOrderParams {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address: string;
  city: string;
  zone: 'inside_dhaka' | 'outside_dhaka';
  items: CartItem[];
  subtotalBDT: number;
  deliveryFeeBDT: number;
  discountBDT: number;
  totalBDT: number;
  paymentMethod?: 'Cash on Delivery' | 'bKash / Nagad' | 'Online Card';
  adminNotes?: string;
}

interface OrderContextType {
  orders: CustomerOrder[];
  isTrackingModalOpen: boolean;
  trackingOrder: CustomerOrder | null;
  trackingQuery: string;
  openTrackingModal: (orderIdOrPhone?: string) => void;
  closeTrackingModal: () => void;
  searchOrder: (query: string) => Promise<CustomerOrder | null>;
  createOrder: (params: CreateOrderParams) => CustomerOrder;
  updateOrderStatus: (
    orderId: string, 
    newStatus: OrderStatus, 
    courierName?: string, 
    courierCode?: string, 
    notes?: string
  ) => void;
  deleteOrder: (orderId: string) => void;
  coupons: CouponCode[];
  addCoupon: (coupon: Omit<CouponCode, 'id' | 'usageCount'>) => void;
  toggleCouponStatus: (id: string) => void;
  deleteCoupon: (id: string) => void;
  validateCoupon: (code: string, currentTotalBDT: number) => { valid: boolean; discountBDT: number; message: string };
  announcement: AnnouncementConfig;
  updateAnnouncement: (config: Partial<AnnouncementConfig>) => void;
  recentBuyerActivities: LiveBuyerActivity[];
  lastCreatedOrder: CustomerOrder | null;
  isQuotaExceeded: boolean;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Orders state
  const [orders, setOrders] = useState<CustomerOrder[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY) || localStorage.getItem('bodibond_orders_v2');
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Error loading stored orders:', e);
    }
    return INITIAL_ORDERS;
  });

  // 2. Coupons state
  const [coupons, setCoupons] = useState<CouponCode[]>(() => {
    try {
      const saved = localStorage.getItem(COUPONS_STORAGE_KEY) || localStorage.getItem('bodibond_coupons_v2');
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Error loading stored coupons:', e);
    }
    return INITIAL_COUPONS;
  });

  // 3. Announcement & Global Store settings
  const [announcement, setAnnouncement] = useState<AnnouncementConfig>(() => {
    try {
      const saved = localStorage.getItem(ANNOUNCEMENT_STORAGE_KEY) || localStorage.getItem('bodibond_announcement_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.whatsappNumber === '8801700000000' || parsed.whatsappNumber === '+8801700000000' || !parsed.whatsappNumber) {
          parsed.whatsappNumber = '8801305273979';
          parsed.emergencySupportPhone = '+880 1305-273979';
        }
        return parsed;
      }
    } catch (e) {
      console.error('Error loading announcement:', e);
    }
    return INITIAL_ANNOUNCEMENT;
  });

  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState<boolean>(false);
  const [trackingOrder, setTrackingOrder] = useState<CustomerOrder | null>(null);
  const [trackingQuery, setTrackingQuery] = useState<string>('');
  const [lastCreatedOrder, setLastCreatedOrder] = useState<CustomerOrder | null>(null);
  const [isQuotaExceeded, setIsQuotaExceeded] = useState<boolean>(() => isFirestoreQuotaExceeded());

  // Listen to global firestore quota status events
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && typeof detail.exceeded === 'boolean') {
        setIsQuotaExceeded(detail.exceeded);
      }
    };
    window.addEventListener('firestore-quota-status', handler);
    return () => window.removeEventListener('firestore-quota-status', handler);
  }, []);

  // Persist Orders & Firestore Real-Time Listener (Optimized: Last 100 orders only)
  useEffect(() => {
    if (isQuotaExceeded) return;

    const path = 'orders';
    const q = query(
      collection(db, path), 
      orderBy('createdAt', 'desc'), 
      limit(100)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const firestoreOrders: CustomerOrder[] = [];
        snapshot.forEach((docSnap) => {
          firestoreOrders.push(docSnap.data() as CustomerOrder);
        });
        // Snapshot is already ordered by query, but we ensure it's correct
        setOrders(firestoreOrders);
        try {
          localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(firestoreOrders));
        } catch (e) {
          console.error('Error saving firestore orders to localStorage:', e);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path, setIsQuotaExceeded);
      }
    );

    return () => unsubscribe();
  }, [isQuotaExceeded]);

  // Persist Coupons
  useEffect(() => {
    try {
      localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(coupons));
    } catch (e) {
      console.error('Error saving coupons:', e);
    }
  }, [coupons]);

  // Persist Announcement to localStorage & Listen to Firestore 'settings/announcement'
  useEffect(() => {
    try {
      localStorage.setItem(ANNOUNCEMENT_STORAGE_KEY, JSON.stringify(announcement));
    } catch (e) {
      console.error('Error saving announcement:', e);
    }
  }, [announcement]);

  useEffect(() => {
    if (isQuotaExceeded) return;

    const unsub = onSnapshot(
      doc(db, 'settings', 'announcement'),
      (snap) => {
        if (snap.exists()) {
          const remoteData = snap.data() as Partial<AnnouncementConfig>;
          setAnnouncement((prev) => {
            const merged = { ...prev, ...remoteData };
            
            // Note: We avoid writing back to Firestore here to prevent infinite read/write loops
            // if multiple clients hit the quota simultaneously.
            // If expired, the UI will handle it or an admin will reset it.
            if (!merged.offerTargetTimestamp || merged.offerTargetTimestamp < Date.now()) {
              const hrs = merged.offerCountdownHours ?? 11;
              const mins = merged.offerCountdownMinutes ?? 51;
              const durationMs = (hrs * 3600 + mins * 60) * 1000;
              merged.offerTargetTimestamp = Date.now() + durationMs;
            }
            return merged;
          });
        }
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, 'settings/announcement', setIsQuotaExceeded);
      }
    );
    return () => unsub();
  }, [isQuotaExceeded]);

  // Search order by orderId or customer phone (Optimized for Firestore Quota)
  const searchOrder = useCallback(async (queryStr: string): Promise<CustomerOrder | null> => {
    if (!queryStr || !queryStr.trim()) return null;
    const cleanQuery = queryStr.trim().toLowerCase().replace(/[\s\-_]/g, '');

    // 1. First check local state (which has latest 100 orders)
    const localMatch = orders.find(order => {
      const cleanId = order.id.toLowerCase().replace(/[\s\-_]/g, '');
      const cleanPhone = order.customerPhone.replace(/[\s\-_+]/g, '');
      
      return cleanId === cleanQuery || 
             cleanId.includes(cleanQuery) || 
             cleanPhone === cleanQuery || 
             cleanPhone.endsWith(cleanQuery);
    });

    if (localMatch) return localMatch;

    // 2. If not in local 100, try fetching by exact ID from Firestore
    try {
      // BD-XXXXXX IDs are usually what people search for
      const exactDoc = await getDoc(doc(db, 'orders', queryStr.trim().toUpperCase()));
      if (exactDoc.exists()) {
        return exactDoc.data() as CustomerOrder;
      }

      // 3. Try searching by phone number in Firestore if it looks like a phone
      const phoneQuery = queryStr.trim().replace(/[\s\-_+]/g, '');
      if (phoneQuery.length >= 10) {
        const q = query(collection(db, 'orders'), where('customerPhone', '==', phoneQuery), limit(1));
        const phoneSnap = await getDocs(q);
        if (!phoneSnap.empty) {
          return phoneSnap.docs[0].data() as CustomerOrder;
        }
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, 'orders/search', setIsQuotaExceeded);
    }

    return null;
  }, [orders]);

  const openTrackingModal = useCallback(async (orderIdOrPhone?: string) => {
    if (orderIdOrPhone) {
      setTrackingQuery(orderIdOrPhone);
      const found = await searchOrder(orderIdOrPhone);
      setTrackingOrder(found);
    } else {
      setTrackingOrder(null);
      setTrackingQuery('');
    }
    setIsTrackingModalOpen(true);
  }, [searchOrder]);

  const closeTrackingModal = useCallback(() => {
    setIsTrackingModalOpen(false);
  }, []);

  // Create a brand new order
  const createOrder = useCallback((params: CreateOrderParams): CustomerOrder => {
    const randomSixDigit = Math.floor(100000 + Math.random() * 900000);
    const newOrderId = `BD-${randomSixDigit}`;

    const now = new Date();
    const isDhaka = params.zone === 'inside_dhaka' || params.city.toLowerCase().includes('dhaka');
    const estimatedText = isDhaka 
      ? 'Within 24-48 Hours' 
      : 'Within 48-72 Hours';

    const timeline: OrderTimelineEvent[] = [
      {
        status: 'placed',
        title: 'Order Placed & Confirmed',
        description: 'Order successfully recorded with Cash on Delivery.',
        timestamp: 'Just now',
        completed: true,
      },
      {
        status: 'confirmed',
        title: 'Verification In Progress',
        description: 'Our team is preparing your package at Bodybond Hub.',
        timestamp: 'Estimated shortly',
        completed: false,
      },
      {
        status: 'processing',
        title: 'Sealed & Quality Packed',
        description: 'Sealed in tamper-resistant security packaging.',
        timestamp: 'Pending packaging',
        location: 'Bodybond Central Dispatch Hub, Dhaka',
        completed: false,
      },
      {
        status: 'shipped',
        title: 'Dispatched to Courier Hub',
        description: 'Assigned to delivery network for transit.',
        timestamp: 'Pending dispatch',
        completed: false,
      },
      {
        status: 'out_for_delivery',
        title: 'Rider Out for Delivery',
        description: 'Courier rider assigned with cash collection.',
        timestamp: 'Pending arrival',
        completed: false,
      },
      {
        status: 'delivered',
        title: 'Delivered & Cash Received',
        description: 'Delivered to recipient with cash receipt.',
        timestamp: 'Pending completion',
        completed: false,
      }
    ];

    const newOrder: CustomerOrder = {
      id: newOrderId,
      customerName: params.customerName.trim(),
      customerPhone: params.customerPhone.trim(),
      ...(params.customerEmail?.trim() ? { customerEmail: params.customerEmail.trim() } : {}),
      address: params.address.trim(),
      city: params.city.trim(),
      zone: params.zone,
      items: params.items,
      subtotalBDT: params.subtotalBDT,
      deliveryFeeBDT: params.deliveryFeeBDT,
      discountBDT: params.discountBDT,
      totalBDT: params.totalBDT,
      paymentMethod: params.paymentMethod || 'Cash on Delivery',
      status: 'placed',
      createdAt: now.toISOString(),
      estimatedDeliveryDate: estimatedText,
      courierName: isDhaka ? 'Pathao Express' : 'Steadfast Courier',
      timeline,
      ...(params.adminNotes?.trim() ? { adminNotes: params.adminNotes.trim() } : {}),
    };

    setOrders(prev => [newOrder, ...prev]);
    setLastCreatedOrder(newOrder);

    // Save to Firebase Firestore safely sanitized and guarded
    const payload = sanitizeFirestoreObject(newOrder);
    safeSetDoc(doc(db, 'orders', newOrder.id), payload);

    return newOrder;
  }, []);

  // Update order status from Admin panel
  const updateOrderStatus = useCallback((
    orderId: string, 
    newStatus: OrderStatus, 
    courierName?: string, 
    courierCode?: string, 
    notes?: string
  ) => {
    let updatedPayload: CustomerOrder | null = null;
    setOrders(prevOrders => {
      return prevOrders.map(order => {
        if (order.id !== orderId) return order;

        const updatedTimeline = order.timeline.map(event => {
          if (event.status === newStatus) {
            return {
              ...event,
              timestamp: 'Updated just now',
              completed: true,
            };
          }
          // Mark earlier events as completed
          const statusRank: Record<OrderStatus, number> = {
            placed: 1,
            confirmed: 2,
            processing: 3,
            shipped: 4,
            out_for_delivery: 5,
            delivered: 6,
            cancelled: 0,
          };
          if (newStatus !== 'cancelled' && statusRank[event.status] <= statusRank[newStatus]) {
            return { ...event, completed: true };
          }
          return event;
        });

        const updatedOrder: CustomerOrder = {
          ...order,
          status: newStatus,
          ...(courierName ? { courierName } : (order.courierName ? { courierName: order.courierName } : {})),
          ...(courierCode ? { courierTrackingCode: courierCode } : (order.courierTrackingCode ? { courierTrackingCode: order.courierTrackingCode } : {})),
          ...(notes !== undefined ? (notes ? { adminNotes: notes } : {}) : (order.adminNotes ? { adminNotes: order.adminNotes } : {})),
          timeline: updatedTimeline,
        };

        updatedPayload = updatedOrder;
        return updatedOrder;
      });
    });

    if (updatedPayload) {
      const payload = sanitizeFirestoreObject(updatedPayload);
      safeSetDoc(doc(db, 'orders', orderId), payload, { merge: true });
    }
  }, []);

  // Delete order
  const deleteOrder = useCallback((orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    safeDeleteDoc(doc(db, 'orders', orderId));
  }, []);

  // Coupons logic
  const addCoupon = useCallback((coupon: Omit<CouponCode, 'id' | 'usageCount'>) => {
    const newCoupon: CouponCode = {
      ...coupon,
      id: `coupon-${Date.now()}`,
      code: coupon.code.toUpperCase().trim(),
      usageCount: 0,
    };
    setCoupons(prev => [newCoupon, ...prev]);
  }, []);

  const toggleCouponStatus = useCallback((id: string) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
  }, []);

  const deleteCoupon = useCallback((id: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
  }, []);

  const validateCoupon = useCallback((code: string, currentTotalBDT: number) => {
    const cleanCode = code.toUpperCase().trim();
    const found = coupons.find(c => c.code === cleanCode && c.isActive);

    if (!found) {
      return { valid: false, discountBDT: 0, message: 'Invalid or expired coupon code.' };
    }

    if (found.minSpendBDT && currentTotalBDT < found.minSpendBDT) {
      return { 
        valid: false, 
        discountBDT: 0, 
        message: `Minimum spend of ৳${found.minSpendBDT} required for code ${found.code}.` 
      };
    }

    let discount = 0;
    if (found.discountPercent) {
      discount = Math.round((currentTotalBDT * found.discountPercent) / 100);
    } else if (found.discountFlatBDT) {
      discount = found.discountFlatBDT;
    }

    return {
      valid: true,
      discountBDT: Math.min(discount, currentTotalBDT),
      message: `Coupon ${found.code} applied successfully!`,
    };
  }, [coupons]);

  const updateAnnouncement = useCallback((config: Partial<AnnouncementConfig>) => {
    let updatedAnnouncement: AnnouncementConfig | null = null;
    setAnnouncement(prev => {
      const updated = { ...prev, ...config };
      if (
        config.offerCountdownHours !== undefined || 
        config.offerCountdownMinutes !== undefined || 
        config.offerCountdownSeconds !== undefined ||
        config.offerTargetTimestamp !== undefined
      ) {
        if (!config.offerTargetTimestamp) {
          const hrs = updated.offerCountdownHours ?? 11;
          const mins = updated.offerCountdownMinutes ?? 51;
          const secs = updated.offerCountdownSeconds ?? 11;
          updated.offerTargetTimestamp = Date.now() + (hrs * 3600 + mins * 60 + secs) * 1000;
        }
      }
      updatedAnnouncement = updated;
      return updated;
    });

    if (updatedAnnouncement) {
      const sanitized = sanitizeFirestoreObject(updatedAnnouncement);
      safeSetDoc(doc(db, 'settings', 'announcement'), sanitized, { merge: true });
    }
  }, []);

  // Compute live recent buyers activity (sanitized for visitor social proof & maximum privacy)
  const recentBuyerActivities: LiveBuyerActivity[] = useMemo(() => {
    return orders.slice(0, 10).map((ord) => {
      // Privacy-masked name: e.g. "Nusrat J***" or "Samira H***"
      const formattedName = maskCustomerName(ord.customerName);

      const firstItem = ord.items[0];
      const createdDate = new Date(ord.createdAt);
      const diffMins = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60));
      
      let timeText = 'Just now';
      if (diffMins > 60 * 24) {
        timeText = `${Math.floor(diffMins / (60 * 24))}d ago`;
      } else if (diffMins > 60) {
        timeText = `${Math.floor(diffMins / 60)}h ago`;
      } else if (diffMins > 0) {
        timeText = `${diffMins}m ago`;
      }

      return {
        id: ord.id,
        name: formattedName,
        city: ord.city.includes('Dhaka') ? 'Dhaka' : ord.city,
        productName: firstItem ? firstItem.name : 'Bodybond Glue (20ml)',
        productImage: firstItem?.image || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80',
        timeAgo: timeText,
        verified: true,
      };
    });
  }, [orders]);

  const contextValue = useMemo<OrderContextType>(() => ({
    orders,
    isTrackingModalOpen,
    trackingOrder,
    trackingQuery,
    openTrackingModal,
    closeTrackingModal,
    searchOrder,
    createOrder,
    updateOrderStatus,
    deleteOrder,
    coupons,
    addCoupon,
    toggleCouponStatus,
    deleteCoupon,
    validateCoupon,
    announcement,
    updateAnnouncement,
    recentBuyerActivities,
    lastCreatedOrder,
    isQuotaExceeded,
  }), [
    orders,
    isTrackingModalOpen,
    trackingOrder,
    trackingQuery,
    openTrackingModal,
    closeTrackingModal,
    searchOrder,
    createOrder,
    updateOrderStatus,
    deleteOrder,
    coupons,
    addCoupon,
    toggleCouponStatus,
    deleteCoupon,
    validateCoupon,
    announcement,
    updateAnnouncement,
    recentBuyerActivities,
    lastCreatedOrder,
    isQuotaExceeded,
  ]);

  return (
    <OrderContext.Provider value={contextValue}>
      {children}
      {isQuotaExceeded && (
        <div className="fixed bottom-4 left-4 right-4 z-[9999] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-[#1C1C1C] border border-[#FF2D8D]/30 p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FF2D8D]/10 flex items-center justify-center flex-shrink-0">
                <span className="text-[#FF2D8D] text-lg font-bold">!</span>
              </div>
              <div>
                <h4 className="text-white text-sm font-bold">Limited Database Access</h4>
                <p className="text-gray-400 text-[11px] leading-tight">
                  High traffic has temporarily paused real-time updates. App will auto-refresh when access is restored.
                </p>
              </div>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#FF2D8D] text-white text-xs font-bold rounded-xl hover:bg-[#E02078] transition-colors flex-shrink-0"
            >
              Check Now
            </button>
          </div>
        </div>
      )}
    </OrderContext.Provider>
  );
};

export const useOrders = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
