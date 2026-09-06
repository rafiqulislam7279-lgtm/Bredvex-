import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Truck, 
  Package, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  MapPin,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Order } from '../types';

export const TrackOrderModal: React.FC = () => {
  const { isTrackOrderOpen, setIsTrackOrderOpen, orders } = useStore();
  const [searchInput, setSearchInput] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [copiedTracking, setCopiedTracking] = useState(false);

  if (!isTrackOrderOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchInput.trim().toUpperCase();
    if (!query) return;

    setHasSearched(true);
    const found = orders.find(
      (o) =>
        o.orderNumber.toUpperCase() === query ||
        o.orderNumber.replace('#', '').toUpperCase() === query ||
        o.customerInfo.phone.replace(/[^0-9]/g, '').includes(query.replace(/[^0-9]/g, ''))
    );
    setSearchedOrder(found || null);
  };

  const getStepProgress = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 1;
      case 'processing':
        return 2;
      case 'shipped':
        return 3;
      case 'delivered':
        return 4;
      case 'cancelled':
        return 0;
      default:
        return 1;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200 cursor-pointer"
      onClick={() => setIsTrackOrderOpen(false)}
    >
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-serif">Track Your Order</h2>
              <p className="text-xs text-slate-500">
                অর্ডার ট্র্যাক করুন (অর্ডার নম্বর বা মোবাইল দিয়ে)
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsTrackOrderOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* Search Input Box */}
          <form onSubmit={handleSearch} className="space-y-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Enter Order ID (e.g. BVX-7824) or Phone Number"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-hidden focus:border-sky-500 focus:bg-white"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Track
              </button>
            </div>

            {/* Quick Demo Order Chips */}
            <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
              <span>Try test orders:</span>
              {orders.slice(0, 2).map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => {
                    setSearchInput(o.orderNumber);
                    setSearchedOrder(o);
                    setHasSearched(true);
                  }}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-mono text-[11px] transition-colors"
                >
                  #{o.orderNumber}
                </button>
              ))}
            </div>
          </form>

          {/* Results Area */}
          {hasSearched && !searchedOrder && (
            <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-2">
              <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
              <h4 className="font-bold text-slate-800 text-sm">No Order Found</h4>
              <p className="text-xs text-slate-600">
                Please check the Order ID or phone number. You can also contact our hotline support.
              </p>
            </div>
          )}

          {searchedOrder && (
            <div className="space-y-5">
              
              {/* Order Overview Header Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Order ID</span>
                  <h3 className="text-lg font-black font-mono text-slate-900">#{searchedOrder.orderNumber}</h3>
                  <p className="text-xs text-slate-500">
                    Placed on: {new Date(searchedOrder.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex flex-col items-end">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    searchedOrder.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                    searchedOrder.status === 'shipped' ? 'bg-sky-100 text-sky-800' :
                    searchedOrder.status === 'processing' ? 'bg-amber-100 text-amber-800' :
                    'bg-slate-200 text-slate-700'
                  }`}>
                    {searchedOrder.status}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-700 mt-1">
                    ৳{searchedOrder.grandTotal.toLocaleString()} ({searchedOrder.paymentMethod.toUpperCase()})
                  </span>
                </div>
              </div>

              {/* Visual Delivery Stepper */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Shipment Progress Timeline
                </h4>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {/* Step 1: Placed */}
                  <div className="relative flex items-start gap-3">
                    <div className={`absolute -left-6 p-1 rounded-full text-white ${
                      getStepProgress(searchedOrder.status) >= 1 ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">Order Placed & Verified</h5>
                      <p className="text-[11px] text-slate-500">Customer details verified by BREDVEX sales desk</p>
                    </div>
                  </div>

                  {/* Step 2: Processing */}
                  <div className="relative flex items-start gap-3">
                    <div className={`absolute -left-6 p-1 rounded-full text-white ${
                      getStepProgress(searchedOrder.status) >= 2 ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}>
                      <Package className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">Packed & Quality Checked</h5>
                      <p className="text-[11px] text-slate-500">Warehouse Banani, Dhaka hub packaging complete</p>
                    </div>
                  </div>

                  {/* Step 3: Shipped */}
                  <div className="relative flex items-start gap-3">
                    <div className={`absolute -left-6 p-1 rounded-full text-white ${
                      getStepProgress(searchedOrder.status) >= 3 ? 'bg-sky-500' : 'bg-slate-300'
                    }`}>
                      <Truck className="w-3.5 h-3.5" />
                    </div>
                    <div className="space-y-1.5 w-full">
                      <h5 className="text-xs font-bold text-slate-900 flex items-center justify-between">
                        <span>In Transit with {searchedOrder.trackingCourier || 'Steadfast / Pathao'}</span>
                        {searchedOrder.courierStatus && (
                          <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded-md">
                            {searchedOrder.courierStatus}
                          </span>
                        )}
                      </h5>
                      
                      <div className="flex flex-wrap items-center gap-2 pt-0.5">
                        <div className="px-2.5 py-1 bg-slate-100 rounded-lg text-[11px] font-mono font-bold text-slate-800 flex items-center gap-2 border border-slate-200">
                          <span>Consignment: {searchedOrder.trackingNumber || searchedOrder.consignmentId || 'Pending'}</span>
                          {(searchedOrder.trackingNumber || searchedOrder.consignmentId) && (
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(searchedOrder.trackingNumber || searchedOrder.consignmentId || '');
                                setCopiedTracking(true);
                                setTimeout(() => setCopiedTracking(false), 2000);
                              }}
                              className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                              title="Copy Tracking ID"
                            >
                              {copiedTracking ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            </button>
                          )}
                        </div>

                        {searchedOrder.courierTrackingUrl && (
                          <a
                            href={searchedOrder.courierTrackingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 text-[11px] font-bold border border-sky-200 transition-colors"
                          >
                            <span>Live Tracking Portal</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Step 4: Delivered */}
                  <div className="relative flex items-start gap-3">
                    <div className={`absolute -left-6 p-1 rounded-full text-white ${
                      getStepProgress(searchedOrder.status) >= 4 ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}>
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">Delivered to Recipient</h5>
                      <p className="text-[11px] text-slate-500">
                        Destination: {searchedOrder.customerInfo.address}, {searchedOrder.customerInfo.district}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items in order */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">Items in this shipment:</h4>
                <div className="space-y-1.5">
                  {searchedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={item.product.images[0]} alt="" className="w-8 h-8 rounded-md object-cover" />
                        <span className="font-medium text-slate-800">{item.product.name} (x{item.quantity})</span>
                      </div>
                      <span className="font-mono font-bold text-slate-900">৳{(item.product.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
