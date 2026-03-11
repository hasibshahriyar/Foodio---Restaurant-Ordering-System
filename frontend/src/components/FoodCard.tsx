'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { MenuItem } from '@/lib/types';
import { API_BASE } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import QuantityModal from './QuantityModal';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface Props {
  item: MenuItem;
}

export default function FoodCard({ item }: Props) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [imgError, setImgError] = useState(false);

  const imageUrl = item.image
    ? item.image.startsWith('http')
      ? item.image
      : `${API_BASE}${item.image}`
    : null;

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please sign in to add items to cart');
      router.push('/auth/signin');
      return;
    }
    setShowQuantityModal(true);
  };

  const handleConfirmQuantity = (quantity: number) => {
    addToCart(item, quantity);
    toast.success(`${item.name} has been added to cart.`);
    setShowQuantityModal(false);
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
        <Link href={`/menu/${item.id}`} className="block">
          <div className="relative h-44 bg-[#FEF7EA]">
            {imageUrl && !imgError ? (
              <Image
                src={imageUrl}
                alt={item.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl">🍽️</div>
            )}
            {!item.isAvailable && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">Unavailable</span>
              </div>
            )}
          </div>
        </Link>
        <div className="p-4">
          <Link href={`/menu/${item.id}`}>
            <h3 className="font-semibold text-gray-900 text-base leading-tight mb-1 hover:text-primary-500 transition-colors">{item.name}</h3>
          </Link>
          <p className="text-gray-500 text-sm line-clamp-2 mb-3">{item.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-primary-500 font-bold text-lg">${Number(item.price).toFixed(2)}</span>
            <button
              onClick={handleAddToCart}
              disabled={!item.isAvailable}
              className="flex items-center gap-1.5 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors"
            >
              <PlusCircle size={15} />
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {showQuantityModal && (
        <QuantityModal
          item={item}
          onConfirm={handleConfirmQuantity}
          onCancel={() => setShowQuantityModal(false)}
        />
      )}
    </>
  );
}
