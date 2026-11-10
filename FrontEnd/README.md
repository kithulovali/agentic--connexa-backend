# Urban Scenery Ventures — Modern Frontend

A modern, high-performance **React 18 + TypeScript + Vite + Tailwind CSS** application built for **Urban Scenery Ventures** — an AI-powered electronics e-commerce platform and merchant hub.

Directly integrated with the live **Agentic Connexa Backend**:  
`https://agentic-connexa-backend.onrender.com`

---

## 🚀 Features

### 1. Consumer Electronics Storefront
- **Dynamic Catalogue Grid:** Real-time stock counts, price formatting, stock status indicators, and responsive card layouts.
- **AI Smart Search:** Natural language search leveraging semantic search (`GET /api/v1/ai/smart-search?q=...`).
- **Inventory Filtering:** Filter by stock status (`AVAILABLE` vs `EMPTY`), minimum/maximum price bounds, and pagination.
- **Product QuickView Modal:** In-depth hardware specifications, high-resolution media previews, and instant quantity selection.
- **Slide-Over Cart Drawer:** Persistent shopping cart powered by Zustand with subtotal calculation and live updates.
- **Instant Checkout & Multi-Rail Payment:** Order placement (`POST /api/v1/orders`) followed immediately by payment authorization (`POST /api/v1/payments/pay`) across:
  - Bank Transfer
  - Mobile Money
  - Crypto

### 2. Autonomous AI Shopping Assistant
- **Floating AI Widget:** Persistent bottom-right interactive assistant with pulsing status indicator.
- **Database-Grounded Advice:** Powered by `POST /api/v1/ai/agents/customer-shopping-assistant`, answering questions strictly from real inventory data.
- **Direct Product Recommendations:** Recommends electronics matching user budget constraints with one-click "Add to Cart" directly inside the chat conversation.

### 3. Merchant & AI Operations Hub
- **Inventory Management:** Full CRUD over electronics hardware (`POST /products`, `PUT /products/{id}`, `DELETE /products/{id}`).
- **Order Fulfilment:** Inspect customer shipping coordinates, phone contact (handling API field spelling), product ordered, payment status, and update administrative fulfilment state (`PATCH /orders/{id}/status`).
- **Payment Ledger:** Transparent records of transactions processed across all payment rails.
- **AI Enterprise Studio:**
  - **Business Intelligence (BI):** Query operational margins and revenue generators.
  - **Growth Optimization:** Restocking strategies and demand forecasting.
  - **Marketing Content:** Promotional copy generation for social media and email campaigns.
  - **Image Studio & Render:** Creative brief generator with base64 image preview.
- **Multichannel Social Hub:**
  - Connection health across Facebook, Instagram, TikTok, and WhatsApp.
  - Unified Campaign Publisher with explicit administrator safety confirmation flag (`approved: true`).
  - Direct WhatsApp customer messaging and conversation analytics.

---

## 🛠️ Project Structure

```
FrontEnd/
├── public/                 # Brand assets, logos, and favicons
├── src/
│   ├── components/
│   │   ├── admin/          # Merchant Hub & Enterprise AI Studio
│   │   ├── auth/           # Login & Registration modal
│   │   ├── common/         # Sticky Header & Footer
│   │   └── storefront/     # Hero, ProductGrid, QuickView, Cart, Checkout, AIAssistant
│   ├── services/
│   │   └── api.ts          # Strongly-typed fetch API client for OpenAPI 3.1.0 backend
│   ├── store/
│   │   ├── useAuthStore.ts # Zustand JWT authentication store (localStorage persisted)
│   │   └── useCartStore.ts # Zustand Cart store (localStorage persisted)
│   ├── types/
│   │   └── index.ts        # Complete TypeScript interfaces for backend schemas
│   ├── utils/
│   │   └── formatters.ts   # Currency, dates, and Order contact normalization
│   ├── App.tsx             # Main view router & modal coordinator
│   ├── index.css           # Tailwind directives & glassmorphism styling
│   └── main.tsx            # React root mount
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 💻 Getting Started

### 1. Development Server
From the workspace root:
```bash
npm run dev
```
Or directly inside `FrontEnd`:
```bash
cd FrontEnd
npm run dev
```

The app will be available at `http://localhost:5173`.

### 2. Production Build
```bash
npm run build
```
Build output is optimized and emitted to `FrontEnd/dist`.

