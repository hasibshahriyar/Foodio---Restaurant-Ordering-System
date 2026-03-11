'use client';

import { useState } from 'react';
import { MenuItem } from '@/lib/types';

interface Props {
  item: MenuItem;
  onConfirm: (quantity: number) => void;
  onCancel: () => void;
}

export default function QuantityModal({ item, onConfirm, onCancel }: Props) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div
        className="p-6"
        style={{ width: 512, background: '#FBFAF8', border: '1px solid #E6E2D8', borderRadius: 12, boxShadow: '0px 21.77px 54.43px rgba(26,60,52,0.1)' }}
      >
        {/* Title */}
        <p style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 18, color: '#1A3C34', marginBottom: 16 }}>
          Select the quantity
        </p>

        {/* Item name */}
        <p style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 16, color: '#1A1A1A', marginBottom: 20 }}>
          {item.name}
        </p>

        {/* Qty row */}
        <div className="flex items-center justify-between mb-8">
          <span style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 400, fontSize: 14, color: '#7A7A7A' }}>Items</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              style={{ opacity: quantity <= 1 ? 0.4 : 1, color: '#1A3C34' }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 10H16" stroke="#1A3C34" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            <div
              className="flex items-center justify-center"
              style={{ width: 67, height: 44, background: '#FBFAF8', border: '1.5px solid #E6E2D8', borderRadius: 12 }}
            >
              <span style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 600, fontSize: 30, color: '#1A1A1A' }}>{quantity}</span>
            </div>
            <button onClick={() => setQuantity(quantity + 1)} style={{ color: '#1A3C34' }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 4V16M4 10H16" stroke="#1A3C34" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            style={{ width: 139, height: 36, border: '1px solid #1A3C34', borderRadius: 56, background: 'transparent', fontFamily: 'Manrope, sans-serif', fontWeight: 500, fontSize: 14, color: '#1A3C34' }}
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(quantity)}
            style={{ width: 139, height: 36, background: '#1A3C34', border: 'none', borderRadius: 56, fontFamily: 'Manrope, sans-serif', fontWeight: 500, fontSize: 14, color: 'white' }}
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}
