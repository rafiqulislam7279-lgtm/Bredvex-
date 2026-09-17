import React, { useState, useEffect } from 'react';
import { 
  User, 
  Lock, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Package, 
  LogOut, 
  Eye, 
  EyeOff, 
  X, 
  ShieldCheck, 
  Zap, 
  ExternalLink,
  ShoppingBag,
  Clock,
  Truck,
  Check
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BANGLADESH_DISTRICTS } from '../data/initialData';

export const CustomerAuthModal: React.FC = () => {
  const {
    isCustomerAuthModalOpen,
    setIsCustomerAuthModalOpen,
    customerAuthModalTab,
    setCustomerAuthModalTab,
    currentUser,
    customerProfile,
    signUpCustomer,
    signInCustomer,
    updateCustomerProfile,
    logoutGoogle,
    loginWithGoogle,
    orders,
    setIsTrackOrderOpen,
    settings
  } = useStore();

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccessMsg, setLoginSuccessMsg] = useState<string | null>(null);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regAddress, setRegAddress] = useState('');
  const [regCity, setRegCity] = useState('Dhaka');
  const [regDistrict, setRegDistrict] = useState('Dhaka');
  const [regZone, setRegZone] = useState<'inside_dhaka' | 'outside_dhaka'>('inside_dhaka');
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  // Profile edit state
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileAddress, setProfileAddress] = useState('');
  const [profileCity, setProfileCity] = useState('');
  const [profileDistrict, setProfileDistrict] = useState('');
  const [profileZone, setProfileZone] = useState<'inside_dhaka' | 'outside_dhaka'>('inside_dhaka');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSavedSuccess, setProfileSavedSuccess] = useState(false);

  // Synchronize profile edit state
  useEffect(() => {
    if (customerProfile) {
      setProfileName(customerProfile.name || '');
      setProfilePhone(customerProfile.phone || '');
      setProfileAddress(customerProfile.address || '');
      setProfileCity(customerProfile.city || 'Dhaka');
      setProfileDistrict(customerProfile.district || 'Dhaka');
      setProfileZone(customerProfile.zone || 'inside_dhaka');
    } else if (currentUser) {
      setProfileName(currentUser.displayName || '');
    }
  }, [customerProfile, currentUser]);

  if (!isCustomerAuthModalOpen) return null;

  // Filter orders for the logged-in customer
  const customerOrders = orders.filter(o => {
    if (!currentUser && !customerProfile) return false;
    const matchUid = currentUser?.uid && o.userId === currentUser.uid;
    const userEmail = (currentUser?.email || customerProfile?.email)?.toLowerCase();
    const orderEmail = o.customerInfo?.email?.toLowerCase();
    const matchEmail = Boolean(userEmail && orderEmail && userEmail === orderEmail);
    const userPhone = customerProfile?.phone ? customerProfile.phone.replace(/[^0-9]/g, '') : '';
    const orderPhone = o.customerInfo?.phone ? o.customerInfo.phone.replace(/[^0-9]/g, '') : '';
    const matchPhone = Boolean(userPhone && orderPhone && userPhone === orderPhone);
    return Boolean(matchUid || matchEmail || matchPhone);
  });

  const totalSpent = customerOrders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);
    setLoginSuccessMsg(null);

    const res = await signInCustomer(loginIdentifier, loginPassword);
    setLoginLoading(false);

    if (res.success) {
      setLoginSuccessMsg(res.message || 'Logged in successfully!');
      setTimeout(() => {
        setCustomerAuthModalTab('profile');
      }, 700);
    } else {
      setLoginError(res.message || 'Login failed. Please verify your credentials.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegLoading(true);
    setRegError(null);

    const res = await signUpCustomer(
      regName,
      regEmail,
      regPassword,
      regPhone,
      regAddress,
      regZone
    );
    setRegLoading(false);

    if (res.success) {
      setCustomerAuthModalTab('profile');
    } else {
      setRegError(res.message || 'Registration failed. Please try again.');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    await updateCustomerProfile({
      name: profileName,
      phone: profilePhone,
      address: profileAddress,
      city: profileCity,
      district: profileDistrict,
      zone: profileZone,
    });
    setProfileSaving(false);
    setProfileSavedSuccess(true);
    setTimeout(() => setProfileSavedSuccess(false), 3000);
  };

  const handleGoogleAuth = async () => {
    try {
      await loginWithGoogle();
      setCustomerAuthModalTab('profile');
    } catch (err) {
      console.warn('Google sign-in within modal:', err);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in"
      onClick={() => setIsCustomerAuthModalOpen(false)}
    >
      <div 
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] flex flex-col overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between shrink-0 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center font-black">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                {currentUser ? 'My Customer Account' : 'Customer Sign In & Registration'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {currentUser ? 'Manage your delivery address & order history' : `Welcome to ${settings.siteName}`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsCustomerAuthModalOpen(false)}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-5 pt-3 gap-2 shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
          {!currentUser ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setCustomerAuthModalTab('login');
                  setLoginError(null);
                }}
                className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  customerAuthModalTab === 'login'
                    ? 'border-rose-600 text-rose-600 dark:text-rose-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setCustomerAuthModalTab('register');
                  setRegError(null);
                }}
                className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  customerAuthModalTab === 'register'
                    ? 'border-rose-600 text-rose-600 dark:text-rose-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                Create Account (Sign Up)
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setCustomerAuthModalTab('profile')}
                className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  customerAuthModalTab === 'profile'
                    ? 'border-rose-600 text-rose-600 dark:text-rose-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Profile & Saved Address</span>
              </button>
              <button
                type="button"
                onClick={() => setCustomerAuthModalTab('login')}
                className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  customerAuthModalTab === 'login'
                    ? 'border-rose-600 text-rose-600 dark:text-rose-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>My Orders ({customerOrders.length})</span>
              </button>
            </>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* TAB 1: SIGN IN (When not logged in) */}
          {!currentUser && customerAuthModalTab === 'login' && (
            <div className="space-y-4">
              <div className="text-center sm:text-left">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Welcome Back!
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Sign in with your email or phone number to view orders and auto-fill checkout.
                </p>
              </div>

              {loginError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300">
                  {loginError}
                </div>
              )}

              {loginSuccessMsg && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{loginSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email or Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="e.g. customer@gmail.com or 01712345678"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-rose-500 outline-hidden"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter your account password"
                      className="w-full pl-9 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-rose-500 outline-hidden"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loginLoading ? (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>Sign In to My Account</span>
                  )}
                </button>
              </form>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-700" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white dark:bg-slate-900 px-2 text-slate-500 dark:text-slate-400 font-medium">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google 1-Click option */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full py-2.5 px-4 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-xl border border-slate-300 dark:border-slate-600 shadow-2xs transition-colors cursor-pointer flex items-center justify-center gap-2.5"
              >
                <img 
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                  alt="Google" 
                  className="w-4 h-4" 
                />
                <span>Sign in with Google</span>
              </button>

              <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => setCustomerAuthModalTab('register')}
                  className="font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                >
                  Create Account here
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: CREATE ACCOUNT (Sign Up) */}
          {!currentUser && customerAuthModalTab === 'register' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Create Customer Account
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Sign up in 30 seconds to save your delivery address, track orders, and receive courier SMS updates.
                </p>
              </div>

              {regError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300">
                  {regError}
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Tanvir Ahmed"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-rose-500 outline-hidden"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="tanvir@gmail.com"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-rose-500 outline-hidden"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Phone Number * (for delivery)
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="017XXXXXXXX"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-rose-500 outline-hidden"
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Password (min 6 characters) *
                  </label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Create a secure password"
                      className="w-full pl-9 pr-10 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-rose-500 outline-hidden"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Default Delivery Address
                  </label>
                  <div className="relative">
                    <textarea
                      rows={2}
                      value={regAddress}
                      onChange={(e) => setRegAddress(e.target.value)}
                      placeholder="House, Road, Area, Thana / Post Office"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-rose-500 outline-hidden resize-none"
                    />
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Delivery Zone
                    </label>
                    <select
                      value={regZone}
                      onChange={(e) => setRegZone(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-hidden"
                    >
                      <option value="inside_dhaka">Inside Dhaka (৳{settings.insideDhakaFee})</option>
                      <option value="outside_dhaka">Outside Dhaka (৳{settings.outsideDhakaFee})</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      District
                    </label>
                    <select
                      value={regDistrict}
                      onChange={(e) => {
                        setRegDistrict(e.target.value);
                        if (e.target.value === 'Dhaka') {
                          setRegZone('inside_dhaka');
                        } else {
                          setRegZone('outside_dhaka');
                        }
                      }}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-hidden"
                    >
                      {BANGLADESH_DISTRICTS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={regLoading}
                  className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {regLoading ? (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>Create My Account</span>
                  )}
                </button>
              </form>

              <div className="pt-1 text-center text-xs text-slate-500 dark:text-slate-400">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setCustomerAuthModalTab('login')}
                  className="font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                >
                  Sign In here
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: LOGGED IN - PROFILE & ADDRESS */}
          {currentUser && customerAuthModalTab === 'profile' && (
            <div className="space-y-5">
              {/* Account summary banner */}
              <div className="p-4 bg-gradient-to-r from-rose-50 via-slate-50 to-amber-50 dark:from-slate-800 dark:via-slate-800/80 dark:to-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {currentUser.photoURL ? (
                    <img 
                      src={currentUser.photoURL} 
                      alt="" 
                      className="w-12 h-12 rounded-full border-2 border-rose-500 shrink-0" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-rose-600 text-white font-bold text-base flex items-center justify-center shrink-0">
                      {currentUser.displayName?.[0] || 'C'}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {currentUser.displayName || customerProfile?.name || 'Customer'}
                      </h4>
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-1.5 py-0.2 rounded-full">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {currentUser.email || customerProfile?.email}
                    </p>
                    {customerProfile?.phone && (
                      <p className="text-[11px] text-slate-600 dark:text-slate-300">
                        📞 {customerProfile.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={async () => {
                      await logoutGoogle();
                      setCustomerAuthModalTab('login');
                    }}
                    className="px-3 py-1.5 bg-white dark:bg-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-slate-200 dark:border-slate-600 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>

              {/* Statistics Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Total Orders</span>
                  <p className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                    {customerOrders.length}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Total Spent</span>
                  <p className="text-base font-black text-rose-600 dark:text-rose-400 mt-0.5">
                    ৳{totalSpent.toLocaleString()}
                  </p>
                </div>
                <div className="col-span-2 sm:col-span-1 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Saved Address</span>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5 truncate max-w-[130px]">
                      {customerProfile?.address ? customerProfile.address : 'Not set yet'}
                    </p>
                  </div>
                  <MapPin className="w-4 h-4 text-slate-400" />
                </div>
              </div>

              {/* Edit Saved Profile & Delivery Details */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 uppercase tracking-wide">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>Saved Delivery & Checkout Details</span>
                  </h5>
                  {profileSavedSuccess && (
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Details Saved!
                    </span>
                  )}
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        Display Name
                      </label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        Contact Phone (for Courier Dispatch)
                      </label>
                      <input
                        type="tel"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        placeholder="017XXXXXXXX"
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Street Address & Apartment
                    </label>
                    <textarea
                      rows={2}
                      value={profileAddress}
                      onChange={(e) => setProfileAddress(e.target.value)}
                      placeholder="e.g. House 14, Road 5, Block B, Mirpur-10"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-hidden resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        Delivery Zone
                      </label>
                      <select
                        value={profileZone}
                        onChange={(e) => setProfileZone(e.target.value as any)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-hidden"
                      >
                        <option value="inside_dhaka">Inside Dhaka</option>
                        <option value="outside_dhaka">Outside Dhaka</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        District
                      </label>
                      <select
                        value={profileDistrict}
                        onChange={(e) => {
                          setProfileDistrict(e.target.value);
                          if (e.target.value === 'Dhaka') {
                            setProfileZone('inside_dhaka');
                          } else {
                            setProfileZone('outside_dhaka');
                          }
                        }}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-hidden"
                      >
                        {BANGLADESH_DISTRICTS.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      disabled={profileSaving}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-rose-600 dark:hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {profileSaving ? 'Saving...' : 'Save Details for Fast Checkout'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 4: LOGGED IN - ORDER HISTORY */}
          {currentUser && customerAuthModalTab === 'login' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Order History & Live Tracking ({customerOrders.length})
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomerAuthModalOpen(false);
                    setIsTrackOrderOpen(true);
                  }}
                  className="text-xs text-rose-600 dark:text-rose-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>Track by Order ID</span>
                </button>
              </div>

              {customerOrders.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-700 space-y-2">
                  <div className="w-12 h-12 rounded-full bg-slate-200/70 dark:bg-slate-700 text-slate-400 mx-auto flex items-center justify-center">
                    <Package className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    No orders placed under this account yet.
                  </p>
                  <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                    Your past and upcoming orders with live Steadfast & Pathao courier tracking will appear right here!
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {customerOrders.map((order) => {
                    const statusColors: Record<string, string> = {
                      pending: 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 border-amber-300',
                      processing: 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 border-blue-300',
                      shipped: 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 border-indigo-300',
                      delivered: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 border-emerald-300',
                      cancelled: 'bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-200 border-rose-300',
                    };

                    return (
                      <div 
                        key={order.id}
                        className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700 space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-black text-slate-900 dark:text-white font-mono">
                              {order.orderNumber}
                            </span>
                            <p className="text-[10px] text-slate-400">
                              {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize ${statusColors[order.status] || 'bg-slate-100 text-slate-700'}`}>
                            {order.status}
                          </span>
                        </div>

                        {/* Order items summary */}
                        <div className="text-[11px] text-slate-600 dark:text-slate-300 bg-white/70 dark:bg-slate-900/70 p-2 rounded-xl border border-slate-200/60 dark:border-slate-800">
                          {(order.items || []).map((item, idx) => (
                            <div key={idx} className="flex justify-between py-0.5">
                              <span className="truncate pr-2">{item.quantity}x {item.product?.name || 'Product'}</span>
                              <span className="font-semibold shrink-0">৳{((item.product?.price || 0) * (item.quantity || 1)).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200 dark:border-slate-700">
                          <span className="font-bold text-slate-900 dark:text-white">
                            Total: ৳{(order.grandTotal || 0).toLocaleString()}
                          </span>

                          <div className="flex items-center gap-2">
                            {order.courierTrackingUrl && (
                              <a
                                href={order.courierTrackingUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 cursor-pointer"
                              >
                                <Truck className="w-3.5 h-3.5" />
                                <span>Track Parcel</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                setIsCustomerAuthModalOpen(false);
                                setIsTrackOrderOpen(true);
                              }}
                              className="px-2.5 py-1 bg-slate-200/80 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                            >
                              Details
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
