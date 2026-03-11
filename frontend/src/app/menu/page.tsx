'use client';

import { useEffect, useState, useCallback } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import UserLayout from '@/components/UserLayout';
import FoodCard from '@/components/FoodCard';
import { MenuItem, Category } from '@/lib/types';
import api from '@/lib/api';

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [items, setItems] = useState<MenuItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showSort, setShowSort] = useState(false);
  const [sortBy, setSortBy] = useState<'price' | 'name' | ''>('');
  const [filterAvail, setFilterAvail] = useState<'' | 'true' | 'false'>('');

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data));
  }, []);

  const fetchItems = useCallback(() => {
    setLoading(true);
    const params: Record<string, string> = { limit: '50' };
    if (activeCategory !== 'all') params.categoryId = activeCategory;
    if (search) params.search = search;
    if (sortBy) params.sortBy = sortBy;
    if (filterAvail) params.isAvailable = filterAvail;
    api
      .get('/menu-items', { params })
      .then((res) => {
        setItems(res.data.data);
        setTotal(res.data.total);
      })
      .finally(() => setLoading(false));
  }, [activeCategory, search, sortBy, filterAvail]);

  useEffect(() => {
    const timer = setTimeout(fetchItems, 300);
    return () => clearTimeout(timer);
  }, [fetchItems]);

  const clearFilters = () => {
    setSortBy('');
    setFilterAvail('');
    setShowSort(false);
  };

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Our Menu</h1>
          <p className="text-gray-500">Discover our selection of premium dishes, crafted with passion.</p>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['all', ...categories.map((c) => c.id)].map((id) => {
            const label = id === 'all' ? 'All' : categories.find((c) => c.id === id)?.name || '';
            return (
              <button
                key={id}
                onClick={() => setActiveCategory(id)}
                className={`px-5 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-colors ${
                  activeCategory === id
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Search + Sort */}
        <div className="flex gap-3 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search dishes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setShowSort(!showSort)}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal size={16} />
              Sort
            </button>
            {showSort && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 p-4 z-30">
                <p className="font-semibold text-gray-800 text-sm mb-3">Sort by</p>
                <label className="flex items-center gap-2 mb-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sort"
                    checked={sortBy === 'name'}
                    onChange={() => setSortBy('name')}
                    className="accent-primary-500"
                  />
                  <span className="text-sm text-gray-700">Name (A-Z)</span>
                </label>
                <label className="flex items-center gap-2 mb-4 cursor-pointer">
                  <input
                    type="radio"
                    name="sort"
                    checked={sortBy === 'price'}
                    onChange={() => setSortBy('price')}
                    className="accent-primary-500"
                  />
                  <span className="text-sm text-gray-700">Price</span>
                </label>
                <p className="font-semibold text-gray-800 text-sm mb-3">Availability</p>
                <label className="flex items-center gap-2 mb-2 cursor-pointer">
                  <input
                    type="radio"
                    name="avail"
                    checked={filterAvail === 'true'}
                    onChange={() => setFilterAvail('true')}
                    className="accent-primary-500"
                  />
                  <span className="text-sm text-gray-700">Available</span>
                </label>
                <label className="flex items-center gap-2 mb-4 cursor-pointer">
                  <input
                    type="radio"
                    name="avail"
                    checked={filterAvail === 'false'}
                    onChange={() => setFilterAvail('false')}
                    className="accent-primary-500"
                  />
                  <span className="text-sm text-gray-700">Unavailable</span>
                </label>
                <button
                  onClick={clearFilters}
                  className="w-full text-sm text-primary-500 hover:underline"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-44 bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-3">🍽️</p>
            <p>No items found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {items.map((item) => (
              <FoodCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  );
}
