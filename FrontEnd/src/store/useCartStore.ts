import { create } from 'zustand';
import { CartItem, ProductOut } from '../types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: ProductOut, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  setIsOpen: (isOpen: boolean) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const STORAGE_KEY = 'urban_scenery_cart';

const loadCart = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load cart from localStorage:', e);
  }
  return [];
};

export const useCartStore = create<CartState>((set, get) => ({
  items: loadCart(),
  isOpen: false,

  addItem: (product: ProductOut, quantity: number = 1) => {
    const items = [...get().items];
    const existingIndex = items.findIndex((i) => i.product.id === product.id);

    if (existingIndex > -1) {
      const newQty = items[existingIndex].quantity + quantity;
      // Cap at product inventory if known
      const available = product.quantity ?? 999;
      items[existingIndex].quantity = Math.min(newQty, available);
    } else {
      items.push({ product, quantity: Math.min(quantity, product.quantity ?? 999) });
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    set({ items, isOpen: true });
  },

  removeItem: (productId: number) => {
    const items = get().items.filter((i) => i.product.id !== productId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    set({ items });
  },

  updateQuantity: (productId: number, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    const items = get().items.map((i) => {
      if (i.product.id === productId) {
        const available = i.product.quantity ?? 999;
        return { ...i, quantity: Math.min(quantity, available) };
      }
      return i;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    set({ items });
  },

  clearCart: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ items: [] });
  },

  setIsOpen: (isOpen: boolean) => set({ isOpen }),

  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  getTotalPrice: () => {
    return get().items.reduce((total, item) => {
      const price = parseFloat(item.product.price) || 0;
      return total + price * item.quantity;
    }, 0);
  },
}));

