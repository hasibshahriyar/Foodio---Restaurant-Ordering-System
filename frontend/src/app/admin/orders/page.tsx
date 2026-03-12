'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Order, OrderStatus, PaginatedResponse } from '@/lib/types';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import OrderDetailsModal from '@/components/admin/OrderDetailsModal';

const STATUS_OPTIONS: OrderStatus[] = ['Pending', 'Preparing', 'Ready', 'Completed'];

export default function AdminOrdersPage() {
  const [data, setData] = useState<PaginatedResponse<Order> | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number } | null>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const fetchOrders = useCallback(async (p = page) => {
    setLoading(true);
    try {
      const res = await api.get('/orders', { params: { page: p, limit: 15 } });
      setData(res.data);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    setOpenDropdown(null);
    setDropdownPos(null);
    try {
      await api.patch(`/orders/${orderId}/status`, { status });
      toast.success(`Status updated to ${status}`);
      fetchOrders();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const toggleDropdown = (e: React.MouseEvent, orderId: string) => {
    e.stopPropagation();
    if (openDropdown === orderId) {
      setOpenDropdown(null);
      setDropdownPos(null);
    } else {
      const btn = buttonRefs.current[orderId];
      if (btn) {
        const rect = btn.getBoundingClientRect();
        setDropdownPos({ top: rect.bottom + 4, left: rect.left });
      }
      setOpenDropdown(orderId);
    }
  };

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const statusBadgeStyle = (s: OrderStatus): React.CSSProperties => {
    if (s === 'Completed') return { background: 'rgba(0,130,54,0.1)', color: '#008236' };
    if (s === 'Ready') return { background: 'rgba(0,100,200,0.1)', color: '#0064C8' };
    return { background: 'rgba(240,177,0,0.1)', color: '#D08700' };
  };

  const openOrder = data?.data.find((o) => o.id === openDropdown) ?? null;

  return (
    <>
      {openDropdown && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => { setOpenDropdown(null); setDropdownPos(null); }} />
      )}

      {openDropdown && dropdownPos && openOrder && typeof document !== 'undefined' && createPortal(
        <div
          onClick={(e) => e.stopPropagation()}
          style={{ position: 'fixed', top: dropdownPos.top, left: dropdownPos.left, width: 130, background: 'white', border: '1px solid #E6E2D8', borderRadius: 8, zIndex: 100, overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
        >
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => handleStatusChange(openOrder.id, s)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', fontFamily: 'Manrope, sans-serif', fontSize: 13, color: '#1A1A1A', background: openOrder.status === s ? '#F2EFE9' : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
            >
              {s}
              {openOrder.status === s && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2.5 7L5.5 10L11.5 4" stroke="#1A3C34" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          ))}
        </div>,
        document.body
      )}

      <div style={{ background: 'white', border: '1px solid #E6E2D8', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#FBFAF8', borderBottom: '1px solid #E6E2D8' }}>
                {['ORDER ID', 'DATE', 'CUSTOMER', 'TOTAL', 'STATUS', 'ACTIONS'].map((col) => (
                  <th key={col} style={{ fontFamily: 'Manrope, sans-serif', fontSize: 12, fontWeight: 600, color: '#7A7A7A', letterSpacing: '0.08em', padding: '0 20px', height: 44, textAlign: 'left', whiteSpace: 'nowrap' }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #E6E2D8', height: 49 }}>
                    {[1,2,3,4,5,6].map((j) => (
                      <td key={j} style={{ padding: '0 20px' }}>
                        <div style={{ height: 14, background: '#F2EFE9', borderRadius: 4 }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : (data?.data || []).map((order) => (
                <tr key={order.id} style={{ borderBottom: '1px solid #E6E2D8', height: 49 }}>
                  <td style={{ padding: '0 20px', fontFamily: 'Manrope, sans-serif', fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>
                    #{order.id.substring(0, 8)}
                  </td>
                  <td style={{ padding: '0 20px', fontFamily: 'Manrope, sans-serif', fontSize: 13, color: '#2D2D2D' }}>
                    {formatDate(order.createdAt)}
                  </td>
                  <td style={{ padding: '0 20px', fontFamily: 'Manrope, sans-serif', fontSize: 13, color: '#2D2D2D' }}>
                    {order.user?.name || 'N/A'}
                  </td>
                  <td style={{ padding: '0 20px', fontFamily: 'Manrope, sans-serif', fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>
                    ${Number(order.totalAmount).toFixed(2)}
                  </td>
                  <td style={{ padding: '0 20px' }}>
                    <button
                      ref={(el) => { buttonRefs.current[order.id] = el; }}
                      onClick={(e) => toggleDropdown(e, order.id)}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: 130, height: 36, padding: '0 10px', background: '#FBFAF8', border: '1px solid #E6E2D8', borderRadius: 6, fontFamily: 'Manrope, sans-serif', fontSize: 13, color: '#1A1A1A', cursor: 'pointer', gap: 6 }}
                    >
                      <span style={{ ...statusBadgeStyle(order.status), borderRadius: 20, padding: '2px 8px', fontSize: 12, fontWeight: 500 }}>{order.status}</span>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 4.5L6 8L9.5 4.5" stroke="#7A7A7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </td>
                  <td style={{ padding: '0 20px' }}>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      style={{ background: 'rgba(230,226,216,0.49)', border: '1px solid #E6E2D8', borderRadius: 6, padding: '0 12px', height: 28.89, fontFamily: 'Manrope, sans-serif', fontSize: 13, color: '#1A1A1A', cursor: 'pointer' }}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data && data.totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderTop: '1px solid #E6E2D8' }}>
            <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 13, color: '#7A7A7A' }}>{data.total} total orders</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                style={{ padding: '4px 12px', border: '1px solid #E6E2D8', borderRadius: 6, fontFamily: 'Manrope, sans-serif', fontSize: 13, color: '#1A1A1A', background: 'white', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1 }}
              >
                Prev
              </button>
              <button
                disabled={page === data.totalPages}
                onClick={() => setPage(page + 1)}
                style={{ padding: '4px 12px', border: '1px solid #E6E2D8', borderRadius: 6, fontFamily: 'Manrope, sans-serif', fontSize: 13, color: '#1A1A1A', background: 'white', cursor: page === data.totalPages ? 'not-allowed' : 'pointer', opacity: page === data.totalPages ? 0.5 : 1 }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedOrder && (
        <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </>
  );
}
