'use client';

import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { API_BASE } from '@/lib/api';
import Image from 'next/image';

export default function CartModal() {
  const { cart, cartTotal, updateQuantity, removeFromCart, clearCartItems, closeCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [placing, setPlacing] = useState(false);

  const handleConfirmOrder = async () => {
    if (!user) {
      closeCart();
      router.push('/auth/signin');
      return;
    }
    setPlacing(true);
    try {
      await api.post('/orders', {
        items: cart.map((c) => ({ menuItemId: c.menuItem.id, quantity: c.quantity })),
        deliveryAddress: user.address,
      });
      clearCartItems();
      closeCart();
      toast.success('Your Order has been confirmed!');
      router.push('/my-orders');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  const totalItems = cart.reduce((s, c) => s + c.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div
        className="flex flex-col max-h-[90vh]"
        style={{ width: 420, background: '#FBFAF8', border: '1px solid #E6E2D8', borderRadius: 12, boxShadow: '0px 21.77px 54.43px rgba(26,60,52,0.1)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4" style={{ borderBottom: '1px solid #E6E2D8' }}>
          <div className="flex items-center gap-3">
            <span style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 18, color: '#1A3C34' }}>Cart</span>
            {cart.length > 0 && (
              <span style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 400, fontSize: 14, color: '#7A7A7A' }}>{totalItems} Items</span>
            )}
          </div>
          <button onClick={closeCart} style={{ color: '#7A7A7A' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5L15 15M15 5L5 15" stroke="#7A7A7A" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12" style={{ color: '#7A7A7A', fontFamily: 'Manrope, sans-serif' }}>
              <span className="text-4xl mb-3">🛒</span>
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item, idx) => {
                const imageUrl = item.menuItem.image
                  ? item.menuItem.image.startsWith('http')
                    ? item.menuItem.image
                    : `${API_BASE}${item.menuItem.image}`
                  : null;
                return (
                  <div key={item.menuItem.id}>
                    <div className="flex items-center gap-3">
                      {/* Circular image */}
                      <div className="relative flex-shrink-0 rounded-full overflow-hidden" style={{ width: 44, height: 44, background: '#E6E2D8' }}>
                        {imageUrl ? (
                          <Image src={imageUrl} alt={item.menuItem.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-lg">🍽️</div>
                        )}
                      </div>

                      {/* Name + qty label */}
                      <div className="flex-1 min-w-0">
                        <p style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 14, color: '#1A1A1A' }} className="truncate">
                          {item.menuItem.name}
                        </p>
                        <p style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 400, fontSize: 12, color: '#7A7A7A' }}>
                          Quantity : {item.quantity}
                        </p>
                      </div>

                      {/* Qty counter */}
                      <div className="flex items-center" style={{ border: '1.5px solid #E6E2D8', borderRadius: 6, background: '#FBFAF8', height: 28 }}>
                        <button
                          onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                          className="flex items-center justify-center"
                          style={{ width: 28, height: 28, color: '#1A3C34' }}
                        >
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6H10" stroke="#1A3C34" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                        </button>
                        <span style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 600, fontSize: 13, color: '#1A1A1A', minWidth: 20, textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                          className="flex items-center justify-center"
                          style={{ width: 28, height: 28, color: '#1A3C34' }}
                        >
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M6 2V10M2 6H10" stroke="#1A3C34" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                        </button>
                      </div>

                      {/* Price */}
                      <span style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 14, color: '#1A1A1A', minWidth: 52, textAlign: 'right' }}>
                        ${(item.menuItem.price * item.quantity).toFixed(2)}
                      </span>

                      {/* Trash */}
                      <button onClick={() => removeFromCart(item.menuItem.id)}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M2 4H14M5 4V3C5 2.448 5.448 2 6 2H10C10.552 2 11 2.448 11 3V4M6 7V12M10 7V12M3 4L4 13C4 13.552 4.448 14 5 14H11C11.552 14 12 13.552 12 13L13 4" stroke="#D64045" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                    {idx < cart.length - 1 && (
                      <div className="mt-4" style={{ height: 1, background: '#E6E2D8' }} />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-5 pb-5 pt-4" style={{ borderTop: '1px solid #E6E2D8' }}>
            <div className="flex items-center justify-between mb-4">
              <span style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 18, color: '#1A1A1A' }}>Total Amount :</span>
              <span style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 18, color: '#1A3C34' }}>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={closeCart}
                className="flex-1 h-[36px] font-medium transition-colors"
                style={{ border: '1px solid #1A3C34', borderRadius: 56, fontFamily: 'Manrope, sans-serif', fontWeight: 500, fontSize: 14, color: '#1A3C34', background: 'transparent' }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmOrder}
                disabled={placing}
                className="flex-1 h-[36px] font-medium transition-opacity disabled:opacity-60"
                style={{ background: '#1A3C34', borderRadius: 56, fontFamily: 'Manrope, sans-serif', fontWeight: 500, fontSize: 14, color: 'white', border: 'none' }}
              >
                {placing ? 'Placing...' : 'Confirm Order'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
