import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const WhatsAppChatButton: React.FC = () => {
  const { settings } = useStore();
  const [showTooltip, setShowTooltip] = useState(true);

  // Format clean phone number without spaces, hyphens, or '+'
  const rawPhone = settings.whatsappNumber || settings.contactPhone || '01711223344';
  const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
  const formattedPhone = cleanPhone.startsWith('88') ? cleanPhone : `88${cleanPhone}`;

  const message = encodeURIComponent(
    `Hello ${settings.siteName}! 👋 I am browsing your online store and would like to chat / place an order.`
  );

  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${message}`;

  return (
    <aside aria-label="WhatsApp Customer Support" className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 pointer-events-none">
      {/* Floating Prompt Bubble */}
      {showTooltip && (
        <div className="pointer-events-auto max-w-xs bg-white text-slate-800 p-3 rounded-2xl shadow-xl border border-emerald-100 flex items-start gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
            <MessageCircle className="w-4 h-4" />
          </div>
          <div className="text-xs space-y-0.5 flex-1 pr-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <span>Chat with us</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Have questions or want to order? Click here to chat on WhatsApp!
            </p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-slate-400 hover:text-slate-600 p-0.5 rounded-full transition-colors cursor-pointer"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Floating Button */}
      <a
        id="btn-floating-whatsapp"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto group relative flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-3.5 rounded-full shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 transition-all transform hover:-translate-y-1 active:translate-y-0 cursor-pointer"
        title={`Chat with ${settings.siteName} on WhatsApp`}
      >
        {/* Radar ping animation */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-white"></span>
        </span>

        <MessageCircle className="w-6 h-6 shrink-0 fill-current" />
        <span className="text-xs sm:text-sm font-bold tracking-wide pr-1">
          Chat on WhatsApp
        </span>
      </a>
    </aside>
  );
};
