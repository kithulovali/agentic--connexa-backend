import React, { useState } from 'react';
import {
  X,
  Layers,
  Sparkles,
  ExternalLink,
  Search,
  Code2,
  CheckCircle2,
  Sun,
  Moon,
  ShoppingBag,
  CreditCard,
  User,
  ShieldAlert,
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Share2,
  Bot,
  Sliders,
  DollarSign,
  TrendingUp,
  MessageSquare,
  ArrowRight,
  Plus,
  Minus,
} from 'lucide-react';

export interface UiInterfaceItem {
  id: string;
  number: string;
  name: string;
  category: 'Storefront' | 'Funnel' | 'AI' | 'Admin';
  component: string;
  endpoints: string[];
  description: string;
  actionType:
    | 'theme_dark'
    | 'theme_light'
    | 'scroll_catalog'
    | 'open_ai_recommend'
    | 'open_cart'
    | 'open_checkout'
    | 'open_auth'
    | 'open_ai_assistant'
    | 'admin_gate'
    | 'admin_overview'
    | 'admin_products'
    | 'admin_customers'
    | 'admin_orders'
    | 'admin_payments'
    | 'admin_ai_studio'
    | 'admin_platforms';
}

export const UI_INTERFACES: UiInterfaceItem[] = [
  {
    id: '01',
    number: '01',
    name: 'Storefront Home (Light Mode)',
    category: 'Storefront',
    component: 'src/components/storefront/HeroBanner.tsx',
    endpoints: ['GET /api/v1/products'],
    description: 'Hero split banner, gadget mosaic, 5 quick category cards, and 4 trust pillars.',
    actionType: 'theme_light',
  },
  {
    id: '02',
    number: '02',
    name: 'Storefront Home (Dark Mode)',
    category: 'Storefront',
    component: 'src/store/useThemeStore.ts',
    endpoints: ['Dynamic theme state (localStorage)'],
    description: 'High-contrast dark mode variant with brand Magenta (#E6007E) and Gold (#FFB800) accents.',
    actionType: 'theme_dark',
  },
  {
    id: '03',
    number: '03',
    name: 'Product Catalog Grid & Filters',
    category: 'Storefront',
    component: 'src/components/storefront/ProductGrid.tsx',
    endpoints: ['GET /api/v1/products?search=...'],
    description: 'Real-time keyword search, category filter pills, price range sliders, and stock badges.',
    actionType: 'scroll_catalog',
  },
  {
    id: '04',
    number: '04',
    name: 'AI Hardware Recommendation Modal',
    category: 'AI',
    component: 'src/components/storefront/AiRecommendationModal.tsx',
    endpoints: ['POST /api/v1/ai/recommend'],
    description: 'Natural language advisor querying live inventory with max budget and category constraints.',
    actionType: 'open_ai_recommend',
  },
  {
    id: '05',
    number: '05',
    name: 'Slide-Over Cart Drawer',
    category: 'Funnel',
    component: 'src/components/storefront/CartDrawer.tsx',
    endpoints: ['GET /api/v1/products (cross-sells)'],
    description: 'Slide-over drawer with item increment/decrement, live stock check, and catalog cross-sells.',
    actionType: 'open_cart',
  },
  {
    id: '06',
    number: '06',
    name: 'Multi-Rail Checkout & Payment Modal',
    category: 'Funnel',
    component: 'src/components/storefront/CheckoutModal.tsx',
    endpoints: ['POST /api/v1/orders', 'POST /api/v1/payments/pay'],
    description: '2-step checkout wizard with shipping form and 3 rails: Mobile Money, Bank, and Crypto.',
    actionType: 'open_checkout',
  },
  {
    id: '07',
    number: '07',
    name: 'Customer & Admin Authentication Modal',
    category: 'Funnel',
    component: 'src/components/auth/AuthModal.tsx',
    endpoints: ['POST /api/v1/auth/login', 'POST /api/v1/auth/register'],
    description: 'Dual-tab sign-in and registration dialog with role-based JWT token persistence.',
    actionType: 'open_auth',
  },
  {
    id: '08',
    number: '08',
    name: 'Floating AI Shopping Assistant',
    category: 'AI',
    component: 'src/components/storefront/AiShoppingAssistant.tsx',
    endpoints: ['POST /api/v1/ai/agents/customer-shopping-assistant'],
    description: 'Autonomous hardware consultation chat drawer with quick prompts and inline add-to-cart cards.',
    actionType: 'open_ai_assistant',
  },
  {
    id: '09',
    number: '09',
    name: 'Admin Authentication Security Gate',
    category: 'Admin',
    component: 'src/components/admin/AdminDashboard.tsx',
    endpoints: ['Client auth guard & role verification'],
    description: 'Security gate preventing unauthorized access to operations, analytics, and admin tools.',
    actionType: 'admin_gate',
  },
  {
    id: '10',
    number: '10',
    name: 'Admin Dashboard: Overview',
    category: 'Admin',
    component: 'src/components/admin/AdminDashboard.tsx (OVERVIEW)',
    endpoints: ['GET /api/v1/orders', 'GET /api/v1/products', 'GET /api/v1/payments'],
    description: 'Executive KPIs, dual-curve SVG sales chart (Revenue vs Orders), top products, and CSV export.',
    actionType: 'admin_overview',
  },
  {
    id: '11',
    number: '11',
    name: 'Admin Dashboard: Products Inventory',
    category: 'Admin',
    component: 'src/components/admin/AdminDashboard.tsx (PRODUCTS)',
    endpoints: ['GET/POST/PUT/DELETE /api/v1/products'],
    description: 'Full CRUD inventory console with Add/Edit modal, stock status toggles, and live price updates.',
    actionType: 'admin_products',
  },
  {
    id: '12',
    number: '12',
    name: 'Admin Dashboard: Customers Management',
    category: 'Admin',
    component: 'src/components/admin/AdminDashboard.tsx (CUSTOMERS)',
    endpoints: ['GET/PUT/DELETE /api/v1/users'],
    description: 'User roster, public IDs, assigned roles (admin/customer), account status toggles, deletion.',
    actionType: 'admin_customers',
  },
  {
    id: '13',
    number: '13',
    name: 'Admin Dashboard: Orders Fulfillment',
    category: 'Admin',
    component: 'src/components/admin/AdminDashboard.tsx (ORDERS)',
    endpoints: ['GET /api/v1/orders', 'PATCH /api/v1/orders/{id}/status'],
    description: 'Order pipeline with customer delivery details and 1-click status progression.',
    actionType: 'admin_orders',
  },
  {
    id: '14',
    number: '14',
    name: 'Admin Dashboard: Multi-Rail Payments',
    category: 'Admin',
    component: 'src/components/admin/AdminDashboard.tsx (PAYMENTS)',
    endpoints: ['GET /api/v1/payments'],
    description: 'Financial ledger displaying settled transactions, amounts, rails (MoMo, Bank, Crypto), timestamps.',
    actionType: 'admin_payments',
  },
  {
    id: '15',
    number: '15',
    name: 'Admin Dashboard: AI Enterprise Studio',
    category: 'Admin',
    component: 'src/components/admin/AdminDashboard.tsx (AI_STUDIO)',
    endpoints: ['POST /api/v1/ai/agents/*'],
    description: 'Autonomous business agents: BI, Growth Optimization, Marketing Copywriter, and Image Studio.',
    actionType: 'admin_ai_studio',
  },
  {
    id: '16',
    number: '16',
    name: 'Admin Dashboard: Multichannel Hub',
    category: 'Admin',
    component: 'src/components/admin/AdminDashboard.tsx (PLATFORM_PARTNER)',
    endpoints: ['GET /api/v1/platforms/status', 'POST /api/v1/platforms/*'],
    description: 'Omnichannel social broadcast (Facebook, Instagram, TikTok) and direct WhatsApp Business API.',
    actionType: 'admin_platforms',
  },
];

// =========================================================================
// 100% PURE CODE VISUAL PREVIEWS (ZERO PNG SCREENSHOT DEPENDENCY)
// =========================================================================
const CodeInterfaceVisual: React.FC<{ id: string }> = ({ id }) => {
  switch (id) {
    case '01': // Storefront Light
      return (
        <div className="w-full h-full bg-slate-50 p-3 text-slate-800 rounded-lg flex flex-col justify-between border border-slate-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-[10px]">
            <span className="font-extrabold text-brand-600">URBAN SCENERY</span>
            <div className="flex gap-1.5 text-[9px] text-slate-500">
              <span className="px-1.5 py-0.5 rounded bg-brand-50 text-brand-600 font-bold">Gadgets</span>
              <span>Audio</span>
              <span>Wearables</span>
            </div>
            <Sun className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="grid grid-cols-2 gap-2 my-1 items-center">
            <div className="space-y-1">
              <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-brand-100 text-brand-600">Discover</span>
              <div className="text-[11px] font-black leading-tight text-slate-900">Latest Tech Gadgets</div>
              <div className="text-[8px] text-slate-500">Cutting-edge electronics & verified warranties.</div>
            </div>
            <div className="grid grid-cols-2 gap-1 p-1 bg-white rounded-lg border border-slate-200 shadow-sm">
              <div className="bg-slate-100 rounded p-1 text-center text-[7px] font-bold">Audio ANC</div>
              <div className="bg-slate-100 rounded p-1 text-center text-[7px] font-bold">Watch Pro</div>
              <div className="bg-slate-100 rounded p-1 text-center text-[7px] font-bold">5G OLED</div>
              <div className="bg-slate-100 rounded p-1 text-center text-[7px] font-bold">Dock 30W</div>
            </div>
          </div>
          <div className="flex justify-between items-center text-[8px] pt-1 border-t border-slate-200 text-slate-500 font-mono">
            <span>Rails: Bank • MoMo • Crypto</span>
            <span className="text-emerald-600 font-bold">FastAPI Connected</span>
          </div>
        </div>
      );

    case '02': // Storefront Dark
      return (
        <div className="w-full h-full bg-slate-950 p-3 text-slate-100 rounded-lg flex flex-col justify-between border border-brand-500/30 shadow-inner">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[10px]">
            <span className="font-extrabold text-brand-400">URBAN SCENERY</span>
            <div className="flex gap-1.5 text-[9px] text-slate-400">
              <span className="px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-400 font-bold">Dark UI</span>
              <span>Audio</span>
              <span>Wearables</span>
            </div>
            <Moon className="w-3.5 h-3.5 text-brand-400" />
          </div>
          <div className="grid grid-cols-2 gap-2 my-1 items-center">
            <div className="space-y-1">
              <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300">Dark Mode</span>
              <div className="text-[11px] font-black leading-tight text-white">Latest Tech Gadgets</div>
              <div className="text-[8px] text-slate-400">Neon Purple & Gold Ambient Glass Aesthetics.</div>
            </div>
            <div className="grid grid-cols-2 gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800 shadow-md">
              <div className="bg-slate-800 rounded p-1 text-center text-[7px] font-bold text-brand-300">ANC Studio</div>
              <div className="bg-slate-800 rounded p-1 text-center text-[7px] font-bold text-accent-300">Elite Watch</div>
              <div className="bg-slate-800 rounded p-1 text-center text-[7px] font-bold text-blue-300">5G OLED</div>
              <div className="bg-slate-800 rounded p-1 text-center text-[7px] font-bold text-emerald-300">30W Dock</div>
            </div>
          </div>
          <div className="flex justify-between items-center text-[8px] pt-1 border-t border-slate-800 text-slate-400 font-mono">
            <span>Tailwind Dark Active</span>
            <span className="text-brand-400 font-bold">Brand: #E6007E</span>
          </div>
        </div>
      );

    case '03': // Catalog Grid
      return (
        <div className="w-full h-full bg-slate-900 p-3 text-slate-200 rounded-lg flex flex-col justify-between border border-slate-800">
          <div className="flex items-center justify-between gap-1 text-[9px] pb-1 border-b border-slate-800">
            <div className="flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded text-slate-400">
              <Search className="w-2.5 h-2.5" />
              <span>Search products...</span>
            </div>
            <span className="px-1.5 py-0.5 bg-brand-500/20 text-brand-300 rounded font-mono text-[8px]">In Stock</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 my-1.5">
            {[
              { name: 'Sony WH-1000XM5', price: '$399' },
              { name: 'MacBook Pro M3', price: '$2,499' },
              { name: 'Samsung S24 Ultra', price: '$1,199' },
            ].map((p, i) => (
              <div key={i} className="bg-slate-800/80 p-1.5 rounded-lg border border-slate-700/60 flex flex-col justify-between">
                <div className="w-full h-7 bg-slate-700/50 rounded mb-1 flex items-center justify-center text-[7px] text-slate-400 font-mono">
                  Hardware
                </div>
                <div className="text-[8px] font-bold truncate text-white">{p.name}</div>
                <div className="text-[8px] font-mono text-brand-400 font-bold">{p.price}</div>
              </div>
            ))}
          </div>
          <div className="text-[8px] text-slate-400 flex justify-between font-mono">
            <span>Filters: Price, Status, Category</span>
            <span>GET /api/v1/products</span>
          </div>
        </div>
      );

    case '04': // AI Recommend Modal
      return (
        <div className="w-full h-full bg-slate-900 p-3 text-slate-200 rounded-lg flex flex-col justify-between border border-brand-500/40">
          <div className="flex items-center gap-1.5 pb-1 border-b border-slate-800 text-[10px] font-bold text-white">
            <Sparkles className="w-3.5 h-3.5 text-accent-400" />
            <span>AI Hardware Recommendation Engine</span>
          </div>
          <div className="space-y-1.5 my-1">
            <div className="bg-slate-800 p-1.5 rounded text-[8px] text-slate-300 font-mono">
              Query: "Noise cancelling headphones under $400"
            </div>
            <div className="bg-brand-500/10 p-1.5 rounded border border-brand-500/30 text-[8px] text-brand-200">
              <span className="font-bold">Agent Advice:</span> Based on live inventory, Sony WH-1000XM5 offers 30hr battery and industry-leading ANC.
            </div>
          </div>
          <div className="flex items-center justify-between text-[8px] font-mono pt-1 border-t border-slate-800 text-slate-400">
            <span>POST /api/v1/ai/recommend</span>
            <span className="px-2 py-0.5 rounded bg-brand-500 text-white font-bold">1-Click Add</span>
          </div>
        </div>
      );

    case '05': // Cart Drawer
      return (
        <div className="w-full h-full bg-slate-900 p-3 text-slate-200 rounded-lg flex flex-col justify-between border border-slate-800">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800 text-[10px] font-bold text-white">
            <div className="flex items-center gap-1">
              <ShoppingBag className="w-3 h-3 text-brand-400" />
              <span>My Cart (2 items)</span>
            </div>
            <span className="text-[8px] text-emerald-400 font-mono">Inventory Locked</span>
          </div>
          <div className="space-y-1 my-1">
            <div className="flex justify-between items-center p-1 bg-slate-800 rounded text-[8px]">
              <div>
                <div className="font-bold text-white">Sony WH-1000XM5</div>
                <div className="text-slate-400 font-mono">Qty: 1 × $399.99</div>
              </div>
              <span className="font-mono font-bold text-brand-400">$399.99</span>
            </div>
            <div className="text-[8px] text-slate-400 p-1 border-t border-slate-800/60 flex justify-between">
              <span>Subtotal:</span>
              <span className="font-bold font-mono text-white">$399.99</span>
            </div>
          </div>
          <div className="flex justify-between items-center text-[8px] pt-1 border-t border-slate-800">
            <span className="text-slate-400 font-mono">Standard Free Delivery</span>
            <span className="px-2 py-0.5 rounded bg-gradient-to-r from-brand-600 to-accent-500 text-white font-bold">Checkout</span>
          </div>
        </div>
      );

    case '06': // Checkout Modal
      return (
        <div className="w-full h-full bg-slate-900 p-3 text-slate-200 rounded-lg flex flex-col justify-between border border-slate-800">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800 text-[10px] font-bold text-white">
            <div className="flex items-center gap-1">
              <CreditCard className="w-3 h-3 text-accent-400" />
              <span>Multi-Rail Checkout Wizard</span>
            </div>
            <span className="text-[8px] font-mono text-brand-400">Order #8921</span>
          </div>
          <div className="space-y-1 my-1">
            <div className="grid grid-cols-3 gap-1">
              <div className="p-1 rounded bg-slate-800 text-center text-[7px] font-bold text-brand-300 border border-brand-500/30">Mobile Money</div>
              <div className="p-1 rounded bg-slate-800 text-center text-[7px] font-bold text-blue-300 border border-slate-700">Bank Transfer</div>
              <div className="p-1 rounded bg-slate-800 text-center text-[7px] font-bold text-amber-300 border border-slate-700">Crypto Rail</div>
            </div>
            <div className="text-[8px] text-slate-400 bg-slate-800/60 p-1 rounded">
              Address: 45 Tech Avenue • Tel: +256 700 000 000
            </div>
          </div>
          <div className="flex justify-between items-center text-[8px] pt-1 border-t border-slate-800 text-slate-400 font-mono">
            <span>POST /api/v1/orders + /payments/pay</span>
            <span className="text-emerald-400 font-bold">Authorize & Pay</span>
          </div>
        </div>
      );

    case '07': // Auth Modal
      return (
        <div className="w-full h-full bg-slate-900 p-3 text-slate-200 rounded-lg flex flex-col justify-between border border-slate-800">
          <div className="flex items-center justify-center gap-2 pb-1 border-b border-slate-800 text-[10px] font-bold text-white">
            <span className="text-brand-400 border-b-2 border-brand-500 pb-0.5">Sign In</span>
            <span className="text-slate-500">Register</span>
          </div>
          <div className="space-y-1.5 my-1">
            <div className="p-1 rounded bg-slate-800 text-[8px] text-slate-400 font-mono">email: user@urbanscenery.com</div>
            <div className="p-1 rounded bg-slate-800 text-[8px] text-slate-400 font-mono">password: ••••••••••••</div>
            <div className="w-full py-1 rounded bg-brand-500 text-white text-center text-[8px] font-bold">
              Sign In to Urban Scenery
            </div>
          </div>
          <div className="text-[8px] text-slate-400 text-center font-mono">
            JWT Access Token Stored in useAuthStore
          </div>
        </div>
      );

    case '08': // AI Assistant
      return (
        <div className="w-full h-full bg-slate-900 p-3 text-slate-200 rounded-lg flex flex-col justify-between border border-brand-500/40">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800 text-[10px] font-bold text-white">
            <div className="flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-brand-400" />
              <span>AI Shopping Assistant</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="space-y-1 my-1">
            <div className="p-1 rounded bg-slate-800 text-[8px] text-slate-300">
              User: "What's the best noise cancelling headphone?"
            </div>
            <div className="p-1 rounded bg-brand-500/10 text-[8px] text-brand-200 border border-brand-500/30">
              Assistant: "Sony WH-1000XM5 ($399) is in stock with 30hr battery."
            </div>
          </div>
          <div className="flex justify-between items-center text-[8px] font-mono text-slate-400 pt-1 border-t border-slate-800">
            <span>POST /ai/agents/customer-shopping-assistant</span>
            <span className="text-accent-400">Floating Widget</span>
          </div>
        </div>
      );

    case '09': // Admin Auth Gate
      return (
        <div className="w-full h-full bg-slate-900 p-3 text-slate-200 rounded-lg flex flex-col items-center justify-center text-center border border-slate-800">
          <ShieldAlert className="w-6 h-6 text-brand-500 mb-1" />
          <div className="text-[11px] font-bold text-white mb-0.5">Merchant Hub Security Gate</div>
          <div className="text-[8px] text-slate-400 max-w-[200px] mb-2">
            Administrator authentication required to access executive controls.
          </div>
          <div className="flex gap-2">
            <span className="px-2 py-0.5 rounded bg-slate-800 text-[8px] text-slate-300">Back to Store</span>
            <span className="px-2 py-0.5 rounded bg-brand-500 text-[8px] text-white font-bold">Sign In</span>
          </div>
        </div>
      );

    case '10': // Admin Overview
      return (
        <div className="w-full h-full bg-slate-900 p-3 text-slate-200 rounded-lg flex flex-col justify-between border border-slate-800">
          <div className="grid grid-cols-3 gap-1 mb-1">
            <div className="p-1 rounded bg-gradient-to-r from-brand-600 to-purple-600 text-white text-[7px]">
              <div>Avg Order Value</div>
              <div className="text-[9px] font-bold font-mono">$399.00</div>
            </div>
            <div className="p-1 rounded bg-slate-800 text-[7px]">
              <div className="text-slate-400">Total Orders</div>
              <div className="text-[9px] font-bold font-mono text-white">48 Orders</div>
            </div>
            <div className="p-1 rounded bg-slate-800 text-[7px]">
              <div className="text-slate-400">Settled Revenue</div>
              <div className="text-[9px] font-bold font-mono text-white">$19,152</div>
            </div>
          </div>
          {/* Dual-Curve SVG Chart */}
          <div className="w-full h-10 bg-slate-800/60 rounded flex items-end p-1">
            <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
              <path d="M0,25 Q25,5 50,20 T100,8" fill="none" stroke="#E6007E" strokeWidth="2" />
              <path d="M0,20 Q25,18 50,10 T100,15" fill="none" stroke="#0EA5E9" strokeWidth="2" strokeDasharray="2 2" />
            </svg>
          </div>
          <div className="text-[8px] text-slate-400 flex justify-between font-mono pt-1">
            <span>Dual Curve: Revenue & Orders</span>
            <span className="text-brand-400">CSV Export Active</span>
          </div>
        </div>
      );

    case '11': // Admin Products
      return (
        <div className="w-full h-full bg-slate-900 p-3 text-slate-200 rounded-lg flex flex-col justify-between border border-slate-800">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800 text-[10px] font-bold text-white">
            <span>Product Inventory (CRUD)</span>
            <span className="px-1.5 py-0.5 rounded bg-brand-500 text-white text-[8px] font-bold">+ Add Product</span>
          </div>
          <div className="space-y-1 my-1 text-[8px]">
            <div className="flex justify-between items-center bg-slate-800 p-1 rounded">
              <span className="text-white font-bold">Sony WH-1000XM5</span>
              <span className="text-emerald-400 font-mono">Available (30)</span>
              <span className="font-mono text-brand-400">$399.99</span>
            </div>
            <div className="flex justify-between items-center bg-slate-800 p-1 rounded">
              <span className="text-white font-bold">MacBook Pro 16 M3</span>
              <span className="text-emerald-400 font-mono">Available (12)</span>
              <span className="font-mono text-brand-400">$2,499.00</span>
            </div>
          </div>
          <div className="text-[8px] text-slate-400 flex justify-between font-mono pt-1 border-t border-slate-800">
            <span>GET/POST/PUT/DELETE /products</span>
            <span className="text-emerald-400">Stock Toggles</span>
          </div>
        </div>
      );

    case '12': // Admin Customers
      return (
        <div className="w-full h-full bg-slate-900 p-3 text-slate-200 rounded-lg flex flex-col justify-between border border-slate-800">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800 text-[10px] font-bold text-white">
            <span>Registered Customers Directory</span>
            <span className="text-[8px] font-mono text-slate-400">GET /api/v1/users</span>
          </div>
          <div className="space-y-1 my-1 text-[8px]">
            <div className="flex justify-between items-center bg-slate-800 p-1 rounded">
              <div>
                <div className="text-white font-bold">Joel Mapendo</div>
                <div className="text-slate-400 font-mono">usr_admin_001</div>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 font-bold uppercase text-[7px]">Admin</span>
            </div>
            <div className="flex justify-between items-center bg-slate-800 p-1 rounded">
              <div>
                <div className="text-white font-bold">Customer Client</div>
                <div className="text-slate-400 font-mono">usr_cust_042</div>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-slate-700 text-slate-300 font-bold uppercase text-[7px]">Customer</span>
            </div>
          </div>
          <div className="text-[8px] text-slate-400 font-mono pt-1 border-t border-slate-800">
            Role elevation & account deletion controls
          </div>
        </div>
      );

    case '13': // Admin Orders
      return (
        <div className="w-full h-full bg-slate-900 p-3 text-slate-200 rounded-lg flex flex-col justify-between border border-slate-800">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800 text-[10px] font-bold text-white">
            <span>Order Fulfillment Pipeline</span>
            <span className="text-[8px] font-mono text-amber-400">Processing</span>
          </div>
          <div className="p-1.5 bg-slate-800 rounded space-y-1 text-[8px] my-1">
            <div className="flex justify-between font-bold text-white">
              <span>Order #8921 • Sony WH-1000XM5</span>
              <span className="font-mono text-brand-400">$399.99</span>
            </div>
            <div className="text-slate-400 font-mono">Tel: +256 700 000 000 • Mobile Money</div>
            <div className="flex gap-1 pt-0.5">
              <span className="px-1.5 py-0.5 rounded bg-brand-500 text-white font-bold text-[7px]">Process</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white font-bold text-[7px]">Deliver</span>
            </div>
          </div>
          <div className="text-[8px] text-slate-400 font-mono flex justify-between pt-1 border-t border-slate-800">
            <span>PATCH /orders/{'{id}'}/status</span>
            <span className="text-emerald-400">Normalized Contact</span>
          </div>
        </div>
      );

    case '14': // Admin Payments
      return (
        <div className="w-full h-full bg-slate-900 p-3 text-slate-200 rounded-lg flex flex-col justify-between border border-slate-800">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800 text-[10px] font-bold text-white">
            <span>Multi-Rail Payments Audit</span>
            <span className="text-[8px] font-mono text-emerald-400">100% Settled</span>
          </div>
          <div className="space-y-1 my-1 text-[8px]">
            <div className="flex justify-between items-center bg-slate-800 p-1 rounded font-mono">
              <span className="text-slate-300">TX #1042 • Order #8921</span>
              <span className="text-brand-300 font-bold">Mobile Money</span>
              <span className="text-white font-bold">$399.99</span>
            </div>
            <div className="flex justify-between items-center bg-slate-800 p-1 rounded font-mono">
              <span className="text-slate-300">TX #1041 • Order #8920</span>
              <span className="text-blue-300 font-bold">Bank Transfer</span>
              <span className="text-white font-bold">$2,499.00</span>
            </div>
          </div>
          <div className="text-[8px] text-slate-400 font-mono flex justify-between pt-1 border-t border-slate-800">
            <span>GET /api/v1/payments</span>
            <span className="text-amber-400">Crypto Rails Ready</span>
          </div>
        </div>
      );

    case '15': // Admin AI Studio
      return (
        <div className="w-full h-full bg-slate-900 p-3 text-slate-200 rounded-lg flex flex-col justify-between border border-brand-500/40">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800 text-[10px] font-bold text-white">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-accent-400" />
              <span>AI Enterprise Studio</span>
            </span>
            <span className="text-[8px] font-mono text-brand-300">4 Active Agents</span>
          </div>
          <div className="space-y-1 my-1">
            <div className="grid grid-cols-4 gap-1 text-[7px] text-center font-bold">
              <div className="p-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/40">BI Agent</div>
              <div className="p-0.5 rounded bg-slate-800 text-slate-400">Growth</div>
              <div className="p-0.5 rounded bg-slate-800 text-slate-400">Marketing</div>
              <div className="p-0.5 rounded bg-slate-800 text-slate-400">Renderer</div>
            </div>
            <div className="p-1 rounded bg-slate-800/80 text-[7px] text-slate-300 font-mono">
              BI Result: Gross margins on audio hardware +28% MoM.
            </div>
          </div>
          <div className="text-[8px] text-slate-400 font-mono flex justify-between pt-1 border-t border-slate-800">
            <span>POST /ai/agents/business-intelligence</span>
            <span className="text-brand-400 font-bold">Run Agent</span>
          </div>
        </div>
      );

    case '16': // Admin Platforms
      return (
        <div className="w-full h-full bg-slate-900 p-3 text-slate-200 rounded-lg flex flex-col justify-between border border-slate-800">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800 text-[10px] font-bold text-white">
            <span className="flex items-center gap-1">
              <Share2 className="w-3 h-3 text-accent-400" />
              <span>Multichannel Social & WhatsApp</span>
            </span>
            <span className="text-[8px] font-mono text-emerald-400">Connected</span>
          </div>
          <div className="space-y-1 my-1 text-[8px]">
            <div className="grid grid-cols-4 gap-1 text-center font-bold text-[7px]">
              <span className="p-0.5 rounded bg-blue-900/50 text-blue-300">Facebook</span>
              <span className="p-0.5 rounded bg-pink-900/50 text-pink-300">Instagram</span>
              <span className="p-0.5 rounded bg-slate-800 text-slate-300">TikTok</span>
              <span className="p-0.5 rounded bg-emerald-900/50 text-emerald-300">WhatsApp</span>
            </div>
            <div className="p-1 rounded bg-slate-800 text-slate-300 text-[7px]">
              Broadcast: "Flash restock on Sony XM5 with instant mobile money payment."
            </div>
          </div>
          <div className="text-[8px] text-slate-400 font-mono flex justify-between pt-1 border-t border-slate-800">
            <span>POST /platforms/campaign/publish</span>
            <span className="text-emerald-400">approved: true</span>
          </div>
        </div>
      );

    default:
      return null;
  }
};

interface UiShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerAction: (actionType: UiInterfaceItem['actionType']) => void;
}

export const UiShowcaseModal: React.FC<UiShowcaseModalProps> = ({
  isOpen,
  onClose,
  onTriggerAction,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectCodeItem, setInspectCodeItem] = useState<UiInterfaceItem | null>(null);

  if (!isOpen) return null;

  const categories = ['All', 'Storefront', 'Funnel', 'AI', 'Admin'];

  const filteredInterfaces = UI_INTERFACES.filter((item) => {
    const matchesCat = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.component.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.endpoints.some((e) => e.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/70 dark:bg-slate-950/85 backdrop-blur-md transition-opacity"
      />

      <div className="min-h-full flex items-center justify-center p-3 sm:p-6">
        <div className="relative w-full max-w-5xl bg-white dark:bg-urban-dark border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
          {/* Top Brand Stripe */}
          <div className="h-1.5 bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500 flex-shrink-0" />

          {/* Modal Header */}
          <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 flex-shrink-0 bg-slate-50/80 dark:bg-slate-900/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-500 to-accent-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white font-heading">
                    UI & UX Code Blueprint (16 Interfaces)
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 text-[10px] font-bold font-mono">
                    100% Code-Driven
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Every interface rendered dynamically in pure React & Tailwind CSS. Click "Launch Live" to test any view.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Bar & Search */}
          <div className="p-4 sm:px-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-urban-dark flex-shrink-0">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeCategory === cat
                      ? 'bg-brand-500 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {cat === 'All' ? 'All (16)' : cat}
                </button>
              ))}
            </div>

            <div className="relative min-w-[200px] sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search interfaces or endpoints..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Scrollable Interfaces Grid */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredInterfaces.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 flex flex-col justify-between hover:border-brand-500/40 transition-all hover:shadow-lg group"
                >
                  <div>
                    {/* Pure-Code Visual Mockup Preview */}
                    <div className="w-full h-44 rounded-xl overflow-hidden mb-3 border border-slate-200 dark:border-slate-800 shadow-sm relative">
                      <CodeInterfaceVisual id={item.id} />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-slate-900/90 text-white font-mono font-bold text-[10px] backdrop-blur-sm border border-slate-700">
                        #{item.number}
                      </span>
                    </div>

                    {/* Title & Category Badge */}
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug">
                        {item.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex-shrink-0">
                        {item.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Component Source File */}
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-600 dark:text-slate-400 mb-2 bg-slate-50 dark:bg-slate-950/80 p-1.5 rounded-lg border border-slate-100 dark:border-slate-800/80">
                      <Code2 className="w-3.5 h-3.5 text-brand-500 flex-shrink-0" />
                      <span className="truncate">{item.component}</span>
                    </div>

                    {/* Backend Endpoints */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.endpoints.map((ep, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-300 text-[10px] font-mono font-semibold"
                        >
                          {ep}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setInspectCodeItem(item)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>Component Spec</span>
                    </button>

                    <button
                      onClick={() => {
                        onClose();
                        onTriggerAction(item.actionType);
                      }}
                      className="px-4 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all flex items-center gap-1.5 hover:scale-102"
                    >
                      <span>Launch Live</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Component Spec Drawer */}
      {inspectCodeItem && (
        <div
          onClick={() => setInspectCodeItem(null)}
          className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-xl w-full bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-brand-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  #{inspectCodeItem.number} {inspectCodeItem.name} Spec
                </h3>
              </div>
              <button
                onClick={() => setInspectCodeItem(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 font-mono">Source Component:</span>
                <p className="font-mono font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-950 p-2 rounded mt-1">
                  {inspectCodeItem.component}
                </p>
              </div>

              <div>
                <span className="text-slate-400 font-mono">Backend Endpoints Grounded:</span>
                <div className="space-y-1 mt-1">
                  {inspectCodeItem.endpoints.map((ep, i) => (
                    <div key={i} className="font-mono text-brand-600 dark:text-brand-300 bg-brand-50 dark:bg-brand-500/10 p-1.5 rounded">
                      {ep}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-mono">Description:</span>
                <p className="text-slate-600 dark:text-slate-300 mt-1">
                  {inspectCodeItem.description}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  const action = inspectCodeItem.actionType;
                  setInspectCodeItem(null);
                  onClose();
                  onTriggerAction(action);
                }}
                className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-brand-500/20"
              >
                <span>Launch this Interface Live</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
