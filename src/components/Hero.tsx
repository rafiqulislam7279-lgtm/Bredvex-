import React from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  RefreshCcw, 
  CreditCard, 
  Sparkles,
  Award,
  Zap
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { INITIAL_CATEGORIES } from '../data/initialData';

export const Hero: React.FC = () => {
  const { settings, setSelectedCategory, setIsTrackOrderOpen } = useStore();

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white pt-8 pb-16 lg:pt-14 lg:pb-20">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              <span>{settings.heroBadge || '🇧🇩 PREMIUM BANGLADESHI E-COMMERCE'}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-serif leading-[1.15]">
              {settings.heroHeadline}
            </h1>

            {/* Subheadline */}
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {settings.heroSubheadline}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <a
                href="#products-section"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-600/30 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <span>Shop All Items</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <button
                onClick={() => setIsTrackOrderOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-sm border border-slate-700/80 transition-all cursor-pointer"
              >
                <Truck className="w-4 h-4 text-sky-400" />
                <span>Track My Order</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80 text-left">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-slate-800/70 text-emerald-400 border border-slate-700">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Express Delivery</h4>
                  <p className="text-[11px] text-slate-400">Inside Dhaka 24-48h</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-slate-800/70 text-rose-400 border border-slate-700">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">bKash & Nagad</h4>
                  <p className="text-[11px] text-slate-400">Instant or COD</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-slate-800/70 text-amber-400 border border-slate-700">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">100% Original</h4>
                  <p className="text-[11px] text-slate-400">Verified Quality</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-slate-800/70 text-sky-400 border border-slate-700">
                  <RefreshCcw className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Easy Returns</h4>
                  <p className="text-[11px] text-slate-400">7-Day Guarantee</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Image Container */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-800/50 aspect-4/3 sm:aspect-5/4 group">
                <img
                  src={settings.heroImage || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=85"}
                  alt="Bredvex Modern E-Commerce Store"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                
                {/* Floating Discount Tag */}
                <div className="absolute top-4 right-4 bg-rose-600/90 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow-lg border border-rose-400/30 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Up to 40% OFF</span>
                </div>

                {/* Floating Bottom Card */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider">Mega Promotion</p>
                      <h4 className="text-sm font-bold text-white">Use Code: <span className="font-mono text-amber-300">BREDVEX10</span></h4>
                    </div>
                    <a
                      href="#products-section"
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors"
                    >
                      Apply Now
                    </a>
                  </div>
                </div>
              </div>

              {/* Verified Seller Floating Pill */}
              <div className="absolute -bottom-4 -left-3 sm:-left-6 hidden sm:flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900/95 backdrop-blur-md border border-slate-700/90 shadow-xl">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">100% Genuine Verified</p>
                  <p className="text-[10px] text-slate-400">Authentic Stock & Warranty</p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Category Carousel / Cards */}
        <div className="mt-14 pt-8 border-t border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase">
              Popular Product Categories
            </h3>
            <span className="text-xs text-rose-400 font-medium">Click category to browse</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {INITIAL_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                id={`hero-cat-${cat.id}`}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  const el = document.getElementById('products-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-800 hover:border-rose-500/40 transition-all text-left flex items-center gap-3 cursor-pointer"
              >
                <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-slate-700">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-xs font-bold text-slate-200 group-hover:text-rose-400 truncate transition-colors">
                    {cat.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 truncate">
                    {cat.banglaName}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
