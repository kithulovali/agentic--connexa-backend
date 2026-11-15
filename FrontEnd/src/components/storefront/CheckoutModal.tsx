import React, { useEffect, useState } from 'react';
import {
  X,
  CreditCard,
  Building2,
  Smartphone,
  Coins,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { api } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import { OrderOut, PaymentOut } from '../../types';

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
  const [locationStatus, setLocationStatus] = useState<'detecting' | 'success' | 'error'>('detecting');

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setLocationStatus('error');
      return;
    }

    let cancelled = false;

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const params = new URLSearchParams({
            latitude: String(coords.latitude),
            longitude: String(coords.longitude),
            localityLanguage: 'en',
          });
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?${params.toString()}`
          );

          if (!response.ok) throw new Error('Reverse geocoding failed');

          const place = await response.json();
          const locality =
            place.city ||
            place.locality ||
            place.principalSubdivision ||
            '';
          const addressParts = [
            place.localityInfo?.administrative?.[0]?.name,
            locality,
            place.principalSubdivision,
            place.countryName,
          ].filter((part, index, all) => Boolean(part) && all.indexOf(part) === index);

          if (!cancelled && addressParts.length > 0) {
            setAddress((currentAddress) =>
              currentAddress.trim() ? currentAddress : addressParts.join(', ')
            );
            setLocationStatus('success');
          } else if (!cancelled) {
            setLocationStatus('error');
          }
        } catch (error) {
          console.error('Address lookup failed:', error);
          if (!cancelled) setLocationStatus('error');
        }
      },
      (error) => {
        console.warn('Geolocation unavailable:', error.message);
        if (!cancelled) setLocationStatus('error');
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000,
      }
    );

    return () => {
      cancelled = true;
    };
  }, []);
  const [contact, setContact] = useState(user?.contact || '');
  const [paymentMethod, setPaymentMethod] = useState<'BANK' | 'MOBILE MONEY' | 'CRYPTO'>('BANK');

  const [step, setStep] = useState<'FORM' | 'PROCESSING' | 'SUCCESS'>('FORM');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [createdOrder, setCreatedOrder] = useState<OrderOut | null>(null);
  const [paymentReceipt, setPaymentReceipt] = useState<PaymentOut | null>(null);

  const total = getTotalPrice();

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="w-full max-w-md rounded-3xl bg-white dark:glass-dropdown p-6 text-center border border-slate-200 dark:border-slate-800 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 font-heading">
            Authentication Required
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-6">
            Please sign in or create an account to securely place your electronics order and process your payment.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenAuth();
              }}
              className="flex-1 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-md shadow-brand-500/25"
            >
              Sign In / Register
            </button>
          </div>
        </div>
      </div>
    );
  }

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
      let lastOrder: OrderOut | null = null;
      let lastPayment: PaymentOut | null = null;
      let totalPaidAmount = 0;

      for (const item of items) {
        const order = await api.placeOrder({
          product_id: item.product.id,
          quantity: item.quantity,
          address: address.trim(),
          contact: contact.trim(),
          payment_method: paymentMethod,
        });
        lastOrder = order;

        const amountToPay = order.total_price || String((parseFloat(item.product.price) || 0) * item.quantity);
        const payment = await api.processPayment({
          order_id: order.id,
          payment_method: paymentMethod,
          amount: amountToPay,
        });
        lastPayment = payment;
        totalPaidAmount += parseFloat(String(payment.amount)) || 0;
      }

      if (lastOrder && lastPayment) {
        setCreatedOrder(lastOrder);
        setPaymentReceipt({
          ...lastPayment,
          amount: String(totalPaidAmount.toFixed(2)),
        });
      }
      clearCart();
      setStep('SUCCESS');
    } catch (err: any) {
      console.error('Order/Payment failed:', err);
      setError(err.message || 'Payment processing failed. Please check your details.');
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
                Checkout & Instant Payment
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Review delivery coordinates and select your payment rail.
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
                <p className="mt-1.5 text-[10px] text-slate-500 dark:text-slate-400" aria-live="polite">
                  {locationStatus === 'detecting' && 'Requesting location permission and finding your address...'}
                  {locationStatus === 'success' && 'Address detected from your device location. You can edit it if needed.'}
                  {locationStatus === 'error' && 'Could not detect your location. Enter your delivery address manually.'}
                </p>
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
                  Select Payment Method
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

            <button
              type="submit"
              disabled={loading || items.length === 0}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-600 hover:to-accent-600 text-white font-bold text-xs shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-all hover:scale-102"
            >
              <span>Confirm Order & Pay {formatCurrency(total)}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {step === 'PROCESSING' && (
          <div className="py-12 text-center space-y-4">
            <Loader2 className="w-12 h-12 text-brand-500 animate-spin mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
              Authorizing Order & Payment
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              Connecting with Urban Scenery Ventures payment gateway rail...
            </p>
          </div>
        )}

        {step === 'SUCCESS' && createdOrder && paymentReceipt && (
          <div className="text-center py-4 space-y-4 animate-in fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-heading">Payment Successful!</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
              Your order has been received, paid, and dispatched to our logistics team for fulfilment.
            </p>

            {/* Receipt Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="text-slate-500 dark:text-slate-400">Order Reference:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">#{createdOrder.id}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="text-slate-500 dark:text-slate-400">Payment ID:</span>
                <span className="font-mono text-brand-600 dark:text-brand-400 font-bold">#{paymentReceipt.id}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="text-slate-500 dark:text-slate-400">Method:</span>
                <span className="font-mono text-slate-900 dark:text-white">{paymentReceipt.payment_method}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="text-slate-500 dark:text-slate-400">Amount Paid:</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(paymentReceipt.amount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Delivery Address:</span>
                <span className="text-slate-900 dark:text-white text-right truncate max-w-[200px]">
                  {createdOrder.address}
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
