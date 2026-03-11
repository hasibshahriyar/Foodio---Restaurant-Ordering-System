'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, Truck } from 'lucide-react';
import UserLayout from '@/components/UserLayout';
import FoodCard from '@/components/FoodCard';
import { MenuItem, Category } from '@/lib/types';
import api from '@/lib/api';

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

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
      {/* Hero */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-2xl">
            <p className="text-primary-500 font-semibold text-sm uppercase tracking-wider mb-3">
              Food Ordering Service
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
              Where Great Food<br />Meets Great Taste.
            </h1>
            <p className="text-gray-500 text-lg mb-8">
              Experience a symphony of flavors crafted with passion. Premium ingredients,
              exquisite recipes, delivered to your door.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-8">
              <div className="flex items-center gap-2 bg-orange-50 text-primary-600 px-4 py-2 rounded-full text-sm font-medium">
                <Truck size={16} />
                Today's Offer: Free Delivery
              </div>
              <div className="flex items-center gap-2 bg-orange-50 text-primary-600 px-4 py-2 rounded-full text-sm font-medium">
                <Clock size={16} />
                Avg. Delivery 22 Minutes
              </div>
            </div>

            <Link
              href="/menu"
              className="inline-block bg-primary-500 hover:bg-primary-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-base"
            >
              View Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Menu section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Curated Categories</h2>
          <p className="text-gray-500">Explore our diverse menu of culinary delights.</p>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-5 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-colors ${
              activeCategory === 'all'
                ? 'bg-primary-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat.name}
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {items.map((item) => (
              <FoodCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </UserLayout>
  );
}
