import React, { useEffect, useRef, useState } from 'react';
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
  MapPin,
  LocateFixed,
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
  const [isLocating, setIsLocating] = useState(false);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);
  const addressEditedByCustomer = useRef(false);
  const [contact, setContact] = useState(user?.contact || '');
  const [paymentMethod, setPaymentMethod] = useState<'BANK' | 'MOBILE MONEY' | 'CRYPTO'>('BANK');

  const [step, setStep] = useState<'FORM' | 'PROCESSING' | 'SUCCESS'>('FORM');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [createdOrder, setCreatedOrder] = useState<OrderOut | null>(null);
  const [paymentReceipt, setPaymentReceipt] = useState<PaymentOut | null>(null);

  const total = getTotalPrice();

  const resolveCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage('Location is not supported by this browser. Enter your address manually.');
      return;
    }

    setIsLocating(true);
    setLocationMessage('Getting your location…');

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const params = new URLSearchParams({
            format: 'jsonv2',
            lat: String(coords.latitude),
            lon: String(coords.longitude),
            zoom: '18',
            addressdetails: '1',
          });
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?${params.toString()}`,
            { headers: { 'Accept-Language': 'en' } }
          );

          if (!response.ok) {
            throw new Error('The address lookup service could not resolve your location.');
          }

          const result: { display_name?: string } = await response.json();
          const resolvedAddress = result.display_name?.trim();

          if (!resolvedAddress) {
            throw new Error('No readable address was found for this location.');
          }

          if (!addressEditedByCustomer.current) {
            setAddress(resolvedAddress);
            setLocationMessage('Delivery address detected from your current location. You can edit it before placing the order.');
          } else {
            setLocationMessage('Location detected. Your manually entered address was kept.');
          }
        } catch (locationError) {
          console.error('Reverse geocoding failed:', locationError);
          setLocationMessage(
            locationError instanceof Error
              ? `${locationError.message} Enter your address manually.`
              : 'Could not resolve your address. Enter it manually.'
          );
        } finally {
          setIsLocating(false);
        }
      },
      (geoError) => {
        const message =
          geoError.code === geoError.PERMISSION_DENIED
            ? 'Location permission was denied. Allow location access or enter your address manually.'
            : geoError.code === geoError.POSITION_UNAVAILABLE
              ? 'Your current location is unavailable. Enter your address manually.'
              : 'Location request timed out. Try again or enter your address manually.';
        setLocationMessage(message);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  };

  useEffect(() => {
    resolveCurrentLocation();
    // Request the customer's location when checkout opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <div className="w-full max-w-md rounded-3xl glass-dropdown p-6 text-center border border-slate-800 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Authentication Required</h3>
          <p className="text-xs text-slate-400 mb-6">
            Please sign in or create an account to securely place your electronics order and process your payment.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenAuth();
              }}
              className="flex-1 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow-md shadow-sky-500/20"
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
      // Place order for primary cart item
      const primaryItem = items[0];
      const order = await api.placeOrder({
        product_id: primaryItem.product.id,
        quantity: primaryItem.quantity,
        address: address.trim(),
        contact: contact.trim(),
        payment_method: paymentMethod,
      });

      setCreatedOrder(order);

      // Now immediately process payment on order
      const amountToPay = order.total_price || primaryItem.product.price;
      const payment = await api.processPayment({
        order_id: order.id,
        payment_method: paymentMethod,
        amount: amountToPay,
      });

      setPaymentReceipt(payment);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-3xl glass-dropdown border border-slate-700/80 p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'FORM' && (
          <form onSubmit={handlePlaceOrderAndPay}>
            <div className="flex items-center gap-2 mb-1">
              <CreditCard className="w-5 h-5 text-sky-400" />
              <h3 className="text-lg font-bold text-white">Checkout & Instant Payment</h3>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              Review delivery coordinates and select your payment rail.
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Cart Summary Snippet */}
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 mb-5">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                Order Items ({items.length})
              </div>
              <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex justify-between text-xs">
                    <span className="text-slate-300 truncate max-w-[240px]">
                      {quantity}x {product.name}
                    </span>
                    <span className="font-mono text-white">
                      {formatCurrency((parseFloat(product.price) || 0) * quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-2 mt-2 border-t border-slate-800 flex justify-between text-xs font-bold">
                <span className="text-slate-300">Total Payable:</span>
                <span className="text-sky-400 font-mono text-sm">{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Delivery Inputs */}
            <div className="space-y-4 mb-6">
              <div>
                <div className="flex items-center justify-between gap-3 mb-1">
                  <label className="text-[11px] font-semibold text-slate-300 uppercase font-mono">
                    Shipping Address *
                  </label>
                  <button
                    type="button"
                    onClick={resolveCurrentLocation}
                    disabled={isLocating}
                    className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-sky-400 hover:text-sky-300 disabled:opacity-50"
                  >
                    {isLocating ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <LocateFixed className="w-3.5 h-3.5" />
                    )}
                    {isLocating ? 'Locating…' : 'Use current location'}
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => {
                    addressEditedByCustomer.current = true;
                    setAddress(e.target.value);
                  }}
                  placeholder="Detecting your address…"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
                {locationMessage && (
                  <p className="mt-1.5 text-[10px] text-slate-400 flex items-start gap-1.5">
                    <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0 text-sky-400" />
                    <span>{locationMessage}</span>
                  </p>
                )}
                <p className="mt-1 text-[9px] text-slate-500">
                  Location lookup uses OpenStreetMap. Please verify the detected address before ordering.
                </p>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1 uppercase font-mono">
                  Contact Phone / WhatsApp *
                </label>
                <input
                  type="text"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              {/* Payment Rail Options */}
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1.5 uppercase font-mono">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('BANK')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      paymentMethod === 'BANK'
                        ? 'bg-sky-500/10 border-sky-500 text-sky-400 shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
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
                        ? 'bg-sky-500/10 border-sky-500 text-sky-400 shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
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
                        ? 'bg-sky-500/10 border-sky-500 text-sky-400 shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
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
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 transition-all hover:scale-102"
            >
              <span>Confirm Order & Pay {formatCurrency(total)}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {step === 'PROCESSING' && (
          <div className="py-12 text-center space-y-4">
            <Loader2 className="w-12 h-12 text-sky-400 animate-spin mx-auto" />
            <h3 className="text-base font-bold text-white">Authorizing Order & Payment</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Connecting with Urban Scenery Ventures payment gateway rail...
            </p>
          </div>
        )}

        {step === 'SUCCESS' && createdOrder && paymentReceipt && (
          <div className="text-center py-4 space-y-4 animate-in fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-white">Payment Successful!</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Your order has been received, paid, and dispatched to our logistics team for fulfilment.
            </p>

            {/* Receipt Card */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Order Reference:</span>
                <span className="font-mono font-bold text-white">#{createdOrder.id}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Payment ID:</span>
                <span className="font-mono text-sky-400">#{paymentReceipt.id}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Method:</span>
                <span className="font-mono text-white">{paymentReceipt.payment_method}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Amount Paid:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {formatCurrency(paymentReceipt.amount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Delivery Address:</span>
                <span className="text-white text-right truncate max-w-[200px]">
                  {createdOrder.address}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs"
            >
              Return to Storefront
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

