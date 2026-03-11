'use client';

import { useCart } from '@/context/CartContext';
import CartModal from './CartModal';

export default function CartModalWrapper() {
  const { isCartOpen } = useCart();
  return isCartOpen ? <CartModal /> : null;
}
