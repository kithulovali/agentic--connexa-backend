import React, { useState, useEffect, useMemo } from 'react';
import {
  Package,
  ShoppingCart,
  CreditCard,
  Sparkles,
  Share2,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Bot,
  Loader2,
  ShieldAlert,
  TrendingUp,
  TrendingDown,
  Image as ImageIcon,
  DollarSign,
  MessageSquare,
  Users,
  LayoutDashboard,
  ArrowUpRight,
  Search,
  Filter,
  Check,
  Building2,
  Smartphone,
  Coins,
  Sun,
  Moon,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  ShieldCheck,
  BarChart3,
  ArrowRight,
  MoreVertical,
  Calendar,
  Layers,
  Truck,
  Settings,
  HelpCircle,
  Mic,
  Sliders,
  Download,
  Menu as MenuIcon,
  FileText,
  Database,
  Star,
  CheckCircle,
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import {
  ProductOut,
  ProductCreate,
  ProductUpdate,
  OrderOut,
  PaymentOut,
  UserOut,
  AgentResponse,
} from '../../types';
import {
  formatCurrency,
  formatDate,
  getOrderContact,
  getStatusBadge,
} from '../../utils/formatters';

interface AdminDashboardProps {
  onBackToStore: () => void;
  onOpenAuth: () => void;
}

type AdminTab =
  | 'OVERVIEW'
  | 'PRODUCTS'
  | 'CUSTOMERS'
  | 'ORDERS'
  | 'PAYMENTS'
  | 'AI_STUDIO'
  | 'PLATFORM_PARTNER';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBackToStore,
  onOpenAuth,
}) => {
  const { user, isAuthenticated, isAdmin } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<AdminTab>('OVERVIEW');

  // Search input in admin header
  const [adminSearch, setAdminSearch] = useState('');

  // ==========================================
  // Data State
  // ==========================================
  const [products, setProducts] = useState<ProductOut[]>([]);
  const [orders, setOrders] = useState<OrderOut[]>([]);
  const [payments, setPayments] = useState<PaymentOut[]>([]);
  const [users, setUsers] = useState<UserOut[]>([]);
  const [platformStatus, setPlatformStatus] = useState<Record<string, any> | null>(null);

  const [loading, setLoading] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);

  // ==========================================
  // Product Create/Edit Modal State
  // ==========================================
  const [productModalMode, setProductModalMode] = useState<'CREATE' | 'EDIT' | null>(null);
  const [editingProduct, setEditingProduct] = useState<ProductOut | null>(null);
  const [pName, setPName] = useState('');
  const [pPrice, setPPrice] = useState('');
  const [pDescription, setPDescription] = useState('');
  const [pBannerImage, setPBannerImage] = useState('');
  const [pQuantity, setPQuantity] = useState(10);
  const [pStatus, setPStatus] = useState('AVAILABLE');
  const [productSubmitting, setProductSubmitting] = useState(false);

  // ==========================================
  // AI Enterprise Studio State
  // ==========================================
  const [aiAgentType, setAiAgentType] = useState<'BI' | 'PRODUCT_DISCOVERY' | 'GROWTH' | 'MARKETING' | 'IMAGE_STUDIO'>('BI');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<AgentResponse | null>(null);
  const [renderedImageBase64, setRenderedImageBase64] = useState<string | null>(null);

  // ==========================================
  // Social Hub State
  // ==========================================
  const [campaignCaption, setCampaignCaption] = useState('');
  const [campaignImageUrl, setCampaignImageUrl] = useState('');
  const [campaignPlatforms, setCampaignPlatforms] = useState<('facebook' | 'instagram' | 'tiktok')[]>([
    'facebook',
    'instagram',
  ]);
  const [campaignApproved, setCampaignApproved] = useState(false);
  const [campaignSubmitting, setCampaignSubmitting] = useState(false);
  const [campaignResult, setCampaignResult] = useState<any | null>(null);

  // WhatsApp Single Message
  const [waPhone, setWaPhone] = useState('');
  const [waMessage, setWaMessage] = useState('');
  const [waApproved, setWaApproved] = useState(false);
  const [waSubmitting, setWaSubmitting] = useState(false);
  const [waResult, setWaResult] = useState<any | null>(null);

  // Notification Toast
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  const showStatus = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // ==========================================
  // Data Fetching
  // ==========================================
  const loadAllData = async () => {
    setLoading(true);
    try {
      const [prodsRes, ordersRes, paymentsRes] = await Promise.allSettled([
        api.listProducts({ limit: 100 }),
        api.listOrders(0, 100),
        api.listPayments(0, 100),
      ]);

      if (prodsRes.status === 'fulfilled') setProducts(prodsRes.value || []);
      if (ordersRes.status === 'fulfilled') setOrders(ordersRes.value || []);
      if (paymentsRes.status === 'fulfilled') setPayments(paymentsRes.value || []);

      // If user is admin, fetch users and platforms
      if (isAdmin) {
        try {
          const [uRes, platRes] = await Promise.allSettled([
            api.listUsers(0, 50),
            api.getPlatformStatus(),
          ]);
          if (uRes.status === 'fulfilled') setUsers(uRes.value || []);
          if (platRes.status === 'fulfilled') setPlatformStatus(platRes.value || {});
        } catch {
          // Non-blocking
        }
      }
    } catch (err: any) {
      console.error('Error loading dashboard data:', err);
      showStatus(err.message || 'Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAllData();
    }
  }, [isAdmin]);

  // ==========================================
  // Computed KPI Metrics for Overview Tab
  // ==========================================
  const stats = useMemo(() => {
    // Total Revenue from orders or payments
    const totalRevenue = orders.reduce((acc, curr) => {
      const val = parseFloat(curr.total_price) || 0;
      return acc + val;
    }, 0);

    const totalOrdersCount = orders.length;

    const avgOrderValue =
      totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;

    const totalHardwareStock = products.reduce((acc, curr) => {
      return acc + (curr.quantity || 0);
    }, 0);

    return {
      revenue: totalRevenue,
      orders: totalOrdersCount,
      avgOrderValue,
      stock: totalHardwareStock,
      totalProducts: products.length,
      customers: users.length,
    };
  }, [orders, products, users]);

  // Inventory ordering based on database stock quantities
  const topProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => (b.quantity || 0) - (a.quantity || 0))
      .slice(0, 4);
  }, [products]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    if (!adminSearch.trim()) return products;
    const q = adminSearch.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        String(p.id).includes(q)
    );
  }, [products, adminSearch]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    if (!adminSearch.trim()) return orders;
    const q = adminSearch.toLowerCase();
    return orders.filter(
      (o) =>
        String(o.id).includes(q) ||
        o.address.toLowerCase().includes(q) ||
        o.order_status.toLowerCase().includes(q) ||
        o.payment_method.toLowerCase().includes(q)
    );
  }, [orders, adminSearch]);

  // ==========================================
  // Handlers
  // ==========================================
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setProductSubmitting(true);
    try {
      if (productModalMode === 'CREATE') {
        const payload: ProductCreate = {
          name: pName,
          price: parseFloat(pPrice) || 0,
          description: pDescription || undefined,
          banner_image: pBannerImage || undefined,
          quantity: Number(pQuantity),
          status: pStatus,
        };
        await api.createProduct(payload);
        showStatus('New electronics item added to catalogue!');
      } else if (productModalMode === 'EDIT' && editingProduct) {
        const payload: ProductUpdate = {
          name: pName,
          price: parseFloat(pPrice) || 0,
          description: pDescription || undefined,
          banner_image: pBannerImage || undefined,
          quantity: Number(pQuantity),
          status: pStatus,
        };
        await api.updateProduct(editingProduct.id, payload);
        showStatus(`Product #${editingProduct.id} updated!`);
      }
      setProductModalMode(null);
      loadAllData();
    } catch (err: any) {
      showStatus(err.message || 'Failed to save product', 'error');
    } finally {
      setProductSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!window.confirm(`Are you sure you want to delete Product #${productId}?`)) return;
    try {
      await api.deleteProduct(productId);
      showStatus(`Product #${productId} removed.`);
      loadAllData();
    } catch (err: any) {
      showStatus(err.message || 'Failed to delete product', 'error');
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      await api.updateOrderStatus(orderId, newStatus);
      showStatus(`Order #${orderId} marked as ${newStatus}`);
      loadAllData();
    } catch (err: any) {
      showStatus(err.message || 'Failed to update order status', 'error');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleVerifyOrderPayment = async (order: OrderOut) => {
    const confirmed = window.confirm(
      `Have you independently confirmed receipt of ${formatCurrency(order.total_price)} for Order #${order.id} via ${order.payment_method}?`
    );
    if (!confirmed) return;

    setUpdatingOrderId(order.id);
    try {
      await api.verifyOrderPayment({
        order_id: order.id,
        payment_method: order.payment_method,
        amount: order.total_price,
      });
      showStatus(`Payment for Order #${order.id} verified and recorded.`);
      loadAllData();
    } catch (err: any) {
      showStatus(err.message || 'Failed to verify order payment', 'error');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleRunAiAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setAiLoading(true);
    setAiResponse(null);
    setRenderedImageBase64(null);

    try {
      let res: AgentResponse;
      if (aiAgentType === 'BI') {
        res = await api.getBusinessIntelligence(aiPrompt.trim());
        setAiResponse(res);
      } else if (aiAgentType === 'PRODUCT_DISCOVERY') {
        res = await api.askProductDiscovery(aiPrompt.trim());
        setAiResponse(res);
      } else if (aiAgentType === 'GROWTH') {
        res = await api.getGrowthOptimization(aiPrompt.trim());
        setAiResponse(res);
      } else if (aiAgentType === 'MARKETING') {
        res = await api.getMarketingContent(aiPrompt.trim());
        setAiResponse(res);
      } else if (aiAgentType === 'IMAGE_STUDIO') {
        res = await api.getImageStudioBrief(aiPrompt.trim());
        setAiResponse(res);

        try {
          const renderRes = await api.renderImageStudio(aiPrompt.trim());
          if (renderRes?.image_base64) {
            setRenderedImageBase64(renderRes.image_base64);
          }
        } catch (imgErr) {
          console.warn('Render image provider not connected or skipped:', imgErr);
        }
      }
    } catch (err: any) {
      showStatus(err.message || 'AI agent execution failed', 'error');
    } finally {
      setAiLoading(false);
    }
  };

  const handlePublishCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignApproved) {
      alert('You must check the explicit administrator approval box before publishing.');
      return;
    }
    setCampaignSubmitting(true);
    try {
      const res = await api.publishCampaign({
        approved: true,
        platforms: campaignPlatforms,
        caption: campaignCaption,
        image_url: campaignImageUrl || undefined,
      });
      setCampaignResult(res);
      showStatus('Multichannel campaign dispatched successfully!');
    } catch (err: any) {
      showStatus(err.message || 'Failed to broadcast campaign', 'error');
    } finally {
      setCampaignSubmitting(false);
    }
  };

  const handleSendWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waApproved) {
      alert('You must confirm administrator approval to send WhatsApp message.');
      return;
    }
    setWaSubmitting(true);
    try {
      const res = await api.sendWhatsAppMessage({
        approved: true,
        to: waPhone.trim(),
        message: waMessage.trim(),
      });
      setWaResult(res);
      showStatus('WhatsApp message transmitted!');
    } catch (err: any) {
      showStatus(err.message || 'Failed to send WhatsApp message', 'error');
    } finally {
      setWaSubmitting(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:glass-dropdown border border-slate-200 dark:border-slate-800 text-center shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 font-heading">
            Administrator Access Required
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
            {isAuthenticated
              ? 'Your account does not have the administrator role required to access merchant operations.'
              : 'Sign in with an administrator account to access merchant operations, sales analytics, inventory, and platform tools.'}
          </p>
          <div className="flex gap-3">
            <button
              onClick={onBackToStore}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
            >
              Back to Store
            </button>
            {!isAuthenticated && (
              <button
                onClick={onOpenAuth}
                className="flex-1 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-md shadow-brand-500/25"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-urban-darker transition-colors duration-300">
      {/* Toast */}
      {statusMessage && (
        <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top-3">
          <div
            className={`px-4 py-3 rounded-2xl flex items-center gap-3 text-xs font-bold shadow-2xl border ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/90 border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300'
                : 'bg-rose-50 dark:bg-rose-950/90 border-rose-300 dark:border-rose-500/40 text-rose-800 dark:text-rose-300'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        </div>
      )}

      {/* Main Admin Layout with Left Sidebar (like in reference image 1) */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* ========================================================================= */}
        {/* LEFT VERTICAL SIDEBAR NAVIGATION */}
        {/* ========================================================================= */}
        <aside className="w-full lg:w-64 bg-white dark:bg-urban-dark border-r border-slate-200 dark:border-slate-800/80 p-5 flex flex-col justify-between flex-shrink-0 shadow-sm transition-colors duration-300">
          <div>
            {/* Brand Logo & Name */}
            <div
              onClick={onBackToStore}
              className="flex items-center gap-3 mb-8 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 to-accent-500 p-0.5 shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <img
                  src="/urban-scenery-logo.png"
                  alt="Urban Scenery"
                  className="w-full h-full object-cover rounded-[9px] bg-white dark:bg-urban-darker"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div>
                <div className="font-extrabold text-base text-slate-900 dark:text-white font-heading tracking-tight">
                  <span>URBAN</span> <span className="text-brand-500">SCENERY</span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono tracking-wider">
                  MERCHANT CONSOLE
                </p>
              </div>
            </div>

            {/* Navigation Menu (Endpoint-Backed Modules) */}
            <nav className="space-y-1">
              {[
                { id: 'OVERVIEW', label: 'Overview', icon: LayoutDashboard },
                { id: 'PRODUCTS', label: 'Products', icon: Package, badge: products.length },
                { id: 'CUSTOMERS', label: 'Customer', icon: Users, badge: users.length },
                { id: 'ORDERS', label: 'Orders', icon: ShoppingCart, badge: orders.length },
                { id: 'PAYMENTS', label: 'Payments', icon: CreditCard, badge: payments.length },
                { id: 'AI_STUDIO', label: 'AI Enterprise Studio', icon: Sparkles },
                { id: 'PLATFORM_PARTNER', label: 'Platform & Social Hub', icon: Share2 },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as AdminTab)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Card: "Upgrade Pro" (Matching Reference Image 1) */}
          <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800/80">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 text-white shadow-xl shadow-brand-500/20 relative overflow-hidden">
              <div className="absolute -right-3 -bottom-3 w-16 h-16 bg-white/10 rounded-full blur-xl pointer-events-none" />
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-3">
                <Sparkles className="w-4 h-4 text-accent-200" />
              </div>
              <h4 className="text-xs font-bold font-heading mb-1">Upgrade Pro</h4>
              <p className="text-[11px] text-brand-100 leading-relaxed mb-3">
                Discover new features to detailed report and analysis.
              </p>
              <button
                onClick={() => setActiveTab('AI_STUDIO')}
                className="w-full py-2 rounded-xl bg-white hover:bg-slate-100 text-brand-600 text-xs font-extrabold shadow-sm transition-all text-center"
              >
                Upgrade Now
              </button>
            </div>

            <button
              onClick={onBackToStore}
              className="mt-4 w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-all"
            >
              <span>Back to Storefront</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>

        {/* ========================================================================= */}
        {/* MAIN DASHBOARD CONTENT AREA */}
        {/* ========================================================================= */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Top Bar (Search with Mic, User Avatar with Chevron, Theme Toggle) */}
          <header className="h-18 bg-white dark:bg-urban-dark border-b border-slate-200 dark:border-slate-800/80 px-6 flex items-center justify-between gap-4 sticky top-0 z-30 transition-colors duration-300">
            {/* Search Input with Microphone Icon (Reference 1) */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                placeholder="Search..."
                className="w-full pl-10 pr-10 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-500 transition-colors"
                title="Voice Search"
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>

            {/* Right Header Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={loadAllData}
                disabled={loading}
                title="Refresh live data"
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 transition-all"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-brand-500' : ''}`} />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                data-theme-toggle
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 transition-all"
              >
                {isDark ? <Sun className="w-4 h-4 text-accent-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
              </button>

              <button
                onClick={() => {
                  setPName('');
                  setPPrice('');
                  setPDescription('');
                  setPBannerImage('');
                  setPQuantity(10);
                  setPStatus('AVAILABLE');
                  setEditingProduct(null);
                  setProductModalMode('CREATE');
                }}
                className="px-3.5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-brand-500/25 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add Product</span>
              </button>

              {/* Admin Profile Chip with Chevron (Reference 1) */}
              <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-800 cursor-pointer group">
                <div className="w-8 h-8 rounded-full ring-2 ring-brand-500/30 overflow-hidden bg-gradient-to-tr from-brand-500 to-accent-500 flex items-center justify-center text-xs font-bold text-white uppercase shadow-sm">
                  {user?.name ? user.name[0] : 'A'}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    {user?.name || 'Administrator'}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    {user?.email || 'admin@urbanscenery.com'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition-colors" />
              </div>
            </div>
          </header>

          {/* Content Body */}
          <div className="p-6 sm:p-8 space-y-8 flex-1 overflow-y-auto">
            {/* ========================================================================= */}
            {/* TAB: OVERVIEW (MATCHING REFERENCE IMAGE 1) */}
            {/* ========================================================================= */}
            {activeTab === 'OVERVIEW' && (
              <div className="space-y-8 animate-in fade-in">
                {/* Welcome Heading Banner */}
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
                    Welcome back, {user?.name || 'Administrator'}!
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Here's Your Current Live Store Sales & Operations Overview
                  </p>
                </div>

                {/* 3 Main KPI Cards (AVG Order Value, Total Orders, Lifetime Revenue) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {/* Card 1: AVG . Order Value (Solid Purple/Brand Card) */}
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 text-white shadow-xl shadow-brand-500/20 relative overflow-hidden flex flex-col justify-between min-h-[145px]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-white/90">
                        AVG . Order Value
                      </span>
                      <div className="w-8 h-8 rounded-xl bg-white text-brand-600 flex items-center justify-center shadow-sm">
                        <Database className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight mb-1">
                        {formatCurrency(stats.avgOrderValue)}
                      </div>
                      <div className="text-[11px] text-white/80 font-medium">
                        {stats.orders > 0 ? `Avg per fulfilled order` : 'Grounded in live database orders'}
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Total Orders (Clean Surface Card) */}
                  <div className="p-6 rounded-2xl bg-white dark:bg-urban-dark border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between min-h-[145px]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        Total Orders
                      </span>
                      <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white tracking-tight mb-1">
                        {stats.orders}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        {stats.orders > 0 ? `${stats.orders} total orders recorded` : 'Awaiting first storefront order'}
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Settled Revenue (Clean Surface Card) */}
                  <div className="p-6 rounded-2xl bg-white dark:bg-urban-dark border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between min-h-[145px]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        Settled Revenue
                      </span>
                      <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                        <Sparkles className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white tracking-tight mb-1">
                        {formatCurrency(stats.revenue)}
                      </div>
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                        {stats.revenue > 0 ? 'Live gross settled volume' : 'Zero orders placed yet'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {/* Inventory Snapshot Card (Matching Reference 1) */}
                  <div className="p-6 rounded-2xl bg-white dark:bg-urban-dark border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        Top Selling Product
                      </h3>
                      <button
                        onClick={() => setActiveTab('PRODUCTS')}
                        className="text-xs text-slate-500 hover:text-brand-500 font-medium flex items-center gap-1"
                      >
                        <span>See All Product</span>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Products ordered by current stock quantity */}
                    <div className="space-y-4">
                      {topProducts.length > 0 ? (
                        topProducts.slice(0, 3).map((p) => {
                          const isAvailable = p.status === 'AVAILABLE' && (p.quantity ?? 0) > 0;
                          return (
                            <div key={p.id} className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900 flex-shrink-0 border border-slate-200 dark:border-slate-800">
                                  {p.banner_image ? (
                                    <img src={p.banner_image} alt={p.name} className="h-full w-full object-cover" />
                                  ) : (
                                    <Package className="m-auto h-5 w-5 text-slate-400" />
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                    {p.name}
                                  </h4>
                                  <p className="text-[10px] text-brand-600 dark:text-brand-400 font-mono font-bold">
                                    {formatCurrency(p.price)}
                                  </p>
                                </div>
                              </div>

                              <div className="text-right flex-shrink-0">
                                {isAvailable ? (
                                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                                    • Available
                                  </div>
                                ) : (
                                  <div className="text-[10px] text-rose-500 font-medium">
                                    • Out of Stock
                                  </div>
                                )}
                                <div className="text-[9px] text-slate-400 font-mono">
                                  {p.quantity > 0 ? `${p.quantity} Units In Stock` : 'Restock pending'}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="py-8 px-4 text-center rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800">
                          <Package className="w-7 h-7 mx-auto text-slate-400 mb-2" />
                          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No products registered yet</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Add products to populate live inventory and top rankings.
                          </p>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setActiveTab('PRODUCTS')}
                      className="mt-4 w-full py-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all text-center"
                    >
                      Manage Products ({products.length})
                    </button>
                  </div>
                </div>

                {/* Latest Orders Table (Matching Reference 1 + Live Orders) */}
                <div className="p-6 rounded-2xl bg-white dark:bg-urban-dark border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      Latest Orders
                    </h3>

                    {/* Top Action Buttons (Reference 1: Customize, Filter, Export) */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveTab('ORDERS')}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-medium flex items-center gap-1.5 transition-all"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        <span>Customize</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('ORDERS')}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-medium flex items-center gap-1.5 transition-all"
                      >
                        <Filter className="w-3.5 h-3.5" />
                        <span>Filter</span>
                      </button>
                      <button
                        onClick={() => {
                          const csvRows = [
                            ['Order ID', 'Product', 'Date', 'Price', 'Payment', 'Status'].join(','),
                            ...orders.map((o) =>
                              [
                                `#${o.id}`,
                                `"${(o.product?.name || `Item #${o.product_id}`).replace(/"/g, '""')}"`,
                                `"${formatDate(o.ordered_at)}"`,
                                o.total_price,
                                o.payment_method,
                                o.order_status,
                              ].join(',')
                            ),
                          ].join('\n');
                          const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `urban-scenery-orders-${new Date().toISOString().slice(0, 10)}.csv`;
                          a.click();
                          URL.revokeObjectURL(url);
                          showStatus('Orders exported to CSV!');
                        }}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-medium flex items-center gap-1.5 transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export</span>
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 font-bold">
                        <tr>
                          <th className="py-3 px-4">Order ID</th>
                          <th className="py-3 px-4">Product</th>
                          <th className="py-3 px-4">Order Date</th>
                          <th className="py-3 px-4">Price</th>
                          <th className="py-3 px-4">Payment</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                        {orders.length > 0 ? (
                          orders.slice(0, 5).map((ord) => {
                            const statusBadge = getStatusBadge(ord.order_status);
                            return (
                              <tr
                                key={ord.id}
                                className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                              >
                                <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                                  #{ord.id}
                                </td>
                                <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-white">
                                  {ord.product?.name || `Product ID #${ord.product_id}`}
                                </td>
                                <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                                  {formatDate(ord.ordered_at)}
                                </td>
                                <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                                  {formatCurrency(ord.total_price)}
                                </td>
                                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 text-[11px]">
                                  {ord.payment_method}
                                </td>
                                <td className="py-3.5 px-4">
                                  <span
                                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${statusBadge.bg} ${statusBadge.text}`}
                                  >
                                    {ord.order_status}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 text-right">
                                  <div className="flex items-center justify-end gap-1">
                                    {['PROCESSING', 'DELIVERED'].map((st) => (
                                      <button
                                        key={st}
                                        onClick={() => handleUpdateOrderStatus(ord.id, st)}
                                        disabled={
                                          updatingOrderId === ord.id || ord.order_status === st
                                        }
                                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                                          ord.order_status === st
                                            ? 'bg-brand-500 text-white'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                        }`}
                                      >
                                        {st === 'PROCESSING' ? 'Process' : 'Deliver'}
                                      </button>
                                    ))}
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={7} className="py-10 text-center text-slate-400">
                              <div className="flex flex-col items-center justify-center">
                                <FileText className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2" />
                                <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                  No orders recorded yet
                                </div>
                                <div className="text-[11px] text-slate-500 mt-0.5">
                                  Customer orders placed on the storefront will appear here live.
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB: PRODUCTS (FULL INVENTORY) */}
            {/* ========================================================================= */}
            {activeTab === 'PRODUCTS' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
                      Hardware Catalogue & Stock Inventory
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Live catalogue grounded with API endpoints (`/api/v1/products`)
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setPName('');
                      setPPrice('');
                      setPDescription('');
                      setPBannerImage('');
                      setPQuantity(10);
                      setPStatus('AVAILABLE');
                      setEditingProduct(null);
                      setProductModalMode('CREATE');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-brand-500/25 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Electronics</span>
                  </button>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-urban-dark shadow-sm">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase font-bold">
                      <tr>
                        <th className="py-3.5 px-4">Item</th>
                        <th className="py-3.5 px-4">Price</th>
                        <th className="py-3.5 px-4">Available Units</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                      {filteredProducts.map((p) => {
                        const badge = getStatusBadge(p.status);
                        return (
                          <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                  {p.banner_image ? (
                                    <img src={p.banner_image} alt={p.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <Package className="w-6 h-6 text-slate-400" />
                                  )}
                                </div>
                                <div>
                                  <div className="font-bold text-slate-900 dark:text-white text-sm font-heading">{p.name}</div>
                                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Hardware ID #{p.id}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white text-sm">
                              {formatCurrency(p.price)}
                            </td>
                            <td className="py-3.5 px-4 font-mono font-bold">
                              <span className={p.quantity > 0 ? 'text-slate-800 dark:text-slate-200' : 'text-rose-500'}>
                                {p.quantity} units
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${badge.bg} ${badge.text}`}>
                                {p.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => {
                                    setEditingProduct(p);
                                    setPName(p.name);
                                    setPPrice(p.price);
                                    setPDescription(p.description || '');
                                    setPBannerImage(p.banner_image || '');
                                    setPQuantity(p.quantity);
                                    setPStatus(p.status);
                                    setProductModalMode('EDIT');
                                  }}
                                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                                  title="Edit item"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(p.id)}
                                  className="p-2 rounded-lg bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-500/20 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
                                  title="Delete item"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB: CUSTOMERS (REGISTERED USERS) */}
            {/* ========================================================================= */}
            {activeTab === 'CUSTOMERS' && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
                    Registered Customers & Accounts
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Accounts database from `/api/v1/users`
                  </p>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-urban-dark shadow-sm">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase font-bold">
                      <tr>
                        <th className="py-3.5 px-4">User</th>
                        <th className="py-3.5 px-4">Email</th>
                        <th className="py-3.5 px-4">Contact</th>
                        <th className="py-3.5 px-4">Role</th>
                        <th className="py-3.5 px-4">Public UUID</th>
                        <th className="py-3.5 px-4 text-right">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                      {users.map((u) => (
                        <tr key={u.public_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-500 to-accent-500 flex items-center justify-center text-xs font-bold text-white uppercase">
                                {u.name ? u.name[0] : 'U'}
                              </div>
                              <span className="font-bold text-slate-900 dark:text-white">{u.name}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300">
                            {u.email}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">
                            {u.contact || 'N/A'}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-500/30">
                              {u.role}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[10px] text-slate-400 truncate max-w-[140px]">
                            {u.public_id}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono text-[11px] text-slate-500 dark:text-slate-400">
                            {formatDate(u.created_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB: ORDERS */}
            {/* ========================================================================= */}
            {activeTab === 'ORDERS' && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
                    Full Orders & Shipping Logistics
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Live customer orders from `/api/v1/orders`
                  </p>
                </div>

                <div className="space-y-4">
                  {filteredOrders.map((ord) => {
                    const statusBadge = getStatusBadge(ord.order_status);
                    const paymentBadge = getStatusBadge(ord.payment_status);
                    const contact = getOrderContact(ord);

                    return (
                      <div
                        key={ord.id}
                        className="p-5 rounded-2xl bg-white dark:bg-urban-dark border border-slate-200 dark:border-slate-800 shadow-sm hover:border-brand-500/30 transition-all"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                              Order #{ord.id}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                              {formatDate(ord.ordered_at)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase ${statusBadge.bg} ${statusBadge.text}`}>
                              {ord.order_status}
                            </span>
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase ${paymentBadge.bg} ${paymentBadge.text}`}>
                              {ord.payment_status}
                            </span>
                          </div>
                        </div>

                        <div className="py-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium">
                          <div>
                            <span className="text-slate-400 text-[10px] uppercase font-mono block font-bold">
                              Shipping Coordinates
                            </span>
                            <p className="text-slate-900 dark:text-white font-semibold mt-0.5">{ord.address}</p>
                            <p className="text-brand-600 dark:text-brand-400 font-mono font-bold mt-0.5">Phone: {contact}</p>
                          </div>

                          <div>
                            <span className="text-slate-400 text-[10px] uppercase font-mono block font-bold">
                              Hardware Unit Ordered
                            </span>
                            <p className="text-slate-900 dark:text-white font-semibold mt-0.5">
                              {ord.product?.name || `Product ID #${ord.product_id}`}
                            </p>
                            <p className="text-slate-500 dark:text-slate-400 font-mono mt-0.5">Quantity: {ord.quantity} units</p>
                          </div>

                          <div>
                            <span className="text-slate-400 text-[10px] uppercase font-mono block font-bold">
                              Financial Settlement
                            </span>
                            <p className="text-base font-black text-slate-900 dark:text-white font-mono mt-0.5">
                              {formatCurrency(ord.total_price)}
                            </p>
                            <p className="text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                              Method: {ord.payment_method}
                            </p>
                          </div>
                        </div>

                        {/* Status Transition buttons */}
                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-semibold">
                            Update Order Fulfilment:
                          </span>
                          <div className="flex items-center gap-1.5">
                            {['PENDING', 'APPROVED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
                              <button
                                key={st}
                                disabled={updatingOrderId === ord.id || ord.order_status === st}
                                onClick={() => handleUpdateOrderStatus(ord.id, st)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                                  ord.order_status === st
                                    ? 'bg-brand-500 text-white shadow-sm'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40'
                                }`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        </div>
                        {ord.payment_status !== 'PAID' && ord.order_status !== 'CANCELLED' && (
                          <div className="pt-3 flex flex-wrap items-center justify-between gap-3">
                            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-semibold">
                              Manual Payment Verification:
                            </span>
                            <button
                              type="button"
                              disabled={updatingOrderId === ord.id}
                              onClick={() => handleVerifyOrderPayment(ord)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold disabled:opacity-40 transition-colors"
                            >
                              {updatingOrderId === ord.id ? 'Verifying...' : 'Verify payment received'}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB: PAYMENTS */}
            {/* ========================================================================= */}
            {activeTab === 'PAYMENTS' && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
                    Audited Payment Ledger
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Live transaction gateway records from `/api/v1/payments`
                  </p>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-urban-dark shadow-sm">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase font-bold">
                      <tr>
                        <th className="py-3.5 px-4">Receipt ID</th>
                        <th className="py-3.5 px-4">Linked Order</th>
                        <th className="py-3.5 px-4">Payment Method</th>
                        <th className="py-3.5 px-4">Amount Paid</th>
                        <th className="py-3.5 px-4 text-right">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono font-medium">
                      {payments.map((pmt) => (
                        <tr key={pmt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-brand-600 dark:text-brand-400">#{pmt.id}</td>
                          <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">Order #{pmt.order_id}</td>
                          <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-semibold">{pmt.payment_method}</td>
                          <td className="py-3.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                            {formatCurrency(pmt.amount)}
                          </td>
                          <td className="py-3.5 px-4 text-right text-slate-500 dark:text-slate-400 text-[11px]">
                            {formatDate(pmt.paid_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB: AI ENTERPRISE STUDIO */}
            {/* ========================================================================= */}
            {activeTab === 'AI_STUDIO' && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 font-heading">
                    <Sparkles className="w-5 h-5 text-accent-500" />
                    <span>AI Enterprise & Product Discovery Studio</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Explore catalogue-grounded product discovery, business intelligence, growth optimization, marketing content, and image generation.
                  </p>
                </div>

                {/* Sub-Agent Selector */}
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
                  {[
                    { id: 'BI', title: 'Business Intelligence', desc: 'Margins & revenue metrics', icon: TrendingUp },
                    { id: 'PRODUCT_DISCOVERY', title: 'Product Discovery', desc: 'Catalogue-grounded matching', icon: Search },
                    { id: 'GROWTH', title: 'Growth Optimization', desc: 'Restocking & inventory scaling', icon: DollarSign },
                    { id: 'MARKETING', title: 'Marketing Content', desc: 'Ad copy & campaign drafts', icon: MessageSquare },
                    { id: 'IMAGE_STUDIO', title: 'Image Studio', desc: 'Visual prompt & base64 render', icon: ImageIcon },
                  ].map((agent) => {
                    const Icon = agent.icon;
                    return (
                      <button
                        key={agent.id}
                        onClick={() => {
                          setAiAgentType(agent.id as any);
                          setAiResponse(null);
                          setRenderedImageBase64(null);
                        }}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          aiAgentType === agent.id
                            ? 'bg-gradient-to-tr from-brand-500/10 to-accent-500/10 border-brand-500 text-slate-900 dark:text-white shadow-md'
                            : 'bg-white dark:bg-urban-dark border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <Icon className="w-5 h-5 text-brand-500 mb-2" />
                        <div className="font-bold text-xs text-slate-900 dark:text-white font-heading">{agent.title}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{agent.desc}</div>
                      </button>
                    );
                  })}
                </div>

                {/* Agent Form */}
                <form onSubmit={handleRunAiAgent} className="p-5 rounded-2xl bg-white dark:bg-urban-dark border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                  <div>
                    <label className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
                      Prompt for {aiAgentType === 'PRODUCT_DISCOVERY' ? 'Product Discovery' : aiAgentType} Agent:
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder={
                        aiAgentType === 'BI'
                          ? 'What are our top revenue generators and category margins this month?'
                          : aiAgentType === 'PRODUCT_DISCOVERY'
                          ? 'Recommend available products for a customer looking for a reliable laptop under $800.'
                          : aiAgentType === 'GROWTH'
                          ? 'Which electronics should we restock first based on customer order volume?'
                          : aiAgentType === 'MARKETING'
                          ? 'Write a high-converting promotional post for our flagship noise-cancelling headphones.'
                          : 'Generate a futuristic metropolitan hero render prompt for our flagship smartphone lineup.'
                      }
                      className="w-full p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={aiLoading || !aiPrompt.trim()}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-600 hover:to-accent-600 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-brand-500/25 disabled:opacity-40"
                    >
                      {aiLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Executing Agent...</span>
                        </>
                      ) : (
                        <>
                          <Bot className="w-4 h-4" />
                          <span>Run {aiAgentType === 'PRODUCT_DISCOVERY' ? 'Product Discovery' : aiAgentType} Agent</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Results Output */}
                {aiResponse && (
                  <div className="p-6 rounded-2xl bg-white dark:bg-urban-dark border border-brand-200 dark:border-brand-500/30 space-y-4 animate-in fade-in shadow-md">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <Bot className="w-5 h-5 text-brand-500" />
                        <span className="font-bold text-sm text-slate-900 dark:text-white font-heading">
                          Agent Output: {aiResponse.agent}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                        Model: {aiResponse.model}
                      </span>
                    </div>

                    <div className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                      {aiResponse.answer}
                    </div>

                    {aiResponse.data_summary && Object.keys(aiResponse.data_summary).length > 0 && (
                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] font-mono">
                        <span className="text-slate-500 dark:text-slate-400 block mb-1 uppercase font-bold">
                          Database Grounding Telemetry:
                        </span>
                        <pre className="text-brand-600 dark:text-accent-400 overflow-x-auto whitespace-pre-wrap">
                          {JSON.stringify(aiResponse.data_summary, null, 2)}
                        </pre>
                      </div>
                    )}

                    {renderedImageBase64 && (
                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-xs font-bold text-slate-900 dark:text-white block mb-2 font-heading">
                          Studio Rendered Product Image Preview:
                        </span>
                        <div className="rounded-xl overflow-hidden max-w-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 shadow-sm">
                          <img
                            src={`data:image/png;base64,${renderedImageBase64}`}
                            alt="Rendered product"
                            className="w-full h-auto"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB: SOCIAL MULTICHANNEL HUB & PLATFORM PARTNER */}
            {/* ========================================================================= */}
            {activeTab === 'PLATFORM_PARTNER' && (
              <div className="space-y-8 animate-in fade-in">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 font-heading">
                    <Share2 className="w-5 h-5 text-brand-500" />
                    <span>Platform Partners & Multichannel Campaigns</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Synchronize marketing announcements to Facebook, Instagram, TikTok, and direct WhatsApp customer lines.
                  </p>
                </div>

                {/* Status Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {['facebook', 'instagram', 'tiktok', 'whatsapp'].map((platform) => {
                    const active = platformStatus ? Boolean(platformStatus[platform]) : true;
                    return (
                      <div key={platform} className="p-4 rounded-2xl bg-white dark:bg-urban-dark border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-slate-900 dark:text-white capitalize font-heading">{platform}</span>
                          <span className={`w-2.5 h-2.5 rounded-full ${active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                          {active ? 'Integration Configured' : 'Missing Config'}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Campaign Broadcast */}
                  <form onSubmit={handlePublishCampaign} className="p-6 rounded-2xl bg-white dark:bg-urban-dark border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 font-heading">
                      <Share2 className="w-4 h-4 text-brand-500" />
                      <span>Cross-Channel Campaign Broadcast</span>
                    </h3>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1 uppercase font-mono">
                        Select Target Channels *
                      </label>
                      <div className="flex gap-2">
                        {(['facebook', 'instagram', 'tiktok'] as const).map((plat) => (
                          <button
                            type="button"
                            key={plat}
                            onClick={() => {
                              if (campaignPlatforms.includes(plat)) {
                                setCampaignPlatforms(campaignPlatforms.filter((p) => p !== plat));
                              } else {
                                setCampaignPlatforms([...campaignPlatforms, plat]);
                              }
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all border ${
                              campaignPlatforms.includes(plat)
                                ? 'bg-brand-500 text-white border-brand-600 shadow-sm'
                                : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                            }`}
                          >
                            {plat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1 uppercase font-mono">
                        Campaign Caption *
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={campaignCaption}
                        onChange={(e) => setCampaignCaption(e.target.value)}
                        placeholder="Exciting hardware drops! Check our latest electronics..."
                        className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1 uppercase font-mono">
                        Media Image URL
                      </label>
                      <input
                        type="url"
                        value={campaignImageUrl}
                        onChange={(e) => setCampaignImageUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-accent-50 dark:bg-accent-500/10 border border-accent-300 dark:border-accent-500/30 flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        id="campaign-approve-check"
                        checked={campaignApproved}
                        onChange={(e) => setCampaignApproved(e.target.checked)}
                        className="mt-0.5 rounded text-brand-500 focus:ring-brand-500"
                      />
                      <label htmlFor="campaign-approve-check" className="text-xs text-accent-900 dark:text-accent-200 cursor-pointer">
                        <span className="font-bold">Approval Confirmation:</span> Authorize immediate outbound dispatch to external social channels.
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={campaignSubmitting || !campaignApproved || campaignPlatforms.length === 0}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-600 hover:to-accent-600 text-white font-bold text-xs disabled:opacity-40 transition-all flex items-center justify-center gap-2 shadow-md shadow-brand-500/25"
                    >
                      {campaignSubmitting ? 'Broadcasting...' : 'Broadcast Campaign'}
                    </button>
                  </form>

                  {/* Direct WhatsApp Message */}
                  <form onSubmit={handleSendWhatsApp} className="p-6 rounded-2xl bg-white dark:bg-urban-dark border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 font-heading">
                      <MessageSquare className="w-4 h-4 text-emerald-500" />
                      <span>Direct WhatsApp Customer Notification</span>
                    </h3>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1 uppercase font-mono">
                        Customer Phone (E.164 format) *
                      </label>
                      <input
                        type="text"
                        required
                        value={waPhone}
                        onChange={(e) => setWaPhone(e.target.value)}
                        placeholder="+1234567890"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1 uppercase font-mono">
                        Message Content *
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={waMessage}
                        onChange={(e) => setWaMessage(e.target.value)}
                        placeholder="Your order #123 has been prepared for courier pickup."
                        className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/30 flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        id="wa-approve-check"
                        checked={waApproved}
                        onChange={(e) => setWaApproved(e.target.checked)}
                        className="mt-0.5 rounded text-emerald-500 focus:ring-emerald-500"
                      />
                      <label htmlFor="wa-approve-check" className="text-xs text-emerald-900 dark:text-emerald-200 cursor-pointer">
                        <span className="font-bold">WhatsApp Authorization:</span> Explicit permission to send direct message to customer.
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={waSubmitting || !waApproved || !waPhone.trim()}
                      className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs disabled:opacity-40 transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-600/25"
                    >
                      {waSubmitting ? 'Transmitting...' : 'Send WhatsApp Message'}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ========================================================================= */}
      {/* PRODUCT CREATE / EDIT MODAL */}
      {/* ========================================================================= */}
      {productModalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:glass-dropdown border border-slate-200 dark:border-slate-700/80 p-6 sm:p-8 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 font-heading">
              {productModalMode === 'CREATE' ? 'Add New Electronics Hardware' : 'Edit Product Item'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Enter hardware specifications, unit price, and warehouse stock inventory.
            </p>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1 uppercase font-mono">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={pName}
                  onChange={(e) => setPName(e.target.value)}
                  placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1 uppercase font-mono">
                    Unit Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    min="0"
                    value={pPrice}
                    onChange={(e) => setPPrice(e.target.value)}
                    placeholder="399.99"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1 uppercase font-mono">
                    Stock Units *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={pQuantity}
                    onChange={(e) => setPQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1 uppercase font-mono">
                  Banner Image URL
                </label>
                <input
                  type="url"
                  value={pBannerImage}
                  onChange={(e) => setPBannerImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1 uppercase font-mono">
                  Description & Specs
                </label>
                <textarea
                  rows={3}
                  value={pDescription}
                  onChange={(e) => setPDescription(e.target.value)}
                  placeholder="Technical specs, battery life, connectivity, and manufacturer warranty."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1 uppercase font-mono">
                  Availability Status
                </label>
                <select
                  value={pStatus}
                  onChange={(e) => setPStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  <option value="AVAILABLE">AVAILABLE (In Stock)</option>
                  <option value="EMPTY">EMPTY (Out of Stock)</option>
                </select>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setProductModalMode(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={productSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-md shadow-brand-500/25"
                >
                  {productSubmitting ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
