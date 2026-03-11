'use client';

import { useEffect, useState } from 'react';
import { Category } from '@/lib/types';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setAdding(true);
    try {
      await api.post('/categories', { name: newName.trim() });
      toast.success('Category added');
      setNewName('');
      setShowAdd(false);
      fetchCategories();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to add category');
    } finally {
      setAdding(false);
    }
  };

  const handleEdit = async (id: string) => {
    if (!editName.trim()) return;
    try {
      await api.put(`/categories/${id}`, { name: editName.trim() });
      toast.success('Category updated');
      setEditingId(null);
      setEditName('');
      fetchCategories();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update category');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Category deleted');
      fetchCategories();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditName(cat.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
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
          Add Category
        </button>
      </div>

      {/* Table */}
      <div style={{ background: 'white', border: '1px solid #E6E2D8', borderRadius: 12, overflow: 'hidden' }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: '#FBFAF8', borderBottom: '1px solid #E6E2D8' }}>
              <th className="text-left px-5" style={{ height: 44, fontFamily: 'Manrope, sans-serif', fontWeight: 600, fontSize: 12, color: '#7A7A7A', letterSpacing: '0.06em' }}>NAME</th>
              <th className="text-left px-5" style={{ height: 44, fontFamily: 'Manrope, sans-serif', fontWeight: 600, fontSize: 12, color: '#7A7A7A', letterSpacing: '0.06em' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? [1, 2, 3].map((i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #E6E2D8' }}>
                    <td className="px-5 py-4"><div className="h-4 rounded animate-pulse w-32" style={{ background: '#E6E2D8' }} /></td>
                    <td className="px-5 py-4"><div className="h-4 rounded animate-pulse w-16" style={{ background: '#E6E2D8' }} /></td>
                  </tr>
                ))
              : categories.map((cat) => (
                  <tr key={cat.id} style={{ borderBottom: '1px solid #E6E2D8', height: 49 }}>
                    <td className="px-5">
                      {editingId === cat.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleEdit(cat.id);
                              if (e.key === 'Escape') cancelEdit();
                            }}
                            autoFocus
                            className="focus:outline-none"
                            style={{ height: 34, padding: '0 12px', border: '1px solid #1A3C34', borderRadius: 6, fontFamily: 'Manrope, sans-serif', fontSize: 14, width: 200 }}
                          />
                          <button onClick={() => handleEdit(cat.id)} style={{ color: '#008236' }}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M3 8L6.5 11.5L13 5" stroke="#008236" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                          <button onClick={cancelEdit} style={{ color: '#7A7A7A' }}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M4 4L12 12M12 4L4 12" stroke="#7A7A7A" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 600, fontSize: 14, color: '#1A1A1A' }}>{cat.name}</span>
                      )}
                    </td>
                    <td className="px-5">
                      <div className="flex items-center gap-2">
                        {editingId !== cat.id && (
                          <button
                            onClick={() => startEdit(cat)}
                            className="flex items-center justify-center"
                            style={{ width: 36, height: 36, background: '#1A3C34', borderRadius: 6, border: 'none', cursor: 'pointer' }}
                          >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M11.5 2.5L13.5 4.5L6 12H4V10L11.5 2.5Z" stroke="white" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(cat.id)}
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
                ))}
          </tbody>
        </table>
      </div>

      {/* Add Category Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div
            className="p-6"
            style={{ width: 512, background: '#FBFAF8', border: '1px solid #E6E2D8', borderRadius: 12, boxShadow: '0px 21.77px 54.43px rgba(26,60,52,0.1)' }}
          >
            <p style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 18, color: '#1A3C34', marginBottom: 20 }}>
              Add Category
            </p>
            <form onSubmit={handleAdd}>
              <div className="mb-5">
                <label style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 500, fontSize: 13, color: '#7A7A7A', display: 'block', marginBottom: 6 }}>Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                  className="focus:outline-none w-full"
                  style={{ height: 36, padding: '0 12px', background: 'white', border: '1px solid #E6E2D8', borderRadius: 6, fontFamily: 'Manrope, sans-serif', fontSize: 14 }}
                />
              </div>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  style={{ height: 36, padding: '0 16px', border: '1px solid #1A3C34', borderRadius: 46, background: 'transparent', fontFamily: 'Manrope, sans-serif', fontWeight: 500, fontSize: 14, color: '#1A3C34', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adding}
                  style={{ height: 36, padding: '0 20px', background: '#1A3C34', borderRadius: 46, border: 'none', fontFamily: 'Manrope, sans-serif', fontWeight: 500, fontSize: 14, color: 'white', cursor: 'pointer', opacity: adding ? 0.6 : 1 }}
                >
                  {adding ? 'Adding...' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

