import React, { useState } from 'react';
import { X, ShoppingBag, Sparkles, Check, Package, Cpu } from 'lucide-react';
import { ProductOut } from '../../types';
import { formatCurrency, formatDate, getStatusBadge } from '../../utils/formatters';
import { useCartStore } from '../../store/useCartStore';

interface ProductQuickViewProps {
  product: ProductOut;
  onClose: () => void;
  onAskAi: (product: ProductOut) => void;
}

export const ProductQuickView: React.FC<ProductQuickViewProps> = ({
  product,
  onClose,
  onAskAi,
}) => {
  const { addItem } = useCartStore();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const isAvailable = product.status === 'AVAILABLE' && (product.quantity ?? 0) > 0;
  const statusBadge = getStatusBadge(product.status);
  const maxQty = product.quantity > 0 ? Math.min(product.quantity, 10) : 1;

  const handleAddToCart = () => {
    if (!isAvailable) return;
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl rounded-3xl glass-dropdown border border-slate-700/80 p-6 md:p-8 shadow-2xl overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
          {/* Product Media */}
          <div className="relative aspect-square w-full rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
            {product.banner_image && !imgError ? (
              <img
                src={product.banner_image}
                alt={product.name}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                <Cpu className="w-16 h-16 text-slate-400 mb-2" />
                <span className="text-xs font-mono uppercase text-slate-400">
                  {product.name}
                </span>
              </div>
            )}

            <div className="absolute top-3 left-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md uppercase tracking-wider ${statusBadge.bg} ${statusBadge.text}`}
              >
                {isAvailable ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Details & Actions */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-sky-400 mb-2">
                <Package className="w-3.5 h-3.5" />
                <span>HARDWARE ID #{product.id}</span>
              </div>

              <h2 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight">
                {product.name}
              </h2>

              <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-300 mb-4">
                {formatCurrency(product.price)}
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 mb-6 text-xs text-slate-300 leading-relaxed max-h-40 overflow-y-auto">
                <p className="font-semibold text-white mb-1">Specifications & Overview:</p>
                {product.description ||
                  'High-performance electronic hardware unit compliant with international standards.'}
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs mb-6">
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">
                    Stock Level
                  </span>
                  <span className="font-bold text-white">
                    {product.quantity} units available
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">
                    Listed Date
                  </span>
                  <span className="font-bold text-white">
                    {formatDate(product.created_at)}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              {isAvailable && (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 font-mono">Qty:</span>
                  <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      disabled={qty <= 1}
                      className="w-8 h-8 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center font-bold text-sm disabled:opacity-40"
                    >
                      -
                    </button>
                    <span className="w-10 text-center text-xs font-bold text-white font-mono">
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty(Math.min(maxQty, qty + 1))}
                      disabled={qty >= maxQty}
                      className="w-8 h-8 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center font-bold text-sm disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleAddToCart}
                  disabled={!isAvailable}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg ${
                    added
                      ? 'bg-emerald-500 text-white'
                      : isAvailable
                      ? 'bg-sky-500 hover:bg-sky-400 text-white shadow-sky-500/20'
                      : 'bg-slate-800 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>{isAvailable ? `Add ${qty} to Cart` : 'Out of Stock'}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onAskAi(product)}
                  className="px-4 py-3 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  title="Ask AI Shopping Assistant about this item"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span className="hidden sm:inline">Ask AI</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

