'use client';

import { useEffect, useState } from 'react';
import { MenuItem, PaginatedResponse } from '@/lib/types';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import AddItemModal from '@/components/admin/AddItemModal';
import EditItemModal from '@/components/admin/EditItemModal';
import { API_BASE } from '@/lib/api';
import Image from 'next/image';

export default function AdminMenuItemsPage() {
  const [data, setData] = useState<PaginatedResponse<MenuItem> | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);

  const fetchItems = async (p = page) => {
    setLoading(true);
    try {
      const res = await api.get('/menu-items', { params: { page: p, limit: 10 } });
      setData(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, [page]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    try {
      await api.delete(`/menu-items/${id}`);
      toast.success('Item deleted');
      fetchItems();
    } catch {
      toast.error('Failed to delete item');
    }
  };

  return (
    <>
      {/* Top row */}
      <div className="flex items-center justify-between mb-6">
        <div />
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2"
          style={{ background: '#1A3C34', borderRadius: 56, height: 36, paddingLeft: 16, paddingRight: 16, border: 'none', fontFamily: 'Manrope, sans-serif', fontWeight: 500, fontSize: 14, color: 'white', cursor: 'pointer' }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3V13M3 8H13" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Add Item
        </button>
      </div>

      {/* Table */}
      <div style={{ background: 'white', border: '1px solid #E6E2D8', borderRadius: 12, overflow: 'hidden' }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: '#FBFAF8', borderBottom: '1px solid #E6E2D8' }}>
              {['Name', 'Category', 'Price', 'Status', 'Actions'].map((col) => (
                <th
                  key={col}
                  className="text-left px-5"
                  style={{ height: 44, fontFamily: 'Manrope, sans-serif', fontWeight: 600, fontSize: 12, color: '#7A7A7A', letterSpacing: '0.06em' }}
                >
                  {col.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #E6E2D8' }}>
                    {[1, 2, 3, 4, 5].map((j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 rounded animate-pulse" style={{ background: '#E6E2D8' }} />
                      </td>
                    ))}
                  </tr>
                ))
              : (data?.data || []).map((item) => {
                  const imageUrl = item.image
                    ? item.image.startsWith('http') ? item.image : `${API_BASE}${item.image}`
                    : null;
                  return (
                    <tr key={item.id} style={{ borderBottom: '1px solid #E6E2D8', height: 49 }}>
                      <td className="px-5">
                        <div className="flex items-center gap-3">
                          <div className="relative flex-shrink-0 rounded-full overflow-hidden" style={{ width: 32, height: 32, background: '#E6E2D8' }}>
                            {imageUrl ? (
                              <Image src={imageUrl} alt={item.name} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-sm">🍽️</div>
                            )}
                          </div>
                          <span style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 600, fontSize: 14, color: '#1A1A1A' }}>{item.name}</span>
                        </div>
                      </td>
                      <td className="px-5" style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 400, fontSize: 14, color: '#2D2D2D' }}>
                        {item.category?.name || '—'}
                      </td>
                      <td className="px-5" style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 500, fontSize: 14, color: '#1A1A1A' }}>
                        ${Number(item.price).toFixed(2)}
                      </td>
                      <td className="px-5">
                        <span
                          style={item.isAvailable
                            ? { background: '#DCFCE7', color: '#008236', borderRadius: 999, padding: '2px 10px', fontFamily: 'Manrope, sans-serif', fontWeight: 600, fontSize: 12 }
                            : { background: '#FEE2E2', color: '#D64045', borderRadius: 999, padding: '2px 10px', fontFamily: 'Manrope, sans-serif', fontWeight: 600, fontSize: 12 }
                          }
                        >
                          {item.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td className="px-5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditItem(item)}
                            className="flex items-center justify-center"
                            style={{ width: 36, height: 36, background: '#1A3C34', borderRadius: 6, border: 'none', cursor: 'pointer' }}
                          >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M11.5 2.5L13.5 4.5L6 12H4V10L11.5 2.5Z" stroke="white" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="flex items-center justify-center"
                            style={{ width: 36, height: 36, background: 'transparent', borderRadius: 6, border: '1px solid #E6E2D8', cursor: 'pointer' }}
                          >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M2 4H14M5 4V3C5 2.448 5.448 2 6 2H10C10.552 2 11 2.448 11 3V4M6 7V12M10 7V12M3 4L4 13C4 13.552 4.448 14 5 14H11C11.552 14 12 13.552 12 13L13 4" stroke="#D64045" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4" style={{ borderTop: '1px solid #E6E2D8' }}>
            <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 13, color: '#7A7A7A' }}>
              {((page - 1) * 10) + 1}–{Math.min(page * 10, data.total)} of {data.total}
            </p>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                style={{ padding: '4px 12px', fontSize: 13, border: '1px solid #E6E2D8', borderRadius: 6, background: 'white', cursor: 'pointer', fontFamily: 'Manrope, sans-serif', opacity: page === 1 ? 0.5 : 1 }}
              >
                Prev
              </button>
              <button
                disabled={page === data.totalPages}
                onClick={() => setPage(page + 1)}
                style={{ padding: '4px 12px', fontSize: 13, border: '1px solid #E6E2D8', borderRadius: 6, background: 'white', cursor: 'pointer', fontFamily: 'Manrope, sans-serif', opacity: page === data.totalPages ? 0.5 : 1 }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {showAdd && (
        <AddItemModal
          onClose={() => setShowAdd(false)}
          onSuccess={() => { setShowAdd(false); fetchItems(); }}
        />
      )}
      {editItem && (
        <EditItemModal
          item={editItem}
          onClose={() => setEditItem(null)}
          onSuccess={() => { setEditItem(null); fetchItems(); }}
        />
      )}
    </>
  );
}
