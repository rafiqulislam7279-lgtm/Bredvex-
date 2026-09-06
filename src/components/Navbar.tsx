import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  ShieldCheck, 
  Truck, 
  Phone, 
  Menu, 
  X, 
  Sparkles,
  SlidersHorizontal,
  PackageCheck
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { INITIAL_CATEGORIES } from '../data/initialData';
import { ThemeToggle } from './ThemeToggle';

export const Navbar: React.FC = () => {
  const {
    settings,
    cartCount,
    cartGrandTotal,
    wishlistIds,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsTrackOrderOpen,
    setActiveView,
    activeView,
    searchKeyword,
    setSearchKeyword,
    selectedCategory,
    setSelectedCategory,
    isAdminAuthenticated,
    adminRole,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInputMobile, setShowSearchInputMobile] = useState(false);

  const handleCategoryClick = (catId: string) => {
    setSelectedCategory(catId);
    if (activeView !== 'shop') {
      setActiveView('shop');
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
      {/* Top Announcement Bar */}
      {settings.showAnnouncement && settings.announcementText && (
        <div className="bg-slate-900 dark:bg-slate-950 text-slate-100 text-xs py-2 px-4 border-b border-slate-800 dark:border-slate-800/80">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
              <span className="inline-flex items-center gap-1 bg-rose-500/20 text-rose-300 font-semibold px-2 py-0.5 rounded-full text-[11px] border border-rose-500/30">
                <Sparkles className="w-3 h-3 text-rose-400" /> BREDVEX
              </span>
              <p className="truncate text-slate-200 font-medium">
                {settings.announcementText}
              </p>
            </div>
            <div className="hidden md:flex items-center gap-5 text-slate-400 text-[12px]">
              <div className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Hotline: <strong className="text-slate-200">{settings.contactPhone}</strong></span>
              </div>
              <button 
                id="btn-nav-track-order-top"
                onClick={() => setIsTrackOrderOpen(true)}
                className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <Truck className="w-3.5 h-3.5 text-sky-400" />
                <span>Track Order</span>
              </button>
              <button
                id="btn-nav-admin-top"
                onClick={() => setActiveView('admin')}
                className="flex items-center gap-1 text-amber-300 hover:text-amber-200 font-medium transition-colors cursor-pointer bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>
                  {isAdminAuthenticated 
                    ? (adminRole === 'master' ? '👑 Master Portal' : '👤 Staff Portal') 
                    : 'Admin Login'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <button
              id="btn-nav-logo"
              onClick={() => {
                setActiveView('shop');
                setSelectedCategory('all');
              }}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              {settings.logoUrl ? (
                <img 
                  src={settings.logoUrl} 
                  alt={settings.siteName} 
                  className="h-10 w-auto object-contain rounded-lg"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-slate-950 via-slate-900 to-rose-600 flex items-center justify-center text-white font-extrabold text-xl shadow-md group-hover:scale-105 transition-transform duration-200">
                  <span>B</span>
                </div>
              )}
              <div>
                <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white font-serif flex items-center gap-1.5">
                  {settings.siteName}
                  <span className="text-rose-600 text-xs px-1.5 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/50 border border-rose-200/60 dark:border-rose-900/60 uppercase font-sans font-bold tracking-wider">BD</span>
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block -mt-1 font-medium truncate max-w-[200px]">
                  {settings.tagline}
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="input-desktop-search"
                type="text"
                value={searchKeyword}
                onChange={(e) => {
                  setSearchKeyword(e.target.value);
                  if (activeView !== 'shop') setActiveView('shop');
                }}
                placeholder="Search smartwatches, hoodies, keyboards, wallets..."
                className="w-full pl-10 pr-10 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-full border border-slate-200/80 dark:border-slate-700 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-hidden transition-all"
              />
              {searchKeyword && (
                <button
                  onClick={() => setSearchKeyword('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Desktop Action Icons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Dark/Light Mode Toggle */}
            <ThemeToggle size="md" />

            {/* Track Order Button (Desktop Icon) */}
            <button
              id="btn-nav-track-order"
              onClick={() => setIsTrackOrderOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700"
            >
              <PackageCheck className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              <span>Track Order</span>
            </button>

            {/* Mobile Search Toggle */}
            <button
              id="btn-mobile-search-toggle"
              onClick={() => setShowSearchInputMobile(!showSearchInputMobile)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white md:hidden rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Button */}
            <button
              id="btn-nav-wishlist"
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-2.5 text-slate-700 dark:text-slate-200 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl hover:bg-rose-50/70 dark:hover:bg-rose-950/40 transition-colors cursor-pointer group border border-transparent hover:border-rose-200 dark:hover:border-rose-900/40"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {wishlistIds.length > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-rose-500 rounded-full shadow-xs">
                  {wishlistIds.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              id="btn-nav-cart"
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2.5 px-3.5 py-2 text-white bg-slate-900 dark:bg-rose-600 hover:bg-rose-600 dark:hover:bg-rose-500 rounded-xl transition-all shadow-sm group cursor-pointer"
              aria-label="Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex items-center justify-center min-w-4 h-4 px-1 text-[10px] font-bold text-slate-900 bg-amber-400 rounded-full border border-slate-900">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left leading-tight">
                <span className="text-[10px] font-medium text-slate-300 dark:text-rose-100 group-hover:text-rose-100">Cart</span>
                <span className="text-xs font-bold font-mono">৳{cartGrandTotal.toLocaleString()}</span>
              </div>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              id="btn-mobile-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white md:hidden rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Dropdown */}
        {showSearchInputMobile && (
          <div className="py-2 pb-3 md:hidden border-t border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="input-mobile-search"
                type="text"
                value={searchKeyword}
                onChange={(e) => {
                  setSearchKeyword(e.target.value);
                  if (activeView !== 'shop') setActiveView('shop');
                }}
                placeholder="Search products in Bangladesh..."
                className="w-full pl-9 pr-9 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm rounded-lg border border-slate-200 dark:border-slate-700 outline-hidden focus:border-rose-500"
                autoFocus
              />
              {searchKeyword && (
                <button
                  onClick={() => setSearchKeyword('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Categories Bar (Desktop) */}
        {activeView === 'shop' && (
          <div className="hidden md:flex items-center gap-1 py-2.5 border-t border-slate-100 dark:border-slate-800/80 overflow-x-auto scrollbar-none text-xs font-semibold">
            <button
              id="cat-tab-all"
              onClick={() => handleCategoryClick('all')}
              className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 dark:bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              ✨ All Collection
            </button>
            {INITIAL_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                id={`cat-tab-${cat.id}`}
                onClick={() => handleCategoryClick(cat.id)}
                className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-[10px] opacity-75 font-normal">({cat.banglaName})</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-4 space-y-3 shadow-lg text-slate-900 dark:text-slate-100">
          
          {/* Mobile Theme Toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Theme Mode:</span>
            <ThemeToggle showLabel size="sm" />
          </div>

          <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Product Categories</div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleCategoryClick('all')}
              className={`p-2.5 text-xs text-left rounded-lg font-medium ${
                selectedCategory === 'all' 
                  ? 'bg-slate-900 dark:bg-rose-600 text-white' 
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
              }`}
            >
              🔥 All Products
            </button>
            {INITIAL_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`p-2.5 text-xs text-left rounded-lg font-medium flex flex-col ${
                  selectedCategory === cat.id 
                    ? 'bg-rose-600 text-white' 
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-[10px] opacity-80">{cat.banglaName}</span>
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2 text-sm font-medium">
            <button
              onClick={() => {
                setIsTrackOrderOpen(true);
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-100"
            >
              <Truck className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>Track Customer Order (অর্ডার ট্র্যাক করুন)</span>
            </button>
            {isAdminAuthenticated && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setActiveView('admin');
                }}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-900 dark:text-amber-200 font-semibold border border-amber-200 dark:border-amber-800/50 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>
                  {adminRole === 'master' ? '👑 Master Admin Panel' : '👤 Staff Panel'}
                </span>
              </button>
            )}
            <div className="p-2.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/70 rounded-lg">
              <p>Hotline: <strong className="text-slate-800 dark:text-slate-200">{settings.contactPhone}</strong></p>
              <p className="mt-0.5">Email: {settings.contactEmail}</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
