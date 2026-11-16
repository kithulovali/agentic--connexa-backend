import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  ArrowRight,
  Headphones,
  Smartphone,
  Watch,
  Cpu,
  Tag,
  Laptop,
  ShoppingBag,
  ShieldCheck,
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
    if (searchInput.trim()) onSearch(searchInput.trim());
  };

  const categories = [
    { id: 'All', label: 'All products', icon: Laptop, tone: 'text-slate-700 dark:text-slate-200' },
    { id: 'Audio', label: 'Audio', icon: Headphones, tone: 'text-rose-600 dark:text-rose-400' },
    { id: 'Smart Home', label: 'Smart tech', icon: Smartphone, tone: 'text-emerald-600 dark:text-emerald-400' },
    { id: 'Wearables', label: 'Wearables', icon: Watch, tone: 'text-violet-600 dark:text-violet-400' },
    { id: 'Accessories', label: 'Accessories', icon: Cpu, tone: 'text-blue-600 dark:text-blue-400' },
    { id: 'Sale', label: 'In stock', icon: Tag, tone: 'text-amber-600 dark:text-amber-400' },
  ];

  const selectCategory = (category: string) => {
    if (onSelectCategory) onSelectCategory(category);
    else onSearch(category === 'All' ? '' : category.toLowerCase());
  };

  return (
    <section className="relative overflow-hidden bg-white dark:bg-urban-darker transition-colors duration-300">
      <div className="pointer-events-none absolute -top-40 left-1/3 h-[28rem] w-[42rem] rounded-full bg-brand-500/10 blur-[130px]" />
      <div className="pointer-events-none absolute top-20 right-0 h-72 w-72 rounded-full bg-accent-500/10 blur-[110px]" />

      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-7 sm:px-6 sm:pb-14 lg:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-500/25 bg-brand-500/5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-600 dark:text-brand-300">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
              Urban Scenery Ventures
            </div>
            <h1 className="max-w-2xl text-3xl font-black leading-[1.08] tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl font-heading">
              Technology for the way
              <span className="block bg-gradient-to-r from-brand-500 via-brand-600 to-accent-500 bg-clip-text text-transparent">you live and work.</span>
            </h1>
          </div>
          <p className="max-w-md text-sm leading-6 text-slate-600 dark:text-slate-400">
            Explore electronics, compare options, and use AI-powered guidance to find products that match your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <button
            type="button"
            onClick={() => selectCategory('Audio')}
            className="group relative min-h-[350px] overflow-hidden rounded-[2rem] border border-slate-200/80 bg-gradient-to-br from-amber-50 via-stone-100 to-orange-100/70 p-7 text-left shadow-sm transition-all hover:shadow-xl dark:border-slate-800 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 sm:min-h-[410px] sm:p-10 lg:col-span-8"
          >
            <div className="relative z-10 max-w-md">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Explore the collection</span>
              <h2 className="mt-4 text-4xl font-black leading-[1.04] tracking-tight text-slate-950 dark:text-white sm:text-6xl">
                FIND YOUR
                <span className="block text-brand-500">NEXT</span>
                <span className="block">FAVOURITE.</span>
              </h2>
              <p className="mt-4 max-w-xs text-sm leading-6 text-slate-600 dark:text-slate-300">
                Discover audio, smart devices, wearables, and everyday technology in one place.
              </p>
              <span className="mt-7 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-xs font-bold text-white transition-colors group-hover:bg-brand-600 dark:bg-white dark:text-slate-950 dark:group-hover:bg-brand-500 dark:group-hover:text-white">
                Explore products <ArrowRight className="h-4 w-4" />
              </span>
            </div>
            <div className="pointer-events-none absolute -bottom-5 right-0 h-56 w-56 opacity-90 transition-transform duration-500 group-hover:scale-105 sm:bottom-0 sm:right-5 sm:h-80 sm:w-80">
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=85"
                alt="Premium wireless headphones"
                className="h-full w-full object-contain drop-shadow-2xl"
              />
            </div>
            <div className="pointer-events-none absolute bottom-5 right-5 rounded-full border border-white/70 bg-white/75 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-700 backdrop-blur sm:bottom-7 sm:right-8">
              AI-assisted discovery
            </div>
          </button>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
            <button
              type="button"
              onClick={() => selectCategory('Smart Home')}
              className="group relative flex min-h-[170px] items-center justify-between overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-100 p-6 text-left transition-all hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 sm:min-h-[198px]"
            >
              <div className="relative z-10 max-w-[58%]">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Connected living</span>
                <h3 className="mt-2 text-2xl font-black leading-tight text-slate-950 dark:text-white">SMART<br />TECH</h3>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-brand-400">Explore devices <ArrowRight className="h-3.5 w-3.5" /></span>
              </div>
              <img
                src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=85"
                alt="Modern smartphone"
                className="absolute -right-2 bottom-0 h-40 w-40 object-contain transition-transform duration-500 group-hover:scale-110 sm:h-44 sm:w-44"
              />
            </button>

            <button
              type="button"
              onClick={() => selectCategory('Wearables')}
              className="group relative flex min-h-[170px] items-center justify-between overflow-hidden rounded-[1.75rem] bg-slate-950 p-6 text-left text-white transition-all hover:shadow-lg dark:bg-black sm:min-h-[198px]"
            >
              <div className="relative z-10 max-w-[58%]">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Everyday essentials</span>
                <h3 className="mt-2 text-2xl font-black leading-tight">WEAR<br />YOUR TECH.</h3>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-accent-400">Browse wearables <ArrowRight className="h-3.5 w-3.5" /></span>
              </div>
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=85"
                alt="Smart watch"
                className="absolute -right-2 bottom-0 h-40 w-40 object-contain transition-transform duration-500 group-hover:scale-110 sm:h-44 sm:w-44"
              />
              <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full border border-white/10" />
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              id="main-search-input"
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search phones, laptops, audio gear and more..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-28 text-sm text-slate-900 shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
            <button type="submit" className="absolute right-2 top-1/2 inline-flex -translate-y-1/2 items-center gap-1.5 rounded-xl bg-brand-500 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-brand-600">
              Search <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={onOpenShoppingAssistant} className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-800 transition hover:border-brand-500/40 hover:text-brand-600 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:text-brand-300 sm:flex-none">
              <Sparkles className="h-4 w-4 text-accent-500" /> AI Assistant
            </button>
            {onOpenAiRecommendations && (
              <button type="button" onClick={onOpenAiRecommendations} className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-brand-500/10 px-4 py-3 text-xs font-bold text-brand-700 transition hover:bg-brand-500/15 dark:text-brand-300 sm:flex-none">
                <Sparkles className="h-4 w-4" /> AI Match
              </button>
            )}
          </div>
        </div>

        <div className="mt-9 border-t border-slate-100 pt-7 dark:border-slate-800">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Shop by category</h3>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Jump straight to what you are looking for.</p>
            </div>
            <button type="button" onClick={onExploreProducts} className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 transition hover:text-brand-700 dark:text-brand-400">
              View catalogue <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  type="button"
                  key={category.id}
                  onClick={() => selectCategory(category.id)}
                  className="group flex flex-col items-center rounded-2xl px-2 py-3 text-center transition hover:bg-slate-50 dark:hover:bg-slate-900"
                >
                  <span className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 shadow-sm transition duration-300 group-hover:scale-110 group-hover:bg-brand-500/10 dark:bg-slate-800 sm:h-16 sm:w-16">
                    <Icon className={`h-6 w-6 ${category.tone}`} />
                  </span>
                  <span className="text-[11px] font-bold text-slate-700 transition group-hover:text-brand-600 dark:text-slate-300 dark:group-hover:text-brand-300 sm:text-xs">{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-3 border-y border-slate-100 py-5 dark:border-slate-800 sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400"><Search className="h-5 w-5" /></span>
            <span><strong className="block text-xs text-slate-900 dark:text-white">Product catalogue</strong><small className="text-[11px] text-slate-500 dark:text-slate-400">Browse available items</small></span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-500/10 text-accent-600 dark:text-accent-400"><Sparkles className="h-5 w-5" /></span>
            <span><strong className="block text-xs text-slate-900 dark:text-white">AI product guidance</strong><small className="text-[11px] text-slate-500 dark:text-slate-400">Get tailored suggestions</small></span>
          </div>
          <div className="col-span-2 flex items-center gap-3 sm:col-span-1">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"><ShoppingBag className="h-5 w-5" /></span>
            <span><strong className="block text-xs text-slate-900 dark:text-white">Shopping cart</strong><small className="text-[11px] text-slate-500 dark:text-slate-400">Review items before checkout</small></span>
          </div>
        </div>
      </div>
    </section>
  );
};
