'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, ChefHat, UtensilsCrossed, Cake } from 'lucide-react';
import UserLayout from '@/components/UserLayout';
import FoodCard from '@/components/FoodCard';
import { MenuItem, Category } from '@/lib/types';
import api from '@/lib/api';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80';

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
          <div className="grid lg:grid-cols-2 items-center min-h-[540px]">

            {/* Left – content */}
            <div className="py-16 lg:py-24 lg:pr-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-100 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <span>🍽️</span>
                Food Ordering Service
              </div>

              {/* Heading */}
              <h1 className="text-5xl lg:text-[3.75rem] font-bold text-primary-500 leading-[1.05] tracking-tight mb-5">
                Where Great Food
                <br />
                Meets{' '}
                <span className="font-cormorant italic font-semibold">Great Taste.</span>
              </h1>

              <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-lg">
                Experience a symphony of flavors crafted with passion. Premium ingredients,
                exquisite recipes, delivered to your door.
              </p>

              <Link
                href="/menu"
                className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold px-8 py-4 rounded-[20px_0px_20px_20px] transition-colors text-base shadow-lg shadow-primary-500/20"
              >
                View Menu <span className="text-lg leading-none">→</span>
              </Link>
            </div>

            {/* Right – hero image */}
            <div className="relative hidden lg:flex items-center justify-center h-[540px]">
              {/* Cream panel */}
              <div className="absolute inset-y-0 right-[-100px] left-0 bg-[#FEF7EA] rounded-bl-[210px]" />

              {/* Circular food image */}
              <div className="relative z-10 w-[400px] h-[400px] rounded-full overflow-hidden shadow-xl">
                {!heroImgError ? (
                  <Image
                    src={HERO_IMAGE}
                    alt="Featured dish"
                    fill
                    className="object-cover"
                    priority
                    onError={() => setHeroImgError(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-amber-100 flex items-center justify-center text-7xl">🍽️</div>
                )}
              </div>

              {/* Floating card: Avg. Delivery */}
              <div className="absolute bottom-20 left-0 z-20 bg-white rounded-xl p-3 shadow-lg flex items-center gap-3 border border-gray-100">
                <div className="w-10 h-10 bg-[#FEF7EA] rounded-lg flex items-center justify-center border border-amber-100">
                  <Clock size={20} className="text-primary-500" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900 leading-none mb-0.5">Avg. Delivery</p>
                  <p className="text-xs text-gray-500">22 Minutes</p>
                </div>
              </div>

              {/* Floating card: Today's Offer */}
              <div className="absolute top-14 right-0 z-20 bg-white rounded-xl p-3 shadow-lg flex items-center gap-3 border border-gray-100">
                <div className="w-10 h-10 bg-[#FEF7EA] rounded-lg flex items-center justify-center border border-amber-100">
                  <span className="text-xl">🔥</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 leading-none mb-0.5">Today's Offer</p>
                  <p className="font-semibold text-sm text-gray-900">Free Delivery</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Curated Categories + Items ── */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-10">
            <h2 className="font-cormorant text-4xl font-semibold text-gray-900 mb-2">
              Curated Categories
            </h2>
            <p className="text-gray-500">Explore our diverse menu of culinary delights.</p>
          </div>

          {/* Category icon cards */}
          <div className="flex justify-center gap-5 mb-12 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(activeCategory === cat.id ? 'all' : cat.id)}
                className={`flex flex-col items-center gap-3 px-10 py-6 rounded-2xl transition-all border ${
                  activeCategory === cat.id
                    ? 'bg-[#FEF7EA] border-amber-200 shadow-sm'
                    : 'bg-white border-gray-100 hover:bg-stone-100'
                }`}
              >
                <div className="w-14 h-14 bg-primary-500 rounded-full flex items-center justify-center">
                  {getCategoryIcon(cat.name)}
                </div>
                <span className="font-medium text-gray-900 text-sm">{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Items grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                  <div className="h-44 bg-gray-200" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-5xl mb-4">🍽️</p>
              <p className="text-lg font-medium text-gray-600 mb-1">Menu coming soon</p>
              <p className="text-sm">Check back shortly for our delicious offerings!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {items.map((item) => (
                <FoodCard key={item.id} item={item} />
              ))}
            </div>
          )}

          {items.length > 0 && (
            <div className="text-center mt-10">
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white font-semibold px-8 py-3 rounded-xl transition-colors"
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

