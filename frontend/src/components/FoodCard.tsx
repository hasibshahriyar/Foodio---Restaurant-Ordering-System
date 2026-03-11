'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
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
      {/* mt-14 reserves space for the circular image protruding upward */}
      <div className="relative mt-14 group">

        {/* Circular food image — sits above the card */}
        <Link
          href={`/menu/${item.id}`}
          className="absolute -top-[54px] left-1/2 -translate-x-1/2 z-10 block"
        >
          <div className="w-[118px] h-[118px] rounded-full overflow-hidden shadow-[0_4px_27px_rgba(0,0,0,0.15)] border-[5px] border-white">
            {imageUrl && !imgError ? (
              <Image
                src={imageUrl}
                alt={item.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full bg-[#FEF7EA] flex items-center justify-center text-4xl">
                🍽️
              </div>
            )}
          </div>
        </Link>

        {/* Card body */}
        <div className="relative bg-[#FEF7EA] rounded-tl-[34px] rounded-tr-none rounded-br-[34px] rounded-bl-none pt-[72px] pb-5 px-5">
          {!item.isAvailable && (
            <div className="absolute inset-0 bg-black/30 rounded-tl-[34px] rounded-br-[34px] flex items-center justify-center z-20">
              <span className="text-white font-semibold text-sm bg-black/60 px-3 py-1 rounded-full">
                Unavailable
              </span>
            </div>
          )}

          <Link href={`/menu/${item.id}`}>
            <h3 className="font-bold text-[18px] leading-[22px] text-[#1A1A1A] mb-2 hover:text-primary-500 transition-colors line-clamp-2">
              {item.name}
            </h3>
          </Link>

          <p className="text-[14px] font-medium leading-[22px] text-[#7A7A7A] line-clamp-2 mb-5">
            {item.description}
          </p>

          <div className="flex items-center justify-between gap-2">
            <span className="text-[24px] font-extrabold leading-[22px] text-primary-500">
              ${Number(item.price).toFixed(2)}
            </span>
            <button
              onClick={handleAddToCart}
              disabled={!item.isAvailable}
              className="flex items-center gap-1.5 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-[16px] font-semibold px-3 py-2.5 rounded-tl-[20px] rounded-tr-none rounded-br-[20px] rounded-bl-[20px] transition-colors whitespace-nowrap"
            >
              Add to Cart
              <ShoppingCart size={16} strokeWidth={1.5} />
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

