import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  ArrowRight,
  Headphones,
  Smartphone,
  Watch,
  Cpu,
  Zap,
  Tag,
  Shield,
  Truck,
  RotateCcw,
  Headset,
} from 'lucide-react';

interface HeroBannerProps {
  onSearch: (query: string) => void;
  onOpenShoppingAssistant: () => void;
  onExploreProducts: () => void;
  onSelectCategory?: (category: string) => void;
  onOpenAiRecommendations?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onSearch,
  onOpenShoppingAssistant,
  onExploreProducts,
  onSelectCategory,
  onOpenAiRecommendations,
}) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
    }
  };

  const quickCategories = [
    {
      id: 'Audio',
      title: 'Audio',
      subtitle: 'Premium Sound',
      icon: Headphones,
      query: 'audio',
      color: 'from-pink-500 to-rose-500',
    },
    {
      id: 'Smart Home',
      title: 'Smart Devices',
      subtitle: 'Smarter Living',
      icon: Smartphone,
      query: 'phone',
      color: 'from-amber-500 to-yellow-500',
    },
    {
      id: 'Wearables',
      title: 'Wearables',
      subtitle: 'Track. Achieve.',
      icon: Watch,
      query: 'watch',
      color: 'from-brand-500 to-purple-600',
    },
    {
      id: 'Accessories',
      title: 'Accessories',
      subtitle: 'Designed for You',
      icon: Cpu,
      query: 'accessories',
      color: 'from-blue-500 to-indigo-500',
    },
    {
      id: 'Sale',
      title: 'Deals',
      subtitle: 'Top Deals Today',
      icon: Tag,
      query: 'sale',
      color: 'from-brand-600 to-accent-500',
      isHot: true,
    },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-100/70 dark:from-urban-darker dark:via-urban-dark dark:to-urban-darker transition-colors duration-300">
      {/* Signature Logo Glow Orbs in Background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-brand-500/10 dark:bg-brand-500/15 blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="absolute -top-10 right-10 w-96 h-96 bg-accent-500/10 dark:bg-accent-500/12 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Main Hero Split Section (Reference 2 TechVerse Style) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 sm:pt-14 sm:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Headline, CTAs, Search */}
          <div className="lg:col-span-7 text-left space-y-6">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-slate-900/90 border border-brand-500/30 text-brand-600 dark:text-brand-300 text-xs font-bold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping" />
              <span>Discover. Shop. Upgrade.</span>
            </div>

            {/* Display Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.08] font-heading">
              Latest Tech <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 via-brand-600 to-accent-500">
                Gadgets
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              Explore cutting-edge electronics, AI-recommended flagship hardware, verified warranties, and rapid global delivery.
            </p>

            {/* Search Bar Input */}
            <form onSubmit={handleSearchSubmit} className="relative max-w-xl">
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  id="main-search-input"
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search phones, laptops, audio gear or ask AI..."
                  className="w-full pl-12 pr-32 py-3.5 sm:py-4 bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700/80 rounded-2xl text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all shadow-lg shadow-brand-500/5 dark:shadow-black/40"
                />
                <button
                  type="submit"
                  className="absolute right-2 px-4 py-2 bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-600 hover:to-accent-600 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-brand-500/25 flex items-center gap-1.5"
                >
                  <span>Search</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreProducts}
                className="px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-lg shadow-brand-500/25 flex items-center gap-2 transition-all hover:scale-102"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenShoppingAssistant}
                className="px-6 py-3 rounded-xl bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-white font-bold text-xs border border-slate-300 dark:border-slate-700 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-accent-500" />
                <span>AI Assistant Guidance</span>
              </button>

              {onOpenAiRecommendations && (
                <button
                  onClick={onOpenAiRecommendations}
                  className="px-5 py-3 rounded-xl bg-accent-500/10 hover:bg-accent-500/20 text-accent-700 dark:text-accent-300 font-bold text-xs border border-accent-500/30 transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-accent-500 animate-pulse" />
                  <span>AI Hardware Match</span>
                </button>
              )}
            </div>

            {/* Multi-Rail & Architecture Tag */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500 dark:text-slate-400 pt-2">
              <span className="flex items-center gap-1.5 text-brand-600 dark:text-brand-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>FastAPI Direct Grounded</span>
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span>Supported Rails: Bank Transfer, Mobile Money, Crypto</span>
            </div>
          </div>

          {/* Right Column: High-Impact Visual Composition (Reference 2 Showcase) */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Visual Glass Platform */}
            <div className="relative w-full max-w-md aspect-square rounded-3xl bg-gradient-to-br from-brand-500/10 via-accent-500/10 to-transparent p-6 flex items-center justify-center border border-slate-200 dark:border-slate-800/80 shadow-2xl overflow-hidden group">
              {/* Radial Glow */}
              <div className="absolute inset-0 bg-radial-gradient from-brand-500/20 to-transparent opacity-60 rounded-3xl" />

              {/* Showcase Tech Devices Mosaic */}
              <div className="relative z-10 grid grid-cols-2 gap-4 w-full h-full p-2">
                {/* Device 1: Premium Audio */}
                <div className="relative rounded-2xl overflow-hidden bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-3 shadow-md flex flex-col justify-between group-hover:scale-102 transition-transform">
                  <div className="text-[10px] font-mono font-bold text-brand-600 dark:text-brand-400 uppercase">
                    Hi-Fi Audio
                  </div>
                  <img
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"
                    alt="Wireless ANC Headphones"
                    className="w-full h-28 object-contain my-1"
                  />
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    ANC Studio Headset
                  </div>
                </div>

                {/* Device 2: Smart Watch */}
                <div className="relative rounded-2xl overflow-hidden bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-3 shadow-md flex flex-col justify-between group-hover:scale-102 transition-transform">
                  <div className="text-[10px] font-mono font-bold text-accent-600 dark:text-accent-400 uppercase">
                    Wearable Pro
                  </div>
                  <img
                    src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80"
                    alt="Smartwatch Ultra"
                    className="w-full h-28 object-contain my-1"
                  />
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    Smartwatch Elite
                  </div>
                </div>

                {/* Device 3: Smartphone */}
                <div className="relative rounded-2xl overflow-hidden bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-3 shadow-md flex flex-col justify-between group-hover:scale-102 transition-transform">
                  <div className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 uppercase">
                    Flagship 5G
                  </div>
                  <img
                    src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80"
                    alt="Smartphone OLED"
                    className="w-full h-28 object-contain my-1"
                  />
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    Pro Smartphone OLED
                  </div>
                </div>

                {/* Device 4: Wireless Charging Rig */}
                <div className="relative rounded-2xl overflow-hidden bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-3 shadow-md flex flex-col justify-between group-hover:scale-102 transition-transform">
                  <div className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                    3-in-1 Power
                  </div>
                  <img
                    src="https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&q=80"
                    alt="3-in-1 Fast Wireless Charger"
                    className="w-full h-28 object-contain my-1"
                  />
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    Magnetic Dock 30W
                  </div>
                </div>
              </div>

              {/* Floating "New Arrivals" Circular Badge (as seen in Reference 2) */}
              <div className="absolute top-4 right-4 z-20 w-16 h-16 rounded-full bg-gradient-to-tr from-brand-500 to-accent-500 text-white flex flex-col items-center justify-center text-center shadow-xl shadow-brand-500/30 rotate-12 pointer-events-none">
                <span className="text-[10px] font-extrabold uppercase leading-none">New</span>
                <span className="text-[9px] font-medium leading-none">Arrivals</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Category Jump Cards Row (5 Cards directly matching Reference 2) */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {quickCategories.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (onSelectCategory) {
                    onSelectCategory(item.id);
                  } else {
                    onSearch(item.query);
                  }
                }}
                className={`group p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 dark:hover:border-brand-500/50 shadow-sm hover:shadow-md transition-all text-left flex items-center justify-between ${
                  item.isHot ? 'ring-1 ring-brand-500/30' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-brand-50 dark:group-hover:bg-brand-500/10 text-slate-700 dark:text-slate-300 group-hover:text-brand-500 flex items-center justify-center transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-brand-500 text-slate-400 group-hover:text-white flex items-center justify-center transition-colors shadow-sm">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Trust & Guarantee Banner (Reference 2: 4 Pillars) */}
      <div className="border-t border-b border-slate-200 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/40 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Global Delivery</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Automated order fulfillment</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Secure Payments</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">100% safe & multi-rail checkout</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent-50 dark:bg-accent-500/10 text-accent-700 dark:text-accent-400">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">30-Day Returns</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Hassle-free guarantee</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Headset className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Premium Support</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">24/7 autonomous & live support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
