'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import UserLayout from '@/components/UserLayout';
import FoodCard from '@/components/FoodCard';
import { MenuItem, Category } from '@/lib/types';
import api from '@/lib/api';

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showSort, setShowSort] = useState(false);
  const [sortBy, setSortBy] = useState<'price' | 'name' | ''>('');
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data));
  }, []);

  const fetchItems = useCallback(() => {
    setLoading(true);
    const params: Record<string, string> = { limit: '50' };
    if (activeCategory !== 'all') params.categoryId = activeCategory;
    if (search) params.search = search;
    if (sortBy) params.sortBy = sortBy;
    api
      .get('/menu-items', { params })
      .then((res) => {
        setItems(res.data.data);
      })
      .finally(() => setLoading(false));
  }, [activeCategory, search, sortBy]);

  useEffect(() => {
    const timer = setTimeout(fetchItems, 300);
    return () => clearTimeout(timer);
  }, [fetchItems]);

  // Close sort dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setShowSort(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <UserLayout>
      <div className="px-[105px] py-[48px]">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: 54, color: '#1A3C34', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Our Menu
          </h1>
          <p className="mt-2" style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 500, fontSize: 18, color: '#2D2D2D' }}>
            Discover our selection of premium dishes, crafted with passion.
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          {/* Category pills */}
          <button
            onClick={() => setActiveCategory('all')}
            className="h-[36px] px-4 rounded-full text-[14px] transition-colors"
            style={activeCategory === 'all'
              ? { background: '#1A3C34', color: 'white', fontFamily: 'Manrope, sans-serif', fontWeight: 500, border: 'none' }
              : { background: '#FBFAF8', color: '#1A1A1A', fontFamily: 'Manrope, sans-serif', fontWeight: 500, border: '1px solid #E6E2D8' }
            }
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="h-[36px] px-4 rounded-full text-[14px] transition-colors whitespace-nowrap"
              style={activeCategory === cat.id
                ? { background: '#1A3C34', color: 'white', fontFamily: 'Manrope, sans-serif', fontWeight: 500, border: 'none' }
                : { background: '#FBFAF8', color: '#1A1A1A', fontFamily: 'Manrope, sans-serif', fontWeight: 500, border: '1px solid #E6E2D8' }
              }
            >
              {cat.name}
            </button>
          ))}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Sort button */}
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => setShowSort(!showSort)}
              className="flex items-center gap-2 h-[36px] px-4 rounded-full"
              style={{ background: '#1A3C34', color: 'white', fontFamily: 'Manrope, sans-serif', fontWeight: 500, fontSize: 14 }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 4H14M4 8H12M6 12H10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Sort
            </button>
            {showSort && (
              <div
                className="absolute right-0 top-full mt-2 z-30 py-1"
                style={{ background: '#FFFFFF', border: '1px solid #E6E2D8', borderRadius: 8, boxShadow: '0px 4px 6px -1px rgba(0,0,0,0.1), 0px 2px 4px -2px rgba(0,0,0,0.1)', width: 213 }}
              >
                <p className="px-3 py-2" style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 600, fontSize: 16, color: '#1A3C34' }}>Sort by</p>
                <div style={{ height: 1, background: '#E6E2D8', margin: '0 4px' }} />
                {[{ value: 'price', label: 'Price' }, { value: 'name', label: 'Name (A–Z)' }].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => { setSortBy(opt.value as 'price' | 'name'); setShowSort(false); }}
                    className="w-full flex items-center justify-between px-3 py-2 transition-colors"
                    style={{
                      background: sortBy === opt.value ? '#F7F7F7' : 'transparent',
                      borderRadius: 4,
                      fontFamily: 'Manrope, sans-serif', fontWeight: 500, fontSize: 14, color: '#1A1A1A'
                    }}
                  >
                    {opt.label}
                    {sortBy === opt.value && (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8L6.5 11.5L13 5" stroke="#1A3C34" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                ))}
                {sortBy && (
                  <>
                    <div style={{ height: 1, background: '#E6E2D8', margin: '0 4px' }} />
                    <button
                      onClick={() => { setSortBy(''); setShowSort(false); }}
                      className="w-full px-3 py-2 text-center"
                      style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 500, fontSize: 14, color: '#7A7A7A' }}
                    >
                      Clear
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="#7A7A7A" strokeWidth="1.33"/>
              <path d="M11 11L14 14" stroke="#7A7A7A" strokeWidth="1.33" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-[36px] pl-9 pr-4 focus:outline-none"
              style={{ width: 310, background: '#FBFAF8', border: '1px solid #E6E2D8', borderRadius: 56, fontFamily: 'Manrope, sans-serif', fontSize: 14, color: '#1A1A1A' }}
            />
          </div>
        </div>

        {/* Food grid */}
        {loading ? (
          <div className="grid grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-[12px] border border-[#E6E2D8] overflow-hidden animate-pulse" style={{ background: '#FBFAF8' }}>
                <div className="h-44" style={{ background: '#E6E2D8' }} />
                <div className="p-4 space-y-2">
                  <div className="h-4 rounded w-3/4" style={{ background: '#E6E2D8' }} />
                  <div className="h-3 rounded w-full" style={{ background: '#E6E2D8' }} />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16" style={{ color: '#7A7A7A', fontFamily: 'Manrope, sans-serif' }}>
            <p className="text-5xl mb-3">🍽️</p>
            <p>No items found</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-5">
            {items.map((item) => (
              <FoodCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  );
}
