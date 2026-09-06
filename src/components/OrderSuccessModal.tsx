import React from 'react';
import { 
  CheckCircle2, 
  X, 
  Printer, 
  Truck, 
  ShoppingBag, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const OrderSuccessModal: React.FC = () => {
  const { 
    orderSuccessData, 
    setOrderSuccessData, 
    setIsTrackOrderOpen,
    setActiveView,
    settings 
  } = useStore();

  if (!orderSuccessData) return null;

  const handleTrack = () => {
    setOrderSuccessData(null);
    setIsTrackOrderOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200 cursor-pointer"
      onClick={() => setOrderSuccessData(null)}
    >
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[95vh] flex flex-col cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 text-center relative">
          <button
            onClick={() => setOrderSuccessData(null)}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-xs shadow-inner">
            <CheckCircle2 className="w-9 h-9 text-white" />
          </div>

          <span className="text-xs font-semibold tracking-wider uppercase px-3 py-1 bg-white/20 rounded-full">
            Order Placed Successfully!
          </span>
          <h2 className="text-2xl font-black mt-2 font-serif">ধন্যবাদ, আপনার অর্ডারটি গৃহীত হয়েছে</h2>
          <p className="text-xs text-emerald-100 mt-1">
            Order ID: <strong className="font-mono text-white text-sm">#{orderSuccessData.orderNumber}</strong>
          </p>
        </div>

        {/* Body Content */}
        <div className="overflow-y-auto p-6 space-y-4 flex-1 text-xs">
          
          {/* Status & Delivery Estimation Banner */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-900">
              <Truck className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold">Estimated Delivery: {orderSuccessData.customerInfo.zone === 'inside_dhaka' ? '24 - 48 Hours' : '48 - 72 Hours'}</p>
                <p className="text-[11px] text-emerald-700">Courier Partner: {orderSuccessData.trackingCourier}</p>
              </div>
            </div>
            <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-emerald-600 text-white uppercase">
              {orderSuccessData.paymentMethod.toUpperCase()}
            </span>
          </div>

          {/* Customer & Shipping Summary */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Customer & Delivery Details</h4>
            <div className="grid grid-cols-2 gap-2 text-slate-600">
              <div>
                <p className="text-slate-400">Recipient Name:</p>
                <p className="font-semibold text-slate-900">{orderSuccessData.customerInfo.name}</p>
              </div>
              <div>
                <p className="text-slate-400">Contact Number:</p>
                <p className="font-semibold font-mono text-slate-900">{orderSuccessData.customerInfo.phone}</p>
              </div>
            </div>
            <div className="pt-1 border-t border-slate-200/60">
              <p className="text-slate-400">Delivery Address:</p>
              <p className="font-medium text-slate-800">
                {orderSuccessData.customerInfo.address}, {orderSuccessData.customerInfo.city}, {orderSuccessData.customerInfo.district}
              </p>
            </div>
            {orderSuccessData.transactionId && (
              <div className="pt-1 border-t border-slate-200/60 flex justify-between">
                <span className="text-slate-400">Transaction ID (TrxID):</span>
                <span className="font-mono font-bold text-slate-900">{orderSuccessData.transactionId}</span>
              </div>
            )}
          </div>

          {/* Items Summary */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <div className="bg-slate-100/70 px-4 py-2 font-bold text-slate-700 text-[11px] uppercase tracking-wider">
              Ordered Items ({orderSuccessData.items.length})
            </div>
            <div className="divide-y divide-slate-100 p-2">
              {orderSuccessData.items.map((item, idx) => (
                <div key={idx} className="p-2 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="truncate">
                      <p className="font-bold text-slate-800 truncate">{item.product.name}</p>
                      <p className="text-[10px] text-slate-500">
                        Qty: {item.quantity} {item.selectedColor ? `• Color: ${item.selectedColor}` : ''}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-slate-900 shrink-0">
                    ৳{(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <div className="bg-slate-50 p-3 border-t border-slate-200 space-y-1 text-[11px]">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono">৳{orderSuccessData.subtotal.toLocaleString()}</span>
              </div>
              {orderSuccessData.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount ({orderSuccessData.couponCode}):</span>
                  <span className="font-mono">-৳{orderSuccessData.discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Delivery:</span>
                <span className="font-mono">{orderSuccessData.shippingCost === 0 ? 'FREE' : `৳${orderSuccessData.shippingCost}`}</span>
              </div>
              <div className="flex justify-between text-xs font-black text-slate-900 pt-1 border-t border-slate-200">
                <span>Total Paid / Due:</span>
                <span className="font-mono text-rose-600 text-sm">৳{orderSuccessData.grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 text-center">
            Our support desk will call you from <strong className="text-slate-800">{settings.contactPhone}</strong> to confirm dispatch.
          </p>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex flex-wrap items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice</span>
          </button>
          
          <button
            onClick={handleTrack}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Truck className="w-4 h-4 text-sky-400" />
            <span>Track This Order</span>
          </button>

          <button
            onClick={() => {
              setOrderSuccessData(null);
              setActiveView('shop');
            }}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
