import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Plus, 
  Trash2, 
  Edit, 
  LogOut, 
  Store, 
  Package, 
  ShoppingBag, 
  Settings as SettingsIcon, 
  DollarSign, 
  Search, 
  Check, 
  X, 
  Upload, 
  Phone, 
  Mail, 
  MapPin, 
  RefreshCw,
  Eye,
  EyeOff,
  Truck,
  Sparkles,
  AlertCircle,
  KeyRound,
  CheckCircle2
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, SiteSettings, Order } from '../types';
import { INITIAL_CATEGORIES } from '../data/initialData';

export const AdminPanel: React.FC = () => {
  const {
    isAdminAuthenticated,
    adminLogin,
    adminLogout,
    setActiveView,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    updateOrderPaymentStatus,
    settings,
    updateSettings,
    resetToDefaults
  } = useStore();

  // Login form states
  const [adminId, setAdminId] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Admin tab states
  const [adminTab, setAdminTab] = useState<'overview' | 'products' | 'orders' | 'settings'>('overview');

  // Product modal (Add / Edit) states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Product Form Fields
  const [pName, setPName] = useState('');
  const [pBanglaName, setPBanglaName] = useState('');
  const [pCategory, setPCategory] = useState('gadgets');
  const [pPrice, setPPrice] = useState<number>(1000);
  const [pOriginalPrice, setPOriginalPrice] = useState<number>(1500);
  const [pStock, setPStock] = useState<number>(20);
  const [pDescription, setPDescription] = useState('');
  const [pFeatures, setPFeatures] = useState('');
  const [pImageUrl, setPImageUrl] = useState('');
  const [pColors, setPColors] = useState('');
  const [pSizes, setPSizes] = useState('');
  const [pIsFeatured, setPIsFeatured] = useState(false);
  const [pIsTrending, setPIsTrending] = useState(false);

  // Settings form local state
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(settings);
  const [saveSettingsSuccess, setSaveSettingsSuccess] = useState(false);

  // Admin Security / Password Change State
  const [newAdminLoginId, setNewAdminLoginId] = useState(settings.adminLoginId || 'admin');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Product search in admin
  const [productSearch, setProductSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState<string>('all');

  // Handle Admin Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const ok = adminLogin(adminId, adminPassword);
    if (!ok) {
      setLoginError('Invalid Login ID or Password. Please check your credentials.');
    }
  };

  const handleQuickFill = () => {
    setAdminId('admin');
    setAdminPassword('123456');
    setLoginError('');
  };

  // Open Product Modal for Create or Edit
  const openCreateProductModal = () => {
    setEditingProduct(null);
    setPName('');
    setPBanglaName('');
    setPCategory('gadgets');
    setPPrice(1500);
    setPOriginalPrice(2000);
    setPStock(25);
    setPDescription('');
    setPFeatures('100% Original Brand Authentic\nWarranty included\nExpress delivery all across Bangladesh');
    setPImageUrl('https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80');
    setPColors('Black, White');
    setPSizes('');
    setPIsFeatured(false);
    setPIsTrending(false);
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (prod: Product) => {
    setEditingProduct(prod);
    setPName(prod.name);
    setPBanglaName(prod.banglaName || '');
    setPCategory(prod.category);
    setPPrice(prod.price);
    setPOriginalPrice(prod.originalPrice || prod.price);
    setPStock(prod.stock);
    setPDescription(prod.description);
    setPFeatures(prod.features.join('\n'));
    setPImageUrl(prod.images[0] || '');
    setPColors(prod.colors?.join(', ') || '');
    setPSizes(prod.sizes?.join(', ') || '');
    setPIsFeatured(!!prod.isFeatured);
    setPIsTrending(!!prod.isTrending);
    setIsProductModalOpen(true);
  };

  // Handle image upload from local file
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setPImageUrl(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Logo Upload in Settings
  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setSettingsForm(prev => ({ ...prev, logoUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Product
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName.trim()) return;

    const featureList = pFeatures
      .split('\n')
      .map(f => f.trim())
      .filter(Boolean);

    const colorList = pColors
      .split(',')
      .map(c => c.trim())
      .filter(Boolean);

    const sizeList = pSizes
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const images = [pImageUrl || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80'];

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: pName,
        banglaName: pBanglaName,
        category: pCategory,
        price: Number(pPrice),
        originalPrice: Number(pOriginalPrice),
        stock: Number(pStock),
        description: pDescription,
        features: featureList,
        images,
        colors: colorList.length > 0 ? colorList : undefined,
        sizes: sizeList.length > 0 ? sizeList : undefined,
        isFeatured: pIsFeatured,
        isTrending: pIsTrending,
      });
    } else {
      addProduct({
        name: pName,
        banglaName: pBanglaName,
        slug: pName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        price: Number(pPrice),
        originalPrice: Number(pOriginalPrice),
        rating: 5.0,
        reviewsCount: 1,
        category: pCategory,
        description: pDescription,
        features: featureList,
        images,
        stock: Number(pStock),
        colors: colorList.length > 0 ? colorList : undefined,
        sizes: sizeList.length > 0 ? sizeList : undefined,
        isFeatured: pIsFeatured,
        isTrending: pIsTrending,
      });
    }

    setIsProductModalOpen(false);
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
    setSaveSettingsSuccess(true);
    setTimeout(() => setSaveSettingsSuccess(false), 3000);
  };

  // Change Admin Password / ID
  const handleChangeAdminCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeError('');
    setPasswordChangeSuccess('');

    const trimmedId = newAdminLoginId.trim();
    if (!trimmedId) {
      setPasswordChangeError('Admin Login ID cannot be empty.');
      return;
    }

    if (!newPassword) {
      setPasswordChangeError('Please enter a new password.');
      return;
    }

    if (newPassword.length < 4) {
      setPasswordChangeError('Password must be at least 4 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordChangeError('New password and confirm password do not match.');
      return;
    }

    updateSettings({
      adminLoginId: trimmedId,
      adminPassword: newPassword
    });

    setPasswordChangeSuccess('Admin Login ID and Password updated successfully! Keep your new credentials safe.');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordChangeSuccess(''), 5000);
  };

  // Metrics Calculations
  const totalRevenue = orders.reduce((acc, o) => acc + o.grandTotal, 0);
  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );
  const filteredOrders = orders.filter(o =>
    orderFilter === 'all' ? true : o.status === orderFilter
  );

  // 1. If not authenticated, show modern Admin Login View
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-100">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto border border-amber-500/20">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 font-serif">BREDVEX Admin Portal</h2>
            <p className="text-xs text-slate-500">
              Secure administrative access for product & store management
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Admin Login ID:
              </label>
              <input
                id="input-admin-id"
                type="text"
                required
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder="Enter Login ID"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-hidden focus:border-amber-500 focus:bg-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Admin Password:
              </label>
              <div className="relative">
                <input
                  id="input-admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="123456"
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-hidden focus:border-amber-500 focus:bg-white font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              id="btn-admin-login-submit"
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Sign In to Admin Panel</span>
            </button>
          </form>

          {/* Quick Fill credentials helper box */}
          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold">Authorized Admin Access:</span>
              <button
                type="button"
                onClick={handleQuickFill}
                className="px-2.5 py-1 rounded-md bg-amber-200/80 hover:bg-amber-300 font-bold text-[11px] transition-colors cursor-pointer"
              >
                1-Click Auto Fill
              </button>
            </div>
            <p className="text-[11px] text-amber-950">
              Only authorized store administrators can access product editing and order controls.
            </p>
          </div>

          <button
            onClick={() => setActiveView('shop')}
            className="w-full text-center text-xs text-slate-500 hover:text-slate-800 font-medium py-1"
          >
            ← Return to Customer Store
          </button>
        </div>
      </div>
    );
  }

  // 2. Full Admin Dashboard
  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 pb-16">
      
      {/* Top Admin Header */}
      <div className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500 text-slate-950 font-black">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-white font-serif">
                  {settings.siteName} Admin Panel
                </h1>
                <span className="text-[10px] font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-md uppercase">
                  ADMIN
                </span>
              </div>
              <p className="text-xs text-slate-400">Live Management Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              id="btn-admin-view-store"
              onClick={() => setActiveView('shop')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Store className="w-4 h-4 text-emerald-400" />
              <span>Back to Store</span>
            </button>
            <button
              id="btn-admin-logout"
              onClick={adminLogout}
              className="px-3.5 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-2 overflow-x-auto scrollbar-none border-t border-slate-800 pt-1">
          <button
            onClick={() => setAdminTab('overview')}
            className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              adminTab === 'overview'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </button>

          <button
            id="tab-admin-products"
            onClick={() => setAdminTab('products')}
            className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              adminTab === 'products'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products ({products.length})</span>
          </button>

          <button
            id="tab-admin-orders"
            onClick={() => setAdminTab('orders')}
            className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              adminTab === 'orders'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Customer Orders ({orders.length})</span>
            {pendingOrdersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          <button
            id="tab-admin-settings"
            onClick={() => setAdminTab('settings')}
            className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              adminTab === 'settings'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            <span>Store Logo & Info Settings</span>
          </button>
        </div>
      </div>

      {/* Main Tab Views */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* ===================== TAB 1: OVERVIEW ===================== */}
        {adminTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Sales Volume</span>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-2xl font-black font-mono text-slate-900">৳{totalRevenue.toLocaleString()}</h3>
                  <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600 font-bold text-xs">BDT</span>
                </div>
                <p className="text-[11px] text-slate-400">Across {orders.length} lifetime orders</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Inventory</span>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-2xl font-black font-mono text-slate-900">{products.length} Items</h3>
                  <span className="p-2 rounded-xl bg-sky-50 text-sky-600 font-bold text-xs">Catalog</span>
                </div>
                <p className="text-[11px] text-slate-400">Multi-category tech & apparel</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Orders</span>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-2xl font-black font-mono text-rose-600">{pendingOrdersCount}</h3>
                  <span className="p-2 rounded-xl bg-rose-50 text-rose-600 font-bold text-xs">Action</span>
                </div>
                <p className="text-[11px] text-slate-400">Awaiting packaging or verification</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">bKash / Nagad Gateways</span>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-2xl font-black font-mono text-slate-900">Active</h3>
                  <span className="p-2 rounded-xl bg-pink-50 text-pink-600 font-bold text-xs">BD MFS</span>
                </div>
                <p className="text-[11px] text-slate-400">bKash, Nagad, Rocket, COD ready</p>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl text-white flex flex-wrap items-center justify-between gap-4 shadow-xl">
              <div>
                <h3 className="text-lg font-bold font-serif">Quick Store Administration</h3>
                <p className="text-xs text-slate-400">Add products, review pending orders, or update store branding in seconds.</p>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={openCreateProductModal}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
                <button
                  onClick={() => setAdminTab('orders')}
                  className="px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-100 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Review Orders</span>
                </button>
                <button
                  onClick={() => setAdminTab('settings')}
                  className="px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-100 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <SettingsIcon className="w-4 h-4" />
                  <span>Store Logo & Info</span>
                </button>
              </div>
            </div>

            {/* Recent Orders Preview */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">Recent Customer Orders</h3>
                <button
                  onClick={() => setAdminTab('orders')}
                  className="text-xs text-rose-600 font-bold hover:underline"
                >
                  View All Orders →
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] tracking-wider">
                    <tr>
                      <th className="px-6 py-3">Order ID</th>
                      <th className="px-6 py-3">Customer</th>
                      <th className="px-6 py-3">Payment</th>
                      <th className="px-6 py-3">Amount</th>
                      <th className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.slice(0, 5).map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-3.5 font-mono font-bold text-slate-900">#{ord.orderNumber}</td>
                        <td className="px-6 py-3.5">
                          <p className="font-bold text-slate-800">{ord.customerInfo.name}</p>
                          <p className="text-[10px] text-slate-400">{ord.customerInfo.city}, {ord.customerInfo.district}</p>
                        </td>
                        <td className="px-6 py-3.5">
                          <span className="uppercase font-bold text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-800">
                            {ord.paymentMethod}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 font-mono font-bold text-slate-900">
                          ৳{ord.grandTotal.toLocaleString()}
                        </td>
                        <td className="px-6 py-3.5">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            ord.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                            ord.status === 'shipped' ? 'bg-sky-100 text-sky-800' :
                            ord.status === 'processing' ? 'bg-amber-100 text-amber-800' :
                            'bg-slate-200 text-slate-700'
                          }`}>
                            {ord.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ===================== TAB 2: PRODUCTS ===================== */}
        {adminTab === 'products' && (
          <div className="space-y-5">
            {/* Action & Search Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search products by title or category..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-hidden focus:border-rose-500 focus:bg-white"
                />
              </div>

              <button
                id="btn-admin-add-product"
                onClick={openCreateProductModal}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product (নতুন প্রোডাক্ট যোগ করুন)</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="px-5 py-3.5">Product</th>
                      <th className="px-4 py-3.5">Category</th>
                      <th className="px-4 py-3.5">Price</th>
                      <th className="px-4 py-3.5">Stock</th>
                      <th className="px-4 py-3.5">Badges</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.images[0]}
                              alt={prod.name}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-slate-100 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div className="max-w-xs">
                              <h4 className="font-bold text-slate-900 truncate">{prod.name}</h4>
                              {prod.banglaName && (
                                <p className="text-[11px] text-slate-500 truncate">{prod.banglaName}</p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-semibold text-[10px] uppercase">
                            {prod.category}
                          </span>
                        </td>

                        <td className="px-4 py-3.5 font-mono font-bold text-slate-900">
                          ৳{prod.price.toLocaleString()}
                          {prod.originalPrice && prod.originalPrice > prod.price && (
                            <span className="block text-[10px] text-slate-400 line-through">
                              ৳{prod.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            prod.stock > 10 ? 'bg-emerald-100 text-emerald-800' :
                            prod.stock > 0 ? 'bg-amber-100 text-amber-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {prod.stock} Units
                          </span>
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="flex flex-wrap gap-1">
                            {prod.isFeatured && (
                              <span className="text-[9px] font-bold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-sm">Featured</span>
                            )}
                            {prod.isTrending && (
                              <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-sm">Trending</span>
                            )}
                          </div>
                        </td>

                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              id={`btn-edit-prod-${prod.id}`}
                              onClick={() => openEditProductModal(prod)}
                              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                              title="Edit Product"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              id={`btn-delete-prod-${prod.id}`}
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete "${prod.name}"?`)) {
                                  deleteProduct(prod.id);
                                }
                              }}
                              className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                              title="Delete Product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 3: ORDERS ===================== */}
        {adminTab === 'orders' && (
          <div className="space-y-5">
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs text-xs font-semibold">
              <span className="text-slate-400 text-[11px] uppercase mr-2">Filter Orders:</span>
              {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setOrderFilter(status)}
                  className={`px-3 py-1.5 rounded-xl capitalize transition-all cursor-pointer ${
                    orderFilter === status
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Orders List */}
            <div className="space-y-3">
              {filteredOrders.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs">
                  No orders found matching "{orderFilter}" status.
                </div>
              ) : (
                filteredOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4"
                  >
                    {/* Header Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-base font-black font-mono text-slate-900">
                          #{ord.orderNumber}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(ord.createdAt).toLocaleString()}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          ord.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                          ord.status === 'shipped' ? 'bg-sky-100 text-sky-800' :
                          ord.status === 'processing' ? 'bg-amber-100 text-amber-800' :
                          ord.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-slate-200 text-slate-800'
                        }`}>
                          {ord.status}
                        </span>
                      </div>

                      {/* Status changer dropdown */}
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-500 font-semibold">Change Status:</span>
                        <select
                          value={ord.status}
                          onChange={(e) => updateOrderStatus(ord.id, e.target.value as Order['status'])}
                          className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-hidden focus:border-rose-500"
                        >
                          <option value="pending">Pending (অপেক্ষারত)</option>
                          <option value="processing">Processing (প্যাকিং হচ্ছে)</option>
                          <option value="shipped">Shipped (কুরিয়ারে দেয়া হয়েছে)</option>
                          <option value="delivered">Delivered (ডেলিভার্ড সম্পন্ন)</option>
                          <option value="cancelled">Cancelled (বাতিল)</option>
                        </select>
                      </div>
                    </div>

                    {/* Order Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
                      {/* Customer Info */}
                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-1">
                        <h5 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">Customer & Delivery:</h5>
                        <p className="font-semibold text-slate-800">{ord.customerInfo.name}</p>
                        <p className="font-mono text-slate-700">Phone: {ord.customerInfo.phone}</p>
                        <p>{ord.customerInfo.address}, {ord.customerInfo.city}, {ord.customerInfo.district}</p>
                        {ord.customerInfo.deliveryNotes && (
                          <p className="text-[11px] text-amber-700 italic">Note: "{ord.customerInfo.deliveryNotes}"</p>
                        )}
                      </div>

                      {/* Payment Info */}
                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-1">
                        <h5 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">Payment Details:</h5>
                        <p className="font-semibold text-slate-800 uppercase">Method: {ord.paymentMethod}</p>
                        <p className="font-mono font-bold text-emerald-700">
                          Total Amount: ৳{ord.grandTotal.toLocaleString()}
                        </p>
                        {ord.transactionId && (
                          <p className="font-mono text-[11px]">TrxID: <strong className="text-slate-900">{ord.transactionId}</strong></p>
                        )}
                        {ord.paymentSenderNumber && (
                          <p className="font-mono text-[11px]">Sender Acc: {ord.paymentSenderNumber}</p>
                        )}
                        <div className="pt-1 flex items-center gap-1.5">
                          <span className="text-[10px] text-slate-400">Payment:</span>
                          <button
                            onClick={() => updateOrderPaymentStatus(ord.id, ord.paymentStatus === 'paid' ? 'pending' : 'paid')}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold cursor-pointer ${
                              ord.paymentStatus === 'paid' || ord.paymentStatus === 'verified'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {ord.paymentStatus.toUpperCase()} (Click to toggle)
                          </button>
                        </div>
                      </div>

                      {/* Courier & Tracking */}
                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-1">
                        <h5 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">Logistics & Courier:</h5>
                        <p className="font-semibold text-slate-800">Courier: {ord.trackingCourier || 'Steadfast / Pathao'}</p>
                        <p className="font-mono text-[11px]">Consignment: {ord.trackingNumber || 'Pending'}</p>
                        <p className="text-[11px] text-slate-500">
                          Zone: {ord.customerInfo.zone === 'inside_dhaka' ? 'Inside Dhaka (৳60)' : 'Outside Dhaka (৳120)'}
                        </p>
                      </div>
                    </div>

                    {/* Ordered Items List */}
                    <div className="pt-1 border-t border-slate-100">
                      <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Items ordered:</h5>
                      <div className="flex flex-wrap gap-2">
                        {ord.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                            <img src={item.product.images[0]} alt="" className="w-8 h-8 rounded-lg object-cover" />
                            <div>
                              <p className="font-semibold text-slate-800">{item.product.name}</p>
                              <p className="text-[10px] text-slate-500">
                                Qty: {item.quantity} {item.selectedColor ? `(${item.selectedColor})` : ''} • ৳{(item.product.price * item.quantity).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ===================== TAB 4: STORE SETTINGS ===================== */}
        {adminTab === 'settings' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-bold font-serif text-slate-900">Website Identity & Contact Information</h3>
                <p className="text-xs text-slate-500">
                  Update your website logo, store title, phone number, address, and Bangladeshi payment gateways.
                </p>
              </div>

              {saveSettingsSuccess && (
                <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Settings Saved Successfully!</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6">
              
              {/* Logo & Store Identity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Store Logo Configuration:</h4>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden bg-slate-50 shrink-0">
                      {settingsForm.logoUrl ? (
                        <img src={settingsForm.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-xs font-bold text-slate-400">No Logo</span>
                      )}
                    </div>
                    <div className="space-y-2 flex-1">
                      <label className="block text-xs font-medium text-slate-700">Upload Logo from Computer:</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoFileUpload}
                        className="text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-slate-800"
                      />
                      <input
                        type="text"
                        value={settingsForm.logoUrl}
                        onChange={(e) => setSettingsForm({ ...settingsForm, logoUrl: e.target.value })}
                        placeholder="Or enter image URL..."
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-rose-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Store Branding:</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs font-bold text-slate-700">Website Name:</label>
                      <input
                        type="text"
                        value={settingsForm.siteName}
                        onChange={(e) => setSettingsForm({ ...settingsForm, siteName: e.target.value })}
                        className="w-full mt-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-hidden font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700">Tagline:</label>
                      <input
                        type="text"
                        value={settingsForm.tagline}
                        onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                        className="w-full mt-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Contact & Location (Bangladesh):</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Contact Hotline:</span>
                    </label>
                    <input
                      type="text"
                      value={settingsForm.contactPhone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, contactPhone: e.target.value })}
                      className="w-full mt-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-hidden font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-sky-600" />
                      <span>Support Email:</span>
                    </label>
                    <input
                      type="email"
                      value={settingsForm.contactEmail}
                      onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                      className="w-full mt-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-600" />
                      <span>Store Address (Dhaka, BD):</span>
                    </label>
                    <input
                      type="text"
                      value={settingsForm.address}
                      onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                      className="w-full mt-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Bangladeshi Payment Numbers */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Bangladeshi Payment Account Numbers:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* bKash */}
                  <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-200 space-y-2">
                    <label className="text-xs font-bold text-[#E2136E]">bKash Number:</label>
                    <input
                      type="text"
                      value={settingsForm.bkashNumber}
                      onChange={(e) => setSettingsForm({ ...settingsForm, bkashNumber: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-white border border-pink-300 rounded-xl outline-hidden font-mono"
                    />
                    <div className="flex gap-3 text-xs text-slate-700 pt-1">
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name="bkashType"
                          checked={settingsForm.bkashType === 'Merchant'}
                          onChange={() => setSettingsForm({ ...settingsForm, bkashType: 'Merchant' })}
                        />
                        Merchant
                      </label>
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name="bkashType"
                          checked={settingsForm.bkashType === 'Personal'}
                          onChange={() => setSettingsForm({ ...settingsForm, bkashType: 'Personal' })}
                        />
                        Personal
                      </label>
                    </div>
                  </div>

                  {/* Nagad */}
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                    <label className="text-xs font-bold text-[#F7931E]">Nagad Number:</label>
                    <input
                      type="text"
                      value={settingsForm.nagadNumber}
                      onChange={(e) => setSettingsForm({ ...settingsForm, nagadNumber: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-white border border-amber-300 rounded-xl outline-hidden font-mono"
                    />
                    <div className="flex gap-3 text-xs text-slate-700 pt-1">
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name="nagadType"
                          checked={settingsForm.nagadType === 'Merchant'}
                          onChange={() => setSettingsForm({ ...settingsForm, nagadType: 'Merchant' })}
                        />
                        Merchant
                      </label>
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name="nagadType"
                          checked={settingsForm.nagadType === 'Personal'}
                          onChange={() => setSettingsForm({ ...settingsForm, nagadType: 'Personal' })}
                        />
                        Personal
                      </label>
                    </div>
                  </div>

                  {/* Rocket */}
                  <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2">
                    <label className="text-xs font-bold text-[#8C3494]">Rocket Number:</label>
                    <input
                      type="text"
                      value={settingsForm.rocketNumber}
                      onChange={(e) => setSettingsForm({ ...settingsForm, rocketNumber: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-white border border-purple-300 rounded-xl outline-hidden font-mono"
                    />
                    <div className="flex gap-3 text-xs text-slate-700 pt-1">
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name="rocketType"
                          checked={settingsForm.rocketType === 'Merchant'}
                          onChange={() => setSettingsForm({ ...settingsForm, rocketType: 'Merchant' })}
                        />
                        Merchant
                      </label>
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name="rocketType"
                          checked={settingsForm.rocketType === 'Personal'}
                          onChange={() => setSettingsForm({ ...settingsForm, rocketType: 'Personal' })}
                        />
                        Personal
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Fees & Top Announcement */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Delivery Charges & Top Bar:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700">Inside Dhaka Fee (৳):</label>
                    <input
                      type="number"
                      value={settingsForm.insideDhakaFee}
                      onChange={(e) => setSettingsForm({ ...settingsForm, insideDhakaFee: Number(e.target.value) })}
                      className="w-full mt-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-hidden font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700">Outside Dhaka Fee (৳):</label>
                    <input
                      type="number"
                      value={settingsForm.outsideDhakaFee}
                      onChange={(e) => setSettingsForm({ ...settingsForm, outsideDhakaFee: Number(e.target.value) })}
                      className="w-full mt-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-hidden font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700">Free Delivery Minimum (৳):</label>
                    <input
                      type="number"
                      value={settingsForm.freeDeliveryThreshold}
                      onChange={(e) => setSettingsForm({ ...settingsForm, freeDeliveryThreshold: Number(e.target.value) })}
                      className="w-full mt-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-hidden font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="text-xs font-bold text-slate-700">Top Announcement Banner Text:</label>
                  <input
                    type="text"
                    value={settingsForm.announcementText}
                    onChange={(e) => setSettingsForm({ ...settingsForm, announcementText: e.target.value })}
                    className="w-full mt-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-hidden"
                  />
                </div>
              </div>

              {/* Save Settings Button */}
              <div className="pt-4 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="submit"
                  id="btn-save-settings"
                  className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Save Store Information & Logo
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Reset all store settings, products and orders to original default demo state?')) {
                      resetToDefaults();
                      setSettingsForm(settings);
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-600 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Default Demo Catalog</span>
                </button>
              </div>

            </form>

            {/* Admin Password & Credentials Change Card */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 font-serif">Admin Security & Password (পাসওয়ার্ড পরিবর্তন)</h4>
                  <p className="text-xs text-slate-500">
                    Change your admin login ID and password to keep your portal secure.
                  </p>
                </div>
              </div>

              {passwordChangeSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{passwordChangeSuccess}</span>
                </div>
              )}

              {passwordChangeError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{passwordChangeError}</span>
                </div>
              )}

              <form onSubmit={handleChangeAdminCredentials} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700">Admin Login ID:</label>
                    <input
                      type="text"
                      required
                      value={newAdminLoginId}
                      onChange={(e) => setNewAdminLoginId(e.target.value)}
                      placeholder="e.g. admin or your username"
                      className="w-full mt-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-amber-500 focus:bg-white font-mono"
                    />
                    <p className="text-[10px] text-slate-400 mt-0.5">Current login username</p>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700">New Password:</label>
                    <div className="relative mt-1">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full pl-3 pr-9 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-amber-500 focus:bg-white font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                      >
                        {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">Minimum 4 characters</p>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700">Confirm Password:</label>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="w-full mt-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-amber-500 focus:bg-white font-mono"
                    />
                    <p className="text-[10px] text-slate-400 mt-0.5">Must match new password</p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="submit"
                    id="btn-update-admin-password"
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                    <span>Update Admin Login & Password</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>

      {/* ===================== ADD / EDIT PRODUCT MODAL ===================== */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div 
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-serif">
                  {editingProduct ? 'Edit Product (প্রোডাক্ট এডিট করুন)' : 'Add New Product (নতুন প্রোডাক্ট যোগ করুন)'}
                </h3>
                <p className="text-xs text-slate-500">
                  {editingProduct ? `Updating ${editingProduct.name}` : 'Create a new item in your catalog'}
                </p>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProduct} className="overflow-y-auto p-6 space-y-4 text-xs">
              
              {/* Product Titles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Product Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={pName}
                    onChange={(e) => setPName(e.target.value)}
                    placeholder="e.g. Bredvex Horizon Smartwatch"
                    className="w-full mt-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-rose-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Bangla Name (বাংলা নাম)</label>
                  <input
                    type="text"
                    value={pBanglaName}
                    onChange={(e) => setPBanglaName(e.target.value)}
                    placeholder="যেমন: হরাইজন স্মার্টওয়াচ"
                    className="w-full mt-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-rose-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Category, Price, Original Price, Stock */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Category *</label>
                  <select
                    value={pCategory}
                    onChange={(e) => setPCategory(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-rose-500"
                  >
                    {INITIAL_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700">Price (৳ BDT) *</label>
                  <input
                    type="number"
                    required
                    value={pPrice}
                    onChange={(e) => setPPrice(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-rose-500 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700">Original Price (৳)</label>
                  <input
                    type="number"
                    value={pOriginalPrice}
                    onChange={(e) => setPOriginalPrice(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700">Stock Units *</label>
                  <input
                    type="number"
                    required
                    value={pStock}
                    onChange={(e) => setPStock(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-hidden font-mono font-bold"
                  />
                </div>
              </div>

              {/* Image URL & File Upload */}
              <div className="space-y-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <label className="font-bold text-slate-700">Product Image (Copyright-free URL or Local Upload):</label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl bg-slate-200 overflow-hidden shrink-0 border border-slate-300">
                    {pImageUrl ? (
                      <img src={pImageUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] text-slate-400 flex items-center justify-center h-full">No Img</span>
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="text"
                      value={pImageUrl}
                      onChange={(e) => setPImageUrl(e.target.value)}
                      placeholder="Enter Pixabay or Unsplash image URL..."
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-hidden focus:border-rose-500"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">Or choose file:</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        className="text-[11px] text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-slate-800 file:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="font-bold text-slate-700">Product Description:</label>
                <textarea
                  rows={3}
                  value={pDescription}
                  onChange={(e) => setPDescription(e.target.value)}
                  placeholder="Provide comprehensive details about this product..."
                  className="w-full mt-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-rose-500 focus:bg-white"
                />
              </div>

              {/* Features (one per line) */}
              <div>
                <label className="font-bold text-slate-700">Bullet Features (One per line):</label>
                <textarea
                  rows={3}
                  value={pFeatures}
                  onChange={(e) => setPFeatures(e.target.value)}
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                  className="w-full mt-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-rose-500 focus:bg-white font-mono"
                />
              </div>

              {/* Colors & Sizes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Colors (comma separated):</label>
                  <input
                    type="text"
                    value={pColors}
                    onChange={(e) => setPColors(e.target.value)}
                    placeholder="e.g. Space Black, Pearl White, Navy"
                    className="w-full mt-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Sizes (comma separated):</label>
                  <input
                    type="text"
                    value={pSizes}
                    onChange={(e) => setPSizes(e.target.value)}
                    placeholder="e.g. M, L, XL, XXL"
                    className="w-full mt-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-hidden"
                  />
                </div>
              </div>

              {/* Badges Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={pIsFeatured}
                    onChange={(e) => setPIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded-sm text-rose-600"
                  />
                  <span>Mark as Featured (ফিচার্ড)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={pIsTrending}
                    onChange={(e) => setPIsTrending(e.target.checked)}
                    className="w-4 h-4 rounded-sm text-amber-500"
                  />
                  <span>Mark as Trending (ট্রেন্ডিং)</span>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="btn-save-product-modal"
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-md cursor-pointer"
                >
                  {editingProduct ? 'Update Product' : 'Add to Store'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
