'use client';

import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
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

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-900 text-lg">Cart</h2>
            {cart.length > 0 && (
              <p className="text-gray-500 text-sm">{cart.reduce((s, c) => s + c.quantity, 0)} Items</p>
            )}
          </div>
          <button onClick={closeCart} className="text-gray-400 hover:text-gray-600">
            <X size={22} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <ShoppingBag size={48} className="mb-3 opacity-30" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => {
                const imageUrl = item.menuItem.image
                  ? item.menuItem.image.startsWith('http')
                    ? item.menuItem.image
                    : `${API_BASE}${item.menuItem.image}`
                  : null;
                return (
                  <div key={item.menuItem.id} className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                      {imageUrl ? (
                        <Image src={imageUrl} alt={item.menuItem.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl">🍽️</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{item.menuItem.name}</p>
                      <p className="text-gray-500 text-xs">Quantity : {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="w-5 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                        >
                          <Plus size={11} />
                        </button>
                      </div>
                      <span className="text-primary-500 font-semibold text-sm w-16 text-right">
                        ${(item.menuItem.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.menuItem.id)}
                        className="text-gray-400 hover:text-red-500 ml-1"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-700 font-medium">Total Amount :</span>
              <span className="font-bold text-gray-900 text-lg">${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={closeCart}
                className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmOrder}
                disabled={placing}
                className="flex-1 py-2.5 bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white font-medium rounded-lg transition-colors"
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
