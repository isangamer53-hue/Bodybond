import { CustomerOrder, CouponCode, AnnouncementConfig } from '../types/orders';

export const INITIAL_ORDERS: CustomerOrder[] = [
  {
    id: 'BD-892415',
    customerName: 'Nusrat Jahan',
    customerPhone: '01712345678',
    customerEmail: 'nusrat.j@gmail.com',
    address: 'House 42, Road 9/A, Dhanmondi',
    city: 'Dhaka',
    zone: 'inside_dhaka',
    items: [
      {
        id: 'bodybond-glue-20ml-std',
        productId: 'bodybond-glue',
        name: 'Bodybond Max Hold Body Glue (20ml)',
        priceNZD: 1250,
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
        quantity: 1,
      }
    ],
    subtotalBDT: 1250,
    deliveryFeeBDT: 60,
    discountBDT: 0,
    totalBDT: 1310,
    paymentMethod: 'Cash on Delivery',
    status: 'out_for_delivery',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), // 18 hrs ago
    estimatedDeliveryDate: 'Today, by 6:00 PM',
    courierName: 'Pathao Express',
    courierTrackingCode: 'PT-984321',
    timeline: [
      {
        status: 'placed',
        title: 'Order Placed & Received',
        description: 'Customer placed order with Cash On Delivery.',
        timestamp: 'Yesterday at 3:15 PM',
        completed: true,
      },
      {
        status: 'confirmed',
        title: 'Order Verified by Support',
        description: 'Order confirmed with customer over phone verification.',
        timestamp: 'Yesterday at 3:45 PM',
        completed: true,
      },
      {
        status: 'processing',
        title: 'Packed & Quality Checked',
        description: 'Bodybond 20ml sealed in tamper-proof bubble polybag.',
        timestamp: 'Yesterday at 6:30 PM',
        location: 'Bodybond Dhaka Central Hub, Banani',
        completed: true,
      },
      {
        status: 'shipped',
        title: 'Handed Over to Courier',
        description: 'Dispatched to Pathao Express Hub for last-mile delivery.',
        timestamp: 'Today at 9:00 AM',
        location: 'Pathao Tejgaon Hub',
        completed: true,
      },
      {
        status: 'out_for_delivery',
        title: 'Rider Out for Delivery',
        description: 'Rider (Rifat - 01844992211) is on the way to Dhanmondi.',
        timestamp: 'Today at 1:20 PM',
        location: 'Dhanmondi Zone, Dhaka',
        completed: true,
      },
      {
        status: 'delivered',
        title: 'Delivered & Cash Collected',
        description: 'Package delivered to recipient with cash payment.',
        timestamp: 'Pending Delivery',
        completed: false,
      }
    ],
    adminNotes: 'Priority delivery requested before evening party.'
  },
  {
    id: 'BD-749102',
    customerName: 'Tashfia Nawar',
    customerPhone: '01899887766',
    customerEmail: 'tashfia.style@yahoo.com',
    address: 'Apt 4B, Concord Tower, Road 11, Banani',
    city: 'Dhaka',
    zone: 'inside_dhaka',
    items: [
      {
        id: 'bodybond-glue-20ml-std',
        productId: 'bodybond-glue',
        name: 'Bodybond Max Hold Body Glue (20ml)',
        priceNZD: 1250,
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
        quantity: 2,
      }
    ],
    subtotalBDT: 2500,
    deliveryFeeBDT: 0, // Free delivery
    discountBDT: 150,
    totalBDT: 2350,
    paymentMethod: 'Cash on Delivery',
    status: 'delivered',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 42).toISOString(),
    estimatedDeliveryDate: 'Yesterday, 4:30 PM',
    courierName: 'Steadfast Courier',
    courierTrackingCode: 'ST-552109',
    timeline: [
      {
        status: 'placed',
        title: 'Order Placed',
        description: 'Order submitted via website checkout.',
        timestamp: '2 days ago at 11:10 AM',
        completed: true,
      },
      {
        status: 'confirmed',
        title: 'Order Confirmed',
        description: 'Verified via WhatsApp confirmation.',
        timestamp: '2 days ago at 11:30 AM',
        completed: true,
      },
      {
        status: 'processing',
        title: 'Packed & Dispatched',
        description: 'Packed at Banani fulfillment hub.',
        timestamp: '2 days ago at 3:00 PM',
        completed: true,
      },
      {
        status: 'shipped',
        title: 'In Transit',
        description: 'Courier picked up parcel for same-day delivery.',
        timestamp: 'Yesterday at 10:00 AM',
        completed: true,
      },
      {
        status: 'out_for_delivery',
        title: 'Out for Delivery',
        description: 'Steadfast delivery agent assigned.',
        timestamp: 'Yesterday at 1:45 PM',
        completed: true,
      },
      {
        status: 'delivered',
        title: 'Successfully Delivered',
        description: 'Delivered and ৳2,350 collected at door.',
        timestamp: 'Yesterday at 4:30 PM',
        completed: true,
      }
    ],
    adminNotes: 'Repeat customer from Instagram.'
  },
  {
    id: 'BD-620984',
    customerName: 'Samira Huq',
    customerPhone: '01677112233',
    address: 'Holding 85, GEC Circle, Nasirabad',
    city: 'Chittagong',
    zone: 'outside_dhaka',
    items: [
      {
        id: 'bodybond-glue-20ml-std',
        productId: 'bodybond-glue',
        name: 'Bodybond Max Hold Body Glue (20ml)',
        priceNZD: 1250,
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
        quantity: 1,
      }
    ],
    subtotalBDT: 1250,
    deliveryFeeBDT: 120,
    discountBDT: 0,
    totalBDT: 1370,
    paymentMethod: 'Cash on Delivery',
    status: 'shipped',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    estimatedDeliveryDate: 'Tomorrow by 2:00 PM',
    courierName: 'Steadfast Courier',
    courierTrackingCode: 'ST-903421',
    timeline: [
      {
        status: 'placed',
        title: 'Order Placed',
        description: 'Order received via online COD checkout.',
        timestamp: 'Today at 1:00 AM',
        completed: true,
      },
      {
        status: 'confirmed',
        title: 'Order Confirmed',
        description: 'Verified by Bodybond support desk.',
        timestamp: 'Today at 9:30 AM',
        completed: true,
      },
      {
        status: 'processing',
        title: 'Packed for Inter-District Transit',
        description: 'Heavy duty bubble wrap applied for transit to Chittagong.',
        timestamp: 'Today at 11:00 AM',
        completed: true,
      },
      {
        status: 'shipped',
        title: 'Departed Central Sorting Facility',
        description: 'Vehicle en route from Dhaka to Chittagong sorting depot.',
        timestamp: 'Today at 2:30 PM',
        location: 'Dhaka-Ctg Highway Transit',
        completed: true,
      },
      {
        status: 'out_for_delivery',
        title: 'Arrival at Local Hub',
        description: 'Expected to reach Nasirabad Hub tomorrow morning.',
        timestamp: 'Pending Transit',
        completed: false,
      },
      {
        status: 'delivered',
        title: 'Delivered',
        description: 'Package delivered to recipient.',
        timestamp: 'Pending Delivery',
        completed: false,
      }
    ]
  },
  {
    id: 'BD-519280',
    customerName: 'Raisa Anjum',
    customerPhone: '01799334455',
    address: 'House 14, Sector 7, Uttara',
    city: 'Dhaka',
    zone: 'inside_dhaka',
    items: [
      {
        id: 'bodybond-glue-20ml-std',
        productId: 'bodybond-glue',
        name: 'Bodybond Max Hold Body Glue (20ml)',
        priceNZD: 1250,
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
        quantity: 1,
      }
    ],
    subtotalBDT: 1250,
    deliveryFeeBDT: 60,
    discountBDT: 0,
    totalBDT: 1310,
    paymentMethod: 'Cash on Delivery',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    estimatedDeliveryDate: 'Tomorrow, by 4:00 PM',
    courierName: 'Pathao Express',
    timeline: [
      {
        status: 'placed',
        title: 'Order Placed',
        description: 'Cash On Delivery order recorded in store system.',
        timestamp: '45 mins ago',
        completed: true,
      },
      {
        status: 'confirmed',
        title: 'Order Confirmed',
        description: 'Verified & assigned to fulfillment queue.',
        timestamp: '20 mins ago',
        completed: true,
      },
      {
        status: 'processing',
        title: 'Fulfillment & Packing',
        description: 'Being prepared at packaging station.',
        timestamp: 'In Progress',
        completed: false,
      },
      {
        status: 'shipped',
        title: 'Courier Handover',
        description: 'Ready for courier pickup.',
        timestamp: 'Pending Packing',
        completed: false,
      },
      {
        status: 'out_for_delivery',
        title: 'Out for Delivery',
        description: 'Rider dispatch.',
        timestamp: 'Pending Pickup',
        completed: false,
      },
      {
        status: 'delivered',
        title: 'Delivered',
        description: 'Customer delivery & cash collection.',
        timestamp: 'Pending Delivery',
        completed: false,
      }
    ]
  }
];

export const INITIAL_COUPONS: CouponCode[] = [
  {
    id: 'coupon-1',
    code: 'WELCOME10',
    discountPercent: 10,
    minSpendBDT: 1000,
    isActive: true,
    description: '10% discount for first-time shoppers',
    usageCount: 142
  },
  {
    id: 'coupon-2',
    code: 'BODY10',
    discountPercent: 10,
    minSpendBDT: 1200,
    isActive: true,
    description: 'Special viral social discount',
    usageCount: 89
  },
  {
    id: 'coupon-3',
    code: 'FREESHIP',
    discountFlatBDT: 60,
    minSpendBDT: 2000,
    isActive: true,
    description: 'Free standard delivery across Bangladesh',
    usageCount: 64
  }
];

export const INITIAL_ANNOUNCEMENT: AnnouncementConfig = {
  topBarText: '🚚 Fast Cash on Delivery Available Across Bangladesh • Pay Upon Receipt',
  showTopBar: true,
  highlightBadgeText: 'CASH ON DELIVERY (COD)',
  freeShippingThresholdBDT: 2500,
  insideDhakaFeeBDT: 60,
  outsideDhakaFeeBDT: 120,
  whatsappNumber: '8801305273979',
  emergencySupportPhone: '+880 1305-273979',
  showOfferCountdown: true,
  offerCountdownHours: 11,
  offerCountdownMinutes: 51,
  offerCountdownSeconds: 11,
  offerCountdownLabel: 'OFFER ENDS IN',
};
