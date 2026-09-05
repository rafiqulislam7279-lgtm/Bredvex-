import React, { useState, useEffect } from 'react';
import { Flame, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export const FlashSaleBanner: React.FC = () => {
  const { settings, setSelectedCategory } = useStore();
  const flashConfig = settings.flashSale;

  const calculateTimeLeft = (): TimeLeft => {
    if (!flashConfig?.endTime) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }
    const difference = new Date(flashConfig.endTime).getTime() - new Date().getTime();
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isExpired: false
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [flashConfig?.endTime]);

  if (!flashConfig || !flashConfig.enabled || timeLeft.isExpired) {
    return null;
  }

  const handleScrollToProducts = () => {
    const el = document.getElementById('products-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 text-white shadow-md relative overflow-hidden py-3 px-4 sm:px-6">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 relative z-10">
        
        {/* Left: Tagline & Offer */}
        <div className="flex items-center gap-3 text-center md:text-left">
          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 animate-bounce">
            <Flame className="w-5 h-5 text-amber-300 fill-amber-300" />
          </div>
          <div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-tight font-serif">
                {flashConfig.title || '⚡ Flash Sale Live!'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-xs">
                {flashConfig.discountLabel || 'UP TO 40% OFF'}
              </span>
            </div>
            <p className="text-xs text-rose-100 hidden sm:block">
              {flashConfig.subtitle || 'Special limited time pricing on top-selling tech & fashion.'}
            </p>
          </div>
        </div>

        {/* Center/Right: Countdown Ticker */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-100">
            <Clock className="w-4 h-4 text-amber-300 animate-spin-slow" />
            <span className="text-[11px] uppercase tracking-wider font-bold">Ends in:</span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-center">
            {timeLeft.days > 0 && (
              <div className="bg-black/30 backdrop-blur-xs rounded-lg px-2 py-1 min-w-[36px] border border-white/10">
                <span className="text-sm font-black text-white">{String(timeLeft.days).padStart(2, '0')}</span>
                <span className="text-[9px] block text-rose-200 uppercase font-sans">Days</span>
              </div>
            )}
            <div className="bg-black/30 backdrop-blur-xs rounded-lg px-2 py-1 min-w-[36px] border border-white/10">
              <span className="text-sm font-black text-white">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="text-[9px] block text-rose-200 uppercase font-sans">Hours</span>
            </div>
            <span className="text-amber-300 font-bold">:</span>
            <div className="bg-black/30 backdrop-blur-xs rounded-lg px-2 py-1 min-w-[36px] border border-white/10">
              <span className="text-sm font-black text-white">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="text-[9px] block text-rose-200 uppercase font-sans">Mins</span>
            </div>
            <span className="text-amber-300 font-bold">:</span>
            <div className="bg-black/30 backdrop-blur-xs rounded-lg px-2 py-1 min-w-[36px] border border-white/10">
              <span className="text-sm font-black text-amber-300">{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className="text-[9px] block text-rose-200 uppercase font-sans">Secs</span>
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={handleScrollToProducts}
            className="hidden lg:flex items-center gap-1.5 px-4 py-1.5 bg-white text-slate-950 hover:bg-amber-300 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs shrink-0"
          >
            <span>Shop Deals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
