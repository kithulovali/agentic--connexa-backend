import React, { useState, useEffect } from 'react';
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
  Send,
  Eye,
  Loader2,
  ShieldAlert,
  ArrowUpRight,
  TrendingUp,
  Image as ImageIcon,
  DollarSign,
  MessageSquare,
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/useAuthStore';
import {
  ProductOut,
  ProductCreate,
  ProductUpdate,
  OrderOut,
  PaymentOut,
  AgentResponse,
} from '../../types';
import { formatCurrency, formatDate, getOrderContact, getStatusBadge } from '../../utils/formatters';

interface AdminDashboardProps {
  onBackToStore: () => void;
  onOpenAuth: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBackToStore,
  onOpenAuth,
}) => {
  const { user, isAuthenticated, isAdmin } = useAuthStore();

  const [activeTab, setActiveTab] = useState<
    'INVENTORY' | 'ORDERS' | 'PAYMENTS' | 'AI_STUDIO' | 'SOCIAL_HUB'
  >('INVENTORY');

  // ==========================================
  // Inventory State
  // ==========================================
  const [products, setProducts] = useState<ProductOut[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productModalMode, setProductModalMode] = useState<'CREATE' | 'EDIT' | null>(null);
  const [editingProduct, setEditingProduct] = useState<ProductOut | null>(null);

  // Form states for Product Create/Edit
  const [pName, setPName] = useState('');
  const [pPrice, setPPrice] = useState('');
  const [pDescription, setPDescription] = useState('');
  const [pBannerImage, setPBannerImage] = useState('');
  const [pQuantity, setPQuantity] = useState(10);
  const [pStatus, setPStatus] = useState('AVAILABLE');
  const [productSubmitting, setProductSubmitting] = useState(false);

  // ==========================================
  // Orders State
  // ==========================================
  const [orders, setOrders] = useState<OrderOut[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);

  // ==========================================
  // Payments State
  // ==========================================
  const [payments, setPayments] = useState<PaymentOut[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);

  // ==========================================
  // AI Enterprise Studio State
  // ==========================================
  const [aiAgentType, setAiAgentType] = useState<
    'BI' | 'GROWTH' | 'MARKETING' | 'IMAGE_STUDIO'
  >('BI');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<AgentResponse | null>(null);
  const [renderedImageBase64, setRenderedImageBase64] = useState<string | null>(null);

  // ==========================================
  // Social Hub State
  // ==========================================
  const [platformStatus, setPlatformStatus] = useState<Record<string, any> | null>(null);
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

  // Notification Banner
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  const showStatus = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Load Inventory
  const loadInventory = async () => {
    setLoadingProducts(true);
    try {
      const data = await api.listProducts({ limit: 100 });
      setProducts(data || []);
    } catch (err: any) {
      showStatus(err.message || 'Failed to load inventory', 'error');
    } finally {
      setLoadingProducts(false);
    }
  };

  // Load Orders
  const loadOrders = async () => {
    setLoadingOrders(true);
    try {
      const data = await api.listOrders(0, 100);
      setOrders(data || []);
    } catch (err: any) {
      showStatus(err.message || 'Failed to load orders', 'error');
    } finally {
      setLoadingOrders(false);
    }
  };

  // Load Payments
  const loadPayments = async () => {
    setLoadingPayments(true);
    try {
      const data = await api.listPayments(0, 100);
      setPayments(data || []);
    } catch (err: any) {
      showStatus(err.message || 'Failed to load payments', 'error');
    } finally {
      setLoadingPayments(false);
    }
  };

  // Load Platform Status
  const loadPlatforms = async () => {
    try {
      const status = await api.getPlatformStatus();
      setPlatformStatus(status);
    } catch (err) {
      console.error('Failed to load platform status:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'INVENTORY') loadInventory();
    if (activeTab === 'ORDERS') loadOrders();
    if (activeTab === 'PAYMENTS') loadPayments();
    if (activeTab === 'SOCIAL_HUB') loadPlatforms();
  }, [activeTab]);

  // Handle Product Save
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
        showStatus(`Product #${editingProduct.id} successfully updated!`);
      }
      setProductModalMode(null);
      loadInventory();
    } catch (err: any) {
      showStatus(err.message || 'Failed to save product', 'error');
    } finally {
      setProductSubmitting(false);
    }
  };

  // Handle Delete Product
  const handleDeleteProduct = async (productId: number) => {
    if (!window.confirm(`Are you sure you want to delete Product #${productId}?`)) return;
    try {
      await api.deleteProduct(productId);
      showStatus(`Product #${productId} removed.`);
      loadInventory();
    } catch (err: any) {
      showStatus(err.message || 'Failed to delete product', 'error');
    }
  };

  // Handle Order Status Update
  const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      await api.updateOrderStatus(orderId, newStatus);
      showStatus(`Order #${orderId} marked as ${newStatus}`);
      loadOrders();
    } catch (err: any) {
      showStatus(err.message || 'Failed to update order status', 'error');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Handle AI Agent Query
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
      } else if (aiAgentType === 'GROWTH') {
        res = await api.getGrowthOptimization(aiPrompt.trim());
        setAiResponse(res);
      } else if (aiAgentType === 'MARKETING') {
        res = await api.getMarketingContent(aiPrompt.trim());
        setAiResponse(res);
      } else if (aiAgentType === 'IMAGE_STUDIO') {
        // First get the studio brief
        res = await api.getImageStudioBrief(aiPrompt.trim());
        setAiResponse(res);

        // Then call render endpoint for base64 image preview
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

  // Handle Campaign Publishing
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

  // Handle Direct WhatsApp Message
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

  // Check auth requirement for Admin Hub
  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl glass-dropdown border border-slate-800 text-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Merchant Hub Access</h2>
          <p className="text-xs text-slate-400 mb-6">
            Authentication is required to view inventory management, order fulfilment, and enterprise AI tools.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onBackToStore}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Back to Store
            </button>
            <button
              onClick={onOpenAuth}
              className="flex-1 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow-md shadow-sky-500/20"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Header & Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 uppercase tracking-wider mb-1">
            <span>Enterprise Back-Office</span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
            <span>Agentic Connexa API</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Merchant & AI Operations Hub</span>
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2 text-xs">
            <span className="text-slate-400">Signed in:</span>
            <span className="font-semibold text-white">{user?.name}</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 font-mono uppercase">
              {user?.role}
            </span>
          </div>

          <button
            onClick={onBackToStore}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-all"
          >
            Storefront
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {statusMessage && (
        <div
          className={`mb-6 p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold animate-in fade-in ${
            statusMessage.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto gap-2 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 mb-8 scrollbar-none">
        <button
          onClick={() => setActiveTab('INVENTORY')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'INVENTORY'
              ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Product Inventory</span>
        </button>

        <button
          onClick={() => setActiveTab('ORDERS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'ORDERS'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Orders & Fulfilment</span>
        </button>

        <button
          onClick={() => setActiveTab('PAYMENTS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'PAYMENTS'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Payment Records</span>
        </button>

        <button
          onClick={() => setActiveTab('AI_STUDIO')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'AI_STUDIO'
              ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>AI Enterprise Studio</span>
        </button>

        <button
          onClick={() => setActiveTab('SOCIAL_HUB')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'SOCIAL_HUB'
              ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>Social Multichannel</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PRODUCT INVENTORY */}
      {/* ========================================================================= */}
      {activeTab === 'INVENTORY' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Electronics Hardware Catalogue</h3>
              <p className="text-xs text-slate-400">
                Manage specifications, live stock levels, pricing, and availability.
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
              className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-sky-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Hardware</span>
            </button>
          </div>

          {loadingProducts ? (
            <div className="py-16 text-center text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-sky-400" />
              <p className="text-xs font-mono">Fetching latest product records...</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
                  <tr>
                    <th className="py-3.5 px-4">Item</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Stock</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {products.map((p) => {
                    const badge = getStatusBadge(p.status);
                    return (
                      <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden flex-shrink-0 flex items-center justify-center">
                              {p.banner_image ? (
                                <img
                                  src={p.banner_image}
                                  alt={p.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Package className="w-5 h-5 text-slate-400" />
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-white text-xs">{p.name}</div>
                              <div className="text-[10px] text-slate-400 font-mono">ID #{p.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-white">
                          {formatCurrency(p.price)}
                        </td>
                        <td className="py-3 px-4 font-mono">
                          <span
                            className={
                              p.quantity > 0 ? 'text-slate-300' : 'text-rose-400 font-bold'
                            }
                          >
                            {p.quantity} units
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase ${badge.bg} ${badge.text}`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
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
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                              title="Edit item"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400"
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
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ORDERS & FULFILMENT */}
      {/* ========================================================================= */}
      {activeTab === 'ORDERS' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Customer Orders & Logistics</h3>
              <p className="text-xs text-slate-400">
                Track real-time orders, payment receipts, and dispatch states.
              </p>
            </div>
            <button
              onClick={loadOrders}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <RefreshCw className={`w-4 h-4 ${loadingOrders ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {loadingOrders ? (
            <div className="py-16 text-center text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-indigo-400" />
              <p className="text-xs font-mono">Loading order logs...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
              <ShoppingCart className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-white">No customer orders placed yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => {
                const statusBadge = getStatusBadge(ord.order_status);
                const paymentBadge = getStatusBadge(ord.payment_status);
                const contact = getOrderContact(ord);

                return (
                  <div
                    key={ord.id}
                    className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-white font-mono">
                          Order #{ord.id}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {formatDate(ord.ordered_at)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase ${statusBadge.bg} ${statusBadge.text}`}
                        >
                          {ord.order_status}
                        </span>
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase ${paymentBadge.bg} ${paymentBadge.text}`}
                        >
                          {ord.payment_status}
                        </span>
                      </div>
                    </div>

                    <div className="py-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-mono block">
                          Recipient & Shipping Address
                        </span>
                        <p className="text-white font-medium mt-0.5">{ord.address}</p>
                        <p className="text-sky-400 font-mono mt-0.5">Contact: {contact}</p>
                      </div>

                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-mono block">
                          Product Ordered
                        </span>
                        <p className="text-white font-medium mt-0.5">
                          {ord.product?.name || `Hardware Item #${ord.product_id}`}
                        </p>
                        <p className="text-slate-400 font-mono mt-0.5">Qty: {ord.quantity} units</p>
                      </div>

                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-mono block">
                          Financial Settlement
                        </span>
                        <p className="text-base font-bold text-white font-mono mt-0.5">
                          {formatCurrency(ord.total_price)}
                        </p>
                        <p className="text-slate-400 font-mono mt-0.5">
                          Rail: {ord.payment_method}
                        </p>
                      </div>
                    </div>

                    {/* Fulfilment Status Controls */}
                    <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                      <span className="text-[11px] font-mono text-slate-400">
                        Update Fulfilment Status:
                      </span>
                      <div className="flex items-center gap-1.5">
                        {['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
                          <button
                            key={st}
                            disabled={updatingOrderId === ord.id || ord.order_status === st}
                            onClick={() => handleUpdateOrderStatus(ord.id, st)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                              ord.order_status === st
                                ? 'bg-sky-500 text-white shadow-sm'
                                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-40'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: PAYMENT RECORDS */}
      {/* ========================================================================= */}
      {activeTab === 'PAYMENTS' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Payment Ledger</h3>
              <p className="text-xs text-slate-400">
                Audited payment receipts processed through Bank, Mobile Money, and Crypto rails.
              </p>
            </div>
            <button
              onClick={loadPayments}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <RefreshCw className={`w-4 h-4 ${loadingPayments ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {loadingPayments ? (
            <div className="py-16 text-center text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-purple-400" />
              <p className="text-xs font-mono">Reading payment gateway ledger...</p>
            </div>
          ) : payments.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
              <CreditCard className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-white">No payment transactions recorded</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
                  <tr>
                    <th className="py-3.5 px-4">Receipt ID</th>
                    <th className="py-3.5 px-4">Order Link</th>
                    <th className="py-3.5 px-4">Payment Rail</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {payments.map((pmt) => (
                    <tr key={pmt.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-sky-400">#{pmt.id}</td>
                      <td className="py-3 px-4 text-white">Order #{pmt.order_id}</td>
                      <td className="py-3 px-4 text-slate-300">{pmt.payment_method}</td>
                      <td className="py-3 px-4 font-bold text-emerald-400">
                        {formatCurrency(pmt.amount)}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-400 text-[11px]">
                        {formatDate(pmt.paid_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: AI ENTERPRISE STUDIO */}
      {/* ========================================================================= */}
      {activeTab === 'AI_STUDIO' && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>AI Enterprise Decision & Marketing Studio</span>
            </h3>
            <p className="text-xs text-slate-400">
              Ground executive decisions, marketing campaigns, and visual assets directly in your database records.
            </p>
          </div>

          {/* Sub-Agent Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                id: 'BI',
                title: 'Business Intelligence',
                desc: 'Operational metrics & margins',
                icon: TrendingUp,
              },
              {
                id: 'GROWTH',
                title: 'Growth Optimization',
                desc: 'Stock replenishment & scaling',
                icon: DollarSign,
              },
              {
                id: 'MARKETING',
                title: 'Marketing Content',
                desc: 'Social copy & email campaigns',
                icon: MessageSquare,
              },
              {
                id: 'IMAGE_STUDIO',
                title: 'Image Studio',
                desc: 'Visual brief & base64 preview',
                icon: ImageIcon,
              },
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
                      ? 'bg-gradient-to-tr from-sky-500/20 to-indigo-600/20 border-sky-400 text-white shadow-lg'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 text-sky-400 mb-2" />
                  <div className="font-bold text-xs text-white">{agent.title}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{agent.desc}</div>
                </button>
              );
            })}
          </div>

          {/* Agent Query Form */}
          <form
            onSubmit={handleRunAiAgent}
            className="p-5 rounded-2xl glass-panel space-y-4"
          >
            <div>
              <label className="text-xs font-bold text-white block mb-1">
                Prompt for {aiAgentType} Agent:
              </label>
              <textarea
                rows={3}
                required
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder={
                  aiAgentType === 'BI'
                    ? 'What are our top revenue generators and category margins this month?'
                    : aiAgentType === 'GROWTH'
                    ? 'Which electronics should we restock first based on customer order volume?'
                    : aiAgentType === 'MARKETING'
                    ? 'Write a high-converting promotional post for our flagship noise-cancelling headphones.'
                    : 'Generate a futuristic metropolitan hero render prompt for our flagship smartphone lineup.'
                }
                className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={aiLoading || !aiPrompt.trim()}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-sky-500/20 disabled:opacity-40"
              >
                {aiLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Executing Agent...</span>
                  </>
                ) : (
                  <>
                    <Bot className="w-4 h-4" />
                    <span>Run {aiAgentType} Agent</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Agent Results Output */}
          {aiResponse && (
            <div className="p-6 rounded-2xl glass-panel border border-sky-500/30 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-sky-400" />
                  <span className="font-bold text-sm text-white">
                    Agent Output: {aiResponse.agent}
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  Model: {aiResponse.model}
                </span>
              </div>

              <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                {aiResponse.answer}
              </div>

              {/* Data Summary Chips */}
              {aiResponse.data_summary && Object.keys(aiResponse.data_summary).length > 0 && (
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono">
                  <span className="text-slate-400 block mb-1 uppercase font-bold">
                    Database Grounding Telemetry:
                  </span>
                  <pre className="text-sky-300 overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(aiResponse.data_summary, null, 2)}
                  </pre>
                </div>
              )}

              {/* Rendered Base64 Image Preview (if image studio) */}
              {renderedImageBase64 && (
                <div className="pt-4 border-t border-slate-800">
                  <span className="text-xs font-bold text-white block mb-2">
                    Studio Rendered Product Image Preview:
                  </span>
                  <div className="rounded-xl overflow-hidden max-w-md border border-slate-700 bg-slate-950">
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
      {/* TAB 5: MULTICHANNEL SOCIAL PUBLISHER */}
      {/* ========================================================================= */}
      {activeTab === 'SOCIAL_HUB' && (
        <div className="space-y-8 animate-in fade-in">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Share2 className="w-5 h-5 text-pink-400" />
              <span>Multichannel Social Media & WhatsApp Hub</span>
            </h3>
            <p className="text-xs text-slate-400">
              Synchronize marketing campaigns across Facebook, Instagram, TikTok, and direct WhatsApp customer channels.
            </p>
          </div>

          {/* Platform Status Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {['facebook', 'instagram', 'tiktok', 'whatsapp'].map((platform) => {
              const active = platformStatus ? Boolean(platformStatus[platform]) : true;
              return (
                <div
                  key={platform}
                  className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-white capitalize">{platform}</span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        active ? 'bg-emerald-400' : 'bg-slate-400'
                      }`}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {active ? 'Integration Configured' : 'Missing Config'}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Multi-Platform Campaign Publisher */}
            <form
              onSubmit={handlePublishCampaign}
              className="p-6 rounded-2xl glass-panel space-y-4"
            >
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Share2 className="w-4 h-4 text-sky-400" />
                <span>Publish Cross-Channel Campaign</span>
              </h4>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1 uppercase font-mono">
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
                          ? 'bg-sky-500 text-white border-sky-400'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      {plat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1 uppercase font-mono">
                  Caption / Message Content *
                </label>
                <textarea
                  rows={3}
                  required
                  value={campaignCaption}
                  onChange={(e) => setCampaignCaption(e.target.value)}
                  placeholder="Announcing our seasonal electronics drops! Check out the catalogue..."
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1 uppercase font-mono">
                  Media Image / Video URL (Optional)
                </label>
                <input
                  type="url"
                  value={campaignImageUrl}
                  onChange={(e) => setCampaignImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              {/* Mandatory Approval Checkbox */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="campaign-approve-check"
                  checked={campaignApproved}
                  onChange={(e) => setCampaignApproved(e.target.checked)}
                  className="mt-0.5 rounded text-sky-500 focus:ring-sky-500"
                />
                <label htmlFor="campaign-approve-check" className="text-xs text-amber-200 cursor-pointer">
                  <span className="font-bold">Explicit Administrator Approval:</span> I confirm this campaign is approved for immediate outbound broadcast to external social platforms.
                </label>
              </div>

              <button
                type="submit"
                disabled={campaignSubmitting || !campaignApproved || campaignPlatforms.length === 0}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs disabled:opacity-40 transition-all flex items-center justify-center gap-2"
              >
                {campaignSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Broadcasting Campaign...</span>
                  </>
                ) : (
                  <span>Broadcast Campaign</span>
                )}
              </button>

              {campaignResult && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300">
                  <pre>{JSON.stringify(campaignResult, null, 2)}</pre>
                </div>
              )}
            </form>

            {/* Direct WhatsApp Messaging */}
            <form
              onSubmit={handleSendWhatsApp}
              className="p-6 rounded-2xl glass-panel space-y-4"
            >
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>Direct WhatsApp Customer Notification</span>
              </h4>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1 uppercase font-mono">
                  Recipient Phone Number (E.164 Format) *
                </label>
                <input
                  type="text"
                  required
                  value={waPhone}
                  onChange={(e) => setWaPhone(e.target.value)}
                  placeholder="+1234567890"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1 uppercase font-mono">
                  Message Body *
                </label>
                <textarea
                  rows={3}
                  required
                  value={waMessage}
                  onChange={(e) => setWaMessage(e.target.value)}
                  placeholder="Your order #123 has been dispatched and is out for delivery."
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Mandatory WhatsApp Approval */}
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="wa-approve-check"
                  checked={waApproved}
                  onChange={(e) => setWaApproved(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-500 focus:ring-emerald-500"
                />
                <label htmlFor="wa-approve-check" className="text-xs text-emerald-200 cursor-pointer">
                  <span className="font-bold">Approval Confirmation:</span> I authorize transmitting this message directly to the customer's WhatsApp line.
                </label>
              </div>

              <button
                type="submit"
                disabled={waSubmitting || !waApproved || !waPhone.trim()}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs disabled:opacity-40 transition-all flex items-center justify-center gap-2"
              >
                {waSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Transmitting...</span>
                  </>
                ) : (
                  <span>Send WhatsApp Message</span>
                )}
              </button>

              {waResult && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300">
                  <pre>{JSON.stringify(waResult, null, 2)}</pre>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PRODUCT CREATE / EDIT MODAL */}
      {/* ========================================================================= */}
      {productModalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl glass-dropdown border border-slate-700/80 p-6 sm:p-8 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">
              {productModalMode === 'CREATE' ? 'Add New Electronics Product' : 'Edit Product Item'}
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Enter hardware specs, pricing, and initial inventory stock.
            </p>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1 uppercase font-mono">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={pName}
                  onChange={(e) => setPName(e.target.value)}
                  placeholder="e.g. UltraVision 4K OLED Monitor 32-inch"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1 uppercase font-mono">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    min="0"
                    value={pPrice}
                    onChange={(e) => setPPrice(e.target.value)}
                    placeholder="699.99"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1 uppercase font-mono">
                    Initial Stock *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={pQuantity}
                    onChange={(e) => setPQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1 uppercase font-mono">
                  Image Banner URL
                </label>
                <input
                  type="url"
                  value={pBannerImage}
                  onChange={(e) => setPBannerImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1 uppercase font-mono">
                  Description & Technical Specs
                </label>
                <textarea
                  rows={3}
                  value={pDescription}
                  onChange={(e) => setPDescription(e.target.value)}
                  placeholder="Detailed specifications, warranty information, and connectivity ports."
                  className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1 uppercase font-mono">
                  Availability Status
                </label>
                <select
                  value={pStatus}
                  onChange={(e) => setPStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                >
                  <option value="AVAILABLE">AVAILABLE (In Stock)</option>
                  <option value="EMPTY">EMPTY (Out of Stock)</option>
                </select>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setProductModalMode(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={productSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow-md shadow-sky-500/20"
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

