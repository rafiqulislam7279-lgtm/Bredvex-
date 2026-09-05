import React, { useState, useMemo } from 'react';
import { 
  StoreProvider, 
  useStore 
} from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { TrackOrderModal } from './components/TrackOrderModal';
import { WishlistModal } from './components/WishlistModal';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { INITIAL_CATEGORIES } from './data/initialData';
import { 
  SlidersHorizontal, 
  Sparkles, 
  ArrowUpDown, 
  Check, 
  X, 
  Truck, 
  ShieldCheck, 
  CreditCard, 
  RotateCcw,
  Zap,
  ShoppingBag
} from 'lucide-react';

const MainShop: React.FC = () => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    searchKeyword,
    setSearchKeyword,
    selectedProductForModal,
    setSelectedProductForModal,
    settings,
    setIsCartOpen
  } = useStore();

  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('featured');
  const [onlyInStock, setOnlyInStock] = useState(false);

  // Filter & Sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category filter
        if (selectedCategory !== 'all' && product.category !== selectedCategory) {
          return false;
        }
        // In-stock filter
        if (onlyInStock && product.stock <= 0) {
          return false;
        }
        // Search filter
        if (searchKeyword.trim()) {
          const q = searchKeyword.toLowerCase();
          const matchName = product.name.toLowerCase().includes(q);
          const matchBangla = product.banglaName?.toLowerCase().includes(q);
          const matchCategory = product.category.toLowerCase().includes(q);
          const matchDesc = product.description.toLowerCase().includes(q);
          const matchTags = product.tags?.some(t => t.toLowerCase().includes(q));
          if (!matchName && !matchBangla && !matchCategory && !matchDesc && !matchTags) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        // default featured
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return 0;
      });
  }, [products, selectedCategory, searchKeyword, onlyInStock, sortBy]);

  const activeCategoryObj = INITIAL_CATEGORIES.find((c) => c.id === selectedCategory);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero />

        {/* Products Section */}
        <section id="products-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          
          {/* Section Heading & Filter Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600 font-bold">
                  <Sparkles className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                  Curated Catalog
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-serif">
                {selectedCategory === 'all'
                  ? 'All Featured Products'
                  : `${activeCategoryObj?.name || 'Category'} (${activeCategoryObj?.banglaName || ''})`}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Showing {filteredProducts.length} verified item{filteredProducts.length === 1 ? '' : 's'} with express delivery in Bangladesh
              </p>
            </div>

            {/* Filter and Sort Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* In-Stock Toggle */}
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 px-3 py-2 rounded-xl cursor-pointer hover:border-slate-300 transition-colors">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <span>In Stock Only</span>
              </label>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-xs font-semibold text-slate-700 bg-transparent outline-hidden cursor-pointer"
                >
                  <option value="featured">Featured & Trending</option>
                  <option value="price-asc">Price: Low to High (৳)</option>
                  <option value="price-desc">Price: High to Low (৳)</option>
                  <option value="rating">Top Rated (★)</option>
                  <option value="newest">New Arrivals</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Search / Category Chips */}
          {(searchKeyword || selectedCategory !== 'all') && (
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-slate-500">Active filters:</span>
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 font-semibold border border-rose-200">
                  <span>Category: {activeCategoryObj?.name}</span>
                  <button onClick={() => setSelectedCategory('all')} className="hover:text-rose-900 cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}
              {searchKeyword && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-semibold border border-slate-200">
                  <span>Search: "{searchKeyword}"</span>
                  <button onClick={() => setSearchKeyword('')} className="hover:text-slate-900 cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchKeyword('');
                  setOnlyInStock(false);
                }}
                className="text-xs text-rose-600 hover:text-rose-700 underline font-medium ml-1 cursor-pointer"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No Products Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                We couldn't find any products matching your search criteria. Try different keywords or reset your category filter.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchKeyword('');
                  setOnlyInStock(false);
                }}
                className="mt-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-rose-600 text-white font-bold text-xs transition-colors shadow-xs"
              >
                Show All Items
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Mid-Page Promotional Banner */}
          <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-rose-950 text-white border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-2xl space-y-3">
              <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 font-bold text-xs uppercase tracking-wider border border-rose-500/30 inline-flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> Nationwide Free Delivery
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-serif">
                Shop over ৳{settings.freeDeliveryThreshold.toLocaleString()} for Free Shipping all across Bangladesh
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Whether you are in Dhaka, Chittagong, Sylhet, Rajshahi, or any other district, enjoy zero delivery charge on qualifying baskets with 100% genuine product guarantee and verified bKash/Nagad transactions.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md"
                >
                  View Your Cart
                </button>
                <span className="text-xs text-slate-400 font-mono">
                  Coupon: <strong className="text-amber-300">BREDVEX10</strong>
                </span>
              </div>
            </div>
          </div>

        </section>

      </main>

      <Footer />

      {/* Product Detail Modal */}
      {selectedProductForModal && (
        <ProductModal
          product={selectedProductForModal}
          onClose={() => setSelectedProductForModal(null)}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Checkout Modal */}
      <CheckoutModal />

      {/* Order Success Modal */}
      <OrderSuccessModal />

      {/* Track Order Modal */}
      <TrackOrderModal />

      {/* Wishlist Modal */}
      <WishlistModal />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}

const AppContent: React.FC = () => {
  const { activeView } = useStore();

  if (activeView === 'admin') {
    return <AdminPanel />;
  }

  return <MainShop />;
};
