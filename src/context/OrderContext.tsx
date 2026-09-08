import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
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

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
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
  searchOrder: (query: string) => CustomerOrder | null;
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

  // 4. Order tracking modal state
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState<boolean>(false);
  const [trackingOrder, setTrackingOrder] = useState<CustomerOrder | null>(null);
  const [trackingQuery, setTrackingQuery] = useState<string>('');
  const [lastCreatedOrder, setLastCreatedOrder] = useState<CustomerOrder | null>(null);

  // Persist Orders & Firestore Real-Time Listener
  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Error saving orders:', e);
    }
  }, [orders]);

  useEffect(() => {
    const path = 'orders';
    const unsubscribe = onSnapshot(
      collection(db, path),
      (snapshot) => {
        const firestoreOrders: CustomerOrder[] = [];
        snapshot.forEach((docSnap) => {
          firestoreOrders.push(docSnap.data() as CustomerOrder);
        });
        firestoreOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrders(firestoreOrders);
        try {
          localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(firestoreOrders));
        } catch (e) {
          console.error('Error saving firestore orders to localStorage:', e);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );

    return () => unsubscribe();
  }, []);

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
    const unsub = onSnapshot(
      doc(db, 'settings', 'announcement'),
      (snap) => {
        if (snap.exists()) {
          const remoteData = snap.data() as Partial<AnnouncementConfig>;
          setAnnouncement((prev) => ({ ...prev, ...remoteData }));
        }
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, 'settings/announcement');
      }
    );
    return () => unsub();
  }, []);

  // Search order by orderId or customer phone (No login required)
  const searchOrder = useCallback((query: string): CustomerOrder | null => {
    if (!query || !query.trim()) return null;
    const cleanQuery = query.trim().toLowerCase().replace(/[\s\-_]/g, '');

    const match = orders.find(order => {
      const cleanId = order.id.toLowerCase().replace(/[\s\-_]/g, '');
      const cleanPhone = order.customerPhone.replace(/[\s\-_+]/g, '');
      
      return cleanId === cleanQuery || 
             cleanId.includes(cleanQuery) || 
             cleanPhone === cleanQuery || 
             cleanPhone.endsWith(cleanQuery) ||
             (cleanQuery.length >= 4 && cleanPhone.includes(cleanQuery));
    });

    return match || null;
  }, [orders]);

  const openTrackingModal = useCallback((orderIdOrPhone?: string) => {
    if (orderIdOrPhone) {
      setTrackingQuery(orderIdOrPhone);
      const found = searchOrder(orderIdOrPhone);
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

    // Save to Firebase Firestore safely sanitized
    const payload = sanitizeFirestoreObject(newOrder);
    setDoc(doc(db, 'orders', newOrder.id), payload).catch((err) => {
      handleFirestoreError(err, OperationType.WRITE, `orders/${newOrder.id}`);
    });

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

        // Sync to Firebase Firestore safely sanitized
        const payload = sanitizeFirestoreObject(updatedOrder);
        setDoc(doc(db, 'orders', orderId), payload, { merge: true }).catch((err) => {
          handleFirestoreError(err, OperationType.WRITE, `orders/${orderId}`);
        });

        return updatedOrder;
      });
    });
  }, []);

  // Delete order
  const deleteOrder = useCallback((orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    deleteDoc(doc(db, 'orders', orderId)).catch((err) => {
      handleFirestoreError(err, OperationType.DELETE, `orders/${orderId}`);
    });
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
    setAnnouncement(prev => {
      const updated = { ...prev, ...config };
      const sanitized = sanitizeFirestoreObject(updated);
      setDoc(doc(db, 'settings', 'announcement'), sanitized, { merge: true }).catch((err) => {
        handleFirestoreError(err, OperationType.WRITE, 'settings/announcement');
      });
      return updated;
    });
  }, []);

  // Compute live recent buyers activity (sanitized for visitor social proof & maximum privacy)
  const recentBuyerActivities: LiveBuyerActivity[] = orders.slice(0, 10).map((ord) => {
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

  return (
    <OrderContext.Provider
      value={{
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
      }}
    >
      {children}
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
