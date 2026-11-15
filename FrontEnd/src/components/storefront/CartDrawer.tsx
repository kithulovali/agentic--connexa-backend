import React, { useState, useEffect } from 'react';
import {
  X,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Plus,
  Minus,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Cpu,
} from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { formatCurrency } from '../../utils/formatters';
import { api } from '../../services/api';
import { ProductOut } from '../../types';

interface CartDrawerProps {
  onOpenCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onOpenCheckout }) => {
  const {
    items,
    isOpen,
    setIsOpen,
    removeItem,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
    addItem,
  } = useCartStore();

  const [recommendedProducts, setRecommendedProducts] = useState<ProductOut[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    api
      .listProducts({ limit: 6, status: 'AVAILABLE' })
      .then((data) => {
        if (!isMounted) return;
        const currentCartIds = new Set(items.map((i) => i.product.id));
        const filtered = (data || []).filter((p) => !currentCartIds.has(p.id)).slice(0, 3);
        setRecommendedProducts(filtered);
      })
      .catch((err) => {
        console.warn('Failed to fetch cross-sell suggestions:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, items]);

  if (!isOpen) return null;

  const totalItemCount = getTotalItems();
  const rawSubtotal = getTotalPrice();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-8 sm:pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-urban-darker border-l border-slate-200 dark:border-slate-800 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
          {/* Header (Reference 3: "My Cart (4)") */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white font-heading">
                  My Cart ({totalItemCount})
                </h2>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  Standard Free Global Delivery Active
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center mb-4 text-slate-400">
                  <ShoppingBag className="w-8 h-8 text-brand-500" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  Your cart is empty
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mb-6">
                  Explore our verified electronics catalogue and add items to begin checkout.
                </p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-md shadow-brand-500/20"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <>
                {/* Product List */}
                <div className="space-y-3">
                  {items.map(({ product, quantity }) => (
                    <div
                      key={product.id}
                      className="flex gap-3.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 items-center justify-between shadow-sm"
                    >
                      <div className="w-16 h-16 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {product.banner_image ? (
                          <img
                            src={product.banner_image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Cpu className="w-6 h-6 text-slate-400" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {product.name}
                        </h4>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mb-1.5 flex items-center gap-1.5">
                          <span className="text-brand-600 dark:text-brand-400 font-bold">
                            {formatCurrency(product.price)}
                          </span>
                          <span>•</span>
                          <span>In Stock</span>
                        </div>

                        {/* Stepper (Reference 3) */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-0.5">
                            <button
                              onClick={() => updateQuantity(product.id, quantity - 1)}
                              className="w-6 h-6 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center font-bold"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center text-xs font-mono font-bold text-slate-900 dark:text-white">
                              {quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(product.id, quantity + 1)}
                              className="w-6 h-6 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center font-bold"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(product.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="text-right pl-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                          {formatCurrency((parseFloat(product.price) || 0) * quantity)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Verified Order Assurance Badge */}
                <div className="p-3 rounded-xl bg-brand-500/5 dark:bg-brand-500/10 border border-brand-500/20 text-xs flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-[11px]">
                      Live Inventory Lock Active
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      Prices and items are verified directly against our live catalog database.
                    </div>
                  </div>
                </div>

                {/* "You Might Also Like" Cross-Sell Row Grounded in Live Products */}
                {recommendedProducts.length > 0 && (
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-1.5 mb-3">
                      <Sparkles className="w-3.5 h-3.5 text-accent-500" />
                      <h4 className="text-xs font-extrabold text-slate-900 dark:text-white font-heading">
                        You Might Also Like
                      </h4>
                    </div>
                    <div className="space-y-2.5">
                      {recommendedProducts.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800"
                        >
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-white dark:bg-slate-950 flex-shrink-0 border border-slate-200 dark:border-slate-800">
                            <img
                              src={p.banner_image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80'}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-[11px] font-bold text-slate-900 dark:text-white truncate">
                              {p.name}
                            </h5>
                            <span className="text-[10px] font-mono font-bold text-brand-600 dark:text-brand-400">
                              {formatCurrency(p.price)}
                            </span>
                          </div>
                          <button
                            onClick={() => addItem(p, 1)}
                            className="w-7 h-7 rounded-lg bg-brand-500/10 hover:bg-brand-500 text-brand-600 dark:text-brand-400 hover:text-white flex items-center justify-center transition-all shadow-sm"
                            title="Add to cart"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer Summary & High-Impact Checkout (Reference 3) */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/80 space-y-3.5">
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {formatCurrency(rawSubtotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                    Free Standard Delivery
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">Total</span>
                  <span className="text-lg font-black text-brand-600 dark:text-brand-400 font-mono">
                    {formatCurrency(rawSubtotal)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenCheckout();
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-brand-500 via-brand-600 to-accent-500 hover:from-brand-600 hover:to-accent-600 text-white font-bold text-xs shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-all hover:scale-102"
              >
                <span>Checkout ({totalItemCount})</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Payment Rails (Strictly Grounded in Backend Payment Rails: MOBILE MONEY, BANK, CRYPTO) */}
              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-mono pt-1">
                <span>Rails:</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">Mobile Money</span>
                <span>•</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">Bank Transfer</span>
                <span>•</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">Crypto</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
