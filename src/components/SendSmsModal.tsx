import React, { useState } from 'react';
import { X, MessageSquare, Send, CheckCircle2, AlertCircle, Phone, Sparkles } from 'lucide-react';
import { Order, SiteSettings } from '../types';
import { generateOrderSmsText, generateCourierSmsText } from '../services/smsService';
import { useStore } from '../context/StoreContext';

interface SendSmsModalProps {
  order: Order;
  settings: SiteSettings;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

export const SendSmsModal: React.FC<SendSmsModalProps> = ({ order, settings, onClose, onSuccess }) => {
  const { sendOrderSms } = useStore();

  const [smsType, setSmsType] = useState<'order_placed' | 'courier_dispatch' | 'custom'>('order_placed');
  const [customText, setCustomText] = useState(generateOrderSmsText(order, settings.siteName));
  const [isSending, setIsSending] = useState(false);
  const [resultStatus, setResultStatus] = useState<{ success: boolean; message: string } | null>(null);

  const handleTypeChange = (type: 'order_placed' | 'courier_dispatch' | 'custom') => {
    setSmsType(type);
    if (type === 'order_placed') {
      setCustomText(generateOrderSmsText(order, settings.siteName));
    } else if (type === 'courier_dispatch') {
      setCustomText(generateCourierSmsText(order, settings.siteName));
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;

    setIsSending(true);
    setResultStatus(null);

    try {
      const res = await sendOrderSms(order.id, smsType, customText);
      setResultStatus(res);
      if (res.success) {
        onSuccess(`SMS successfully sent to ${order.customerInfo.phone}!`);
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (err: any) {
      setResultStatus({
        success: false,
        message: err.message || 'Failed to send SMS.'
      });
    } finally {
      setIsSending(false);
    }
  };

  const charCount = customText.length;
  const smsSegments = Math.ceil(charCount / 160) || 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Send SMS Notification</h3>
              <p className="text-[11px] text-slate-500">To customer for Order #{order.orderNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSend} className="p-6 space-y-4">
          
          {/* Recipient */}
          <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <Phone className="w-4 h-4 text-slate-500" />
              <span>Recipient: <strong>{order.customerInfo.name}</strong></span>
            </div>
            <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
              {order.customerInfo.phone}
            </span>
          </div>

          {/* Quick Template Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Choose Message Template:</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleTypeChange('order_placed')}
                className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                  smsType === 'order_placed'
                    ? 'bg-rose-50 border-rose-500 text-rose-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Order Placed
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('courier_dispatch')}
                className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                  smsType === 'courier_dispatch'
                    ? 'bg-rose-50 border-rose-500 text-rose-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Courier Tracking
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('custom')}
                className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                  smsType === 'custom'
                    ? 'bg-rose-50 border-rose-500 text-rose-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Custom Text
              </button>
            </div>
          </div>

          {/* Text Area */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Message Text:</span>
              <span>{charCount} characters ({smsSegments} SMS)</span>
            </div>
            <textarea
              rows={4}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-full text-xs font-sans p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 leading-relaxed resize-none"
              placeholder="Type SMS text..."
              required
            />
          </div>

          {/* Gateway status note */}
          <div className="text-[11px] text-slate-500 flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <span>Provider: <strong>{settings.smsSettings?.provider?.toUpperCase() || 'SIMULATION'}</strong></span>
            <span>Sender ID: <strong>{settings.smsSettings?.senderId || 'BREDVEX'}</strong></span>
          </div>

          {/* Feedback banner */}
          {resultStatus && (
            <div className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
              resultStatus.success 
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {resultStatus.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span>{resultStatus.message}</span>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSending || !customText.trim()}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              {isSending ? (
                <span>Sending SMS...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Send SMS Now (পাঠান)</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
