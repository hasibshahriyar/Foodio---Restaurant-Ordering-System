'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, PlusCircle, ShoppingCart, Clock, Star } from 'lucide-react';
import UserLayout from '@/components/UserLayout';
import QuantityModal from '@/components/QuantityModal';
import { MenuItem } from '@/lib/types';
import api, { API_BASE } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import toast from 'react-hot-toast';

export default function MenuItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [showQuantityModal, setShowQuantityModal] = useState(false);

  useEffect(() => {
    if (!params.id) return;
    setLoading(true);
    api
      .get(`/menu-items/${params.id}`)
      .then((res) => setItem(res.data))
      .catch(() => {
        toast.error('Menu item not found');
        router.push('/menu');
      })
      .finally(() => setLoading(false));
  }, [params.id, router]);

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please sign in to add items to cart');
      router.push('/auth/signin');
      return;
    }
    if (!item) return;
    setShowQuantityModal(true);
  };

  const handleConfirmQuantity = (quantity: number) => {
    if (!item) return;
    addToCart(item, quantity);
    toast.success(`${item.name} has been added to cart.`);
    setShowQuantityModal(false);
  };

  const imageUrl = item?.image
    ? item.image.startsWith('http')
      ? item.image
      : `${API_BASE}${item.image}`
    : null;

  if (loading) {
    return (
      <UserLayout>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-24 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="aspect-square bg-gray-200 rounded-2xl" />
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-10 bg-gray-200 rounded w-1/3 mt-8" />
              </div>
            </div>
          </div>
        </div>
      </UserLayout>
    );
  }

  if (!item) {
    return (
      <UserLayout>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <p className="text-5xl mb-4">🍽️</p>
          <p className="text-gray-500 text-lg">Menu item not found</p>
          <Link
            href="/menu"
            className="inline-block mt-6 text-primary-500 hover:text-primary-600 font-medium"
          >
            ← Back to Menu
          </Link>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back link */}
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 font-medium text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Menu
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Image */}
          <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-sm">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={item.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl">
                🍽️
              </div>
            )}
            {!item.isAvailable && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-semibold text-lg bg-black/60 px-6 py-2 rounded-full">
                  Currently Unavailable
                </span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            {/* Category badge */}
            {item.category && (
              <span className="inline-block bg-orange-50 text-primary-600 text-xs font-semibold px-3 py-1 rounded-full w-fit mb-3">
                {item.category.name}
              </span>
            )}

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {item.name}
            </h1>

            {/* Status indicator */}
            <div className="flex items-center gap-3 mb-4">
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                  item.isAvailable
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-600'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    item.isAvailable ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
                {item.isAvailable ? 'Available' : 'Unavailable'}
              </span>
            </div>

            {/* Price */}
            <p className="text-3xl font-bold text-primary-500 mb-6">
              ${Number(item.price).toFixed(2)}
            </p>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Info badges */}
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center gap-1.5 bg-gray-50 text-gray-600 px-3 py-2 rounded-lg text-sm">
                <Clock size={14} />
                <span>15–25 mins</span>
              </div>
              <div className="flex items-center gap-1.5 bg-gray-50 text-gray-600 px-3 py-2 rounded-lg text-sm">
                <Star size={14} className="text-yellow-500" />
                <span>Chef's Pick</span>
              </div>
            </div>

            {/* Add to Cart button */}
            <div className="mt-auto">
              <button
                onClick={handleAddToCart}
                disabled={!item.isAvailable}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-base"
              >
                {item.isAvailable ? (
                  <>
                    <PlusCircle size={18} />
                    Add to Cart
                  </>
                ) : (
                  'Currently Unavailable'
                )}
              </button>

              {!user && item.isAvailable && (
                <p className="text-xs text-gray-400 mt-2">
                  You'll need to{' '}
                  <Link
                    href="/auth/signin"
                    className="text-primary-500 font-medium hover:underline"
                  >
                    sign in
                  </Link>{' '}
                  to add items to your cart.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quantity Modal */}
      {showQuantityModal && item && (
        <QuantityModal
          item={item}
          onConfirm={handleConfirmQuantity}
          onCancel={() => setShowQuantityModal(false)}
        />
      )}
    </UserLayout>
  );
}
