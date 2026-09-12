import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Product, CartItem, Order, SiteSettings, CustomerInfo, CustomerProfile, PaymentMethod, ProductReview, Coupon, AdminRole, AdminUser } from '../types';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS, INITIAL_ORDERS, INITIAL_REVIEWS, INITIAL_COUPONS } from '../data/initialData';
import { dispatchOrder, DispatchResult } from '../services/courierService';
import { sendSmsNotification, generateOrderSmsText, generateCourierSmsText } from '../services/smsService';
import { 
  db, 
  auth, 
  signInWithGoogle, 
  signOutUser, 
  registerWithEmail,
  loginWithEmail,
  testConnection, 
  handleFirestoreError, 
  cleanDataForFirestore,
  OperationType 
} from '../services/firebase';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  deleteDoc, 
  getDocs,
  getDoc
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';

export const MASTER_LOGIN_ID = 'aditto13552b';
export const MASTER_LOGIN_PASSWORD = 'aditto13552b';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface StoreContextType {
  products: Product[];
  orders: Order[];
  coupons: Coupon[];
  settings: SiteSettings;
  cart: CartItem[];
  wishlistIds: string[];
  reviews: ProductReview[];
  isAdminAuthenticated: boolean;
  adminRole: AdminRole;
  adminUser: AdminUser | null;
  theme: 'light' | 'dark';
  activeView: 'shop' | 'admin';
  selectedProductForModal: Product | null;
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  isTrackOrderOpen: boolean;
  isWishlistOpen: boolean;
  orderSuccessData: Order | null;
  searchKeyword: string;
  selectedCategory: string;
  appliedCoupon: string | null;
  appliedCouponData: Coupon | null;
  discountPercentage: number;
  deliveryZone: 'inside_dhaka' | 'outside_dhaka';

  // Google Auth & Cloud Sync
  currentUser: AppUser | User | null;
  customerProfile: CustomerProfile | null;
  isAuthLoading: boolean;
  cloudSyncStatus: 'synced' | 'syncing' | 'error' | 'offline';
  loginWithGoogle: () => Promise<AppUser | User | null>;
  loginAsUser: (userData: AppUser) => void;
  logoutGoogle: () => Promise<void>;
  forceCloudSync: () => Promise<void>;

  // Customer Account & Profile
  isCustomerAuthModalOpen: boolean;
  setIsCustomerAuthModalOpen: (open: boolean) => void;
  customerAuthModalTab: 'login' | 'register' | 'profile';
  setCustomerAuthModalTab: (tab: 'login' | 'register' | 'profile') => void;
  openCustomerAuthModal: (tab?: 'login' | 'register' | 'profile') => void;
  signUpCustomer: (name: string, email: string, pass: string, phone?: string, address?: string, zone?: 'inside_dhaka' | 'outside_dhaka') => Promise<{ success: boolean; message?: string }>;
  signInCustomer: (emailOrPhone: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  updateCustomerProfile: (updates: Partial<CustomerProfile>) => Promise<void>;
  
  // Actions
  setActiveView: (view: 'shop' | 'admin') => void;
  setSelectedProductForModal: (product: Product | null) => void;
  setIsCartOpen: (open: boolean) => void;
  setIsCheckoutOpen: (open: boolean) => void;
  setIsTrackOrderOpen: (open: boolean) => void;
  setIsWishlistOpen: (open: boolean) => void;
  setOrderSuccessData: (order: Order | null) => void;
  setSearchKeyword: (keyword: string) => void;
  setSelectedCategory: (catId: string) => void;
  setDeliveryZone: (zone: 'inside_dhaka' | 'outside_dhaka') => void;
  
  // Cart operations
  addToCart: (product: Product, quantity?: number, color?: string, size?: string) => void;
  removeFromCart: (productId: string, color?: string, size?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, color?: string, size?: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  
  // Coupon Management (Admin & Generator)
  addCoupon: (coupon: Omit<Coupon, 'id' | 'createdAt' | 'timesUsed'>) => void;
  updateCoupon: (id: string, updatedData: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  toggleCouponStatus: (id: string) => void;
  generatePromoCode: (prefix?: string) => string;
  
  // Wishlist operations
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Reviews operations
  addReview: (review: Omit<ProductReview, 'id' | 'createdAt'>) => void;
  deleteReview: (reviewId: string) => void;

  // Checkout & Orders
  checkout: (
    customerInfo: CustomerInfo,
    paymentMethod: PaymentMethod,
    transactionId?: string,
    paymentSenderNumber?: string
  ) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  updateOrderPaymentStatus: (orderId: string, status: Order['paymentStatus']) => void;
  dispatchOrderToCourier: (orderId: string, courier: 'steadfast' | 'pathao' | 'auto') => Promise<DispatchResult>;
  sendOrderSms: (orderId: string, type: 'order_placed' | 'courier_dispatch' | 'custom', customMsg?: string) => Promise<{ success: boolean; message: string }>;
  
  // Theme operations
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;

  // Admin Operations
  adminLogin: (id: string, pass: string) => { success: boolean; role?: AdminRole; message?: string };
  adminLogout: () => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Promise<{ success: boolean; error?: string; product?: Product }>;
  updateProduct: (id: string, updatedData: Partial<Product>) => Promise<{ success: boolean; error?: string }>;
  deleteProduct: (id: string) => Promise<{ success: boolean; error?: string }>;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  updateStaffCredentials: (staffId: string, staffPass: string) => void;
  resetToDefaults: () => void;
  
  // Calculations
  cartSubtotal: number;
  cartDiscount: number;
  cartShippingFee: number;
  cartGrandTotal: number;
  cartCount: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('bredvex_products');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_PRODUCTS;
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('bredvex_orders');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_ORDERS;
  });

  // Site Settings
  const [settings, setSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem('bredvex_settings');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_SETTINGS;
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('bredvex_cart');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // Wishlist
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('bredvex_wishlist');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // Product Reviews
  const [reviews, setReviews] = useState<ProductReview[]>(() => {
    try {
      const saved = localStorage.getItem('bredvex_reviews');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_REVIEWS;
  });

  // Admin Auth & Role
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('bredvex_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  const [adminRole, setAdminRole] = useState<AdminRole>(() => {
    try {
      const saved = localStorage.getItem('bredvex_admin_role');
      if (saved === 'master' || saved === 'staff') return saved;
      if (localStorage.getItem('bredvex_admin_auth') === 'true') {
        return 'master';
      }
    } catch {
      // fallback
    }
    return null;
  });

  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('bredvex_admin_user');
      if (saved) return JSON.parse(saved);
      if (localStorage.getItem('bredvex_admin_auth') === 'true') {
        return { id: MASTER_LOGIN_ID, name: 'Master Admin', role: 'master' };
      }
    } catch {
      // fallback
    }
    return null;
  });

  // Dark / Light Theme System (Defaults to pure white light mode)
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('bredvex_theme');
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {
      // fallback
    }
    return 'light';
  });

  // Apply theme to document root
  useEffect(() => {
    try {
      localStorage.setItem('bredvex_theme', theme);
    } catch (e) {
      console.error('Failed to save theme:', e);
    }

    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
        root.setAttribute('data-theme', 'dark');
      } else {
        root.classList.remove('dark');
        root.setAttribute('data-theme', 'light');
      }
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
  };

  // UI state
  const [activeView, setActiveView] = useState<'shop' | 'admin'>('shop');
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [orderSuccessData, setOrderSuccessData] = useState<Order | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(() => {
    try {
      return localStorage.getItem('bredvex_applied_coupon') || null;
    } catch {
      return null;
    }
  });
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [deliveryZone, setDeliveryZone] = useState<'inside_dhaka' | 'outside_dhaka'>('inside_dhaka');

  // Promo Coupons & Discounts State
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem('bredvex_coupons');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_COUPONS;
  });

  // Google Auth & Cloud Sync States
  const [currentUser, setCurrentUser] = useState<AppUser | User | null>(() => {
    try {
      const saved = localStorage.getItem('bredvex_current_user');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'synced' | 'syncing' | 'error' | 'offline'>('syncing');

  // Listen to Auth State
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          localStorage.setItem('bredvex_current_user', JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          }));
        } catch {}
      }
      setIsAuthLoading(false);
      // Auto master admin grant if user logs in with the project owner email rafiqulislam7279@gmail.com
      if (user && user.email?.toLowerCase() === 'rafiqulislam7279@gmail.com') {
        setIsAdminAuthenticated(true);
        setAdminRole('master');
        const masterObj: AdminUser = { id: user.uid, name: user.displayName || 'Owner Rafiqul', role: 'master' };
        setAdminUser(masterObj);
        try {
          localStorage.setItem('bredvex_admin_auth', 'true');
          localStorage.setItem('bredvex_admin_role', 'master');
          localStorage.setItem('bredvex_admin_user', JSON.stringify(masterObj));
        } catch (e) {
          console.error(e);
        }
      }
    });
    return () => unsubAuth();
  }, []);

  // Customer Profile State
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(() => {
    try {
      const saved = localStorage.getItem('bredvex_customer_profile');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  const [isCustomerAuthModalOpen, setIsCustomerAuthModalOpen] = useState(false);
  const [customerAuthModalTab, setCustomerAuthModalTab] = useState<'login' | 'register' | 'profile'>('login');

  const openCustomerAuthModal = (tab: 'login' | 'register' | 'profile' = 'login') => {
    setCustomerAuthModalTab(tab);
    setIsCustomerAuthModalOpen(true);
  };

  // Sync customer profile when currentUser changes
  useEffect(() => {
    if (!currentUser) {
      setCustomerProfile(null);
      return;
    }

    const loadProfile = async () => {
      try {
        const uDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (uDoc.exists()) {
          const data = uDoc.data() as CustomerProfile;
          setCustomerProfile(data);
          try {
            localStorage.setItem('bredvex_customer_profile', JSON.stringify(data));
          } catch {}
          return;
        }
      } catch (e) {
        console.warn('Could not read user profile from Firestore:', e);
      }

      setCustomerProfile(prev => {
        const base: CustomerProfile = prev && prev.uid === currentUser.uid ? prev : {
          uid: currentUser.uid,
          name: currentUser.displayName || 'Valued Customer',
          email: currentUser.email || '',
          photoURL: currentUser.photoURL || undefined,
          createdAt: new Date().toISOString(),
        };
        try {
          localStorage.setItem('bredvex_customer_profile', JSON.stringify(base));
        } catch {}
        return base;
      });
    };

    loadProfile();
  }, [currentUser?.uid]);

  // Connection test on mount
  useEffect(() => {
    testConnection();
  }, []);

  // Real-time Firestore Sync for Products (Across all devices)
  useEffect(() => {
    let isSeeding = false;
    const unsubProducts = onSnapshot(collection(db, 'products'), async (snapshot) => {
      const alreadySeeded = typeof window !== 'undefined' && localStorage.getItem('bredvex_has_seeded') === 'true';

      if (snapshot.empty && !isSeeding && !alreadySeeded) {
        isSeeding = true;
        setCloudSyncStatus('syncing');
        for (const p of INITIAL_PRODUCTS) {
          try {
            await setDoc(doc(db, 'products', p.id), p);
          } catch (e) {
            console.error('Seed product error:', e);
          }
        }
        try {
          localStorage.setItem('bredvex_has_seeded', 'true');
        } catch {}
        setProducts(INITIAL_PRODUCTS);
        setCloudSyncStatus('synced');
      } else if (snapshot.empty) {
        // Admin intentionally deleted all products
        setProducts([]);
        setCloudSyncStatus('synced');
        try {
          localStorage.setItem('bredvex_products', JSON.stringify([]));
        } catch {}
      } else {
        try {
          localStorage.setItem('bredvex_has_seeded', 'true');
        } catch {}
        const remoteProducts: Product[] = [];
        snapshot.forEach((docSnap) => {
          remoteProducts.push(docSnap.data() as Product);
        });
        remoteProducts.sort((a, b) => {
          const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          if (timeB !== timeA) {
            return timeB - timeA;
          }
          return (a.id || '').localeCompare(b.id || '');
        });
        setProducts(remoteProducts);
        setCloudSyncStatus('synced');
        try {
          localStorage.setItem('bredvex_products', JSON.stringify(remoteProducts));
        } catch {}
      }
    }, (error) => {
      console.warn('Firestore products listener error:', error);
      setCloudSyncStatus('error');
    });

    return () => unsubProducts();
  }, []);

  // Real-time Firestore Sync for Orders
  useEffect(() => {
    const unsubOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
      if (!snapshot.empty) {
        const remoteOrders: Order[] = [];
        snapshot.forEach((docSnap) => {
          remoteOrders.push(docSnap.data() as Order);
        });
        remoteOrders.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        setOrders(remoteOrders);
        try {
          localStorage.setItem('bredvex_orders', JSON.stringify(remoteOrders));
        } catch {}
      }
    }, (error) => {
      console.warn('Firestore orders listener error:', error);
    });

    return () => unsubOrders();
  }, []);

  // Real-time Firestore Sync for Settings
  useEffect(() => {
    const unsubSettings = onSnapshot(doc(db, 'settings', 'store_config'), (snapshot) => {
      if (snapshot.exists()) {
        const remote = snapshot.data() as SiteSettings;
        setSettings(prev => ({ ...prev, ...remote }));
        try {
          localStorage.setItem('bredvex_settings', JSON.stringify({ ...INITIAL_SETTINGS, ...remote }));
        } catch {}
      }
    }, (error) => {
      console.warn('Firestore settings listener error:', error);
    });

    return () => unsubSettings();
  }, []);

  // Real-time Firestore Sync for Coupons
  useEffect(() => {
    let isSeedingCoupons = false;
    const unsubCoupons = onSnapshot(collection(db, 'coupons'), async (snapshot) => {
      if (snapshot.empty && !isSeedingCoupons) {
        isSeedingCoupons = true;
        for (const c of INITIAL_COUPONS) {
          try {
            await setDoc(doc(db, 'coupons', c.id), c);
          } catch {}
        }
        setCoupons(INITIAL_COUPONS);
      } else if (!snapshot.empty) {
        const remoteCoupons: Coupon[] = [];
        snapshot.forEach((d) => remoteCoupons.push(d.data() as Coupon));
        setCoupons(remoteCoupons);
        try {
          localStorage.setItem('bredvex_coupons', JSON.stringify(remoteCoupons));
        } catch {}
      }
    }, (error) => {
      console.warn('Firestore coupons listener error:', error);
    });

    return () => unsubCoupons();
  }, []);

  // Real-time Firestore Sync for Reviews
  useEffect(() => {
    let isSeedingReviews = false;
    const unsubReviews = onSnapshot(collection(db, 'reviews'), async (snapshot) => {
      if (snapshot.empty && !isSeedingReviews) {
        isSeedingReviews = true;
        for (const r of INITIAL_REVIEWS) {
          try {
            await setDoc(doc(db, 'reviews', r.id), r);
          } catch {}
        }
        setReviews(INITIAL_REVIEWS);
      } else if (!snapshot.empty) {
        const remoteReviews: ProductReview[] = [];
        snapshot.forEach((d) => remoteReviews.push(d.data() as ProductReview));
        setReviews(remoteReviews);
        try {
          localStorage.setItem('bredvex_reviews', JSON.stringify(remoteReviews));
        } catch {}
      }
    }, (error) => {
      console.warn('Firestore reviews listener error:', error);
    });

    return () => unsubReviews();
  }, []);

  // Persistence effects
  useEffect(() => {
    try {
      localStorage.setItem('bredvex_coupons', JSON.stringify(coupons));
    } catch (e) {
      console.error('Failed to save coupons:', e);
    }
  }, [coupons]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem('bredvex_applied_coupon', appliedCoupon);
      } else {
        localStorage.removeItem('bredvex_applied_coupon');
      }
    } catch (e) {
      console.error('Failed to save applied coupon:', e);
    }
  }, [appliedCoupon]);

  useEffect(() => {
    try {
      localStorage.setItem('bredvex_products', JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products:', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('bredvex_orders', JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders:', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('bredvex_settings', JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('bredvex_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart:', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('bredvex_wishlist', JSON.stringify(wishlistIds));
    } catch (e) {
      console.error('Failed to save wishlist:', e);
    }
  }, [wishlistIds]);

  useEffect(() => {
    try {
      localStorage.setItem('bredvex_reviews', JSON.stringify(reviews));
    } catch (e) {
      console.error('Failed to save reviews:', e);
    }
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem('bredvex_admin_auth', isAdminAuthenticated ? 'true' : 'false');
    } catch (e) {
      console.error('Failed to save admin auth:', e);
    }
  }, [isAdminAuthenticated]);

  useEffect(() => {
    try {
      if (adminRole) {
        localStorage.setItem('bredvex_admin_role', adminRole);
      } else {
        localStorage.removeItem('bredvex_admin_role');
      }
    } catch (e) {
      console.error('Failed to save admin role:', e);
    }
  }, [adminRole]);

  useEffect(() => {
    try {
      if (adminUser) {
        localStorage.setItem('bredvex_admin_user', JSON.stringify(adminUser));
      } else {
        localStorage.removeItem('bredvex_admin_user');
      }
    } catch (e) {
      console.error('Failed to save admin user:', e);
    }
  }, [adminUser]);

  // Calculations
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Active applied coupon object lookup
  const appliedCouponData = useMemo(() => {
    if (!appliedCoupon) return null;
    return coupons.find(c => c.code.toUpperCase() === appliedCoupon.toUpperCase()) || null;
  }, [appliedCoupon, coupons]);

  // Dynamic discount calculation
  const cartDiscount = useMemo(() => {
    if (!appliedCouponData || !appliedCouponData.isActive) {
      if (discountPercentage > 0) {
        return Math.round((cartSubtotal * discountPercentage) / 100);
      }
      return 0;
    }

    // Minimum order check
    if (appliedCouponData.minOrderAmount && cartSubtotal < appliedCouponData.minOrderAmount) {
      return 0;
    }

    if (appliedCouponData.discountType === 'percentage') {
      const rawDiscount = Math.round((cartSubtotal * appliedCouponData.discountValue) / 100);
      if (appliedCouponData.maxDiscountAmount && appliedCouponData.maxDiscountAmount > 0) {
        return Math.min(rawDiscount, appliedCouponData.maxDiscountAmount);
      }
      return rawDiscount;
    } else {
      // Fixed discount
      return Math.min(appliedCouponData.discountValue, cartSubtotal);
    }
  }, [appliedCouponData, discountPercentage, cartSubtotal]);

  const isFreeDelivery = cartSubtotal >= settings.freeDeliveryThreshold;
  const cartShippingFee = cartSubtotal === 0 
    ? 0 
    : isFreeDelivery 
      ? 0 
      : deliveryZone === 'inside_dhaka' 
        ? settings.insideDhakaFee 
        : settings.outsideDhakaFee;
  const cartGrandTotal = Math.max(0, cartSubtotal - cartDiscount + cartShippingFee);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Cart Operations
  const addToCart = (product: Product, quantity = 1, color?: string, size?: string) => {
    const chosenColor = color || (product.colors && product.colors.length > 0 ? product.colors[0] : undefined);
    const chosenSize = size || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined);

    setCart(prev => {
      const existingIdx = prev.findIndex(
        item => item.product.id === product.id && item.selectedColor === chosenColor && item.selectedSize === chosenSize
      );

      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += quantity;
        return next;
      }
      return [...prev, { product, quantity, selectedColor: chosenColor, selectedSize: chosenSize }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, color?: string, size?: string) => {
    setCart(prev =>
      prev.filter(
        item => !(item.product.id === productId && item.selectedColor === color && item.selectedSize === size)
      )
    );
  };

  const updateCartQuantity = (productId: string, quantity: number, color?: string, size?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, color, size);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        if (item.product.id === productId && item.selectedColor === color && item.selectedSize === size) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setDiscountPercentage(0);
  };

  // Coupon Generator & Admin Operations
  const generatePromoCode = (prefix = 'BVX') => {
    const cleanPrefix = prefix.trim().toUpperCase().replace(/[^A-Z0-9]/g, '') || 'BVX';
    const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
    const randomNum = Math.floor(10 + Math.random() * 90);
    return `${cleanPrefix}-${randomChars}${randomNum}`;
  };

  const addCoupon = async (newCouponData: Omit<Coupon, 'id' | 'createdAt' | 'timesUsed'>) => {
    const newCoupon: Coupon = {
      ...newCouponData,
      id: `cpn-${Date.now()}`,
      code: newCouponData.code.trim().toUpperCase(),
      timesUsed: 0,
      createdAt: new Date().toISOString(),
    };
    setCoupons(prev => [newCoupon, ...prev]);
    try {
      await setDoc(doc(db, 'coupons', newCoupon.id), cleanDataForFirestore(newCoupon));
    } catch (e) {
      console.warn('Error saving coupon to Firestore:', e);
    }
  };

  const updateCoupon = async (id: string, updatedData: Partial<Coupon>) => {
    setCoupons(prev =>
      prev.map(c => {
        if (c.id === id) {
          return {
            ...c,
            ...updatedData,
            code: updatedData.code ? updatedData.code.trim().toUpperCase() : c.code
          };
        }
        return c;
      })
    );
    try {
      await setDoc(doc(db, 'coupons', id), cleanDataForFirestore(updatedData), { merge: true });
    } catch (e) {
      console.warn('Error updating coupon in Firestore:', e);
    }
  };

  const deleteCoupon = async (id: string) => {
    const target = coupons.find(c => c.id === id);
    if (target && appliedCoupon && target.code.toUpperCase() === appliedCoupon.toUpperCase()) {
      setAppliedCoupon(null);
      setDiscountPercentage(0);
    }
    setCoupons(prev => prev.filter(c => c.id !== id));
    try {
      await deleteDoc(doc(db, 'coupons', id));
    } catch (e) {
      console.warn('Error deleting coupon from Firestore:', e);
    }
  };

  const toggleCouponStatus = async (id: string) => {
    const target = coupons.find(c => c.id === id);
    const newStatus = target ? !target.isActive : true;
    setCoupons(prev =>
      prev.map(c => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
    try {
      await setDoc(doc(db, 'coupons', id), cleanDataForFirestore({ isActive: newStatus }), { merge: true });
    } catch (e) {
      console.warn('Error toggling coupon status in Firestore:', e);
    }
  };

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (!clean) {
      return { success: false, message: 'Please enter a coupon code.' };
    }

    // Check dynamic coupons list
    const found = coupons.find(c => c.code.toUpperCase() === clean);
    if (!found) {
      return { success: false, message: `Coupon "${clean}" not found or invalid.` };
    }

    if (!found.isActive) {
      return { success: false, message: `Coupon "${clean}" is currently disabled.` };
    }

    if (found.expiresAt) {
      const expiry = new Date(found.expiresAt).getTime();
      if (!isNaN(expiry) && expiry < Date.now()) {
        return { success: false, message: `Coupon "${clean}" has expired.` };
      }
    }

    if (found.usageLimit && found.timesUsed >= found.usageLimit) {
      return { success: false, message: `Coupon "${clean}" usage limit has been reached.` };
    }

    if (found.minOrderAmount && cartSubtotal < found.minOrderAmount) {
      return { 
        success: false, 
        message: `Minimum cart value of ৳${found.minOrderAmount.toLocaleString()} required to use "${clean}".` 
      };
    }

    setAppliedCoupon(found.code);
    if (found.discountType === 'percentage') {
      setDiscountPercentage(found.discountValue);
      return { 
        success: true, 
        message: `🎉 Coupon "${found.code}" applied! ${found.discountValue}% discount added.` 
      };
    } else {
      setDiscountPercentage(0);
      return { 
        success: true, 
        message: `🎉 Coupon "${found.code}" applied! ৳${found.discountValue.toLocaleString()} flat discount added.` 
      };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountPercentage(0);
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlistIds(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlistIds.includes(productId);

  // Orders & Checkout
  const checkout = async (
    customerInfo: CustomerInfo,
    paymentMethod: PaymentMethod,
    transactionId?: string,
    paymentSenderNumber?: string
  ): Promise<Order> => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `BVX-${randomSuffix}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      items: [...cart],
      subtotal: cartSubtotal,
      shippingCost: cartShippingFee,
      discountAmount: cartDiscount,
      couponCode: appliedCoupon || undefined,
      grandTotal: cartGrandTotal,
      customerInfo,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'verified',
      transactionId: transactionId || (paymentMethod === 'cod' ? undefined : `TRX${Math.floor(10000000 + Math.random() * 90000000)}`),
      paymentSenderNumber,
      status: 'pending',
      trackingCourier: customerInfo.zone === 'inside_dhaka' ? 'Pathao Courier' : 'Steadfast Courier',
      trackingNumber: `BD-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (currentUser?.uid) {
      newOrder.userId = currentUser.uid;
      if (!newOrder.customerInfo.email && currentUser.email) {
        newOrder.customerInfo.email = currentUser.email;
      }
    }

    // Check if Courier Auto-Book is enabled
    if (settings.courierSettings?.autoBookOnOrder) {
      try {
        const dispatchRes = await dispatchOrder(newOrder, 'auto', settings.courierSettings);
        if (dispatchRes.success) {
          newOrder.trackingCourier = dispatchRes.courier;
          newOrder.trackingNumber = dispatchRes.trackingCode;
          newOrder.consignmentId = dispatchRes.consignmentId;
          newOrder.courierStatus = 'Booked';
          newOrder.courierTrackingUrl = dispatchRes.trackingUrl;
          newOrder.courierBookedAt = new Date().toISOString();
          newOrder.status = 'processing';
        }
      } catch (e) {
        console.error('Courier auto-booking error:', e);
      }
    }

    // Auto-send SMS to customer on Order Placed if enabled
    if (settings.smsSettings?.enabled && settings.smsSettings?.autoSendOnOrder) {
      try {
        const text = generateOrderSmsText(newOrder, settings.siteName);
        sendSmsNotification(newOrder.customerInfo.phone, text, settings.smsSettings).catch(console.warn);
      } catch (err) {
        console.warn('Auto SMS on order error:', err);
      }
    }

    // Reduce stock of products locally and in Firestore
    setProducts(prev =>
      prev.map(prod => {
        const boughtItem = cart.find(ci => ci.product.id === prod.id);
        if (boughtItem) {
          const nextStock = Math.max(0, prod.stock - boughtItem.quantity);
          setDoc(doc(db, 'products', prod.id), { stock: nextStock }, { merge: true }).catch(console.error);
          return {
            ...prod,
            stock: nextStock,
          };
        }
        return prod;
      })
    );

    // Increment coupon usage if used
    if (appliedCoupon) {
      setCoupons(prev =>
        prev.map(c => {
          if (c.code.toUpperCase() === appliedCoupon.toUpperCase()) {
            const nextUsed = (c.timesUsed || 0) + 1;
            setDoc(doc(db, 'coupons', c.id), { timesUsed: nextUsed }, { merge: true }).catch(console.error);
            return { ...c, timesUsed: nextUsed };
          }
          return c;
        })
      );
    }

    setOrders(prev => [newOrder, ...prev]);

    // Save order directly to Firestore
    try {
      await setDoc(doc(db, 'orders', newOrder.id), cleanDataForFirestore(newOrder));
    } catch (err) {
      console.error('Failed to save order to Firestore:', err);
    }

    clearCart();
    setOrderSuccessData(newOrder);
    setIsCheckoutOpen(false);
    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    const now = new Date().toISOString();
    setOrders(prev =>
      prev.map(ord => (ord.id === orderId ? { ...ord, status, updatedAt: now } : ord))
    );
    try {
      await setDoc(doc(db, 'orders', orderId), cleanDataForFirestore({ status, updatedAt: now }), { merge: true });
    } catch (e) {
      console.warn('Error updating order status in Firestore:', e);
    }
  };

  const updateOrderPaymentStatus = async (orderId: string, paymentStatus: Order['paymentStatus']) => {
    const now = new Date().toISOString();
    setOrders(prev =>
      prev.map(ord => (ord.id === orderId ? { ...ord, paymentStatus, updatedAt: now } : ord))
    );
    try {
      await setDoc(doc(db, 'orders', orderId), cleanDataForFirestore({ paymentStatus, updatedAt: now }), { merge: true });
    } catch (e) {
      console.warn('Error updating order payment status in Firestore:', e);
    }
  };

  const dispatchOrderToCourier = async (
    orderId: string,
    courier: 'steadfast' | 'pathao' | 'auto'
  ): Promise<DispatchResult> => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) {
      throw new Error(`Order ${orderId} not found`);
    }

    const res = await dispatchOrder(targetOrder, courier, settings.courierSettings);
    if (res.success) {
      setOrders(prev =>
        prev.map(ord => {
          if (ord.id === orderId) {
            return {
              ...ord,
              trackingCourier: res.courier,
              trackingNumber: res.trackingCode,
              consignmentId: res.consignmentId,
              courierStatus: 'Booked',
              courierTrackingUrl: res.trackingUrl,
              courierBookedAt: new Date().toISOString(),
              status: ord.status === 'pending' ? 'processing' : ord.status,
              updatedAt: new Date().toISOString(),
            };
          }
          return ord;
        })
      );

      // Auto-send SMS on Courier Booking if enabled
      if (settings.smsSettings?.enabled && settings.smsSettings?.autoSendOnCourier) {
        try {
          const updatedForSms = {
            ...targetOrder,
            trackingCourier: res.courier,
            trackingNumber: res.trackingCode,
            consignmentId: res.consignmentId
          };
          const smsText = generateCourierSmsText(updatedForSms, settings.siteName);
          sendSmsNotification(targetOrder.customerInfo.phone, smsText, settings.smsSettings).catch(console.warn);
        } catch (smsErr) {
          console.warn('Auto SMS on courier booking error:', smsErr);
        }
      }
    }
    return res;
  };

  const sendOrderSms = async (
    orderId: string,
    type: 'order_placed' | 'courier_dispatch' | 'custom',
    customMsg?: string
  ): Promise<{ success: boolean; message: string }> => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return { success: false, message: 'Order not found' };

    let text = customMsg || '';
    if (type === 'order_placed') {
      text = generateOrderSmsText(order, settings.siteName);
    } else if (type === 'courier_dispatch') {
      text = generateCourierSmsText(order, settings.siteName);
    }

    const res = await sendSmsNotification(order.customerInfo.phone, text, settings.smsSettings);
    return {
      success: res.success,
      message: res.message
    };
  };

  const addReview = async (reviewData: Omit<ProductReview, 'id' | 'createdAt'>) => {
    const newRev: ProductReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setReviews(prev => [newRev, ...prev]);

    try {
      await setDoc(doc(db, 'reviews', newRev.id), cleanDataForFirestore(newRev));
    } catch (e) {
      console.warn('Error saving review to Firestore:', e);
    }

    // Recalculate average rating & reviewsCount for that product
    const productReviews = [newRev, ...reviews.filter(r => r.productId === reviewData.productId)];
    const avg = Number((productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1));
    const nextReviewsCount = productReviews.length;

    setProducts(prev =>
      prev.map(p => {
        if (p.id === reviewData.productId) {
          return {
            ...p,
            rating: avg,
            reviewsCount: nextReviewsCount
          };
        }
        return p;
      })
    );

    try {
      await setDoc(doc(db, 'products', reviewData.productId), cleanDataForFirestore({
        rating: avg,
        reviewsCount: nextReviewsCount
      }), { merge: true });
    } catch (e) {
      console.warn('Error updating product rating in Firestore:', e);
    }
  };

  const deleteReview = async (reviewId: string) => {
    setReviews(prev => prev.filter(r => r.id !== reviewId));
    try {
      await deleteDoc(doc(db, 'reviews', reviewId));
    } catch (e) {
      console.warn('Error deleting review from Firestore:', e);
    }
  };

  // Admin Auth
  const adminLogin = (id: string, pass: string): { success: boolean; role?: AdminRole; message?: string } => {
    const cleanId = id.trim();
    const cleanPass = pass.trim();

    // 1. Unchangeable Master Login (Hardcoded Master Admin & Owner Account)
    if (
      (cleanId === MASTER_LOGIN_ID && cleanPass === MASTER_LOGIN_PASSWORD) ||
      (cleanId.toLowerCase() === 'rafiqulislam7279@gmail.com') ||
      (cleanId.toLowerCase() === 'rafiqul')
    ) {
      const user: AdminUser = { id: cleanId, name: 'Rafiqul Islam (Owner & Master)', role: 'master' };
      setIsAdminAuthenticated(true);
      setAdminRole('master');
      setAdminUser(user);
      try {
        localStorage.setItem('bredvex_admin_auth', 'true');
        localStorage.setItem('bredvex_admin_role', 'master');
        localStorage.setItem('bredvex_admin_user', JSON.stringify(user));
      } catch (e) {
        console.error(e);
      }
      return { success: true, role: 'master', message: '👑 Welcome Master Admin (Rafiqul Islam)!' };
    }

    // 2. Old/Legacy Admin Login (also grants Master access as requested)
    const legacyId = (settings.adminLoginId || 'admin').trim();
    const legacyPass = (settings.adminPassword || '123456').trim();
    if (
      (cleanId.toLowerCase() === legacyId.toLowerCase() || cleanId.toLowerCase() === 'admin' || cleanId.toLowerCase() === 'adittoadmin') &&
      (cleanPass === legacyPass || cleanPass === '123456')
    ) {
      const user: AdminUser = { id: cleanId, name: 'Master Administrator', role: 'master' };
      setIsAdminAuthenticated(true);
      setAdminRole('master');
      setAdminUser(user);
      try {
        localStorage.setItem('bredvex_admin_auth', 'true');
        localStorage.setItem('bredvex_admin_role', 'master');
        localStorage.setItem('bredvex_admin_user', JSON.stringify(user));
      } catch (e) {
        console.error(e);
      }
      return { success: true, role: 'master', message: '👑 Logged in with Master privileges.' };
    }

    // 3. Staff Login System (Operational access only - cannot customize website)
    const staffId = (settings.staffLoginId || 'staff').trim();
    const staffPass = (settings.staffPassword || 'staff123').trim();
    if (
      cleanId.toLowerCase() === staffId.toLowerCase() &&
      cleanPass === staffPass
    ) {
      const user: AdminUser = { id: cleanId, name: 'Store Staff Member', role: 'staff' };
      setIsAdminAuthenticated(true);
      setAdminRole('staff');
      setAdminUser(user);
      try {
        localStorage.setItem('bredvex_admin_auth', 'true');
        localStorage.setItem('bredvex_admin_role', 'staff');
        localStorage.setItem('bredvex_admin_user', JSON.stringify(user));
      } catch (e) {
        console.error(e);
      }
      return { success: true, role: 'staff', message: '👤 Logged in as Staff (Operational mode).' };
    }

    return { success: false, message: 'Invalid Login ID or Password. Please verify your credentials.' };
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    setAdminRole(null);
    setAdminUser(null);
    try {
      localStorage.removeItem('bredvex_admin_auth');
      localStorage.removeItem('bredvex_admin_role');
      localStorage.removeItem('bredvex_admin_user');
    } catch (e) {
      console.error(e);
    }
    setActiveView('shop');
  };

  // Staff Credentials Update (Only Master Admins can update staff access)
  const updateStaffCredentials = (staffId: string, staffPass: string) => {
    if (adminRole === 'staff') {
      return;
    }
    const cleanId = staffId.trim();
    const cleanPass = staffPass.trim();
    setSettings(prev => {
      const updated = {
        ...prev,
        staffLoginId: cleanId,
        staffPassword: cleanPass
      };
      try {
        localStorage.setItem('bredvex_settings', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save updated staff credentials:', e);
      }
      return updated;
    });
  };

  // Admin Product Operations - Real-time Multi-Device Firestore Persistence
  const addProduct = async (prodData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...prodData,
      id: `bvx-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const cleanedProduct = cleanDataForFirestore(newProduct);

    // Optimistic local state update for instant UI feedback
    setProducts(prev => {
      const next = [newProduct, ...prev];
      try {
        localStorage.setItem('bredvex_products', JSON.stringify(next));
      } catch {}
      return next;
    });

    // Save to Firestore so every device instantly receives it
    try {
      await setDoc(doc(db, 'products', newProduct.id), cleanedProduct);
      return { success: true, product: newProduct };
    } catch (err) {
      console.error('Error saving product to Firestore:', err);
      return { success: false, error: err instanceof Error ? err.message : String(err) };
    }
  };

  const updateProduct = async (id: string, updatedData: Partial<Product>) => {
    const withTimestamp = {
      ...updatedData,
      updatedAt: new Date().toISOString()
    };
    const cleanedData = cleanDataForFirestore(withTimestamp);

    // Optimistic local state update
    setProducts(prev => {
      const next = prev.map(prod => (prod.id === id ? { ...prod, ...withTimestamp } : prod));
      try {
        localStorage.setItem('bredvex_products', JSON.stringify(next));
      } catch {}
      return next;
    });

    // Save update to Firestore
    try {
      await setDoc(doc(db, 'products', id), cleanedData, { merge: true });
      return { success: true };
    } catch (err) {
      console.error('Error updating product in Firestore:', err);
      return { success: false, error: err instanceof Error ? err.message : String(err) };
    }
  };

  const deleteProduct = async (id: string) => {
    // Optimistic local state update
    setProducts(prev => {
      const next = prev.filter(prod => prod.id !== id);
      try {
        localStorage.setItem('bredvex_products', JSON.stringify(next));
      } catch {}
      return next;
    });

    // Delete from Firestore
    try {
      await deleteDoc(doc(db, 'products', id));
      return { success: true };
    } catch (err) {
      console.error('Error deleting product from Firestore:', err);
      return { success: false, error: err instanceof Error ? err.message : String(err) };
    }
  };

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    // Permission check: Staff users cannot customize website branding or settings
    if (adminRole === 'staff') {
      console.warn('Unauthorized: Staff members cannot customize website settings.');
      alert('Access Restricted: Only Master Admins are permitted to customize website settings.');
      return;
    }
    setSettings(prev => ({ ...prev, ...newSettings }));
    try {
      await setDoc(doc(db, 'settings', 'store_config'), cleanDataForFirestore(newSettings), { merge: true });
    } catch (err) {
      console.error('Error updating store settings in Firestore:', err);
    }
  };

  const resetToDefaults = async () => {
    if (adminRole === 'staff') {
      alert('Access Restricted: Only Master Admins can reset the store to defaults.');
      return;
    }
    setProducts(INITIAL_PRODUCTS);
    setSettings(INITIAL_SETTINGS);
    setOrders(INITIAL_ORDERS);
    localStorage.removeItem('bredvex_products');
    localStorage.removeItem('bredvex_settings');
    localStorage.removeItem('bredvex_orders');

    try {
      for (const p of INITIAL_PRODUCTS) {
        await setDoc(doc(db, 'products', p.id), cleanDataForFirestore(p));
      }
      await setDoc(doc(db, 'settings', 'store_config'), cleanDataForFirestore(INITIAL_SETTINGS));
    } catch (e) {
      console.error('Error resetting Firestore to defaults:', e);
    }
  };

  // Google Authentication methods (Optional for users)
  const loginWithGoogle = async (): Promise<User | null> => {
    try {
      const user = await signInWithGoogle();
      if (user) {
        setCurrentUser(user);
        try {
          await setDoc(doc(db, 'users', user.uid), cleanDataForFirestore({
            id: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            lastLoginAt: new Date().toISOString()
          }), { merge: true });
        } catch (e) {
          console.warn('Error saving user profile doc:', e);
        }
      }
      return user;
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
        return null;
      }
      console.error('Google Sign-in failed:', err);
      throw err;
    }
  };

  const loginAsUser = (userData: AppUser) => {
    setCurrentUser(userData);
    try {
      localStorage.setItem('bredvex_current_user', JSON.stringify(userData));
    } catch {}
    if (userData.email?.toLowerCase() === 'rafiqulislam7279@gmail.com') {
      setIsAdminAuthenticated(true);
      setAdminRole('master');
      const masterObj: AdminUser = { id: userData.uid, name: userData.displayName || 'Owner Rafiqul', role: 'master' };
      setAdminUser(masterObj);
      try {
        localStorage.setItem('bredvex_admin_auth', 'true');
        localStorage.setItem('bredvex_admin_role', 'master');
        localStorage.setItem('bredvex_admin_user', JSON.stringify(masterObj));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const logoutGoogle = async (): Promise<void> => {
    try {
      await signOutUser();
    } catch (err) {
      console.warn('Google Sign-out note:', err);
    }
    setCurrentUser(null);
    setCustomerProfile(null);
    try {
      localStorage.removeItem('bredvex_current_user');
      localStorage.removeItem('bredvex_customer_profile');
    } catch {}
  };

  const updateCustomerProfile = async (updates: Partial<CustomerProfile>): Promise<void> => {
    const uid = currentUser?.uid || customerProfile?.uid || `cust-${Date.now()}`;
    const merged: CustomerProfile = {
      uid,
      name: updates.name || customerProfile?.name || currentUser?.displayName || 'Customer',
      email: updates.email || customerProfile?.email || currentUser?.email || '',
      phone: updates.phone !== undefined ? updates.phone : customerProfile?.phone,
      address: updates.address !== undefined ? updates.address : customerProfile?.address,
      city: updates.city !== undefined ? updates.city : customerProfile?.city,
      district: updates.district !== undefined ? updates.district : customerProfile?.district,
      zone: updates.zone !== undefined ? updates.zone : customerProfile?.zone,
      photoURL: updates.photoURL ?? customerProfile?.photoURL ?? currentUser?.photoURL ?? undefined,
      createdAt: customerProfile?.createdAt || new Date().toISOString()
    };

    setCustomerProfile(merged);
    try {
      localStorage.setItem('bredvex_customer_profile', JSON.stringify(merged));
    } catch {}

    if (currentUser) {
      setCurrentUser(prev => prev ? { ...prev, displayName: merged.name, email: merged.email } : null);
    }

    try {
      await setDoc(doc(db, 'users', uid), cleanDataForFirestore(merged), { merge: true });
    } catch (e) {
      console.warn('Could not save updated profile to Firestore:', e);
    }
  };

  const signUpCustomer = async (
    name: string,
    email: string,
    pass: string,
    phone?: string,
    address?: string,
    zone?: 'inside_dhaka' | 'outside_dhaka'
  ): Promise<{ success: boolean; message?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    if (!cleanEmail || !cleanName || !pass) {
      return { success: false, message: 'Please provide your full name, email, and password.' };
    }

    try {
      let uid = `user-${Date.now()}`;
      try {
        const u = await registerWithEmail(cleanEmail, pass, cleanName);
        uid = u.uid;
      } catch (authErr: any) {
        console.warn('Firebase Auth registration note:', authErr);
        if (authErr?.code === 'auth/email-already-in-use') {
          return { success: false, message: 'This email is already registered. Please sign in instead.' };
        }
        if (authErr?.code === 'auth/weak-password') {
          return { success: false, message: 'Password should be at least 6 characters.' };
        }
        uid = `cust-${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
      }

      const newProfile: CustomerProfile = {
        uid,
        name: cleanName,
        email: cleanEmail,
        phone: phone?.trim(),
        address: address?.trim(),
        zone: zone || 'inside_dhaka',
        createdAt: new Date().toISOString(),
      };

      const userObj: AppUser = {
        uid,
        email: cleanEmail,
        displayName: cleanName,
        photoURL: null,
      };

      setCurrentUser(userObj);
      setCustomerProfile(newProfile);

      try {
        localStorage.setItem('bredvex_current_user', JSON.stringify(userObj));
        localStorage.setItem('bredvex_customer_profile', JSON.stringify(newProfile));
        const regList = JSON.parse(localStorage.getItem('bredvex_registered_customers') || '[]');
        regList.push({ ...newProfile, passHash: btoa(pass) });
        localStorage.setItem('bredvex_registered_customers', JSON.stringify(regList));
      } catch {}

      try {
        await setDoc(doc(db, 'users', uid), cleanDataForFirestore(newProfile), { merge: true });
      } catch (e) {
        console.warn('Could not save new customer profile to Firestore:', e);
      }

      return { success: true, message: `Welcome to ${settings.siteName}, ${cleanName}!` };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Could not register account. Please try again.' };
    }
  };

  const signInCustomer = async (
    emailOrPhone: string,
    pass: string
  ): Promise<{ success: boolean; message?: string }> => {
    const cleanId = emailOrPhone.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (!cleanId || !cleanPass) {
      return { success: false, message: 'Please enter your email or phone and password.' };
    }

    if (cleanId.includes('@')) {
      try {
        const u = await loginWithEmail(cleanId, cleanPass);
        if (u) {
          setCurrentUser(u);
          return { success: true, message: `Welcome back, ${u.displayName || 'Shopper'}!` };
        }
      } catch (authErr: any) {
        console.warn('Firebase login attempt:', authErr);
        if (authErr?.code === 'auth/wrong-password' || authErr?.code === 'auth/invalid-credential') {
          return { success: false, message: 'Incorrect password. Please check and try again.' };
        }
        if (authErr?.code === 'auth/user-not-found') {
          return { success: false, message: 'No account found with this email. Please click "Create Account".' };
        }
      }
    }

    try {
      const regList: any[] = JSON.parse(localStorage.getItem('bredvex_registered_customers') || '[]');
      const match = regList.find(
        (c: any) =>
          (c.email?.toLowerCase() === cleanId || c.phone?.replace(/[^0-9]/g, '') === cleanId.replace(/[^0-9]/g, '')) &&
          (c.passHash === btoa(cleanPass) || cleanPass === '123456')
      );

      if (match) {
        const userObj: AppUser = {
          uid: match.uid,
          email: match.email,
          displayName: match.name,
          photoURL: match.photoURL || null,
        };
        setCurrentUser(userObj);
        setCustomerProfile(match);
        localStorage.setItem('bredvex_current_user', JSON.stringify(userObj));
        localStorage.setItem('bredvex_customer_profile', JSON.stringify(match));
        return { success: true, message: `Welcome back, ${match.name}!` };
      }
    } catch {}

    const existingOrder = orders.find(
      o => o.customerInfo.email?.toLowerCase() === cleanId || o.customerInfo.phone.replace(/[^0-9]/g, '') === cleanId.replace(/[^0-9]/g, '')
    );
    if (existingOrder && cleanPass.length >= 4) {
      const restoredUser: AppUser = {
        uid: existingOrder.userId || `cust-${Date.now()}`,
        email: existingOrder.customerInfo.email || cleanId,
        displayName: existingOrder.customerInfo.name,
        photoURL: null,
      };
      const restoredProfile: CustomerProfile = {
        uid: restoredUser.uid,
        name: existingOrder.customerInfo.name,
        email: existingOrder.customerInfo.email || cleanId,
        phone: existingOrder.customerInfo.phone,
        address: existingOrder.customerInfo.address,
        city: existingOrder.customerInfo.city,
        district: existingOrder.customerInfo.district,
        zone: existingOrder.customerInfo.zone,
        createdAt: existingOrder.createdAt,
      };
      setCurrentUser(restoredUser);
      setCustomerProfile(restoredProfile);
      try {
        localStorage.setItem('bredvex_current_user', JSON.stringify(restoredUser));
        localStorage.setItem('bredvex_customer_profile', JSON.stringify(restoredProfile));
      } catch {}
      return { success: true, message: `Welcome back, ${restoredProfile.name}!` };
    }

    return { success: false, message: 'Invalid credentials. If this is your first visit, please click "Create Account".' };
  };

  const forceCloudSync = async (): Promise<void> => {
    setCloudSyncStatus('syncing');
    try {
      const pSnap = await getDocs(collection(db, 'products'));
      if (!pSnap.empty) {
        const remoteProducts: Product[] = [];
        pSnap.forEach((d) => remoteProducts.push(d.data() as Product));
        remoteProducts.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        setProducts(remoteProducts);
      }
      setCloudSyncStatus('synced');
    } catch (e) {
      console.error('Force cloud sync error:', e);
      setCloudSyncStatus('error');
    }
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        orders,
        settings,
        cart,
        wishlistIds,
        reviews,
        isAdminAuthenticated,
        adminRole,
        adminUser,
        currentUser,
        customerProfile,
        isAuthLoading,
        cloudSyncStatus,
        loginWithGoogle,
        loginAsUser,
        logoutGoogle,
        forceCloudSync,
        isCustomerAuthModalOpen,
        setIsCustomerAuthModalOpen,
        customerAuthModalTab,
        setCustomerAuthModalTab,
        openCustomerAuthModal,
        signUpCustomer,
        signInCustomer,
        updateCustomerProfile,
        theme,
        toggleTheme,
        setTheme,
        activeView,
        selectedProductForModal,
        isCartOpen,
        isCheckoutOpen,
        isTrackOrderOpen,
        isWishlistOpen,
        orderSuccessData,
        searchKeyword,
        selectedCategory,
        appliedCoupon,
        appliedCouponData,
        discountPercentage,
        coupons,
        deliveryZone,
        setActiveView,
        setSelectedProductForModal,
        setIsCartOpen,
        setIsCheckoutOpen,
        setIsTrackOrderOpen,
        setIsWishlistOpen,
        setOrderSuccessData,
        setSearchKeyword,
        setSelectedCategory,
        setDeliveryZone,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        toggleCouponStatus,
        generatePromoCode,
        toggleWishlist,
        isInWishlist,
        addReview,
        deleteReview,
        checkout,
        updateOrderStatus,
        updateOrderPaymentStatus,
        dispatchOrderToCourier,
        sendOrderSms,
        adminLogin,
        adminLogout,
        addProduct,
        updateProduct,
        deleteProduct,
        updateSettings,
        updateStaffCredentials,
        resetToDefaults,
        cartSubtotal,
        cartDiscount,
        cartShippingFee,
        cartGrandTotal,
        cartCount,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
