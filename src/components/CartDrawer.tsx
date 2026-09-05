import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Plus, 
  Minus, 
  Sparkles, 
  Tag, 
  Truck,
  CheckCircle2
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartSubtotal,
    cartDiscount,
    cartShippingFee,
    cartGrandTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    deliveryZone,
    setDeliveryZone,
    settings,
    setIsCheckoutOpen
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponStatus, setCouponStatus] = useState<{ success: boolean; message: string } | null>(null);

  if (!isCartOpen) return null;

  const freeShippingThreshold = settings.freeDeliveryThreshold;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponStatus(res);
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div 
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Cart Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-slate-900 text-white">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-base">Shopping Cart</h2>
                <p className="text-xs text-slate-500">
                  {cart.length} {cart.length === 1 ? 'item' : 'items'} in your bag
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-rose-600 hover:text-rose-700 font-medium px-2 py-1 rounded-md hover:bg-rose-50 transition-colors"
                >
                  Clear All
                </button>
              )}
              <button
                id="btn-close-cart"
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-rose-50/70 px-5 py-3 border-b border-rose-100/80 text-xs">
            <div className="flex items-center justify-between text-slate-700 mb-1.5 font-medium">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-rose-600" />
                {remainingForFreeShipping === 0 ? (
                  <strong className="text-emerald-700">🎉 Free Delivery Unlocked across BD!</strong>
                ) : (
                  <span>Add <strong className="text-rose-700 font-mono">৳{remainingForFreeShipping.toLocaleString()}</strong> more for Free Delivery</span>
                )}
              </span>
              <span className="font-bold font-mono text-[11px] text-slate-600">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-rose-200/70 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-600 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-800 text-base">Your Cart is Empty</h3>
                <p className="text-xs text-slate-500 max-w-xs">
                  Looks like you haven't added any premium lifestyle or tech items yet. Explore our top categories!
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-rose-600 transition-colors shadow-xs"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}-${idx}`} className="pt-3 first:pt-0 flex gap-3">
                  {/* Thumbnail */}
                  <div className="w-18 h-18 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/80">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedColor, item.selectedSize)}
                          className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Variant Pills */}
                      <div className="flex flex-wrap gap-1 mt-1 text-[10px] text-slate-500">
                        {item.selectedColor && (
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded-md font-medium text-slate-600">
                            {item.selectedColor}
                          </span>
                        )}
                        {item.selectedSize && (
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded-md font-medium text-slate-600">
                            {item.selectedSize}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price & Quantity Controls */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 p-0.5">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1, item.selectedColor, item.selectedSize)}
                          className="p-1 hover:bg-white text-slate-600 rounded-md transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold font-mono text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1, item.selectedColor, item.selectedSize)}
                          disabled={item.quantity >= item.product.stock}
                          className="p-1 hover:bg-white text-slate-600 rounded-md transition-colors disabled:opacity-30"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-bold font-mono text-slate-900">
                        ৳{(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Calculations & Checkout */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/70 space-y-3.5">
              
              {/* Delivery Zone Selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Delivery Destination:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setDeliveryZone('inside_dhaka')}
                    className={`py-1.5 px-2.5 rounded-lg text-xs font-medium border text-left flex items-center justify-between transition-all cursor-pointer ${
                      deliveryZone === 'inside_dhaka'
                        ? 'border-rose-600 bg-rose-50 text-rose-700 font-semibold shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span>Inside Dhaka</span>
                    <span className="font-mono text-[11px]">৳{settings.insideDhakaFee}</span>
                  </button>
                  <button
                    onClick={() => setDeliveryZone('outside_dhaka')}
                    className={`py-1.5 px-2.5 rounded-lg text-xs font-medium border text-left flex items-center justify-between transition-all cursor-pointer ${
                      deliveryZone === 'outside_dhaka'
                        ? 'border-rose-600 bg-rose-50 text-rose-700 font-semibold shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span>Outside Dhaka</span>
                    <span className="font-mono text-[11px]">৳{settings.outsideDhakaFee}</span>
                  </button>
                </div>
              </div>

              {/* Coupon Code Input */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Code: <strong>{appliedCoupon}</strong> Applied</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-slate-500 hover:text-rose-600 font-bold text-[11px]"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Discount Code (e.g. BREDVEX10)"
                        className="w-full pl-8 pr-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-hidden focus:border-rose-500 uppercase"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponStatus && !appliedCoupon && (
                  <p className="text-[11px] text-rose-600 mt-1 font-medium">{couponStatus.message}</p>
                )}
              </div>

              {/* Cost Summary Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200/80">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono font-medium text-slate-800">৳{cartSubtotal.toLocaleString()}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount</span>
                    <span className="font-mono">-৳{cartDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span className="font-mono font-medium text-slate-800">
                    {cartShippingFee === 0 ? (
                      <strong className="text-emerald-600">FREE</strong>
                    ) : (
                      `৳${cartShippingFee.toLocaleString()}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Grand Total</span>
                  <span className="font-mono text-base text-rose-600">
                    ৳{cartGrandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                id="btn-checkout-drawer"
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Proceed to Checkout (অর্ডার কনফার্ম করুন)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-center text-slate-400">
                🔒 100% Verified Delivery across Bangladesh • Pay via bKash, Nagad or Cash on Delivery
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
