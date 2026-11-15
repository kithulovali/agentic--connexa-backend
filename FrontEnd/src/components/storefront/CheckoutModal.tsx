import React, { useEffect, useState } from 'react';
import {
  X,
  CreditCard,
  Building2,
  Smartphone,
  Coins,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { api } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import { OrderOut } from '../../types';

interface CheckoutModalProps {
  onClose: () => void;
  onOpenAuth: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  onClose,
  onOpenAuth,
}) => {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();

  const [address, setAddress] = useState('');
  const [locationStatus, setLocationStatus] = useState<'idle' | 'detecting' | 'success' | 'error'>('idle');
  const [locationAttempt, setLocationAttempt] = useState(0);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus('error');
      return;
    }

    let cancelled = false;
    setLocationStatus('detecting');

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const result = await api.reverseGeocode(coords.latitude, coords.longitude);
          if (cancelled) return;

          if (!result.display_name?.trim()) {
            throw new Error('The address service returned no readable address.');
          }

          setAddress((currentAddress) =>
            currentAddress.trim() ? currentAddress : result.display_name
          );
          setLocationStatus('success');
        } catch (lookupError) {
          console.error('Reverse geocoding failed:', lookupError);
          if (!cancelled) setLocationStatus('error');
        }
      },
      (geoError) => {
        console.warn('Browser geolocation failed:', geoError.message);
        if (!cancelled) setLocationStatus('error');
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 60000,
      }
    );

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, locationAttempt]);
  const [contact, setContact] = useState(user?.contact || '');
  const [paymentMethod, setPaymentMethod] = useState<'BANK' | 'MOBILE MONEY' | 'CRYPTO'>('BANK');

  const [step, setStep] = useState<'FORM' | 'PROCESSING' | 'SUCCESS'>('FORM');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [createdOrder, setCreatedOrder] = useState<OrderOut | null>(null);
  const [createdOrders, setCreatedOrders] = useState<OrderOut[]>([]);

  const total = getTotalPrice();

  const handlePlaceOrderAndPay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim() || !contact.trim()) {
      setError('Please provide both delivery address and contact number.');
      return;
    }

    if (items.length === 0) {
      setError('Cart is empty.');
      return;
    }

    setLoading(true);
    setError(null);
    setStep('PROCESSING');

    try {
      const submittedOrders: OrderOut[] = [];

      for (const item of items) {
        const order = await api.placeOrder({
          product_id: item.product.id,
          quantity: item.quantity,
          address: address.trim(),
          contact: contact.trim(),
          payment_method: paymentMethod,
        });
        submittedOrders.push(order);
      }

      setCreatedOrders(submittedOrders);
      clearCart();
      setStep('SUCCESS');
    } catch (err: any) {
      console.error('Order/Payment failed:', err);
      setError(err.message || 'Order submission failed. Please check your details.');
      setStep('FORM');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-3xl bg-white dark:glass-dropdown border border-slate-200 dark:border-slate-700/80 p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'FORM' && (
          <form onSubmit={handlePlaceOrderAndPay}>
            <div className="flex items-center gap-2 mb-1">
              <CreditCard className="w-5 h-5 text-brand-500" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
                Checkout & Place Order
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Provide your delivery details and choose your preferred payment method.
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Cart Summary Snippet */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 mb-5">
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 font-bold">
                Order Items ({items.length})
              </div>
              <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex justify-between text-xs font-medium">
                    <span className="text-slate-700 dark:text-slate-300 truncate max-w-[240px]">
                      {quantity}x {product.name}
                    </span>
                    <span className="font-mono text-slate-900 dark:text-white font-bold">
                      {formatCurrency((parseFloat(product.price) || 0) * quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between text-xs font-bold">
                <span className="text-slate-600 dark:text-slate-300">Total Payable:</span>
                <span className="text-brand-600 dark:text-brand-400 font-mono text-sm">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>

            {/* Delivery Inputs */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1 uppercase font-mono">
                  Shipping Address *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={
                    locationStatus === 'detecting'
                      ? 'Detecting your location...'
                      : 'Street, Suite / Apt, City, Country'
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
                <div className="mt-1.5 flex items-center justify-between gap-2">
                  <p className="text-[10px] text-slate-500 dark:text-slate-400" aria-live="polite">
                    {locationStatus === 'detecting' && 'Allow location access to find your delivery address...'}
                    {locationStatus === 'success' && 'Location-based address suggestion. Verify and edit it before ordering. © OpenStreetMap contributors.'}
                    {locationStatus === 'error' && 'Location could not be resolved. Enter your delivery address manually or try again.'}
                  </p>
                  {locationStatus === 'error' && (
                    <button
                      type="button"
                      onClick={() => setLocationAttempt((attempt) => attempt + 1)}
                      className="shrink-0 text-[10px] font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
                    >
                      Try again
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1 uppercase font-mono">
                  Contact Phone / WhatsApp *
                </label>
                <input
                  type="text"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              {/* Payment Rail Options */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1.5 uppercase font-mono">
                  Preferred Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('BANK')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      paymentMethod === 'BANK'
                        ? 'bg-brand-50 dark:bg-brand-500/10 border-brand-500 text-brand-600 dark:text-brand-400 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Building2 className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-[10px] font-bold block">BANK TRANSFER</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('MOBILE MONEY')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      paymentMethod === 'MOBILE MONEY'
                        ? 'bg-brand-50 dark:bg-brand-500/10 border-brand-500 text-brand-600 dark:text-brand-400 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-[10px] font-bold block">MOBILE MONEY</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CRYPTO')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      paymentMethod === 'CRYPTO'
                        ? 'bg-brand-50 dark:bg-brand-500/10 border-brand-500 text-brand-600 dark:text-brand-400 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Coins className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-[10px] font-bold block">CRYPTO</span>
                  </button>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 dark:text-slate-400 -mt-2 mb-4" role="note">
              Online payment is not available yet. Your selected method is recorded as a preference. Payment remains pending until our team provides instructions and verifies receipt.
            </p>

            <button
              type="submit"
              disabled={loading || items.length === 0}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-600 hover:to-accent-600 text-white font-bold text-xs shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-all hover:scale-102"
            >
              <span>Place Order — {formatCurrency(total)}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {step === 'PROCESSING' && (
          <div className="py-12 text-center space-y-4">
            <Loader2 className="w-12 h-12 text-brand-500 animate-spin mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
              Submitting Your Order
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              Please wait while we submit your order details...
            </p>
          </div>
        )}

        {step === 'SUCCESS' && createdOrders.length > 0 && (
          <div className="text-center py-4 space-y-4 animate-in fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-heading">Order Submitted Successfully</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
              Your order has been received. Payment is still pending; our team will contact you with payment instructions and verify receipt before updating its status.
            </p>

            {/* Order confirmation */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="text-slate-500 dark:text-slate-400">Order Reference(s):</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-right">{createdOrders.map((order) => `#${order.id}`).join(', ')}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="text-slate-500 dark:text-slate-400">Preferred Method:</span>
                <span className="font-mono text-slate-900 dark:text-white">{paymentMethod}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="text-slate-500 dark:text-slate-400">Order Total:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="text-slate-500 dark:text-slate-400">Payment Status:</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">Pending Verification</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Delivery Address:</span>
                <span className="text-slate-900 dark:text-white text-right truncate max-w-[200px]">
                  {createdOrders[0].address}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-500/25"
            >
              Return to Storefront
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
