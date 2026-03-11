'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Clock, ChefHat, Package } from 'lucide-react';
import UserLayout from '@/components/UserLayout';
import { useAuth } from '@/context/AuthContext';
import { Order, OrderStatus } from '@/lib/types';
import api from '@/lib/api';

const STATUS_STEPS: OrderStatus[] = ['Pending', 'Preparing', 'Ready', 'Completed'];

const statusIcon = (s: OrderStatus) => {
  if (s === 'Pending') return <Clock size={14} />;
  if (s === 'Preparing') return <ChefHat size={14} />;
  if (s === 'Ready') return <Package size={14} />;
  return <CheckCircle2 size={14} />;
};

const statusColor = (s: OrderStatus) => {
  if (s === 'Completed') return 'bg-green-100 text-green-700';
  if (s === 'Ready') return 'bg-blue-100 text-blue-700';
  if (s === 'Preparing') return 'bg-yellow-100 text-yellow-700';
  return 'bg-gray-100 text-gray-600';
};

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

  return (
    <UserLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">My Orders</h1>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
                <div className="h-3 bg-gray-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-3">📋</p>
            <p>No orders yet</p>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => {
              const stepIdx = getStepIndex(order.status);
              return (
                <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-semibold text-gray-900">
                        Order #{order.id.substring(0, 8)}
                      </p>
                      <p className="text-sm text-gray-500 mt-0.5">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">${Number(order.totalAmount).toFixed(2)}</p>
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full mt-1 ${statusColor(order.status)}`}>
                        {statusIcon(order.status)}
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="mb-4 space-y-1.5">
                    <p className="text-sm font-medium text-gray-700 mb-2">Items</p>
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.quantity}x {item.menuItem?.name || 'Item'}
                        </span>
                        <span className="text-gray-700">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-sm font-semibold pt-2 border-t border-gray-100">
                      <span>Total Amount :</span>
                      <span>${Number(order.totalAmount).toFixed(2)}</span>
                    </div>
                  </div>

                  {order.deliveryAddress && (
                    <p className="text-sm text-gray-500 mb-4">
                      Delivering to: {order.deliveryAddress}
                    </p>
                  )}

                  {/* Status steps */}
                  <div className="flex items-center gap-1">
                    {STATUS_STEPS.map((step, i) => (
                      <div key={step} className="flex items-center flex-1">
                        <div className="flex flex-col items-center flex-1">
                          <div
                            className={`w-full h-1.5 rounded-full ${
                              i <= stepIdx ? 'bg-primary-500' : 'bg-gray-200'
                            }`}
                          />
                          <span
                            className={`text-xs mt-1 font-medium ${
                              i <= stepIdx ? 'text-primary-500' : 'text-gray-400'
                            }`}
                          >
                            {step}
                          </span>
                        </div>
                      </div>
                    ))}
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
