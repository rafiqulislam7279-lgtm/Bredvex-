import React, { useState } from 'react';
import { 
  X, 
  Crown, 
  UserCheck, 
  Lock, 
  KeyRound, 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose }) => {
  const { adminLogin, setActiveView, settings } = useStore();

  const [loginRoleTab, setLoginRoleTab] = useState<'master' | 'staff' | 'legacy'>('master');
  const [adminId, setAdminId] = useState('aditto13552b');
  const [adminPassword, setAdminPassword] = useState('aditto13552b');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccessMsg, setLoginSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSelectRolePreset = (role: 'master' | 'staff' | 'legacy') => {
    setLoginRoleTab(role);
    setLoginError('');
    if (role === 'master') {
      setAdminId('aditto13552b');
      setAdminPassword('aditto13552b');
    } else if (role === 'staff') {
      setAdminId(settings.staffLoginId || 'staff');
      setAdminPassword(settings.staffPassword || 'staff123');
    } else {
      setAdminId(settings.adminLoginId || 'admin');
      setAdminPassword(settings.adminPassword || '123456');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginSuccessMsg('');

    const res = adminLogin(adminId, adminPassword);
    if (res.success) {
      setLoginSuccessMsg(res.message || 'Login successful!');
      setTimeout(() => {
        onClose();
        setActiveView('admin');
      }, 400);
    } else {
      setLoginError(res.message || 'Invalid Login ID or Password. Please try again.');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white font-serif">
            Portal Authentication
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Authorized store owner & operational staff login
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            id="modal-tab-master"
            onClick={() => handleSelectRolePreset('master')}
            className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
              loginRoleTab === 'master'
                ? 'bg-amber-400 text-slate-950 shadow-xs font-black'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span className="text-[11px]">👑 Master</span>
          </button>
          <button
            type="button"
            id="modal-tab-staff"
            onClick={() => handleSelectRolePreset('staff')}
            className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
              loginRoleTab === 'staff'
                ? 'bg-sky-500 text-white shadow-xs font-black'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span className="text-[11px]">👤 Staff</span>
          </button>
          <button
            type="button"
            id="modal-tab-legacy"
            onClick={() => handleSelectRolePreset('legacy')}
            className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
              loginRoleTab === 'legacy'
                ? 'bg-slate-900 dark:bg-slate-700 text-white shadow-xs font-black'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="text-[11px]">🔑 Legacy</span>
          </button>
        </div>

        {/* Role Explanatory Banner */}
        <div className={`p-3 rounded-xl border text-xs leading-relaxed ${
          loginRoleTab === 'master' 
            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-200' 
            : loginRoleTab === 'staff'
            ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800 text-sky-950 dark:text-sky-200'
            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
        }`}>
          {loginRoleTab === 'master' && (
            <p>
              <strong>👑 Master Login:</strong> Permanent root access (<code>aditto13552b</code>). Full control over website customization, logo, hotline, payment numbers & staff management.
            </p>
          )}
          {loginRoleTab === 'staff' && (
            <p>
              <strong>👤 Staff Login:</strong> Operational account for customer orders, inventory, courier parcel dispatch & reviews. Website customization is restricted.
            </p>
          )}
          {loginRoleTab === 'legacy' && (
            <p>
              <strong>🔑 Legacy Admin:</strong> Secondary admin login (default <code>admin</code> / <code>123456</code>).
            </p>
          )}
        </div>

        {loginSuccessMsg && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs rounded-xl font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{loginSuccessMsg}</span>
          </div>
        )}

        {loginError && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs rounded-xl font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{loginError}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Login Username / ID:
            </label>
            <input
              id="input-modal-admin-id"
              type="text"
              required
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              placeholder="Enter Login ID"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-hidden focus:border-amber-500 text-slate-900 dark:text-white font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Password:
            </label>
            <div className="relative">
              <input
                id="input-modal-admin-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter Password"
                className="w-full pl-4 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-hidden focus:border-amber-500 text-slate-900 dark:text-white font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            id="btn-modal-admin-login-submit"
            className="w-full py-3 px-4 rounded-xl bg-slate-900 dark:bg-amber-500 hover:bg-slate-800 dark:hover:bg-amber-400 text-white dark:text-slate-950 font-black text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4 text-amber-400 dark:text-slate-950" />
            <span>
              {loginRoleTab === 'master' ? 'Sign In as Master Admin' : loginRoleTab === 'staff' ? 'Sign In as Staff Member' : 'Sign In as Admin'}
            </span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </form>

        {/* Quick Credentials Summary & Autofill */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-2">
          <div className="flex items-center justify-between font-bold">
            <span className="flex items-center gap-1.5 text-slate-900 dark:text-white">
              <KeyRound className="w-3.5 h-3.5 text-amber-500" />
              Quick 1-Click Autofill:
            </span>
          </div>
          <div className="space-y-1 font-mono text-[11px]">
            <div className="flex justify-between items-center bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200/80 dark:border-slate-700">
              <span>👑 Master: <strong>aditto13552b</strong></span>
              <button
                type="button"
                onClick={() => handleSelectRolePreset('master')}
                className="text-amber-600 dark:text-amber-400 font-bold hover:underline cursor-pointer"
              >
                Autofill
              </button>
            </div>

            <div className="flex justify-between items-center bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200/80 dark:border-slate-700">
              <span>👤 Staff: <strong>{settings.staffLoginId || 'staff'}</strong></span>
              <button
                type="button"
                onClick={() => handleSelectRolePreset('staff')}
                className="text-sky-600 dark:text-sky-400 font-bold hover:underline cursor-pointer"
              >
                Autofill
              </button>
            </div>

            <div className="flex justify-between items-center bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200/80 dark:border-slate-700">
              <span>🔑 Legacy: <strong>{settings.adminLoginId || 'admin'}</strong></span>
              <button
                type="button"
                onClick={() => handleSelectRolePreset('legacy')}
                className="text-slate-600 dark:text-slate-400 font-bold hover:underline cursor-pointer"
              >
                Autofill
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
