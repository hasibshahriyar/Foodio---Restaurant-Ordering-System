'use client';

import { Order } from '@/lib/types';

interface Props {
  order: Order;
  onClose: () => void;
}

export default function OrderDetailsModal({ order, onClose }: Props) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ width: 512, background: '#FBFAF8', border: '1px solid #E6E2D8', borderRadius: 12, padding: 24 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <span style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 18, color: '#1A3C34' }}>
            Order Details #{order.id.substring(0, 8)}
          </span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4L12 12" stroke="#7A7A7A" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Address */}
        {order.deliveryAddress && (
          <>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 12, color: '#7A7A7A' }}>Address</span>
              <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 14, color: '#1A1A1A', maxWidth: 320, textAlign: 'right' }}>{order.deliveryAddress}</span>
            </div>
            <div style={{ borderTop: '1px solid #E6E2D8', marginBottom: 16 }} />
          </>
        )}

        {/* Items label */}
        <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: 12, fontWeight: 600, color: '#7A7A7A', letterSpacing: '0.08em', marginBottom: 10 }}>ITEMS</div>

        {/* Items list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          {order.items.map((item) => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 14, color: '#2D2D2D' }}>{item.quantity}x {item.menuItem?.name || 'Item'}</span>
              <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 14, color: '#1A1A1A', fontWeight: 600 }}>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid #E6E2D8', marginBottom: 16 }} />

        {/* Total */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 16, fontWeight: 700, color: '#1A1A1A' }}>Total Amount :</span>
          <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 16, fontWeight: 700, color: '#1A3C34' }}>${Number(order.totalAmount).toFixed(2)}</span>
        </div>

      </div>
    </div>
  );
}

