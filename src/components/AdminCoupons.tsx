import React, { useState } from 'react';
import { 
  Tag, 
  Percent, 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit3, 
  Copy, 
  Check, 
  Calendar, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Zap, 
  Megaphone, 
  Clock,
  Search,
  Filter,
  ArrowRight,
  DollarSign
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Coupon } from '../types';

export const AdminCoupons: React.FC = () => {
  const { 
    coupons, 
    addCoupon, 
    updateCoupon, 
    deleteCoupon, 
    toggleCouponStatus, 
    generatePromoCode,
    settings,
    updateSettings 
  } = useStore();

  // Generator & Form state
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minOrderAmount, setMinOrderAmount] = useState<number | ''>(500);
  const [maxDiscountAmount, setMaxDiscountAmount] = useState<number | ''>(500);
  const [usageLimit, setUsageLimit] = useState<number | ''>(100);
  const [expiresAt, setExpiresAt] = useState('');
  const [isActive, setIsActive] = useState(true);

  // UI state
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'expired'>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [bannerSuccess, setBannerSuccess] = useState<string | null>(null);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  // Quick generate promo code
  const handleQuickGenerate = (prefix = 'BVX') => {
    const generated = generatePromoCode(prefix);
    setCode(generated);
  };

  // Submit new coupon
  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      setFormError('Promo code cannot be empty.');
      return;
    }

    if (coupons.some(c => c.code.toUpperCase() === cleanCode)) {
      setFormError(`Coupon code "${cleanCode}" already exists. Choose a different code.`);
      return;
    }

    if (discountValue <= 0) {
      setFormError('Discount value must be greater than 0.');
      return;
    }

    if (discountType === 'percentage' && discountValue > 100) {
      setFormError('Percentage discount cannot exceed 100%.');
      return;
    }

    addCoupon({
      code: cleanCode,
      description: description.trim() || undefined,
      discountType,
      discountValue: Number(discountValue),
      minOrderAmount: minOrderAmount !== '' && Number(minOrderAmount) > 0 ? Number(minOrderAmount) : undefined,
      maxDiscountAmount: discountType === 'percentage' && maxDiscountAmount !== '' && Number(maxDiscountAmount) > 0 ? Number(maxDiscountAmount) : undefined,
      usageLimit: usageLimit !== '' && Number(usageLimit) > 0 ? Number(usageLimit) : undefined,
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
      isActive,
    });

    setFormSuccess(`🎉 Coupon code "${cleanCode}" created successfully!`);
    // Reset form
    setCode('');
    setDescription('');
    setDiscountValue(10);
    setMinOrderAmount(500);
    setMaxDiscountAmount(500);
    setUsageLimit(100);
    setExpiresAt('');
    setIsActive(true);

    setTimeout(() => setFormSuccess(''), 4000);
  };

  // Copy code to clipboard
  const handleCopy = (couponCode: string) => {
    navigator.clipboard.writeText(couponCode);
    setCopiedCode(couponCode);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  // Set as Announcement Banner
  const handleSetAsBanner = (cpn: Coupon) => {
    const discountText = cpn.discountType === 'percentage' ? `${cpn.discountValue}% OFF` : `৳${cpn.discountValue} FLAT OFF`;
    const minText = cpn.minOrderAmount ? ` on orders above ৳${cpn.minOrderAmount}` : '';
    const newAnnouncement = `⚡ SPECIAL OFFER: Use code "${cpn.code}" for ${discountText}${minText}! Limited time only.`;

    updateSettings({
      showAnnouncement: true,
      announcementText: newAnnouncement,
    });

    setBannerSuccess(cpn.code);
    setTimeout(() => setBannerSuccess(null), 4000);
  };

  // Save edited coupon
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCoupon) return;

    updateCoupon(editingCoupon.id, {
      code: editingCoupon.code.trim().toUpperCase(),
      description: editingCoupon.description,
      discountType: editingCoupon.discountType,
      discountValue: Number(editingCoupon.discountValue),
      minOrderAmount: editingCoupon.minOrderAmount ? Number(editingCoupon.minOrderAmount) : undefined,
      maxDiscountAmount: editingCoupon.maxDiscountAmount ? Number(editingCoupon.maxDiscountAmount) : undefined,
      usageLimit: editingCoupon.usageLimit ? Number(editingCoupon.usageLimit) : undefined,
      expiresAt: editingCoupon.expiresAt || undefined,
      isActive: editingCoupon.isActive,
    });

    setEditingCoupon(null);
  };

  // Filtered coupons
  const filteredCoupons = coupons.filter(c => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCode = c.code.toLowerCase().includes(q);
      const matchDesc = c.description?.toLowerCase().includes(q);
      if (!matchCode && !matchDesc) return false;
    }

    const now = Date.now();
    const isExpired = c.expiresAt ? new Date(c.expiresAt).getTime() < now : false;

    if (filterStatus === 'active') return c.isActive && !isExpired;
    if (filterStatus === 'inactive') return !c.isActive;
    if (filterStatus === 'expired') return isExpired;

    return true;
  });

  // Calculate summary metrics
  const activeCount = coupons.filter(c => c.isActive).length;
  const totalUses = coupons.reduce((sum, c) => sum + (c.timesUsed || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner Alert if set */}
      {bannerSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between text-xs font-semibold shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Promo code "{bannerSuccess}" is now live on the store's top announcement banner!</span>
          </div>
        </div>
      )}

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total Promo Codes</p>
            <h3 className="text-2xl font-black text-slate-900">{coupons.length}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Active Coupons</p>
            <h3 className="text-2xl font-black text-emerald-600">{activeCount}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-black">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total Times Redeemed</p>
            <h3 className="text-2xl font-black text-purple-600">{totalUses}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-black">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Store Top Banner</p>
            <p className="text-xs font-bold text-slate-800 truncate max-w-[170px]">
              {settings.showAnnouncement ? settings.announcementText || 'Banner Active' : 'Banner Off'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Generator Form & Existing Coupons List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Generate / Create Coupon Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-serif">Generate Promo Code</h3>
                  <p className="text-xs text-slate-500">Create discount coupons for campaigns</p>
                </div>
              </div>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              
              {/* Promo Code Input & Quick Generator */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">Promo Code (কুপন কোড)</label>
                  <button
                    type="button"
                    onClick={() => handleQuickGenerate('BVX')}
                    className="text-[11px] font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Auto-Generate</span>
                  </button>
                </div>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g. SUMMER25, EID15, BVX-99"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm font-bold text-slate-900 outline-hidden focus:border-amber-500 focus:bg-white transition-all uppercase"
                  />
                </div>
                {/* Quick Generator presets */}
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  <span className="text-[10px] text-slate-400 py-0.5">Quick presets:</span>
                  <button
                    type="button"
                    onClick={() => handleQuickGenerate('EID')}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded-md text-[10px] font-semibold text-slate-700 cursor-pointer"
                  >
                    + EID
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickGenerate('DISC')}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded-md text-[10px] font-semibold text-slate-700 cursor-pointer"
                  >
                    + DISC
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickGenerate('FLASH')}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded-md text-[10px] font-semibold text-slate-700 cursor-pointer"
                  >
                    + FLASH
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickGenerate('WELCOME')}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded-md text-[10px] font-semibold text-slate-700 cursor-pointer"
                  >
                    + WELCOME
                  </button>
                </div>
              </div>

              {/* Discount Type Selector */}
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Discount Type (ডিসকাউন্টের ধরন)</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDiscountType('percentage')}
                    className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all cursor-pointer ${
                      discountType === 'percentage'
                        ? 'border-amber-500 bg-amber-50 text-amber-800 shadow-xs'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Percent className="w-4 h-4" />
                    <span>Percentage (%)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDiscountType('fixed')}
                    className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all cursor-pointer ${
                      discountType === 'fixed'
                        ? 'border-amber-500 bg-amber-50 text-amber-800 shadow-xs'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>Flat Taka (৳)</span>
                  </button>
                </div>
              </div>

              {/* Discount Value with Quick Chips */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {discountType === 'percentage' ? 'Discount Percentage (%)' : 'Discount Amount (৳ টাকা)'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min={1}
                    max={discountType === 'percentage' ? 100 : 50000}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono text-sm text-slate-900 outline-hidden focus:border-amber-500 focus:bg-white"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                    {discountType === 'percentage' ? '%' : '৳'}
                  </span>
                </div>

                {/* Percentage Quick selection buttons */}
                {discountType === 'percentage' ? (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {[5, 10, 15, 20, 25, 30, 50].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setDiscountValue(pct)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          discountValue === pct
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {[50, 100, 150, 200, 300, 500, 1000].map((taka) => (
                      <button
                        key={taka}
                        type="button"
                        onClick={() => setDiscountValue(taka)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          discountValue === taka
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        ৳{taka}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Min Order & Max Discount Cap */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Min. Order Amount (৳)</label>
                  <input
                    type="number"
                    min={0}
                    placeholder="e.g. 500 (0 for none)"
                    value={minOrderAmount}
                    onChange={(e) => setMinOrderAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-900 outline-hidden focus:border-amber-500 focus:bg-white"
                  />
                  <span className="text-[10px] text-slate-400">Cart subtotal required</span>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Max Discount Cap (৳)</label>
                  <input
                    type="number"
                    min={0}
                    disabled={discountType === 'fixed'}
                    placeholder="e.g. 500 (optional)"
                    value={maxDiscountAmount}
                    onChange={(e) => setMaxDiscountAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-900 outline-hidden focus:border-amber-500 focus:bg-white disabled:opacity-50 disabled:bg-slate-100"
                  />
                  <span className="text-[10px] text-slate-400">Upper limit for % discount</span>
                </div>
              </div>

              {/* Usage Limit & Expiry */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Total Usage Limit</label>
                  <input
                    type="number"
                    min={1}
                    placeholder="e.g. 100 (optional)"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-900 outline-hidden focus:border-amber-500 focus:bg-white"
                  />
                  <span className="text-[10px] text-slate-400">Max redemptions count</span>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Expiry Date (মেয়াদ)</label>
                  <input
                    type="date"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-900 outline-hidden focus:border-amber-500 focus:bg-white"
                  />
                  <span className="text-[10px] text-slate-400">Leave blank for no expiry</span>
                </div>
              </div>

              {/* Campaign / Description */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Description / Campaign Name</label>
                <input
                  type="text"
                  placeholder="e.g. 15% discount for Eid Special Celebration"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-hidden focus:border-amber-500 focus:bg-white"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="font-bold text-slate-800">Activate Immediately</span>
                  <p className="text-[10px] text-slate-500">Customers can apply this code right away</p>
                </div>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded-sm cursor-pointer"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="btn-create-coupon-submit"
                className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Save & Create Promo Code</span>
              </button>

            </form>
          </div>
        </div>

        {/* Right Column: Existing Coupons List & Management */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Header & Filter Controls */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search promo codes or descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs text-slate-800 outline-hidden bg-transparent"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 text-[11px] font-semibold">Filter:</span>
              {(['all', 'active', 'inactive', 'expired'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-2.5 py-1 rounded-lg font-bold capitalize transition-colors cursor-pointer text-[11px] ${
                    filterStatus === st
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* List of Coupons */}
          {filteredCoupons.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Tag className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">No Promo Codes Found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {searchQuery
                  ? `No coupons match "${searchQuery}". Try a different search.`
                  : 'You have not created any promo codes yet. Use the form on the left to create your first coupon!'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCoupons.map((cpn) => {
                const isExpired = cpn.expiresAt ? new Date(cpn.expiresAt).getTime() < Date.now() : false;
                const isLimitReached = cpn.usageLimit ? cpn.timesUsed >= cpn.usageLimit : false;

                return (
                  <div 
                    key={cpn.id}
                    className={`bg-white rounded-2xl border transition-all p-4 sm:p-5 shadow-xs flex flex-col gap-3 ${
                      !cpn.isActive || isExpired
                        ? 'border-slate-200/80 bg-slate-50/50 opacity-80'
                        : 'border-slate-200 hover:border-amber-400/80'
                    }`}
                  >
                    {/* Top Row: Code Badge & Status */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {/* Coupon Code Pill */}
                        <div className="flex items-center bg-amber-500/10 border border-amber-400/40 px-3 py-1 rounded-xl text-slate-950 font-mono font-black text-sm tracking-wider">
                          <Tag className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
                          <span>{cpn.code}</span>
                        </div>

                        {/* 1-Click Copy */}
                        <button
                          type="button"
                          onClick={() => handleCopy(cpn.code)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                          title="Copy Code"
                        >
                          {copiedCode === cpn.code ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Status Pills */}
                        {isExpired ? (
                          <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 font-bold text-[10px]">
                            Expired
                          </span>
                        ) : isLimitReached ? (
                          <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-700 font-bold text-[10px]">
                            Limit Reached
                          </span>
                        ) : cpn.isActive ? (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 font-bold text-[10px] flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-600 font-bold text-[10px]">
                            Disabled
                          </span>
                        )}
                      </div>

                      {/* Discount Value Badge */}
                      <div className="text-right">
                        <span className="inline-block font-black text-base text-amber-700 font-mono">
                          {cpn.discountType === 'percentage'
                            ? `${cpn.discountValue}% OFF`
                            : `৳${cpn.discountValue.toLocaleString()} OFF`}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    {cpn.description && (
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {cpn.description}
                      </p>
                    )}

                    {/* Meta Details: Min Order, Cap, Expiry, Usage */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-mono">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-sans">Min Spend</span>
                        <strong className="text-slate-800">
                          {cpn.minOrderAmount ? `৳${cpn.minOrderAmount.toLocaleString()}` : 'None'}
                        </strong>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block font-sans">Max Cap</span>
                        <strong className="text-slate-800">
                          {cpn.maxDiscountAmount ? `৳${cpn.maxDiscountAmount.toLocaleString()}` : 'No limit'}
                        </strong>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block font-sans">Times Used</span>
                        <strong className="text-slate-800">
                          {cpn.timesUsed || 0} {cpn.usageLimit ? `/ ${cpn.usageLimit}` : 'uses'}
                        </strong>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block font-sans">Expires</span>
                        <strong className="text-slate-800">
                          {cpn.expiresAt ? new Date(cpn.expiresAt).toLocaleDateString() : 'Never'}
                        </strong>
                      </div>
                    </div>

                    {/* Actions Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                      <div className="flex items-center gap-2">
                        {/* 1-Click Promote on Store Banner */}
                        <button
                          type="button"
                          onClick={() => handleSetAsBanner(cpn)}
                          className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-amber-200"
                          title="Display on Top Announcement Bar"
                        >
                          <Megaphone className="w-3.5 h-3.5 text-amber-600" />
                          <span>Show on Store Banner</span>
                        </button>

                        {/* Active Toggle Switch */}
                        <button
                          type="button"
                          onClick={() => toggleCouponStatus(cpn.id)}
                          className={`px-2.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                            cpn.isActive
                              ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {cpn.isActive ? 'Turn Off' : 'Turn On'}
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => setEditingCoupon(cpn)}
                          className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Edit Coupon"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete coupon "${cpn.code}"?`)) {
                              deleteCoupon(cpn.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Coupon"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

      {/* Edit Coupon Modal */}
      {editingCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 font-serif">Edit Coupon: {editingCoupon.code}</h3>
              <button
                onClick={() => setEditingCoupon(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  value={editingCoupon.code}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold uppercase"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Discount Type</label>
                <select
                  value={editingCoupon.discountType}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, discountType: e.target.value as 'percentage' | 'fixed' })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Flat Taka (৳)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {editingCoupon.discountType === 'percentage' ? 'Discount Percentage (%)' : 'Discount Amount (৳)'}
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={editingCoupon.discountType === 'percentage' ? 100 : 50000}
                  value={editingCoupon.discountValue}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, discountValue: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Min Order (৳)</label>
                  <input
                    type="number"
                    min={0}
                    value={editingCoupon.minOrderAmount || ''}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, minOrderAmount: e.target.value === '' ? undefined : Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Max Cap (৳)</label>
                  <input
                    type="number"
                    min={0}
                    value={editingCoupon.maxDiscountAmount || ''}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, maxDiscountAmount: e.target.value === '' ? undefined : Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Usage Limit</label>
                  <input
                    type="number"
                    min={1}
                    value={editingCoupon.usageLimit || ''}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, usageLimit: e.target.value === '' ? undefined : Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={editingCoupon.expiresAt ? editingCoupon.expiresAt.split('T')[0] : ''}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, expiresAt: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <input
                  type="text"
                  value={editingCoupon.description || ''}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="edit-is-active"
                  checked={editingCoupon.isActive}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, isActive: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 rounded-sm cursor-pointer"
                />
                <label htmlFor="edit-is-active" className="font-bold text-slate-800 cursor-pointer">
                  Active (Allow customers to use)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingCoupon(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold cursor-pointer hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black cursor-pointer shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
