import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  CheckCircle2, 
  Info,
  Copy,
  Check
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BANGLADESH_DISTRICTS } from '../data/initialData';
import { CustomerInfo, PaymentMethod } from '../types';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    cartShippingFee,
    cartDiscount,
    cartGrandTotal,
    appliedCoupon,
    deliveryZone,
    setDeliveryZone,
    settings,
    checkout
  } = useStore();

  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [district, setDistrict] = useState('Dhaka');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  
  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bkash');
  const [transactionId, setTransactionId] = useState('');
  const [paymentSenderNumber, setPaymentSenderNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isCheckoutOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleZoneChange = (zone: 'inside_dhaka' | 'outside_dhaka') => {
    setDeliveryZone(zone);
    if (zone === 'inside_dhaka' && district !== 'Dhaka') {
      setDistrict('Dhaka');
    }
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your full name (আপনার পুরো নাম লিখুন)');
      return;
    }
    if (!phone.trim() || phone.replace(/[^0-9]/g, '').length < 10) {
      setErrorMessage('Please enter a valid 11-digit Bangladeshi mobile number (যেমন: 017XXXXXXXX)');
      return;
    }
    if (!address.trim()) {
      setErrorMessage('Please provide your full delivery address (পূর্ণাঙ্গ ঠিকানা প্রদান করুন)');
      return;
    }

    setStep(2);
  };

  const handleFinalOrderSubmit = async () => {
    setErrorMessage('');

    if (paymentMethod === 'bkash' || paymentMethod === 'nagad' || paymentMethod === 'rocket') {
      if (!paymentSenderNumber.trim()) {
        setErrorMessage(`Please enter your ${paymentMethod.toUpperCase()} account number`);
        return;
      }
      if (!transactionId.trim()) {
        setErrorMessage(`Please enter the ${paymentMethod.toUpperCase()} Transaction ID (TrxID)`);
        return;
      }
    }

    if (paymentMethod === 'card') {
      if (!cardNumber.trim() || !cardExpiry.trim() || !cardCvc.trim()) {
        setErrorMessage('Please enter all card details');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const customerInfo: CustomerInfo = {
        name,
        phone,
        email,
        address,
        city: city || district,
        district,
        zone: deliveryZone,
        deliveryNotes
      };

      await checkout(customerInfo, paymentMethod, transactionId, paymentSenderNumber);
    } catch (err) {
      setErrorMessage('Failed to place order. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[95vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-serif">Checkout & Order Confirmation</h2>
            <p className="text-xs text-slate-500">
              {step === 1 ? 'Step 1: Delivery Address in Bangladesh' : 'Step 2: Bangladeshi Payment Method'}
            </p>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Indicator */}
        <div className="px-6 pt-3 pb-2 bg-slate-50/40 border-b border-slate-100 flex items-center gap-3 text-xs font-semibold">
          <div className={`flex items-center gap-1.5 ${step === 1 ? 'text-rose-600' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 1 ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-600'}`}>1</span>
            <span>Delivery Info</span>
          </div>
          <span className="text-slate-300">──</span>
          <div className={`flex items-center gap-1.5 ${step === 2 ? 'text-rose-600' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 2 ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-600'}`}>2</span>
            <span>Payment Gateway (বিকাশ / নগদ / COD)</span>
          </div>
        </div>

        {/* Scrollable Form Content */}
        <div className="overflow-y-auto p-6 space-y-5 flex-1">
          
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* STEP 1: DELIVERY INFO */}
          {step === 1 && (
            <form id="form-checkout-step1" onSubmit={handleNextStep} className="space-y-4">
              
              {/* Delivery Zone Toggle */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Select Delivery Zone (ডেলিভারি লোকেশন):
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => handleZoneChange('inside_dhaka')}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                      deliveryZone === 'inside_dhaka'
                        ? 'border-rose-600 bg-rose-50/60 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Inside Dhaka (ঢাকা সিটি)</h4>
                      <p className="text-[11px] text-slate-500">24-48 Hours Delivery</p>
                    </div>
                    <span className="font-mono text-xs font-bold text-rose-600">৳{settings.insideDhakaFee}</span>
                  </div>

                  <div
                    onClick={() => handleZoneChange('outside_dhaka')}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                      deliveryZone === 'outside_dhaka'
                        ? 'border-rose-600 bg-rose-50/60 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Outside Dhaka (ঢাকার বাইরে)</h4>
                      <p className="text-[11px] text-slate-500">48-72 Hours All 64 Districts</p>
                    </div>
                    <span className="font-mono text-xs font-bold text-rose-600">৳{settings.outsideDhakaFee}</span>
                  </div>
                </div>
              </div>

              {/* Customer Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Full Name (আপনার নাম) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="input-customer-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Tanvir Rahman"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-rose-500 focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Mobile Number (মোবাইল নম্বর) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="input-customer-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-rose-500 focus:bg-white font-mono"
                  />
                </div>
              </div>

              {/* District & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    District (জেলা) <span className="text-rose-600">*</span>
                  </label>
                  <select
                    id="select-customer-district"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-rose-500 focus:bg-white"
                  >
                    {BANGLADESH_DISTRICTS.map((dist) => (
                      <option key={dist} value={dist}>{dist}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Thana / Upazila / Area (থানা / এলাকা)
                  </label>
                  <input
                    id="input-customer-city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Dhanmondi / Agrabad / Mirpur"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-rose-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Full Address */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Detailed Address (হাউস, রোড, ফ্ল্যাট নম্বর ইত্যাদি) <span className="text-rose-600">*</span>
                </label>
                <textarea
                  id="input-customer-address"
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House 12, Road 5, Block B, Landmark..."
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-rose-500 focus:bg-white"
                />
              </div>

              {/* Email & Delivery Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="For order receipt"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-rose-500 focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Special Note / Delivery Instruction
                  </label>
                  <input
                    type="text"
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    placeholder="e.g. Call before coming"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-rose-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Next Step Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-md shadow-rose-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Continue to Payment Method (পেমেন্ট নির্বাচন করুন)</span>
                </button>
              </div>

            </form>
          )}

          {/* STEP 2: BANGLADESHI PAYMENT METHODS */}
          {step === 2 && (
            <div className="space-y-5">
              
              {/* Payment Method Selector Cards */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Select Payment Gateway (পেমেন্ট মাধ্যম বেছে নিন):
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {/* bKash */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bkash')}
                    className={`p-3 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      paymentMethod === 'bkash'
                        ? 'border-[#E2136E] bg-pink-50/50 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#E2136E] text-white flex items-center justify-center font-bold text-xs">
                      ব
                    </div>
                    <span className="text-xs font-bold text-slate-900">bKash</span>
                    <span className="text-[10px] text-[#E2136E] font-medium">বিকাশ পেমেন্ট</span>
                  </button>

                  {/* Nagad */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('nagad')}
                    className={`p-3 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      paymentMethod === 'nagad'
                        ? 'border-[#F7931E] bg-amber-50/50 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#F7931E] text-white flex items-center justify-center font-bold text-xs">
                      ন
                    </div>
                    <span className="text-xs font-bold text-slate-900">Nagad</span>
                    <span className="text-[10px] text-[#F7931E] font-medium">নগদ পেমেন্ট</span>
                  </button>

                  {/* Rocket */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('rocket')}
                    className={`p-3 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      paymentMethod === 'rocket'
                        ? 'border-[#8C3494] bg-purple-50/50 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#8C3494] text-white flex items-center justify-center font-bold text-xs">
                      র
                    </div>
                    <span className="text-xs font-bold text-slate-900">Rocket</span>
                    <span className="text-[10px] text-[#8C3494] font-medium">রকেট পেমেন্ট</span>
                  </button>

                  {/* COD */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      paymentMethod === 'cod'
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                      ৳
                    </div>
                    <span className="text-xs font-bold text-slate-900">Cash on Delivery</span>
                    <span className="text-[10px] text-emerald-700 font-medium">হাতে পেয়ে টাকা দিন</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Payment Instruction & Input Box */}
              {paymentMethod === 'bkash' && (
                <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#E2136E] uppercase tracking-wider">bKash {settings.bkashType} Number</span>
                      <p className="text-base font-extrabold font-mono text-slate-900">{settings.bkashNumber}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(settings.bkashNumber)}
                      className="px-2.5 py-1 text-xs font-semibold bg-white border border-pink-300 text-[#E2136E] rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      {copiedNumber ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedNumber ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* Step Instructions */}
                  <div className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-pink-100 space-y-1">
                    <p className="font-bold text-[#E2136E]">পেমেন্ট করার নিয়মাবলী:</p>
                    <p>১. আপনার bKash App ওপেন করুন অথবা dial করুন *247#</p>
                    <p>২. {settings.bkashType === 'Merchant' ? 'Make Payment' : 'Send Money'} অপশনে যান এবং উপরের নম্বরে <strong>৳{cartGrandTotal.toLocaleString()}</strong> পাঠান।</p>
                    <p>৩. রেফারেন্স হিসেবে লিখুন: <strong>BREDVEX</strong></p>
                    <p>৪. লেনদেন সম্পন্ন হলে নিচে আপনার bKash নম্বর ও ট্রানজেকশন আইডি (TrxID) দিন।</p>
                  </div>

                  {/* Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="text-xs font-bold text-slate-700">Your bKash Number (আপনার নম্বর)</label>
                      <input
                        type="tel"
                        value={paymentSenderNumber}
                        onChange={(e) => setPaymentSenderNumber(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="w-full mt-1 px-3 py-2 text-sm bg-white border border-pink-200 rounded-xl outline-hidden focus:border-[#E2136E] font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700">Transaction ID (TrxID)</label>
                      <input
                        type="text"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="e.g. 9K8J7H6G"
                        className="w-full mt-1 px-3 py-2 text-sm bg-white border border-pink-200 rounded-xl outline-hidden focus:border-[#E2136E] font-mono uppercase"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'nagad' && (
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#F7931E] uppercase tracking-wider">Nagad {settings.nagadType} Number</span>
                      <p className="text-base font-extrabold font-mono text-slate-900">{settings.nagadNumber}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(settings.nagadNumber)}
                      className="px-2.5 py-1 text-xs font-semibold bg-white border border-amber-300 text-[#F7931E] rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      {copiedNumber ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedNumber ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <div className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-amber-100 space-y-1">
                    <p className="font-bold text-[#F7931E]">নগদ পেমেন্ট নির্দেশিকা:</p>
                    <p>১. নগদ অ্যাপ অথবা *167# ডায়াল করুন।</p>
                    <p>২. {settings.nagadType === 'Merchant' ? 'Merchant Pay' : 'Send Money'} সিলেক্ট করে <strong>৳{cartGrandTotal.toLocaleString()}</strong> টাকা প্রেরণ করুন।</p>
                    <p>৩. নিচে আপনার নগদ একাউন্ট নম্বর এবং প্রাপ্ত TrxID প্রদান করুন।</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="text-xs font-bold text-slate-700">Your Nagad Number</label>
                      <input
                        type="tel"
                        value={paymentSenderNumber}
                        onChange={(e) => setPaymentSenderNumber(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="w-full mt-1 px-3 py-2 text-sm bg-white border border-amber-200 rounded-xl outline-hidden focus:border-[#F7931E] font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700">Transaction ID (TrxID)</label>
                      <input
                        type="text"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="e.g. NAG98271"
                        className="w-full mt-1 px-3 py-2 text-sm bg-white border border-amber-200 rounded-xl outline-hidden focus:border-[#F7931E] font-mono uppercase"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'rocket' && (
                <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#8C3494] uppercase tracking-wider">Rocket {settings.rocketType} Number</span>
                      <p className="text-base font-extrabold font-mono text-slate-900">{settings.rocketNumber}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(settings.rocketNumber)}
                      className="px-2.5 py-1 text-xs font-semibold bg-white border border-purple-300 text-[#8C3494] rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      {copiedNumber ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedNumber ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <div className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-purple-100 space-y-1">
                    <p className="font-bold text-[#8C3494]">রকেট পেমেন্ট নির্দেশিকা:</p>
                    <p>১. রকেট অ্যাপ অথবা *322# ডায়াল করে উপরে প্রদত্ত নম্বরে <strong>৳{cartGrandTotal.toLocaleString()}</strong> টাকা পাঠান।</p>
                    <p>২. পেমেন্ট শেষে ট্রানজেকশন আইডি নিচে প্রবেশ করান।</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="text-xs font-bold text-slate-700">Your Rocket Account</label>
                      <input
                        type="tel"
                        value={paymentSenderNumber}
                        onChange={(e) => setPaymentSenderNumber(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="w-full mt-1 px-3 py-2 text-sm bg-white border border-purple-200 rounded-xl outline-hidden font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700">Transaction ID (TrxID)</label>
                      <input
                        type="text"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="e.g. RCKT8291"
                        className="w-full mt-1 px-3 py-2 text-sm bg-white border border-purple-200 rounded-xl outline-hidden font-mono uppercase"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Cash on Delivery (ক্যাশ অন ডেলিভারি)</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    অর্ডারটি নিশ্চিত করার পর আমাদের কুরিয়ার প্রতিনিধি আপনার ঠিকানায় পণ্য পৌঁছে দেবে। পণ্য হাতে পেয়ে চেক করে ডেলিভারিম্যানের কাছে সম্পূর্ণ মূল্য <strong>৳{cartGrandTotal.toLocaleString()}</strong> টাকা পরিশোধ করুন।
                  </p>
                  <p className="text-[11px] text-emerald-700 font-medium">
                    ✓ অগ্রিম কোনো পেমেন্টের প্রয়োজন নেই।
                  </p>
                </div>
              )}

              {/* Order Summary Recap */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Final Order Breakdown</h4>
                <div className="flex justify-between text-slate-600">
                  <span>Customer:</span>
                  <span className="font-medium text-slate-900">{name} ({phone})</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery to:</span>
                  <span className="font-medium text-slate-900">{district} ({deliveryZone === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'})</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({cart.length} items):</span>
                  <span className="font-mono text-slate-900">৳{cartSubtotal.toLocaleString()}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount {appliedCoupon ? `(${appliedCoupon})` : ''}:</span>
                    <span className="font-mono">-৳{cartDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Charge:</span>
                  <span className="font-mono text-slate-900">
                    {cartShippingFee === 0 ? 'FREE' : `৳${cartShippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Grand Total Payable:</span>
                  <span className="text-base text-rose-600 font-mono">৳{cartGrandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  id="btn-confirm-order-final"
                  onClick={handleFinalOrderSubmit}
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-md shadow-rose-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isSubmitting ? 'Placing Order...' : 'Confirm Order (অর্ডার নিশ্চিত করুন)'}</span>
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
