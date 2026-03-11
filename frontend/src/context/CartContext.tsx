'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { CartItem, MenuItem } from '@/lib/types';
import {
  getCart,
  addToCart as addCartItem,
  updateCartQuantity,
  removeFromCart as removeCartItem,
  clearCart,
  getCartCount,
  getCartTotal,
} from '@/lib/cart';

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (item: MenuItem, quantity?: number) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  removeFromCart: (menuItemId: string) => void;
  clearCartItems: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    setCart(getCart());
  }, []);

  const addToCart = useCallback((item: MenuItem, quantity = 1) => {
    setCart(addCartItem(item, quantity));
  }, []);

  const updateQuantity = useCallback((menuItemId: string, quantity: number) => {
    setCart(updateCartQuantity(menuItemId, quantity));
  }, []);

  const removeFromCart = useCallback((menuItemId: string) => {
    setCart(removeCartItem(menuItemId));
  }, []);

  const clearCartItems = useCallback(() => {
    clearCart();
    setCart([]);
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount: getCartCount(cart),
        cartTotal: getCartTotal(cart),
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCartItems,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
