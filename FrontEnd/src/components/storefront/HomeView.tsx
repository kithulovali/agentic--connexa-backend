import React, { useState } from 'react';
import {
  ArrowRight,
  Headphones,
  Gamepad2,
  Laptop,
  Smartphone,
  Watch,
  Zap,
  Search,
  Sparkles,
  ShoppingBag,
  Database,
  ShieldCheck,
} from 'lucide-react';

interface HomeViewProps {
  onNavigateToShop: (category: string) => void;
  onSearch: (query: string) => void;
  onOpenShoppingAssistant: () => void;
  onExploreProducts: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigateToShop,
  onSearch,
  onOpenShoppingAssistant,
  onExploreProducts,
}) => {
  const [searchInput, setSearchInput] = useState('');

  const categoryCircles = [
    { name: 'Super Deals', icon: Zap, query: 'deal', bg: 'bg-amber-50 text-brand-600' },
    { name: 'Gaming', icon: Gamepad2, query: 'gaming', bg: 'bg-slate-100 text-slate-700' },
    { name: 'Laptops', icon: Laptop, query: 'laptop', bg: 'bg-slate-100 text-slate-800' },
    { name: 'Phones', icon: Smartphone, query: 'phone', bg: 'bg-amber-50 text-amber-700' },
    { name: 'Watches', icon: Watch, query: 'watch', bg: 'bg-slate-100 text-slate-700' },
    { name: 'Audio', icon: Headphones, query: 'audio', bg: 'bg-amber-50 text-amber-600' },
  ];

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchInput.trim()) onSearch(searchInput.trim());
  };

  return (
    <div className="min-h-0 bg-white text-slate-900 transition-colors dark:bg-urban-darker dark:text-white">
      <section className="mx-auto max-w-7xl px-4 pb-8 pt-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <button
            type="button"
            onClick={() => onNavigateToShop('Audio')}
            className="group relative flex min-h-[380px] cursor-pointer flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-amber-50/70 via-stone-100 to-amber-100/50 p-8 text-left shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 sm:min-h-[430px] sm:p-12 lg:col-span-8"
          >
            <div className="relative z-10 max-w-sm space-y-3">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Audio Edition
              </span>
              <h1 className="font-heading text-3xl font-black leading-[1.08] tracking-tight text-slate-950 dark:text-white sm:text-5xl">
                AUDIO<br />
                <span className="text-brand-500">STUDIO 3</span><br />
                WIRELESS
              </h1>
              <p className="max-w-xs pt-1 text-xs leading-5 text-slate-600 dark:text-slate-400 sm:text-sm">
                Hear the music. Not the noise. Explore wireless audio and active noise-cancelling devices.
              </p>
              <span className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-2.5 text-xs font-bold text-white shadow-sm transition-all group-hover:scale-105 group-hover:bg-brand-500">
                View audio products <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
            <div className="pointer-events-none absolute bottom-3 right-2 flex h-56 w-56 items-center justify-center transition-transform duration-500 group-hover:scale-105 sm:bottom-5 sm:right-7 sm:h-80 sm:w-80">
              <img
                src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80"
                alt="Wireless headphones"
                className="h-full w-full object-contain drop-shadow-2xl"
              />
            </div>
          </button>

          <div className="flex flex-col gap-5 lg:col-span-4">
            <button
              type="button"
              onClick={() => onNavigateToShop('Phones')}
              className="group relative flex min-h-[180px] flex-1 cursor-pointer items-center justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-100/90 p-6 text-left shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="relative z-10 max-w-[160px] space-y-1.5">
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Connected living</p>
                <h2 className="text-xl font-black leading-tight text-slate-950 dark:text-white">SMART<br />DEVICES</h2>
                <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">Explore phones & more</p>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-black px-3 py-1.5 text-[11px] font-bold text-white transition-colors group-hover:bg-brand-500">
                  View products <ArrowRight className="h-3 w-3" />
                </span>
              </div>
              <img
                src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=350&q=80"
                alt="Smartphone"
                className="h-32 w-32 object-contain transition-transform duration-500 group-hover:scale-105 sm:h-40 sm:w-40"
              />
            </button>

            <button
              type="button"
              onClick={() => onNavigateToShop('Gaming')}
              className="group relative flex min-h-[180px] flex-1 cursor-pointer items-center justify-between overflow-hidden rounded-3xl bg-black p-6 text-left text-white shadow-sm transition-all hover:shadow-md dark:bg-black"
            >
              <div className="relative z-10 max-w-[160px] space-y-1.5">
                <h2 className="text-base font-black leading-tight tracking-tight">ENHANCE YOUR<br />ENTERTAINMENT</h2>
                <p className="font-mono text-xs font-bold text-brand-400">Gaming & accessories</p>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-black transition-colors group-hover:bg-brand-500 group-hover:text-white">
                  Explore gaming <ArrowRight className="h-3 w-3" />
                </span>
              </div>
              <img
                src="https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=350&q=80"
                alt="Gaming equipment"
                className="h-32 w-32 object-contain transition-transform duration-500 group-hover:scale-105 sm:h-40 sm:w-40"
              />
            </button>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-100 pt-8 dark:border-slate-800">
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
            {categoryCircles.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  type="button"
                  key={category.name}
                  onClick={() => onNavigateToShop(category.query)}
                  className="group flex flex-col items-center rounded-2xl p-3 text-center transition-all hover:bg-slate-50 dark:hover:bg-slate-900"
                >
                  <span className={`mb-2.5 flex h-14 w-14 items-center justify-center rounded-full shadow-sm transition-all group-hover:scale-110 group-hover:shadow sm:h-16 sm:w-16 ${category.bg}`}>
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="text-xs font-bold text-slate-800 transition-colors group-hover:text-brand-500 dark:text-slate-200">
                    {category.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-3 border-t border-slate-100 pt-6 dark:border-slate-800 sm:flex-row">
          <form onSubmit={submitSearch} className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="main-search-input"
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search products in the catalogue..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-xs text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
          </form>
          <button
            type="button"
            onClick={onOpenShoppingAssistant}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-500/20 bg-brand-500/5 px-5 py-3 text-xs font-bold text-brand-700 transition-colors hover:bg-brand-500/10 dark:text-brand-300"
          >
            <Sparkles className="h-4 w-4" /> Ask the AI shopping assistant
          </button>
          <button
            type="button"
            onClick={onExploreProducts}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-xs font-bold text-white transition-colors hover:bg-brand-500 dark:bg-white dark:text-black dark:hover:bg-brand-500 dark:hover:text-white"
          >
            Browse catalogue <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
};

export const StorefrontBenefits: React.FC = () => (
  <section className="my-8 border-y border-slate-200/80 bg-slate-50 py-6 dark:border-slate-800 dark:bg-slate-900/60">
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 text-center sm:grid-cols-3 sm:px-6 sm:text-left lg:px-8">
      <div className="flex items-center justify-center gap-3 sm:justify-start">
        <span className="rounded-full bg-black p-2.5 text-brand-400"><Database className="h-5 w-5" /></span>
        <span><strong className="block text-xs text-slate-900 dark:text-white">Live product catalogue</strong><small className="text-[11px] text-slate-500 dark:text-slate-400">Products loaded from the platform API</small></span>
      </div>
      <div className="flex items-center justify-center gap-3 sm:justify-start">
        <span className="rounded-full bg-black p-2.5 text-brand-400"><Sparkles className="h-5 w-5" /></span>
        <span><strong className="block text-xs text-slate-900 dark:text-white">AI shopping assistance</strong><small className="text-[11px] text-slate-500 dark:text-slate-400">Guidance and product discovery</small></span>
      </div>
      <div className="flex items-center justify-center gap-3 sm:justify-start">
        <span className="rounded-full bg-black p-2.5 text-brand-400"><ShieldCheck className="h-5 w-5" /></span>
        <span><strong className="block text-xs text-slate-900 dark:text-white">Account-protected access</strong><small className="text-[11px] text-slate-500 dark:text-slate-400">Verified access to merchant tools</small></span>
      </div>
    </div>
  </section>
);
