export interface Product {
  id: string;
  name: string;
  banglaName?: string;
  slug: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  category: string;
  description: string;
  features: string[];
  images: string[];
  stock: number;
  isFeatured?: boolean;
  isTrending?: boolean;
  colors?: string[];
  sizes?: string[];
  tags?: string[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  banglaName: string;
  iconName: string;
  image: string;
  description?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export type PaymentMethod = 'bkash' | 'nagad' | 'rocket' | 'cod' | 'card';

export interface CustomerInfo {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  district: string;
  zone: 'inside_dhaka' | 'outside_dhaka';
  deliveryNotes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  couponCode?: string;
  grandTotal: number;
  customerInfo: CustomerInfo;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'verified' | 'paid' | 'failed';
  transactionId?: string;
  paymentSenderNumber?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingCourier?: string;
  trackingNumber?: string;
  consignmentId?: string;
  courierStatus?: string;
  courierTrackingUrl?: string;
  courierBookedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourierSettings {
  autoBookOnOrder: boolean;
  defaultCourier: 'steadfast' | 'pathao' | 'zone_smart';
  // Steadfast
  steadfastEnabled: boolean;
  steadfastApiKey: string;
  steadfastSecretKey: string;
  steadfastSandbox: boolean;
  // Pathao
  pathaoEnabled: boolean;
  pathaoClientId: string;
  pathaoClientSecret: string;
  pathaoUsername: string;
  pathaoPassword: string;
  pathaoStoreId: string;
  pathaoSandbox: boolean;
}

export interface ProductReview {
  id: string;
  productId: string;
  userName: string;
  userLocation?: string;
  rating: number;
  comment: string;
  createdAt: string;
  verifiedBuyer?: boolean;
}

export interface FlashSaleConfig {
  enabled: boolean;
  title: string;
  subtitle: string;
  endTime: string;
  discountLabel: string;
}

export interface SmsSettings {
  enabled: boolean;
  provider: 'greenweb' | 'bulksmsbd' | 'simulation';
  apiKey: string;
  senderId: string;
  autoSendOnOrder: boolean;
  autoSendOnCourier: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // percentage (e.g. 10 for 10%) or fixed taka (e.g. 200 for ৳200)
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  expiresAt?: string;
  usageLimit?: number;
  timesUsed: number;
  isActive: boolean;
  description?: string;
  createdAt: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  logoUrl: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  announcementText: string;
  showAnnouncement: boolean;
  bkashNumber: string;
  bkashType: 'Merchant' | 'Personal';
  nagadNumber: string;
  nagadType: 'Merchant' | 'Personal';
  rocketNumber: string;
  rocketType: 'Merchant' | 'Personal';
  insideDhakaFee: number;
  outsideDhakaFee: number;
  freeDeliveryThreshold: number;
  heroHeadline: string;
  heroSubheadline: string;
  heroBadge: string;
  heroImage: string;
  facebookUrl?: string;
  whatsappNumber?: string;
  adminLoginId?: string;
  adminPassword?: string;
  courierSettings?: CourierSettings;
  flashSale?: FlashSaleConfig;
  smsSettings?: SmsSettings;
}
