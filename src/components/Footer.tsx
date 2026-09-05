import React from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  RefreshCcw, 
  CreditCard,
  Lock
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { INITIAL_CATEGORIES } from '../data/initialData';

export const Footer: React.FC = () => {
  const { 
    settings, 
    setSelectedCategory, 
    setActiveView, 
    setIsTrackOrderOpen 
  } = useStore();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Badges Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-600/10 text-rose-500 border border-rose-500/20 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">All 64 Districts Delivery</h4>
              <p className="text-xs text-slate-400">Pathao & Steadfast Courier</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-pink-600/10 text-pink-500 border border-pink-500/20 flex items-center justify-center shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">bKash & Nagad Verified</h4>
              <p className="text-xs text-slate-400">Instant MFS or Cash on Delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Genuine Guarantee</h4>
              <p className="text-xs text-slate-400">Quality Checked & Guaranteed</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-600/10 text-sky-500 border border-sky-500/20 flex items-center justify-center shrink-0">
              <RefreshCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">7-Day Easy Replacement</h4>
              <p className="text-xs text-slate-400">Hassle-free return policy</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 text-xs">
          
          {/* Brand & Bio */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt={settings.siteName} className="h-9 w-auto rounded-md" />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-900 to-rose-600 flex items-center justify-center text-white font-black text-lg">
                  B
                </div>
              )}
              <span className="text-xl font-extrabold text-white tracking-tight font-serif">
                {settings.siteName}
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              {settings.tagline}. Leading multi-category e-commerce platform offering premium tech gadgets, contemporary fashion apparel, smart home electronics, and curated lifestyle accessories.
            </p>

            {/* Bangladeshi MFS Payment Icons */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Supported Bangladeshi Payment Methods:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-[#E2136E] text-white font-bold text-[11px] tracking-wide">
                  bKash বিকাশ
                </span>
                <span className="px-2.5 py-1 rounded-md bg-[#F7931E] text-white font-bold text-[11px] tracking-wide">
                  Nagad নগদ
                </span>
                <span className="px-2.5 py-1 rounded-md bg-[#8C3494] text-white font-bold text-[11px] tracking-wide">
                  Rocket রকেট
                </span>
                <span className="px-2.5 py-1 rounded-md bg-emerald-700 text-white font-bold text-[11px] tracking-wide">
                  Cash on Delivery
                </span>
                <span className="px-2 py-1 rounded-md bg-slate-800 text-slate-300 font-bold text-[11px]">
                  Visa / Master
                </span>
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide font-serif">Shop Categories</h4>
            <ul className="space-y-2 text-slate-400">
              {INITIAL_CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setActiveView('shop');
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className="hover:text-rose-400 transition-colors cursor-pointer text-left flex items-center gap-1.5"
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-slate-500">({cat.banglaName})</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide font-serif">Help & Tracking</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={() => setIsTrackOrderOpen(true)}
                  className="hover:text-sky-400 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Track Consignment</span>
                </button>
              </li>
              <li>
                <a href="#products-section" className="hover:text-white transition-colors">
                  Delivery Charges (Dhaka ৳60 / Out ৳120)
                </a>
              </li>
              <li>
                <a href="#products-section" className="hover:text-white transition-colors">
                  7-Day Return Policy
                </a>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('admin')}
                  className="hover:text-amber-400 transition-colors text-amber-300/80 font-medium flex items-center gap-1"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Admin Login</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact in Bangladesh */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide font-serif">Contact Us (Bangladesh)</h4>
            <div className="space-y-2.5 text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-mono text-slate-200">{settings.contactPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{settings.contactEmail}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} {settings.siteName}. All Rights Reserved. Crafted for Bangladesh E-Commerce.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveView('admin')}
              className="text-amber-400/70 hover:text-amber-300 font-semibold"
            >
              Staff / Admin Portal
            </button>
            <span>•</span>
            <span>Made with precision for BREDVEX</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
