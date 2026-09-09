import React from 'react';
import { Heart, ShoppingBag, Star, Eye, MessageCircle } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist, setSelectedProductForModal, settings } = useStore();

  const isWishlisted = isInWishlist(product.id);
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // WhatsApp Link for quick order
  const rawWaNumber = settings.whatsappNumber || settings.contactPhone || '01711223344';
  const cleanWaNumber = rawWaNumber.replace(/[^0-9]/g, '');
  const formattedWa = cleanWaNumber.startsWith('88') ? cleanWaNumber : `88${cleanWaNumber.replace(/^0/, '')}`;
  const waMessage = encodeURIComponent(
    `Assalamu Alaikum, I want to order this product from ${settings.siteName}:\n\n` +
    `🛍️ *Product:* ${product.name}\n` +
    `💰 *Price:* ৳${product.price.toLocaleString()}\n` +
    `Link: ${window.location.origin}\n\nPlease confirm my order!`
  );
  const whatsappUrl = `https://wa.me/${formattedWa}?text=${waMessage}`;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => setSelectedProductForModal(product)}
      className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-500/50 shadow-xs hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* Product Image Area */}
      <div className="relative aspect-square w-full bg-slate-50 dark:bg-slate-800/50 overflow-hidden">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80'}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Badges Container */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 text-[11px] font-bold text-white bg-rose-600 rounded-md shadow-xs">
              -{discountPercent}% OFF
            </span>
          )}
          {product.isTrending && (
            <span className="px-2 py-0.5 text-[10px] font-bold text-amber-900 bg-amber-300/90 rounded-md shadow-xs">
              🔥 Trending
            </span>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-bold text-red-700 bg-red-100 border border-red-200 rounded-md">
              Only {product.stock} left
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          id={`btn-wishlist-${product.id}`}
          onClick={handleWishlistToggle}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md shadow-sm transition-all cursor-pointer z-10 ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 shadow-rose-200'
              : 'bg-white/80 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 hover:text-rose-600 hover:bg-white dark:hover:bg-slate-800'
          }`}
          aria-label="Add to wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Quick View Button Hover Overlay */}
        <div className="absolute inset-x-0 bottom-3 px-3 hidden group-hover:flex items-center justify-center gap-2 z-10 transition-opacity duration-200">
          <button
            onClick={() => setSelectedProductForModal(product)}
            className="w-full py-2 px-3 bg-slate-900/90 hover:bg-slate-900 backdrop-blur-md text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-lg"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="flex flex-col flex-1 p-4">
        {/* Category & Rating */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
          <span className="uppercase tracking-wider font-semibold text-[10px] text-rose-600 dark:text-rose-400">
            {product.category}
          </span>
          <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-[11px]">{product.rating}</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Product Name */}
        <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2 leading-snug group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
          {product.name}
        </h3>

        {/* Bengali Name if present */}
        {product.banglaName && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
            {product.banglaName}
          </p>
        )}

        {/* Price & Add to Cart Area */}
        <div className="mt-auto pt-3 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white font-mono">
                ৳{product.price.toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 dark:text-slate-500 line-through font-mono">
                  ৳{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
              {product.stock > 0 ? '✓ In Stock' : 'Out of Stock'}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5">
            <a
              id={`btn-wa-${product.id}`}
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 transition-all shadow-xs flex items-center justify-center cursor-pointer border border-emerald-200/60 dark:border-emerald-800/50"
              title="Order on WhatsApp (হোয়াটসঅ্যাপে সরাসরি অর্ডার)"
            >
              <MessageCircle className="w-4 h-4" />
            </a>

            {/* Quick Cart Button */}
            <button
              id={`btn-add-cart-${product.id}`}
              onClick={handleQuickAdd}
              disabled={product.stock <= 0}
              className={`p-2.5 rounded-xl font-medium transition-all shadow-xs flex items-center justify-center cursor-pointer ${
                product.stock > 0
                  ? 'bg-slate-900 dark:bg-rose-600 text-white hover:bg-rose-600 dark:hover:bg-rose-500 hover:shadow-rose-200'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
              title="Add to Cart"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
