import React, { useState } from 'react';
import { Search, Sparkles, Cpu, Zap, Shield, ArrowRight } from 'lucide-react';

interface HeroBannerProps {
  onSearch: (query: string) => void;
  onOpenShoppingAssistant: () => void;
  onExploreProducts: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onSearch,
  onOpenShoppingAssistant,
  onExploreProducts,
}) => {
  const [searchInput, setSearchInput] = useState('');

  const quickPrompts = [
    'Laptops under $1200',
    'Noise-cancelling headphones',
    'Flagship smartphones',
    'High-resolution monitors',
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
    }
  };

  return (
    <section className="relative overflow-hidden py-14 md:py-20 border-b border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950">
      {/* Glow Orbs Background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-sky-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute -top-10 right-10 w-80 h-80 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-sky-500/30 text-sky-400 text-xs font-semibold mb-6 shadow-inner shadow-sky-500/10">
            <Sparkles className="w-4 h-4 text-sky-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>AI-Driven Electronics Catalogue & Shopping Agents</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
            Intelligent Tech for the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400">
              Modern Lifestyle
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Discover verified electronics with real-time stock, AI semantic search, budget recommendations, and 24/7 autonomous shopping guidance.
          </p>

          {/* Search Bar Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative max-w-2xl mx-auto mb-6"
          >
            <div className="relative flex items-center">
              <Search className="absolute left-4.5 w-5 h-5 text-slate-400 pointer-events-none" />
              <input
                id="main-search-input"
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search phones, laptops, audio gear or ask AI ('budget gaming rig')..."
                className="w-full pl-12 pr-32 py-4 bg-slate-900/90 border border-slate-700/80 rounded-2xl text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all shadow-xl shadow-black/40"
              />
              <button
                type="submit"
                className="absolute right-2 px-5 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-sky-500/30 flex items-center gap-1.5"
              >
                <span>Search</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Quick Prompts */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10 text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-sky-400" />
              <span>Try:</span>
            </span>
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => {
                  setSearchInput(prompt);
                  onSearch(prompt);
                }}
                className="px-3 py-1 rounded-lg bg-slate-900/70 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition-all text-xs"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onExploreProducts}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition-all flex items-center gap-2"
            >
              <span>Explore All Products</span>
            </button>
            <button
              onClick={onOpenShoppingAssistant}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 group"
            >
              <Sparkles className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
              <span>Consult AI Assistant</span>
            </button>
          </div>
        </div>

        {/* Feature Badges Banner */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-10 border-t border-slate-800/60 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <div className="p-2.5 rounded-lg bg-sky-500/10 text-sky-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">100% Genuine Hardware</div>
              <div className="text-[11px] text-slate-400">Direct electronics distributor warranty</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Database-Grounded AI</div>
              <div className="text-[11px] text-slate-400">Accurate specs without hallucinations</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Multi-Rail Payments</div>
              <div className="text-[11px] text-slate-400">Mobile Money, Bank Transfer & Crypto</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

