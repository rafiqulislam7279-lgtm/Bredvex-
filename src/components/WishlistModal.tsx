import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const WishlistModal: React.FC = () => {
  const { 
    isWishlistOpen, 
    setIsWishlistOpen, 
    wishlistIds, 
    products, 
    toggleWishlist, 
    addToCart,
    setSelectedProductForModal 
  } = useStore();

  if (!isWishlistOpen) return null;

  const savedProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200 cursor-pointer"
      onClick={() => setIsWishlistOpen(false)}
    >
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <Heart className="w-5 h-5 fill-rose-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-serif">Saved Wishlist</h2>
              <p className="text-xs text-slate-500">
                {savedProducts.length} {savedProducts.length === 1 ? 'item' : 'items'} saved for later
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsWishlistOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {savedProducts.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center text-rose-300 mx-auto">
                <Heart className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Your Wishlist is Empty</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Tap the heart icon on any product to save it to your personal collection.
              </p>
            </div>
          ) : (
            savedProducts.map((prod) => (
              <div
                key={prod.id}
                className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3 hover:border-rose-200 transition-all"
              >
                <div 
                  className="flex items-center gap-3 cursor-pointer overflow-hidden flex-1"
                  onClick={() => {
                    setIsWishlistOpen(false);
                    setSelectedProductForModal(prod);
                  }}
                >
                  <img
                    src={prod.images[0]}
                    alt={prod.name}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="truncate">
                    <h4 className="text-xs font-bold text-slate-900 truncate hover:text-rose-600 transition-colors">
                      {prod.name}
                    </h4>
                    <p className="text-[11px] font-mono font-bold text-slate-700 mt-0.5">
                      ৳{prod.price.toLocaleString()}
                    </p>
                    <span className="text-[10px] text-emerald-600 font-semibold">
                      {prod.stock > 0 ? '✓ In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => addToCart(prod, 1)}
                    disabled={prod.stock <= 0}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-rose-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Add to Cart</span>
                  </button>
                  <button
                    onClick={() => toggleWishlist(prod.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
