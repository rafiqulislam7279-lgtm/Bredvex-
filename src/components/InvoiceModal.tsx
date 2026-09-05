import React from 'react';
import { X, Printer, CheckCircle, Truck, Phone, Mail, MapPin, Package } from 'lucide-react';
import { Order, SiteSettings } from '../types';

interface InvoiceModalProps {
  order: Order;
  settings: SiteSettings;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, settings, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const isPaid = order.paymentStatus === 'paid' || order.paymentStatus === 'verified';
  const isCod = order.paymentMethod === 'cod';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[95vh] flex flex-col print:shadow-none print:border-none print:max-h-none print:rounded-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar (Hidden when printing) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Parcel Packing Memo & Invoice</span>
            <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-slate-200 text-slate-800">
              #{order.orderNumber}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice / Slip (প্রিন্ট করুন)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Area */}
        <div id="printable-invoice" className="p-8 sm:p-10 overflow-y-auto space-y-6 text-slate-800 font-sans print:p-6 print:m-0">
          
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-6 border-b-2 border-slate-900 pb-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                {settings.logoUrl ? (
                  <img src={settings.logoUrl} alt={settings.siteName} className="h-9 object-contain" />
                ) : (
                  <h1 className="text-2xl font-black font-serif tracking-tight text-slate-950">{settings.siteName}</h1>
                )}
              </div>
              <p className="text-xs font-medium text-slate-600 max-w-sm">
                {settings.tagline || 'Modern Premium E-Commerce in Bangladesh'}
              </p>
              <div className="text-[11px] text-slate-500 space-y-0.5 pt-1">
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{settings.address || 'House 42, Road 11, Banani, Dhaka-1213'}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>Hotline: {settings.contactPhone}</span>
                  {settings.contactEmail && <span>| {settings.contactEmail}</span>}
                </p>
              </div>
            </div>

            {/* Invoice Meta */}
            <div className="text-right space-y-1">
              <span className="inline-block px-3 py-1 bg-slate-900 text-white text-[11px] font-bold rounded-md tracking-wider uppercase">
                COMMERCIAL INVOICE
              </span>
              <p className="text-sm font-mono font-bold text-slate-950 pt-1">
                INVOICE: #{order.orderNumber}
              </p>
              <p className="text-xs text-slate-500">Date: {formattedDate}</p>
              <div className="pt-1">
                {isPaid ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                    <CheckCircle className="w-3 h-3" /> PAID ({order.paymentMethod.toUpperCase()})
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-300">
                    CASH ON DELIVERY (বাকি / COD)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Customer & Courier Logistics Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
            {/* Customer Details */}
            <div className="space-y-1.5">
              <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-slate-500">Bill & Ship To (গ্রাহকের তথ্য):</h3>
              <p className="text-sm font-bold text-slate-950">{order.customerInfo.name}</p>
              <p className="font-mono text-slate-800 font-semibold">{order.customerInfo.phone}</p>
              <p className="text-slate-600 leading-relaxed">{order.customerInfo.address}</p>
              <p className="text-slate-500">{order.customerInfo.city}, {order.customerInfo.district} ({order.customerInfo.zone === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'})</p>
              {order.customerInfo.deliveryNotes && (
                <p className="italic text-slate-500 pt-1">Note: "{order.customerInfo.deliveryNotes}"</p>
              )}
            </div>

            {/* Courier Booking & Tracking Info */}
            <div className="space-y-2 border-t sm:border-t-0 sm:border-l sm:border-slate-200 sm:pl-6 pt-3 sm:pt-0">
              <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-slate-500">Logistics & Courier Booking:</h3>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-rose-600" />
                <span className="font-bold text-slate-900">{order.trackingCourier || 'Standard Bangladesh Delivery'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px]">Consignment / Tracking ID:</span>
                <p className="font-mono font-bold text-slate-950 text-sm">
                  {order.trackingNumber || order.consignmentId || 'Pending Booking'}
                </p>
              </div>
              {/* Simulated barcode for logistics scan */}
              <div className="pt-1">
                <div className="font-mono tracking-widest text-center py-1 bg-white border border-slate-300 rounded font-bold text-slate-700 text-[10px] select-none">
                  ||| | |||| | ||||| || |||| ||| | ||
                  <div className="text-[9px] text-slate-400">{order.trackingNumber || order.orderNumber}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Itemized Products Table */}
          <div className="overflow-hidden border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-2.5 px-4">#</th>
                  <th className="py-2.5 px-4">Item & Specifications</th>
                  <th className="py-2.5 px-4 text-center">Qty</th>
                  <th className="py-2.5 px-4 text-right">Unit Price</th>
                  <th className="py-2.5 px-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 text-slate-400 font-mono">{idx + 1}</td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{item.product.name}</p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-0.5">
                        {item.selectedColor && <span>Color: <strong>{item.selectedColor}</strong></span>}
                        {item.selectedSize && <span>| Size: <strong>{item.selectedSize}</strong></span>}
                        <span>| SKU: {item.product.id}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-800 font-mono">{item.quantity}</td>
                    <td className="py-3 px-4 text-right font-mono text-slate-600">৳{item.product.price.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-950">৳{(item.product.price * item.quantity).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Totals & COD Amount */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pt-2">
            <div className="text-[11px] text-slate-500 max-w-xs space-y-1">
              <p className="font-bold text-slate-700">Terms & Conditions:</p>
              <p>• Check parcel before courier delivery rider leaves.</p>
              <p>• 7 days exchange warranty against manufacturing defects.</p>
              <p>• Thank you for choosing {settings.siteName}!</p>
            </div>

            <div className="w-full sm:w-72 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono">৳{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Charge ({order.customerInfo.zone === 'inside_dhaka' ? 'Dhaka' : 'Outside'}):</span>
                <span className="font-mono">৳{order.shippingCost.toLocaleString()}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount:</span>
                  <span className="font-mono">-৳{order.discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="border-t border-slate-300 pt-2 flex justify-between items-baseline font-bold text-slate-950 text-sm">
                <span>Grand Total:</span>
                <span className="font-mono text-base font-black text-slate-950">৳{order.grandTotal.toLocaleString()}</span>
              </div>

              {/* COD Collection Highlight */}
              <div className="mt-2 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-center">
                <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">
                  {isCod ? 'Cash to Collect on Delivery (COD)' : 'Payment Status'}
                </span>
                <span className="text-lg font-mono font-black text-rose-900">
                  {isCod ? `৳${order.grandTotal.toLocaleString()}` : 'PAID IN ADVANCE (৳0)'}
                </span>
              </div>
            </div>
          </div>

          {/* Signature Footer */}
          <div className="border-t border-dashed border-slate-300 pt-6 flex justify-between items-end text-xs text-slate-500">
            <div>
              <p className="font-mono text-[10px] text-slate-400">Printed from {settings.siteName} Admin Panel</p>
              <p className="text-[10px]">Support: {settings.contactPhone}</p>
            </div>
            <div className="text-center">
              <div className="w-36 border-b border-slate-400 mb-1"></div>
              <span className="text-[10px] font-semibold text-slate-600">Authorized Signature</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
