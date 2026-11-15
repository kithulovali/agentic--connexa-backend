# Urban Scenery Ventures — Modern Frontend & AI Platform

A modern, high-performance **React 18 + TypeScript + Vite + Tailwind CSS** application built for **Urban Scenery Ventures** — an AI-powered electronics e-commerce platform and merchant hub.

Directly integrated with the live **Agentic Connexa Backend**:  
`https://agentic-connexa-backend.onrender.com` (OpenAPI Spec: `/openapi.json`)

---

## 🎨 16 Interfaces & Visual Code Blueprints

All 16 interfaces are implemented in **100% pure React + Tailwind CSS code** (zero static image bloat). Developers and users can inspect and test all 16 interfaces live inside the app by clicking **"UI Showcase (16 Interfaces)"** in the top navigation header or footer.

| # | Interface Name | Code Component | Verified Backend Endpoints |
|---|---|---|---|
| **01** | **Storefront Home (Light)** | `src/components/storefront/HeroBanner.tsx` | `GET /api/v1/products` |
| **02** | **Storefront Home (Dark)** | `src/store/useThemeStore.ts` | Theme state (localStorage) |
| **03** | **Product Catalog Grid** | `src/components/storefront/ProductGrid.tsx` | `GET /api/v1/products?search=...` |
| **04** | **AI Hardware Recommend Modal** | `src/components/storefront/AiRecommendationModal.tsx` | `POST /api/v1/ai/recommend` |
| **05** | **Slide-Over Cart Drawer** | `src/components/storefront/CartDrawer.tsx` | `GET /api/v1/products` (cross-sells) |
| **06** | **Multi-Rail Checkout Modal** | `src/components/storefront/CheckoutModal.tsx` | `POST /api/v1/orders`, `POST /api/v1/payments/pay` |
| **07** | **Authentication Modal** | `src/components/auth/AuthModal.tsx` | `POST /api/v1/auth/login`, `POST /api/v1/auth/register` |
| **08** | **AI Shopping Assistant** | `src/components/storefront/AiShoppingAssistant.tsx` | `POST /api/v1/ai/agents/customer-shopping-assistant` |
| **09** | **Admin Authentication Gate** | `src/components/admin/AdminDashboard.tsx` | Client auth guard & role verification |
| **10** | **Admin Overview Dashboard** | `src/components/admin/AdminDashboard.tsx` (OVERVIEW) | `GET /orders`, `GET /products`, `GET /payments` |
| **11** | **Admin Products Inventory** | `src/components/admin/AdminDashboard.tsx` (PRODUCTS) | `GET/POST/PUT/DELETE /api/v1/products` |
| **12** | **Admin Customers Roster** | `src/components/admin/AdminDashboard.tsx` (CUSTOMERS) | `GET/PUT/DELETE /api/v1/users` |
| **13** | **Admin Orders Fulfillment** | `src/components/admin/AdminDashboard.tsx` (ORDERS) | `GET /orders`, `PATCH /orders/{id}/status` |
| **14** | **Admin Payments Audit Ledger** | `src/components/admin/AdminDashboard.tsx` (PAYMENTS) | `GET /api/v1/payments` |
| **15** | **Admin AI Enterprise Studio** | `src/components/admin/AdminDashboard.tsx` (AI_STUDIO) | `POST /api/v1/ai/agents/*` |
| **16** | **Admin Multichannel & Social Hub**| `src/components/admin/AdminDashboard.tsx` (PLATFORM) | `GET /platforms/status`, `POST /platforms/*` |

---

## 🚀 Key Features

### 1. Storefront & Purchase Experience
- **Dynamic Catalogue Grid:** Real-time stock counts, price formatting, stock status indicators, and responsive card layouts.
- **AI Smart Search:** Natural language search leveraging semantic embeddings (`GET /api/v1/ai/smart-search?q=...`).
- **Hardware Advisor:** Dedicated AI advisor modal powered by `POST /api/v1/ai/recommend` matching queries, budgets, and categories.
- **Slide-Over Cart Drawer:** Live inventory locking, quantity increments/decrements, subtotal calculation, and live dynamic cross-sells.
- **Multi-Rail Checkout:** Multi-rail payment processing across:
  - Mobile Money
  - Bank Transfer
  - Crypto

### 2. Autonomous AI Shopping Assistant
- **Floating Interactive Widget:** Bottom-right expandable drawer providing hardware recommendations grounded strictly in database inventory.
- **Direct Add-to-Cart:** One-click cart insertion for recommended items directly inside chat cards.

### 3. Merchant & AI Operations Console
- **Sales Analytics:** Live dual-curve SVG chart (Revenue vs Orders), 3 executive KPI cards, and CSV export.
- **Inventory CRUD:** Create, read, update, and delete hardware products with real-time stock toggles.
- **Customer Management:** Account roster, roles, verified credentials, and user deletion.
- **Order Pipeline:** Contact normalization, address inspection, and 1-click status progression (`PROCESSING`, `DELIVERED`).
- **Payments Ledger:** Comprehensive transaction audit across all supported payment rails.
- **Enterprise AI Studio:** Business Intelligence (BI), Growth Optimization, Marketing Copywriter, and Image Studio / Renderer.
- **Multichannel Hub:** Health monitor for Facebook, Instagram, TikTok, and WhatsApp Business API messaging.

---

## 🛠️ Project Structure

```
FrontEnd/
├── public/                 # Brand logos and favicons
│   └── urban-scenery-logo.png
├── src/
│   ├── components/
│   │   ├── admin/          # AdminDashboard (Overview, Products, Customers, Orders, Payments, AI, Platforms)
│   │   ├── auth/           # AuthModal (Sign In & Register)
│   │   ├── common/         # Header, Footer, UiShowcaseModal (16 pure-code visual blueprints)
│   │   └── storefront/     # HeroBanner, ProductGrid, ProductCard, QuickView, CartDrawer, CheckoutModal, AiRecommendationModal, AiShoppingAssistant
│   ├── services/
│   │   └── api.ts          # Strongly-typed fetch API client for OpenAPI backend
│   ├── store/
│   │   ├── useAuthStore.ts # Zustand JWT authentication store (localStorage persisted)
│   │   ├── useCartStore.ts # Zustand Cart store (localStorage persisted)
│   │   └── useThemeStore.ts# Zustand Light/Dark theme store
│   ├── types/
│   │   └── index.ts        # Complete TypeScript interfaces for backend schemas
│   ├── utils/
│   │   └── formatters.ts   # Currency, dates, and Order contact normalization
│   ├── App.tsx             # Main view router & modal coordinator
│   ├── index.css           # Tailwind directives & glassmorphism styling
│   └── main.tsx            # React root mount
├── .env.example            # Environment configuration template
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 💻 Getting Started for Forking & Development

### 1. Clone & Install
```bash
git clone https://github.com/<your-username>/URBAN-SCENERY-VENTURES.git
cd URBAN-SCENERY-VENTURES/FrontEnd
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default configuration points to the live backend:
```env
VITE_API_URL=https://agentic-connexa-backend.onrender.com
```

### 3. Run Development Server
```bash
npm run dev
```
The application will be live at `http://localhost:5173`.

### 4. Build for Production
```bash
npm run build
```
Build output is emitted to `FrontEnd/dist`.
