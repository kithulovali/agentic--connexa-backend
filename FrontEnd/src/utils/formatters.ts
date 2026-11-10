import { OrderOut } from '../types';

export function formatCurrency(amount: string | number | undefined | null): string {
  if (amount === undefined || amount === null || amount === '') return '$0.00';
  const num = typeof amount === 'number' ? amount : parseFloat(String(amount));
  if (isNaN(num)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(num);
}

export function formatDate(dateStr?: string | null): string {
  if (!dateStr) return 'N/A';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

export function truncateText(text: string | null | undefined, maxLen = 100): string {
  if (!text) return '';
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen) + '...';
}

/**
 * Normalizes contact string across the 'contacs' typo quirk in OrderOut
 */
export function getOrderContact(order: OrderOut): string {
  return order.contacs || (order as any).contact || 'N/A';
}

export function getStatusBadge(status: string): { label: string; bg: string; text: string } {
  const s = (status || '').toUpperCase();
  switch (s) {
    case 'AVAILABLE':
    case 'PAID':
    case 'DELIVERED':
    case 'COMPLETED':
      return { label: s, bg: 'bg-emerald-500/10 border-emerald-500/30', text: 'text-emerald-400' };
    case 'PROCESSING':
    case 'SHIPPED':
      return { label: s, bg: 'bg-sky-500/10 border-sky-500/30', text: 'text-sky-400' };
    case 'PENDING':
      return { label: s, bg: 'bg-amber-500/10 border-amber-500/30', text: 'text-amber-400' };
    case 'EMPTY':
    case 'OUT_OF_STOCK':
    case 'CANCELLED':
    case 'FAILED':
      return { label: s, bg: 'bg-rose-500/10 border-rose-500/30', text: 'text-rose-400' };
    default:
      return { label: s || 'UNKNOWN', bg: 'bg-slate-500/10 border-slate-500/30', text: 'text-slate-400' };
  }
}

