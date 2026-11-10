import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Filter,
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  X,
} from 'lucide-react';
import { ProductOut } from '../../types';
import { api } from '../../services/api';
import { ProductCard } from './ProductCard';
import { ProductQuickView } from './ProductQuickView';

interface ProductGridProps {
  initialSearchQuery?: string;
  onClearInitialSearch?: () => void;
  onOpenShoppingAssistant: (topic?: string) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  initialSearchQuery = '',
  onClearInitialSearch,
  onOpenShoppingAssistant,
}) => {
  const [products, setProducts] = useState<ProductOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAiSearch, setIsAiSearch] = useState(false);

  // Filters
  const [search, setSearch] = useState(initialSearchQuery);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'AVAILABLE' | 'EMPTY'>('ALL');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  // Pagination
  const [offset, setOffset] = useState(0);
  const limit = 12;

  // QuickView modal
  const [selectedProduct, setSelectedProduct] = useState<ProductOut | null>(null);

  // Sync external search query
  useEffect(() => {
    if (initialSearchQuery !== undefined && initialSearchQuery !== search) {
      setSearch(initialSearchQuery);
      setOffset(0);
    }
  }, [initialSearchQuery]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (isAiSearch && search.trim().length >= 2) {
        // AI Smart Search mode
        const aiRes = await api.aiSmartSearch(search.trim());
        setProducts(aiRes.matches || []);
      } else {
        // Standard catalogue query with filters
        const res = await api.listProducts({
          search: search.trim() || undefined,
          status: statusFilter === 'ALL' ? undefined : statusFilter,
          min_price: minPrice || undefined,
          max_price: maxPrice || undefined,
          offset,
          limit,
        });
        setProducts(res || []);
      }
    } catch (err: any) {
      console.error('Failed to load products:', err);
      setError(
        err.message || 'Unable to connect to electronics catalogue backend. Please try again in a few seconds.'
      );
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, minPrice, maxPrice, offset, isAiSearch]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('ALL');
    setMinPrice('');
    setMaxPrice('');
    setIsAiSearch(false);
    setOffset(0);
    if (onClearInitialSearch) onClearInitialSearch();
  };

  return (
    <section id="catalogue-section" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400 mb-1 tracking-wider uppercase">
            <span>Hardware Inventory</span>
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
            <span>Real-Time Sync</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Electronics Catalogue
          </h2>
        </div>

        {/* Action Controls & AI Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {/* AI Search Mode Toggle */}
          <button
            onClick={() => {
              setIsAiSearch(!isAiSearch);
              setOffset(0);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all border ${
              isAiSearch
                ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white border-sky-400 shadow-md shadow-sky-500/20'
                : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${isAiSearch ? 'text-amber-300 animate-spin' : 'text-sky-400'}`} />
            <span>AI Smart Search {isAiSearch ? 'Active' : 'Off'}</span>
          </button>

          {/* Filter Panel Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all border ${
              showFilters || statusFilter !== 'ALL' || minPrice || maxPrice
                ? 'bg-slate-800 text-sky-400 border-sky-500/40'
                : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>

          {/* Refresh */}
          <button
            onClick={() => fetchProducts()}
            disabled={loading}
            aria-label="Refresh product catalogue"
            className="p-2 rounded-xl bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-sky-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter Drawer / Accordion */}
      {showFilters && (
        <div className="mb-8 p-5 rounded-2xl glass-panel animate-in fade-in slide-in-from-top-3">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-sky-400" />
              <span>Filter Inventory</span>
            </span>
            <button
              onClick={handleClearFilters}
              className="text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset all</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1.5 uppercase font-mono">
                Stock Status
              </label>
              <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800">
                {(['ALL', 'AVAILABLE', 'EMPTY'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setStatusFilter(s);
                      setOffset(0);
                    }}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      statusFilter === s
                        ? 'bg-sky-500 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {s === 'ALL' ? 'All' : s === 'AVAILABLE' ? 'In Stock' : 'Out of Stock'}
                  </button>
                ))}
              </div>
            </div>

            {/* Min Price */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1.5 uppercase font-mono">
                Min Price ($)
              </label>
              <input
                type="number"
                min="0"
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  setOffset(0);
                }}
                placeholder="e.g. 50"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1.5 uppercase font-mono">
                Max Price ($)
              </label>
              <input
                type="number"
                min="0"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  setOffset(0);
                }}
                placeholder="e.g. 1500"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Active Filter Chips */}
      {(search || statusFilter !== 'ALL' || minPrice || maxPrice || isAiSearch) && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs text-slate-400 font-mono">Filtered by:</span>
          {search && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30 text-xs">
              <span>Query: "{search}"</span>
              <X
                className="w-3 h-3 cursor-pointer hover:text-white"
                onClick={() => setSearch('')}
              />
            </span>
          )}
          {isAiSearch && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-xs">
              <Sparkles className="w-3 h-3" />
              <span>AI Semantic Matching</span>
            </span>
          )}
          {statusFilter !== 'ALL' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs">
              <span>{statusFilter}</span>
              <X
                className="w-3 h-3 cursor-pointer hover:text-white"
                onClick={() => setStatusFilter('ALL')}
              />
            </span>
          )}
          {(minPrice || maxPrice) && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs">
              <span>${minPrice || '0'} - ${maxPrice || '∞'}</span>
              <X
                className="w-3 h-3 cursor-pointer hover:text-white"
                onClick={() => {
                  setMinPrice('');
                  setMaxPrice('');
                }}
              />
            </span>
          )}
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-start gap-3 mb-8">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-bold">API Connection Issue</h4>
            <p className="text-xs mt-1 text-rose-300/90">{error}</p>
            <p className="text-[11px] mt-2 text-rose-300/70">
              Note: The backend is hosted on Render and may take 20–30s to wake up if inactive.
            </p>
          </div>
          <button
            onClick={() => fetchProducts()}
            className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-semibold"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4 space-y-4 animate-pulse"
            >
              <div className="aspect-[4/3] w-full rounded-xl bg-slate-800/80" />
              <div className="h-4 bg-slate-800 rounded w-1/3" />
              <div className="h-5 bg-slate-800 rounded w-3/4" />
              <div className="h-4 bg-slate-800 rounded w-full" />
              <div className="pt-2 flex justify-between items-center">
                <div className="h-6 bg-slate-800 rounded w-1/4" />
                <div className="h-8 bg-slate-800 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Products Grid */}
      {!loading && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setSelectedProduct(p)}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && products.length === 0 && !error && (
        <div className="text-center py-16 px-4 rounded-3xl border border-slate-800/80 bg-slate-900/40">
          <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No matching electronics found</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
            We couldn't find items matching your current filters. Try relaxing your price filters, or let our AI find alternatives.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
            >
              Reset Filters
            </button>
            <button
              onClick={() => onOpenShoppingAssistant(search || 'What electronics do you recommend?')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-sky-500/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI Shopping Assistant</span>
            </button>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && products.length > 0 && !isAiSearch && (
        <div className="mt-12 flex items-center justify-between border-t border-slate-800 pt-6">
          <p className="text-xs text-slate-400 font-mono">
            Showing items {offset + 1} - {offset + products.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOffset(Math.max(0, offset - limit))}
              disabled={offset === 0}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Prev</span>
            </button>
            <button
              onClick={() => setOffset(offset + limit)}
              disabled={products.length < limit}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      {selectedProduct && (
        <ProductQuickView
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAskAi={(p) => {
            setSelectedProduct(null);
            onOpenShoppingAssistant(`Tell me more about ${p.name} and how it compares with other electronics.`);
          }}
        />
      )}
    </section>
  );
};

