import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Search,
  DollarSign,
  ShoppingBag,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import { api } from '../../services/api';
import { AIRecommendationResponse, ProductOut } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { useCartStore } from '../../store/useCartStore';

interface AiRecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiRecommendationModal: React.FC<AiRecommendationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [query, setQuery] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIRecommendationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { addItem, setIsOpen: setCartOpen } = useCartStore();

  if (!isOpen) return null;

  const handleRecommend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) {
      setError('Please describe what electronics or features you are looking for.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const budgetNum = maxBudget ? parseFloat(maxBudget) : null;
      const res = await api.getAiRecommendations({
        query: query.trim(),
        max_budget: budgetNum,
        preferred_category: category.trim() || null,
      });
      setResult(res);
    } catch (err: any) {
      console.error('Failed to get recommendations:', err);
      setError(err.message || 'Unable to fetch AI recommendations from backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: ProductOut) => {
    addItem(product, 1);
    setCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity"
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white dark:bg-urban-dark border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header Accent Glow */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-500 to-accent-500 flex items-center justify-center text-white shadow-md shadow-brand-500/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
                AI Hardware Recommendation Engine
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Grounded directly in live inventory via <code className="font-mono text-brand-500">/api/v1/ai/recommend</code>
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleRecommend} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                What are you looking for?
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. Best noise cancelling headphones for long flights, or 4K laptop..."
                  className="w-full pl-4 pr-10 py-3 bg-slate-50 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Maximum Budget (USD) <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(e.target.value)}
                    placeholder="e.g. 500"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Target Category <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <Sliders className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Audio, Laptop, Phone, Wearables"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-medium">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500 hover:from-brand-500 hover:to-accent-400 text-white font-bold text-xs shadow-md shadow-brand-500/20 flex items-center gap-2 transition-all disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing Catalogue...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Get AI Advice</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Results Display */}
          {result && (
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in slide-in-from-bottom-2">
              {/* AI Advice Box */}
              <div className="p-4 rounded-2xl bg-brand-50/70 dark:bg-brand-500/10 border border-brand-500/30">
                <div className="flex items-center gap-2 text-xs font-bold text-brand-600 dark:text-brand-400 mb-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Agent Advice</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {result.ai_advice}
                </p>
              </div>

              {/* Matched Products */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2.5">
                  Matched Recommendations ({result.recommendations?.length || 0})
                </h4>

                {result.recommendations && result.recommendations.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {result.recommendations.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 group hover:border-brand-500/40 transition-colors"
                      >
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-white dark:bg-slate-950 flex-shrink-0 border border-slate-200 dark:border-slate-800">
                          <img
                            src={
                              item.banner_image ||
                              'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80'
                            }
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {item.name}
                          </div>
                          <div className="text-xs font-mono font-bold text-brand-600 dark:text-brand-400">
                            {formatCurrency(item.price)}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {item.quantity > 0 ? `${item.quantity} in stock` : 'Available'}
                          </div>
                        </div>

                        <button
                          onClick={() => handleAddToCart(item)}
                          className="p-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white shadow-md shadow-brand-500/20 transition-all flex-shrink-0"
                          title="Add to Cart"
                        >
                          <ShoppingBag className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    No exact hardware matches found in live inventory for this specific combination.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

