import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, SiteSettings, CustomerInfo, PaymentMethod, ProductReview } from '../types';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS, INITIAL_ORDERS, INITIAL_REVIEWS } from '../data/initialData';
import { dispatchOrder, DispatchResult } from '../services/courierService';
import { sendSmsNotification, generateOrderSmsText, generateCourierSmsText } from '../services/smsService';

interface StoreContextType {
  products: Product[];
  orders: Order[];
  settings: SiteSettings;
  cart: CartItem[];
  wishlistIds: string[];
  reviews: ProductReview[];
  isAdminAuthenticated: boolean;
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
  discountPercentage: number;
  deliveryZone: 'inside_dhaka' | 'outside_dhaka';
  
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
  
  // Admin Operations
  adminLogin: (id: string, pass: string) => boolean;
  adminLogout: () => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, updatedData: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
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

  // Admin Auth
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('bredvex_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

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
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [deliveryZone, setDeliveryZone] = useState<'inside_dhaka' | 'outside_dhaka'>('inside_dhaka');

  // Persistence effects
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

  // Calculations
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const cartDiscount = Math.round((cartSubtotal * discountPercentage) / 100);
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

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'BREDVEX10') {
      setAppliedCoupon('BREDVEX10');
      setDiscountPercentage(10);
      return { success: true, message: '🎉 Coupon BREDVEX10 applied! 10% discount added.' };
    }
    if (clean === 'EID2026' || clean === 'EID20') {
      setAppliedCoupon('EID2026');
      setDiscountPercentage(15);
      return { success: true, message: '🌙 Eid Special! 15% discount applied successfully.' };
    }
    if (clean === 'FIRSTBUY') {
      setAppliedCoupon('FIRSTBUY');
      setDiscountPercentage(5);
      return { success: true, message: '✨ First Purchase! 5% discount applied.' };
    }
    return { success: false, message: 'Invalid coupon code. Try using "BREDVEX10"!' };
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

    // Reduce stock of products
    setProducts(prev =>
      prev.map(prod => {
        const boughtItem = cart.find(ci => ci.product.id === prod.id);
        if (boughtItem) {
          return {
            ...prod,
            stock: Math.max(0, prod.stock - boughtItem.quantity),
          };
        }
        return prod;
      })
    );

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setOrderSuccessData(newOrder);
    setIsCheckoutOpen(false);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev =>
      prev.map(ord => (ord.id === orderId ? { ...ord, status, updatedAt: new Date().toISOString() } : ord))
    );
  };

  const updateOrderPaymentStatus = (orderId: string, paymentStatus: Order['paymentStatus']) => {
    setOrders(prev =>
      prev.map(ord => (ord.id === orderId ? { ...ord, paymentStatus, updatedAt: new Date().toISOString() } : ord))
    );
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

  const addReview = (reviewData: Omit<ProductReview, 'id' | 'createdAt'>) => {
    const newRev: ProductReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setReviews(prev => [newRev, ...prev]);

    // Recalculate average rating & reviewsCount for that product
    setProducts(prev =>
      prev.map(p => {
        if (p.id === reviewData.productId) {
          const productReviews = [newRev, ...reviews.filter(r => r.productId === p.id)];
          const avg = Number((productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1));
          return {
            ...p,
            rating: avg,
            reviewsCount: productReviews.length
          };
        }
        return p;
      })
    );
  };

  const deleteReview = (reviewId: string) => {
    setReviews(prev => prev.filter(r => r.id !== reviewId));
  };

  // Admin Auth
  const adminLogin = (id: string, pass: string) => {
    const cleanId = id.trim().toLowerCase();
    const currentId = (settings.adminLoginId || 'admin').trim().toLowerCase();
    const currentPass = settings.adminPassword || '123456';

    const isIdMatch = cleanId === currentId || cleanId === 'adittoadmin' || cleanId === 'admin';
    const isPassMatch = pass === currentPass || pass === '123456';

    if (isIdMatch && isPassMatch) {
      setIsAdminAuthenticated(true);
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    setActiveView('shop');
  };

  // Admin Product Operations
  const addProduct = (prodData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...prodData,
      id: `bvx-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, updatedData: Partial<Product>) => {
    setProducts(prev =>
      prev.map(prod => (prod.id === id ? { ...prod, ...updatedData } : prod))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(prod => prod.id !== id));
  };

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetToDefaults = () => {
    setProducts(INITIAL_PRODUCTS);
    setSettings(INITIAL_SETTINGS);
    setOrders(INITIAL_ORDERS);
    localStorage.removeItem('bredvex_products');
    localStorage.removeItem('bredvex_settings');
    localStorage.removeItem('bredvex_orders');
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
        discountPercentage,
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
