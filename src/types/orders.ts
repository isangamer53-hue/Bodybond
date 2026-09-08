import { CartItem } from './index';

export type OrderStatus = 
  | 'placed' 
  | 'confirmed' 
  | 'processing' 
  | 'shipped' 
  | 'out_for_delivery' 
  | 'delivered' 
  | 'cancelled';

export interface OrderTimelineEvent {
  status: OrderStatus;
  title: string;
  description: string;
  timestamp: string;
  location?: string;
  completed: boolean;
}

export interface CustomerOrder {
  id: string; // e.g. "BD-847291"
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address: string;
  city: string; // e.g. "Dhaka", "Chittagong", "Sylhet", "Rajshahi"
  zone: 'inside_dhaka' | 'outside_dhaka';
  items: CartItem[];
  subtotalBDT: number;
  deliveryFeeBDT: number;
  discountBDT: number;
  totalBDT: number;
  paymentMethod: 'Cash on Delivery' | 'bKash / Nagad' | 'Online Card';
  status: OrderStatus;
  createdAt: string;
  estimatedDeliveryDate: string;
  courierName?: string; // e.g. "Steadfast Courier", "Pathao Express", "Paperfly"
  courierTrackingCode?: string;
  timeline: OrderTimelineEvent[];
  adminNotes?: string;
}

export interface CouponCode {
  id: string;
  code: string;
  discountPercent?: number;
  discountFlatBDT?: number;
  minSpendBDT?: number;
  isActive: boolean;
  description: string;
  usageCount: number;
}

export interface AnnouncementConfig {
  topBarText: string;
  showTopBar: boolean;
  highlightBadgeText: string;
  freeShippingThresholdBDT: number;
  insideDhakaFeeBDT: number;
  outsideDhakaFeeBDT: number;
  whatsappNumber: string;
  emergencySupportPhone: string;
  showOfferCountdown?: boolean;
  offerCountdownHours?: number;
  offerCountdownMinutes?: number;
  offerCountdownSeconds?: number;
  offerCountdownLabel?: string;
  offerTargetTimestamp?: number;
}

export interface LiveBuyerActivity {
  id: string;
  name: string;
  city: string;
  productName: string;
  productImage: string;
  timeAgo: string;
  verified: boolean;
}
