import React from 'react';
import { 
  Crown, 
  UserCheck, 
  LogOut, 
  Sparkles, 
  LayoutDashboard, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const PortalLoginSection: React.FC = () => {
  const { 
    isAdminAuthenticated, 
    adminRole, 
    adminUser, 
    adminLogout, 
    setActiveView 
  } = useStore();

  // ONLY visible to admin and staff after they have logged in
  if (!isAdminAuthenticated) {
    return null;
  }

  return (
    <div 
      id="portal-login-section" 
      className="pt-4 pb-2 space-y-4 animate-fade-in"
    >
      <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-amber-300/80 dark:border-amber-500/30 p-6 sm:p-8 shadow-xl dark:shadow-2xl max-w-2xl mx-auto space-y-6 text-slate-900 dark:text-white transition-colors">
        
        {/* Top Header with Role & Logout */}
        <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200 dark:border-amber-500/25 shrink-0 shadow-xs">
              {adminRole === 'master' ? <Crown className="w-6 h-6" /> : <UserCheck className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-slate-900 dark:text-white font-serif">
                  Active Portal Session
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800">
                  AUTHENTICATED
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Logged in as: <strong className="text-slate-900 dark:text-white font-mono">{adminUser?.name || adminUser?.id || 'Admin'}</strong> ({adminRole === 'master' ? '👑 Master Admin' : '👤 Staff Member'})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={adminLogout}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-800 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>

        {/* Permissions Explanatory Card */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
          <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span>Current Permissions & Access Level:</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            {adminRole === 'master'
              ? '👑 Full Master Root Control: You have complete access to customer orders, Steadfast & Pathao dispatch, inventory, website customization, branding, hotlines, payment accounts, and staff account management.'
              : '👤 Staff Operational Control: You have access to customer orders, parcel courier bookings, inventory stock, and customer reviews. Website customization and branding settings are permanently locked.'}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            id="btn-open-admin-dashboard"
            onClick={() => setActiveView('admin')}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <LayoutDashboard className="w-4 h-4 text-slate-950" />
            <span>Open Admin Management Dashboard</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>

      </div>
    </div>
  );
};
