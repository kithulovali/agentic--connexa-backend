import React, { useState } from 'react';
import { Search, Sparkles, ArrowRight } from 'lucide-react';

interface HomeViewProps {
  onSearch: (query: string) => void;
  onOpenShoppingAssistant: () => void;
  onExploreProducts: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSearch,
  onOpenShoppingAssistant,
  onExploreProducts,
}) => {
  const [searchInput, setSearchInput] = useState('');

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchInput.trim()) onSearch(searchInput.trim());
  };

  return (
    <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-urban-darker">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Find a product
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Search the catalogue or get help from AI.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row lg:max-w-2xl">
          <form onSubmit={submitSearch} className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="main-search-input"
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search products..."
              aria-label="Search products"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
          </form>

          <button
            type="button"
            onClick={onOpenShoppingAssistant}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Sparkles className="h-4 w-4 text-brand-500" />
            Ask AI
          </button>

          <button
            type="button"
            onClick={onExploreProducts}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
          >
            Products <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
