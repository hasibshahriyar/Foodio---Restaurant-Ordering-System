'use client';

import { useState } from 'react';
import { X, Minus, Plus } from 'lucide-react';
import { MenuItem } from '@/lib/types';

interface Props {
  item: MenuItem;
  onConfirm: (quantity: number) => void;
  onCancel: () => void;
}

export default function QuantityModal({ item, onConfirm, onCancel }: Props) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Select the quantity</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <p className="text-gray-700 font-medium mb-4">{item.name}</p>

        <div className="flex items-center gap-4 mb-6">
          <span className="text-gray-600 text-sm">Items</span>
          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <Minus size={14} />
            </button>
            <span className="font-semibold text-gray-900 w-6 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(quantity)}
            className="flex-1 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}
