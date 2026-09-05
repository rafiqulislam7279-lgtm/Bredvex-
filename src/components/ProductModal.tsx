import React, { useState } from 'react';
import { 
  X, 
  Star, 
  ShoppingBag, 
  Heart, 
  Truck, 
  ShieldCheck, 
  RefreshCcw, 
  Check, 
  Plus, 
  Minus,
  Sparkles,
  Share2,
  MessageCircle,
  Send,
  MessageSquarePlus
} from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    setIsCheckoutOpen,
    settings,
    reviews,
    addReview
  } = useStore();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors && product.colors.length > 0 ? product.colors[0] : ''
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : ''
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'reviews'>('details');
  const [copied, setCopied] = useState(false);

  // Review submission state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerCity, setReviewerCity] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const isWishlisted = isInWishlist(product.id);
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Filter reviews for this product
  const productReviews = reviews.filter(r => r.productId === product.id);

  // Pre-formatted WhatsApp order message
  const rawWaNumber = settings.whatsappNumber || settings.contactPhone || '01711223344';
  const cleanWaNumber = rawWaNumber.replace(/[^0-9]/g, '');
  const formattedWa = cleanWaNumber.startsWith('88') ? cleanWaNumber : `88${cleanWaNumber.replace(/^0/, '')}`;
  const waMessage = encodeURIComponent(
    `Assalamu Alaikum, I would like to order this item from ${settings.siteName}:\n\n` +
    `🛍️ *Product:* ${product.name}\n` +
    `💰 *Price:* ৳${product.price.toLocaleString()}\n` +
    `📦 *Quantity:* ${quantity}\n` +
    (selectedColor ? `🎨 *Color:* ${selectedColor}\n` : '') +
    (selectedSize ? `📏 *Size:* ${selectedSize}\n` : '') +
    `💵 *Total:* ৳${(product.price * quantity).toLocaleString()}\n\n` +
    `Please confirm my delivery address and payment options!`
  );
  const whatsappUrl = `https://wa.me/${formattedWa}?text=${waMessage}`;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor || undefined, selectedSize || undefined);
    onClose();
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor || undefined, selectedSize || undefined);
    onClose();
    setIsCheckoutOpen(true);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) return;

    addReview({
      productId: product.id,
      userName: reviewerName.trim(),
      userLocation: reviewerCity.trim() || 'Dhaka',
      rating: newRating,
      comment: reviewComment.trim(),
      verifiedBuyer: true
    });

    setReviewSuccess(true);
    setReviewerName('');
    setReviewerCity('');
    setReviewComment('');
    setTimeout(() => {
      setReviewSuccess(false);
      setShowReviewForm(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span className="text-rose-600 font-bold">{product.category}</span>
            <span>/</span>
            <span className="truncate max-w-[200px]">{product.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors text-xs flex items-center gap-1 cursor-pointer"
              title="Share product"
            >
              <Share2 className="w-4 h-4" />
              {copied && <span className="text-emerald-600 font-bold text-[10px]">Link Copied!</span>}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Left Column: Image Gallery */}
            <div className="md:col-span-6 space-y-3">
              {/* Main Image */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={product.images[selectedImageIndex] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {discountPercent > 0 && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-bold text-white bg-rose-600 rounded-lg shadow-sm">
                    Save {discountPercent}%
                  </span>
                )}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 backdrop-blur-md shadow-md text-slate-600 hover:text-rose-600 transition-all cursor-pointer"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                        selectedImageIndex === idx ? 'border-rose-600 ring-2 ring-rose-500/20' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              )}

              {/* Bangladeshi Delivery Notice Card */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-2">
                <div className="flex items-center gap-2 text-slate-700 font-semibold">
                  <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Delivery across all 64 Districts of Bangladesh</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1 border-t border-slate-200/60">
                  <div>
                    <span className="font-semibold text-slate-800">Inside Dhaka:</span> 24-48 Hours (৳{settings.insideDhakaFee})
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800">Outside Dhaka:</span> 48-72 Hours (৳{settings.outsideDhakaFee})
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Product Specs & Purchase Options */}
            <div className="md:col-span-6 space-y-5">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                  {product.name}
                </h1>
                {product.banglaName && (
                  <p className="text-sm font-medium text-rose-700 mt-1">
                    {product.banglaName}
                  </p>
                )}

                {/* Rating & Reviews Count */}
                <div className="flex items-center gap-3 mt-2.5">
                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-slate-800">{product.rating}</span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    {product.reviewsCount} verified reviews
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className={`text-xs font-bold ${product.stock > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
                  </span>
                </div>
              </div>

              {/* Price Box */}
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-slate-900 font-mono">
                  ৳{product.price.toLocaleString()}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-base text-slate-400 line-through font-mono">
                    ৳{product.originalPrice.toLocaleString()}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="ml-auto text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                    Save ৳{(product.originalPrice! - product.price).toLocaleString()}
                  </span>
                )}
              </div>

              {/* Color Selection if available */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                    <span>Choose Color:</span>
                    <span className="text-rose-600 font-semibold">{selectedColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                          selectedColor === color
                            ? 'border-rose-600 bg-rose-50 text-rose-700 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                        }`}
                      >
                        {selectedColor === color && <Check className="w-3.5 h-3.5 text-rose-600" />}
                        <span>{color}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection if available */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                    <span>Choose Size:</span>
                    <span className="text-rose-600 font-semibold">{selectedSize}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-10 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          selectedSize === size
                            ? 'border-rose-600 bg-rose-600 text-white shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Quantity:
                </label>
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center border border-slate-300 rounded-xl bg-slate-50 p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-1.5 rounded-lg hover:bg-white text-slate-600 transition-colors cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-12 text-center text-sm font-bold font-mono text-slate-800">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                      className="p-1.5 rounded-lg hover:bg-white text-slate-600 transition-colors cursor-pointer disabled:opacity-40"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    Subtotal: <strong className="text-slate-900 font-mono">৳{(product.price * quantity).toLocaleString()}</strong>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  id="btn-modal-add-to-cart"
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
                <button
                  id="btn-modal-buy-now"
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className="py-3.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-md shadow-rose-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Buy Now (অর্ডার করুন)</span>
                </button>
              </div>

              {/* WhatsApp Quick Order Button */}
              <a
                id="btn-modal-order-whatsapp"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Order via WhatsApp (হোয়াটসঅ্যাপে সরাসরি অর্ডার করুন)</span>
              </a>

              {/* Guarantee items */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>100% Original Authentic Product</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RefreshCcw className="w-4 h-4 text-sky-600" />
                  <span>7 Days Return & Replacement</span>
                </div>
              </div>

            </div>

          </div>

          {/* Tabbed Info Section */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex items-center gap-4 border-b border-slate-200 text-sm font-semibold">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-2.5 transition-colors cursor-pointer border-b-2 ${
                  activeTab === 'details' ? 'border-rose-600 text-rose-600' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Product Description
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-2.5 transition-colors cursor-pointer border-b-2 ${
                  activeTab === 'specs' ? 'border-rose-600 text-rose-600' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Key Features ({product.features.length})
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-2.5 transition-colors cursor-pointer border-b-2 ${
                  activeTab === 'reviews' ? 'border-rose-600 text-rose-600' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Customer Reviews ({product.reviewsCount})
              </button>
            </div>

            <div className="pt-4">
              {activeTab === 'details' && (
                <div className="text-slate-700 text-sm leading-relaxed space-y-3">
                  <p>{product.description}</p>
                  <p className="text-xs text-slate-500">
                    Every order from BREDVEX is inspected by our quality assurance team in Banani, Dhaka before dispatching with authorized couriers.
                  </p>
                </div>
              )}

              {activeTab === 'specs' && (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-xs">{feature}</span>
                    </li>
                  ))}
                </ul>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  {/* Rating Header with Write Review Trigger */}
                  <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200/80 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="text-3xl font-black text-slate-900">{product.rating.toFixed(1)}</span>
                        <span className="text-xs text-slate-500 ml-1 font-medium">/ 5.0</span>
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star 
                              key={s} 
                              className={`w-4 h-4 ${
                                s <= Math.round(product.rating) 
                                  ? 'fill-amber-400 text-amber-400' 
                                  : 'fill-slate-200 text-slate-300'
                              }`} 
                            />
                          ))}
                        </div>
                        <p className="text-[11px] text-slate-500">Based on {productReviews.length || product.reviewsCount} customer reviews</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquarePlus className="w-3.5 h-3.5" />
                      <span>{showReviewForm ? 'Cancel Form' : 'Write a Review (রিভিউ দিন)'}</span>
                    </button>
                  </div>

                  {/* Submission Form Modal/Section */}
                  {showReviewForm && (
                    <form onSubmit={handleSubmitReview} className="p-5 bg-white rounded-2xl border-2 border-rose-200 space-y-4 shadow-sm animate-in fade-in duration-200">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Submit Your Product Review & Rating:</h4>
                        <span className="text-[11px] text-emerald-600 font-semibold">✓ Verified Customer</span>
                      </div>

                      {/* Interactive Star Rating */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Your Rating (স্টার সিলেক্ট করুন):</label>
                        <div className="flex items-center gap-1.5 pt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewRating(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              className="p-1 text-slate-300 transition-transform hover:scale-110 cursor-pointer"
                            >
                              <Star
                                className={`w-6 h-6 transition-colors ${
                                  (hoverRating || newRating) >= star
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-slate-300 fill-slate-100'
                                }`}
                              />
                            </button>
                          ))}
                          <span className="text-xs font-bold text-slate-700 ml-2">
                            {hoverRating || newRating} / 5 Stars
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700">Your Name (আপনার নাম) *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Mahfuzur Rahman"
                            value={reviewerName}
                            onChange={(e) => setReviewerName(e.target.value)}
                            className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700">District / City (জেলা/শহর)</label>
                          <input
                            type="text"
                            placeholder="e.g. Mirpur, Dhaka"
                            value={reviewerCity}
                            onChange={(e) => setReviewerCity(e.target.value)}
                            className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Your Feedback (আপনার অভিজ্ঞতা ও মন্তব্য) *</label>
                        <textarea
                          rows={3}
                          required
                          placeholder="Tell others about product build quality, delivery speed, packaging, etc."
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 resize-none"
                        />
                      </div>

                      {reviewSuccess && (
                        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span>Thank you! Your review has been submitted successfully.</span>
                        </div>
                      )}

                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setShowReviewForm(false)}
                          className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Submit Review (মতামত দিন)</span>
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Reviews List */}
                  <div className="space-y-3">
                    {productReviews.length > 0 ? (
                      productReviews.map((rev) => (
                        <div key={rev.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-slate-900">{rev.userName}</span>
                              {rev.userLocation && (
                                <span className="text-[10px] text-slate-500">({rev.userLocation})</span>
                              )}
                              {rev.verifiedBuyer && (
                                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                  ✓ Verified Buyer
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star 
                                  key={s} 
                                  className={`w-3.5 h-3.5 ${
                                    s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                                  }`} 
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed">{rev.comment}</p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            {new Date(rev.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 bg-slate-50 rounded-2xl border border-slate-200/60 text-slate-500 text-xs">
                        <p>No reviews yet for this product. Be the first to share your experience!</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
