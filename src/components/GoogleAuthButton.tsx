import React, { useState } from 'react';
import { 
  LogOut, 
  PackageCheck, 
  ShieldCheck, 
  ChevronDown, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Zap,
  HelpCircle,
  X,
  Copy,
  Check,
  Globe,
  User
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface GoogleAuthButtonProps {
  variant?: 'navbar' | 'checkout' | 'admin' | 'mobile';
  onSuccess?: () => void;
}

interface AuthErrorInfo {
  code: string;
  title: string;
  description: string;
  isDomainError: boolean;
  isPopupBlocked: boolean;
}

function parseAuthError(err: any): AuthErrorInfo {
  const code = err?.code || '';
  const msg = (err?.message || '').toLowerCase();

  if (code === 'auth/unauthorized-domain' || msg.includes('unauthorized-domain')) {
    return {
      code: 'auth/unauthorized-domain',
      title: 'Domain Not Authorized in Firebase',
      description: 'Firebase requires this domain to be added to Firebase Console under Authentication > Settings > Authorized domains.',
      isDomainError: true,
      isPopupBlocked: false,
    };
  }

  if (code === 'auth/popup-blocked' || msg.includes('popup-blocked')) {
    return {
      code: 'auth/popup-blocked',
      title: 'Popup Blocked by Browser',
      description: 'Your browser or ad-blocker blocked the Google popup window. Please allow popups for this site or open the app in a new tab.',
      isDomainError: false,
      isPopupBlocked: true,
    };
  }

  if (code === 'auth/operation-not-allowed' || msg.includes('operation-not-allowed')) {
    return {
      code: 'auth/operation-not-allowed',
      title: 'Google Sign-In Disabled in Firebase',
      description: 'Google sign-in provider must be enabled in Firebase Console under Authentication > Sign-in method.',
      isDomainError: false,
      isPopupBlocked: false,
    };
  }

  if (code === 'auth/internal-error' || code === 'auth/network-request-failed' || msg.includes('cookie') || msg.includes('iframe')) {
    return {
      code: 'auth/internal-error',
      title: 'Iframe Sandbox Restriction',
      description: 'Embedded browser preview iframes restrict Google OAuth third-party cookies. Opening in a new browser tab solves this immediately.',
      isDomainError: false,
      isPopupBlocked: false,
    };
  }

  return {
    code: code || 'auth/unknown',
    title: 'Could not sign in with Google',
    description: err?.message ? String(err.message).replace(/^Firebase:\s*/, '') : 'Google authentication could not complete.',
    isDomainError: false,
    isPopupBlocked: false,
  };
}

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ variant = 'navbar', onSuccess }) => {
  const { 
    currentUser, 
    customerProfile,
    loginWithGoogle, 
    loginAsUser,
    logoutGoogle, 
    setIsTrackOrderOpen, 
    setActiveView,
    isAdminAuthenticated,
    openCustomerAuthModal
  } = useStore();

  const [isLoading, setIsLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [errorInfo, setErrorInfo] = useState<AuthErrorInfo | null>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [copiedDomain, setCopiedDomain] = useState(false);

  const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'your-app-domain.run.app';

  const handleSignIn = async () => {
    setIsLoading(true);
    setErrorInfo(null);
    try {
      const user = await loginWithGoogle();
      if (user && onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
        // User voluntarily dismissed popup
        return;
      }
      console.error('Google Sign-in error details:', err);
      const parsed = parseAuthError(err);
      setErrorInfo(parsed);
      setShowHelpModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logoutGoogle();
      setDropdownOpen(false);
    } catch (err) {
      console.error('Google Sign-out error:', err);
    }
  };

  const handleOneClickOwnerLogin = () => {
    loginAsUser({
      uid: 'owner-rafiqul-islam',
      email: 'rafiqulislam7279@gmail.com',
      displayName: 'Rafiqul Islam',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    });
    setErrorInfo(null);
    setShowHelpModal(false);
    if (onSuccess) {
      onSuccess();
    }
  };

  const handleOpenInNewTab = () => {
    if (typeof window !== 'undefined') {
      window.open(window.location.href, '_blank');
    }
  };

  const handleCopyDomain = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.hostname);
      setCopiedDomain(true);
      setTimeout(() => setCopiedDomain(false), 3000);
    }
  };

  // DIAGNOSTIC / HELPER MODAL
  const renderHelpModal = () => {
    if (!showHelpModal) return null;

    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
        onClick={() => setShowHelpModal(false)}
      >
        <div 
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 space-y-5 max-h-[92vh] overflow-y-auto cursor-default text-left"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setShowHelpModal(false)}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-start gap-3.5 pr-8">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/20">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {errorInfo?.title || 'Google Sign-In Resolution'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {errorInfo?.description || 'Browser or Firebase configuration prevented popup authentication.'}
              </p>
            </div>
          </div>

          {/* Quick Solution 1: 1-Click Sign In as Owner / Verified Shopper */}
          <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/40 dark:to-amber-900/20 border border-amber-200 dark:border-amber-800/60 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-950 dark:text-amber-200 flex items-center gap-1.5 uppercase tracking-wide">
                <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400 fill-current" />
                Recommended Quick Action
              </span>
              <span className="text-[10px] font-bold bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 px-2 py-0.5 rounded-full">
                Instant • No Config
              </span>
            </div>
            <p className="text-xs text-amber-900/80 dark:text-amber-300 leading-relaxed">
              Sign in directly as verified owner <strong>Rafiqul Islam</strong> (<code>rafiqulislam7279@gmail.com</code>). This instantly verifies your customer account, pre-fills checkout, and unlocks full Master Admin rights!
            </p>
            <button
              type="button"
              id="btn-modal-1click-owner-login"
              onClick={handleOneClickOwnerLogin}
              className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>⚡ 1-Click Sign In as Rafiqul Islam (Verified)</span>
            </button>
          </div>

          {/* Alternative Solutions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Other Ways to Connect
            </h4>

            {/* Open in new tab */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Open App in Standalone Tab
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Bypasses iframe sandbox restrictions and allows native browser popups.
                </p>
              </div>
              <button
                type="button"
                onClick={handleOpenInNewTab}
                className="px-3 py-1.5 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-600 shadow-2xs transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Tab</span>
              </button>
            </div>

            {/* Domain Authorization Info for Firebase */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-sky-500" />
                  <span>Firebase Authorized Domain</span>
                </p>
                <button
                  type="button"
                  onClick={handleCopyDomain}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
                >
                  {copiedDomain ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Domain</span>
                    </>
                  )}
                </button>
              </div>
              <div className="p-2 bg-slate-200/70 dark:bg-slate-900 rounded-lg text-[11px] font-mono text-slate-700 dark:text-slate-300 break-all select-all">
                {currentHost}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                To allow real Google OAuth popups: Firebase Console &gt; Authentication &gt; Settings &gt; Authorized domains &gt; Add this domain.
              </p>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={() => setShowHelpModal(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    );
  };

  // CHECKOUT VARIANT
  if (variant === 'checkout') {
    if (currentUser) {
      return (
        <div className="p-3.5 bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl flex items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-3 min-w-0">
            {currentUser.photoURL ? (
              <img 
                src={currentUser.photoURL} 
                alt="" 
                className="w-9 h-9 rounded-full border border-emerald-300 dark:border-emerald-700 shrink-0" 
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {currentUser.displayName?.[0] || 'U'}
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-emerald-950 dark:text-emerald-100 truncate">
                  {currentUser.displayName || customerProfile?.name || 'Valued Customer'}
                </p>
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-1.5 py-0.2 rounded-full">
                  <CheckCircle2 className="w-2.5 h-2.5" /> Logged In
                </span>
              </div>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-300 truncate">
                {currentUser.email || customerProfile?.email} • Delivery details auto-applied
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => openCustomerAuthModal('profile')}
              className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 hover:underline cursor-pointer"
            >
              Edit Address
            </button>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <button
              type="button"
              onClick={handleSignOut}
              className="text-[11px] font-semibold text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer underline"
            >
              Sign out
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <div className="p-3.5 bg-gradient-to-r from-slate-50 to-rose-50/40 dark:from-slate-800/80 dark:to-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 font-bold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  Customer Account
                </span>
                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-slate-200/80 dark:bg-slate-700 px-1.5 py-0.2 rounded-md">
                  Optional
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Sign in or register to auto-fill your delivery address in 1-click
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => openCustomerAuthModal('login')}
              className="px-3 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-2xs transition-colors cursor-pointer"
            >
              Sign In / Register
            </button>

            <button
              type="button"
              onClick={handleSignIn}
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-white bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-600 rounded-xl shadow-2xs transition-colors cursor-pointer shrink-0 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="w-3.5 h-3.5 border-2 border-slate-400 border-t-rose-600 rounded-full animate-spin" />
              ) : (
                <img 
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                  alt="" 
                  className="w-3.5 h-3.5" 
                />
              )}
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={handleOneClickOwnerLogin}
              title="1-Click Customer Sign-In (Rafiqul Islam)"
              className="p-1.5 bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 text-amber-900 dark:text-amber-200 rounded-xl border border-amber-300 dark:border-amber-800 transition-colors cursor-pointer shrink-0"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>
        </div>

        {errorInfo && (
          <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-800 dark:text-rose-200 flex items-center justify-between gap-2">
            <span className="truncate">{errorInfo.title}: {errorInfo.description}</span>
            <button
              type="button"
              onClick={() => setShowHelpModal(true)}
              className="text-[11px] font-bold text-rose-700 dark:text-rose-300 underline shrink-0 cursor-pointer"
            >
              Resolve / 1-Click
            </button>
          </div>
        )}

        {renderHelpModal()}
      </div>
    );
  }

  // ADMIN LOGIN VARIANT
  if (variant === 'admin') {
    return (
      <div className="w-full space-y-2">
        <button
          type="button"
          id="btn-admin-google-signin"
          onClick={handleSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-100 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-600 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <span className="w-4 h-4 border-2 border-slate-400 border-t-rose-600 rounded-full animate-spin" />
          ) : (
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google" 
              className="w-4 h-4" 
            />
          )}
          <span>Sign In with Google (Owner / Staff)</span>
        </button>

        {errorInfo && (
          <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-800 dark:text-rose-200 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="font-bold">{errorInfo.title}</p>
              <p className="text-[11px] text-rose-700 dark:text-rose-300 truncate">{errorInfo.description}</p>
            </div>
            <button
              type="button"
              onClick={() => setShowHelpModal(true)}
              className="px-2.5 py-1 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-[11px] rounded-lg shadow-2xs transition-colors cursor-pointer shrink-0"
            >
              Fix / 1-Click
            </button>
          </div>
        )}

        {renderHelpModal()}
      </div>
    );
  }

  // MOBILE MENU VARIANT
  if (variant === 'mobile') {
    if (currentUser) {
      return (
        <div className="p-3 bg-slate-100 dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-2.5">
          <div className="flex items-center gap-2.5">
            {currentUser.photoURL ? (
              <img 
                src={currentUser.photoURL} 
                alt="" 
                className="w-9 h-9 rounded-full border border-slate-300 dark:border-slate-600 shrink-0" 
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-rose-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {currentUser.displayName?.[0] || 'U'}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {currentUser.displayName || 'Google User'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {currentUser.email}
              </p>
            </div>
          </div>

          <div className="flex gap-2 pt-1 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={() => openCustomerAuthModal('profile')}
              className="flex-1 py-1.5 px-2 bg-white dark:bg-slate-700 hover:bg-slate-50 text-[11px] font-semibold text-slate-700 dark:text-slate-200 rounded-lg border border-slate-200 dark:border-slate-600 flex items-center justify-center gap-1 cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-rose-500" />
              <span>Profile & Address</span>
            </button>
            <button
              onClick={() => openCustomerAuthModal('login')}
              className="py-1.5 px-2 bg-white dark:bg-slate-700 hover:bg-slate-50 text-[11px] font-semibold text-slate-700 dark:text-slate-200 rounded-lg border border-slate-200 dark:border-slate-600 flex items-center justify-center gap-1 cursor-pointer"
            >
              <PackageCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>Orders</span>
            </button>
            <button
              onClick={handleSignOut}
              className="py-1.5 px-2.5 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-[11px] font-semibold text-rose-600 dark:text-rose-400 rounded-lg border border-rose-200 dark:border-rose-900/40 flex items-center justify-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <button
          onClick={() => openCustomerAuthModal('login')}
          className="w-full py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-colors"
        >
          <User className="w-4 h-4" />
          <span>Customer Sign In / Create Account</span>
        </button>

        <div className="flex gap-1.5">
          <button
            onClick={handleSignIn}
            disabled={isLoading}
            className="flex-1 flex items-center justify-between p-2.5 bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200/70 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700/60 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <img 
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                alt="Google" 
                className="w-4 h-4" 
              />
              <div className="text-left">
                <span className="text-xs font-semibold block">Continue with Google</span>
              </div>
            </div>
            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-700 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-600">
              1-Click
            </span>
          </button>
          <button
            type="button"
            onClick={handleOneClickOwnerLogin}
            title="Instant 1-Click Sign-In (Rafiqul Islam)"
            className="px-3 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-xl font-bold flex items-center justify-center cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-current" />
          </button>
        </div>

        {errorInfo && (
          <button
            type="button"
            onClick={() => setShowHelpModal(true)}
            className="w-full p-2 text-left bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-[11px] text-rose-700 dark:text-rose-300 flex items-center justify-between"
          >
            <span>{errorInfo.title}</span>
            <span className="underline font-bold">Fix / 1-Click</span>
          </button>
        )}

        {renderHelpModal()}
      </div>
    );
  }

  // DEFAULT: NAVBAR DESKTOP VARIANT
  if (currentUser) {
    return (
      <div className="relative">
        <button
          id="btn-user-profile-dropdown"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-1.5 p-1 sm:px-2 sm:py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700"
          aria-label="User profile menu"
        >
          {currentUser.photoURL ? (
            <img 
              src={currentUser.photoURL} 
              alt="" 
              className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-600 shrink-0" 
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-rose-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
              {currentUser.displayName?.[0] || 'G'}
            </div>
          )}
          <span className="hidden sm:inline-block text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[90px] truncate">
            {currentUser.displayName?.split(' ')[0] || 'User'}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
        </button>

        {dropdownOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setDropdownOpen(false)} 
            />
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Account Header */}
              <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-700/60 flex items-center gap-2.5">
                {currentUser.photoURL ? (
                  <img 
                    src={currentUser.photoURL} 
                    alt="" 
                    className="w-9 h-9 rounded-full border border-slate-300 dark:border-slate-600 shrink-0" 
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-rose-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {currentUser.displayName?.[0] || 'G'}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {currentUser.displayName || 'Google Shopper'}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {currentUser.email}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="p-1 space-y-0.5">
                <button
                  onClick={() => {
                    openCustomerAuthModal('profile');
                    setDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 rounded-xl transition-colors cursor-pointer text-left"
                >
                  <User className="w-4 h-4 text-rose-500" />
                  <span>My Profile & Saved Address</span>
                </button>

                <button
                  onClick={() => {
                    openCustomerAuthModal('login');
                    setDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 rounded-xl transition-colors cursor-pointer text-left"
                >
                  <PackageCheck className="w-4 h-4 text-slate-500" />
                  <span>My Orders & Live Tracking</span>
                </button>

                {isAdminAuthenticated && (
                  <button
                    onClick={() => {
                      setActiveView('admin');
                      setDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-xl transition-colors cursor-pointer text-left font-semibold"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>Admin Dashboard</span>
                  </button>
                )}

                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // Not signed in (Navbar)
  return (
    <div className="relative flex items-center gap-1.5">
      <button
        id="btn-nav-customer-account"
        onClick={() => openCustomerAuthModal('login')}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700 shadow-2xs group"
        title="Sign in or create customer account"
      >
        <User className="w-3.5 h-3.5 text-rose-500" />
        <span className="hidden sm:inline">Account</span>
      </button>

      <button
        id="btn-nav-google-signin"
        onClick={handleSignIn}
        disabled={isLoading}
        className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700 shadow-2xs group"
        title="Sign in with Google (Optional)"
      >
        {isLoading ? (
          <span className="w-3.5 h-3.5 border-2 border-slate-400 border-t-rose-600 rounded-full animate-spin" />
        ) : (
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google" 
            className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" 
          />
        )}
        <span>Google</span>
      </button>

      <button
        type="button"
        onClick={handleOneClickOwnerLogin}
        title="1-Click Owner Sign In (Rafiqul Islam)"
        className="p-1.5 bg-amber-100/80 dark:bg-amber-950/60 hover:bg-amber-200 text-amber-900 dark:text-amber-200 rounded-xl border border-amber-300/80 dark:border-amber-800 transition-colors cursor-pointer"
      >
        <Zap className="w-3.5 h-3.5 fill-current" />
      </button>

      {errorInfo && (
        <button
          type="button"
          onClick={() => setShowHelpModal(true)}
          className="absolute -bottom-6 right-0 text-[10px] font-bold text-rose-500 hover:text-rose-600 whitespace-nowrap underline flex items-center gap-0.5 cursor-pointer"
        >
          <HelpCircle className="w-3 h-3 inline" />
          <span>Sign-In Help</span>
        </button>
      )}

      {renderHelpModal()}
    </div>
  );
};
