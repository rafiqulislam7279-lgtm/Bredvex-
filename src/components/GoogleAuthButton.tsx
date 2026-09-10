import React, { useState } from 'react';
import { LogOut, PackageCheck, ShieldCheck, ChevronDown, CheckCircle2, User as UserIcon } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface GoogleAuthButtonProps {
  variant?: 'navbar' | 'checkout' | 'admin' | 'mobile';
  onSuccess?: () => void;
}

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ variant = 'navbar', onSuccess }) => {
  const { 
    currentUser, 
    loginWithGoogle, 
    logoutGoogle, 
    setIsTrackOrderOpen, 
    setActiveView,
    isAdminAuthenticated 
  } = useStore();

  const [isLoading, setIsLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const user = await loginWithGoogle();
      if (user && onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
        // User closed or dismissed the popup window, normal action
        return;
      }
      console.error('Google Sign-in error:', err);
      if (err?.code === 'auth/popup-blocked') {
        setAuthError('Popup blocked by browser. Please allow popups.');
      } else {
        setAuthError('Could not sign in with Google');
      }
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
                className="w-8 h-8 rounded-full border border-emerald-300 dark:border-emerald-700 shrink-0" 
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {currentUser.displayName?.[0] || 'U'}
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-emerald-950 dark:text-emerald-100 truncate">
                  {currentUser.displayName || 'Google Shopper'}
                </p>
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-1.5 py-0.2 rounded-full">
                  <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                </span>
              </div>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-300 truncate">
                {currentUser.email} • Details auto-applied
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="text-[11px] font-semibold text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 shrink-0 cursor-pointer underline px-1 py-0.5"
          >
            Sign out
          </button>
        </div>
      );
    }

    return (
      <div className="p-3.5 bg-gradient-to-r from-slate-50 to-rose-50/40 dark:from-slate-800/80 dark:to-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-2.5">
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google" 
            className="w-5 h-5 shrink-0 mt-0.5 sm:mt-0" 
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                Google Sign-In
              </span>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-slate-200/80 dark:bg-slate-700 px-1.5 py-0.2 rounded-md">
                Optional
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Sign in to prefill delivery details & save your order history
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSignIn}
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-800 dark:text-white bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-600 rounded-xl shadow-2xs transition-colors cursor-pointer shrink-0 disabled:opacity-50"
        >
          {isLoading ? (
            <span className="w-4 h-4 border-2 border-slate-400 border-t-rose-600 rounded-full animate-spin" />
          ) : (
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="" 
              className="w-3.5 h-3.5" 
            />
          )}
          <span>Continue with Google</span>
        </button>
      </div>
    );
  }

  // ADMIN LOGIN VARIANT
  if (variant === 'admin') {
    return (
      <div className="w-full">
        <button
          type="button"
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
        {authError && (
          <p className="mt-1 text-[11px] text-center text-rose-500">{authError}</p>
        )}
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
              onClick={() => setIsTrackOrderOpen(true)}
              className="flex-1 py-1.5 px-2 bg-white dark:bg-slate-700 hover:bg-slate-50 text-[11px] font-semibold text-slate-700 dark:text-slate-200 rounded-lg border border-slate-200 dark:border-slate-600 flex items-center justify-center gap-1 cursor-pointer"
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
      <button
        onClick={handleSignIn}
        disabled={isLoading}
        className="w-full flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200/70 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-2xl border border-slate-200 dark:border-slate-700/60 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google" 
            className="w-4 h-4" 
          />
          <div className="text-left">
            <span className="text-xs font-bold block">Sign in with Google</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">Optional • Sync orders</span>
          </div>
        </div>
        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-700 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-600">
          Optional
        </span>
      </button>
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
                    setIsTrackOrderOpen(true);
                    setDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 rounded-xl transition-colors cursor-pointer text-left"
                >
                  <PackageCheck className="w-4 h-4 text-slate-500" />
                  <span>My Orders / Track Order</span>
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

  // Not signed in
  return (
    <div className="relative">
      <button
        id="btn-nav-google-signin"
        onClick={handleSignIn}
        disabled={isLoading}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700 shadow-2xs group"
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
        <span className="hidden md:inline">Sign In</span>
        <span className="hidden xl:inline text-[10px] font-normal text-slate-400">(Optional)</span>
      </button>
      {authError && (
        <span className="absolute -bottom-5 right-0 text-[10px] text-rose-500 whitespace-nowrap">
          {authError}
        </span>
      )}
    </div>
  );
};
