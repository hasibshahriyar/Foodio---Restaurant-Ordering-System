'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import UserLayout from '@/components/UserLayout';
import { useAuth } from '@/context/AuthContext';
import { Order, OrderStatus } from '@/lib/types';
import api from '@/lib/api';

const STATUS_STEPS: OrderStatus[] = ['Pending', 'Preparing', 'Ready', 'Completed'];

export default function MyOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    api
      .get('/orders/my-orders')
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  }, [user]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getStepIndex = (status: OrderStatus) => STATUS_STEPS.indexOf(status);

  const statusBadgeStyle = (s: OrderStatus): React.CSSProperties => {
    if (s === 'Completed')
      return { background: 'rgba(0,130,54,0.1)', color: '#008236', border: '1px solid rgba(0,130,54,0.2)', borderRadius: 6, padding: '2px 10px', fontFamily: 'Manrope, sans-serif', fontWeight: 500, fontSize: 13 };
    if (s === 'Pending')
      return { background: 'rgba(240,177,0,0.1)', color: '#D08700', border: '1px solid rgba(240,177,0,0.2)', borderRadius: 6, padding: '2px 10px', fontFamily: 'Manrope, sans-serif', fontWeight: 500, fontSize: 13 };
    if (s === 'Preparing')
      return { background: 'rgba(59,130,246,0.1)', color: '#2563EB', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 6, padding: '2px 10px', fontFamily: 'Manrope, sans-serif', fontWeight: 500, fontSize: 13 };
    return { background: 'rgba(100,116,139,0.1)', color: '#475569', border: '1px solid rgba(100,116,139,0.2)', borderRadius: 6, padding: '2px 10px', fontFamily: 'Manrope, sans-serif', fontWeight: 500, fontSize: 13 };
  };

  return (
    <UserLayout>
      <div className="px-4 sm:px-8 lg:px-[105px] py-8 lg:py-[48px]">
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: 32, color: '#1A3C34', marginBottom: 24 }}>
          My Orders
        </h1>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="rounded-[12px] border border-[#E6E2D8] p-6 animate-pulse" style={{ background: '#FBFAF8' }}>
                <div className="h-4 rounded w-1/2 mb-3" style={{ background: '#E6E2D8' }} />
                <div className="h-3 rounded w-1/3" style={{ background: '#E6E2D8' }} />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16" style={{ color: '#7A7A7A', fontFamily: 'Manrope, sans-serif' }}>
            <p className="text-5xl mb-3">📋</p>
            <p>No orders yet</p>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => {
              const stepIdx = getStepIndex(order.status);
              return (
                <div key={order.id} className="rounded-[12px] border border-[#E6E2D8] p-6" style={{ background: '#FBFAF8' }}>
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <p style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 18, color: '#1A3C34' }}>
                        Order #{order.id.substring(0, 8).toUpperCase()}
                      </p>
                      <p className="mt-1" style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 400, fontSize: 13, color: '#7A7A7A' }}>
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <span style={statusBadgeStyle(order.status)}>{order.status}</span>
                  </div>

                  {/* Delivery address */}
                  {order.deliveryAddress && (
                    <p className="mb-4" style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 400, fontSize: 13, color: '#7A7A7A' }}>
                      Delivering to: <span style={{ color: '#2D2D2D', fontWeight: 500 }}>{order.deliveryAddress}</span>
                    </p>
                  )}

                  {/* Items section */}
                  <div className="mb-5">
                    <p className="mb-3" style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 12, color: '#7A7A7A', letterSpacing: '0.08em' }}>
                      ITEMS
                    </p>
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between mb-2">
                        <span style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 400, fontSize: 14, color: '#2D2D2D' }}>
                          {item.quantity}x {item.menuItem?.name || 'Item'}
                        </span>
                        <span style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 500, fontSize: 14, color: '#1A1A1A' }}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    <div style={{ height: 1, background: '#E6E2D8', margin: '12px 0' }} />
                    <div className="flex items-center justify-between">
                      <span style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 16, color: '#1A1A1A' }}>Total Amount :</span>
                      <span style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 16, color: '#1A3C34' }}>${Number(order.totalAmount).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Status tracker */}
                  <div className="flex items-center gap-0">
                    {STATUS_STEPS.map((step, i) => {
                      const active = i <= stepIdx;
                      return (
                        <div key={step} className="flex-1">
                          <div
                            className="h-[6px] rounded-full"
                            style={{
                              background: active ? '#1A3C34' : '#E4E4E4',
                              marginRight: i < STATUS_STEPS.length - 1 ? 4 : 0,
                            }}
                          />
                          <p className="mt-1.5 text-center" style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 500, fontSize: 11, color: active ? '#1A3C34' : '#7A7A7A' }}>
                            {step}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </UserLayout>
  );
}
