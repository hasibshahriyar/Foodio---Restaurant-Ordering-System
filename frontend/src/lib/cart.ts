import { CartItem, MenuItem } from './types';

const CART_KEY = 'foodio_cart';

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveCart(cart: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(menuItem: MenuItem, quantity = 1): CartItem[] {
  const cart = getCart();
  const existing = cart.find((c) => c.menuItem.id === menuItem.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ menuItem, quantity });
  }
  saveCart(cart);
  return cart;
}

export function updateCartQuantity(menuItemId: string, quantity: number): CartItem[] {
  const cart = getCart();
  const item = cart.find((c) => c.menuItem.id === menuItemId);
  if (item) {
    item.quantity = quantity;
    if (item.quantity <= 0) return removeFromCart(menuItemId);
  }
  saveCart(cart);
  return cart;
}

export function removeFromCart(menuItemId: string): CartItem[] {
  const cart = getCart().filter((c) => c.menuItem.id !== menuItemId);
  saveCart(cart);
  return cart;
}

export function clearCart(): void {
  localStorage.removeItem(CART_KEY);
}

export function getCartCount(cart: CartItem[]): number {
  return cart.reduce((sum, c) => sum + c.quantity, 0);
}

export function getCartTotal(cart: CartItem[]): number {
  return cart.reduce((sum, c) => sum + c.menuItem.price * c.quantity, 0);
}
