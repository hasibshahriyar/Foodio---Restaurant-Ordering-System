'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, ChefHat, UtensilsCrossed, Cake } from 'lucide-react';
import UserLayout from '@/components/UserLayout';
import FoodCard from '@/components/FoodCard';
import { MenuItem, Category } from '@/lib/types';
import api from '@/lib/api';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=80',
];

function getCategoryIcon(name: string) {
  switch (name.toLowerCase()) {
    case 'starters':
      return <UtensilsCrossed size={24} className="text-white" />;
    case 'main courses':
      return <ChefHat size={24} className="text-white" />;
    case 'desserts':
      return <Cake size={24} className="text-white" />;
    default:
      return <UtensilsCrossed size={24} className="text-white" />;
  }
}

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroImgError, setHeroImgError] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((i) => (i + 1) % HERO_IMAGES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = { limit: '8' };
    if (activeCategory !== 'all') params.categoryId = activeCategory;
    api
      .get('/menu-items', { params })
      .then((res) => setItems(res.data.data))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  return (
    <UserLayout>

      {/* ── Hero ── */}
      <section className="bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 items-center min-h-[616px]">

            {/* Left column */}
            <div className="py-16 lg:py-0 lg:pr-10">

              {/* Badge — "Food Ordering Service" */}
              <div className="inline-flex items-center gap-1 bg-[#FEF7EA] rounded-[70px] px-[10px] py-[6px] mb-8">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="7" height="7" rx="1" fill="#1A3C34"/>
                  <rect x="14" y="3" width="7" height="7" rx="1" fill="#1A3C34"/>
                  <rect x="3" y="14" width="7" height="7" rx="1" fill="#1A3C34"/>
                  <rect x="14" y="14" width="7" height="7" rx="1" fill="#1A3C34"/>
                </svg>
                <span className="text-[14px] font-semibold leading-[19px] tracking-[-0.02em] text-[#2D2D2D]">
                  Food Ordering Service
                </span>
              </div>

              {/* Heading — Manrope 600, 74px, #1A3C34 */}
              <h1 className="font-semibold text-[58px] lg:text-[74px] leading-[1] tracking-[-0.05em] text-primary-500 mb-7">
                Where Great Food<br />
                Meets{' '}
                <span className="font-cormorant italic font-semibold">Great Taste.</span>
              </h1>

              {/* Description — Manrope 500, 20px, #2D2D2D */}
              <p className="text-[20px] font-medium leading-[27px] tracking-[-0.02em] text-[#2D2D2D] mb-10 max-w-[604px]">
                Experience a symphony of flavors crafted with passion. Premium ingredients,
                exquisite recipes, delivered to your door.
              </p>

              {/* View Menu button — border-radius: 20px 0px 20px 20px */}
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white text-[16px] font-semibold px-[16px] py-[11px] rounded-tl-[20px] rounded-tr-none rounded-br-[20px] rounded-bl-[20px] shadow-[0px_20px_25px_rgba(26,60,52,0.3)] transition-colors"
              >
                View Menu
                <span className="text-base leading-none font-bold">→</span>
              </Link>
            </div>

            {/* Right column — cream panel + circular food image + floating cards */}
            <div className="relative hidden lg:block h-[616px]">

              {/* Cream background panel — border-radius: 0px 0px 0px 210px */}
              <div className="absolute top-0 bottom-0 left-0 right-[-120px] bg-[#FEF7EA] rounded-bl-[210px]" />

              {/* Circular food image with blurred shadow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                {/* Blur shadow layer */}
                <div className="absolute inset-0 rounded-full blur-[42px] overflow-hidden opacity-40">
                  {!heroImgError && (
                    <Image
                      src={HERO_IMAGES[heroIndex]}
                      alt=""
                      fill
                      className="object-cover"
                      aria-hidden
                    />
                  )}
                </div>
                {/* Main image */}
                <div className="relative w-[440px] h-[440px] rounded-full overflow-hidden">
                  {!heroImgError ? (
                    HERO_IMAGES.map((src, idx) => (
                      <Image
                        key={src}
                        src={src}
                        alt={`Featured dish ${idx + 1}`}
                        fill
                        className="object-cover absolute inset-0"
                        style={{ opacity: idx === heroIndex ? 1 : 0, transition: 'opacity 0.6s ease-in-out' }}
                        priority={idx === 0}
                        onError={() => setHeroImgError(true)}
                      />
                    ))
                  ) : (
                    <div className="w-full h-full bg-[#FEF7EA] flex items-center justify-center text-8xl">🍽️</div>
                  )}
                </div>
              </div>

              {/* Floating card: Avg. Delivery — left side, mid-bottom */}
              <div className="animate-float absolute bottom-[140px] left-[-30px] z-20 bg-white border border-[#E6E2D8] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] rounded-[12px] p-3 flex items-center gap-3">
                <div className="w-11 h-11 bg-[#FDF6EA] border border-[#E6E2D8] rounded-[6px] flex items-center justify-center flex-shrink-0">
                  <Clock size={20} strokeWidth={2} className="text-primary-500" />
                </div>
                <div>
                  <p className="text-[16px] font-semibold leading-6 tracking-[-0.015em] text-[#1A1A1A]">Avg. Delivery</p>
                  <p className="text-[14px] font-medium leading-5 tracking-[-0.015em] text-[#7A7A7A]">22 Minutes</p>
                </div>
              </div>

              {/* Floating card: Today's Offer — top right */}
              <div className="animate-float-delayed absolute top-[95px] right-[-10px] z-20 bg-white border border-[#E6E2D8] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] rounded-[12px] p-3 flex items-center gap-3">
                <div className="w-11 h-11 bg-[#FDF6EA] border border-[#E6E2D8] rounded-[6px] flex items-center justify-center flex-shrink-0 text-xl">
                  🔥
                </div>
                <div>
                  <p className="text-[14px] font-medium leading-5 tracking-[-0.015em] text-[#7A7A7A]">Today's Offer</p>
                  <p className="text-[16px] font-semibold leading-6 tracking-[-0.015em] text-[#1A1A1A]">Free Delivery</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── Curated Categories ── */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section heading — Cormorant Garamond 600, 54px, #1A3C34 */}
          <div className="text-center mb-4">
            <h2 className="font-cormorant font-semibold text-[54px] leading-[1] tracking-[-0.05em] text-primary-500">
              Curated Categories
            </h2>
          </div>
          {/* Subtitle — Manrope 500, 18px, #2D2D2D */}
          <p className="text-center text-[18px] font-medium leading-[25px] tracking-[-0.02em] text-[#2D2D2D] mb-12">
            Explore our diverse menu of culinary delights.
          </p>

          {/* Category cards — 215×129px, border-radius: 20px 0px (tl + br = 20px, tr + bl = 0) */}
          <div className="flex justify-center gap-4 mb-16 flex-wrap">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(isActive ? 'all' : cat.id)}
                  style={{ width: 215, height: 129 }}
                  className={`flex flex-col items-center justify-center gap-[18px] rounded-tl-[20px] rounded-tr-none rounded-br-[20px] rounded-bl-none transition-all ${
                    isActive
                      ? 'bg-[#FEF7EA] shadow-[0px_21px_54px_rgba(26,60,52,0.1)]'
                      : 'bg-[#FBFAF8] hover:bg-[#FEF7EA]'
                  }`}
                >
                  {/* Icon circle — 54×54, #1A3C34 bg */}
                  <div className="w-[54px] h-[54px] rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                    {getCategoryIcon(cat.name)}
                  </div>
                  <span className="text-[18px] font-semibold leading-[1] text-primary-500">
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Items grid — accommodate the protruding circular images with pt */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-8 pt-14">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-[#FEF7EA] rounded-tl-[34px] rounded-br-[34px] pt-[72px] pb-5 px-5 animate-pulse mt-14">
                  <div className="h-5 bg-[#e5ddd0] rounded w-3/4 mb-2" />
                  <div className="h-3.5 bg-[#e5ddd0] rounded w-full mb-1" />
                  <div className="h-3.5 bg-[#e5ddd0] rounded w-2/3 mb-5" />
                  <div className="h-8 bg-[#e5ddd0] rounded-tl-[20px] rounded-br-[20px] rounded-bl-[20px] w-full" />
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-5xl mb-4">🍽️</p>
              <p className="text-[18px] font-semibold text-primary-500 mb-1">Menu coming soon</p>
              <p className="text-sm text-[#7A7A7A]">Check back shortly for our delicious offerings!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-8">
              {items.map((item) => (
                <FoodCard key={item.id} item={item} />
              ))}
            </div>
          )}

          {items.length > 0 && (
            <div className="text-center mt-14">
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white text-[16px] font-semibold px-8 py-3 rounded-tl-[20px] rounded-tr-none rounded-br-[20px] rounded-bl-[20px] transition-colors"
              >
                View Full Menu →
              </Link>
            </div>
          )}

        </div>
      </section>

    </UserLayout>
  );
}

