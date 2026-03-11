'use client';

import { useEffect, useState, useRef } from 'react';
import { Category } from '@/lib/types';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddItemModal({ onClose, onSuccess }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    isAvailable: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error('File must be under 2MB'); return; }
    setImageFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error('File must be under 2MB'); return; }
    setImageFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('description', form.description);
      fd.append('price', form.price);
      if (form.categoryId) fd.append('categoryId', form.categoryId);
      fd.append('isAvailable', String(form.isAvailable));
      if (imageFile) fd.append('image', imageFile);
      await api.post('/menu-items', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Item added successfully');
      onSuccess();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to add item');
    } finally {
      setSaving(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', height: 36, background: 'white', border: '1px solid #E6E2D8',
    borderRadius: 6, padding: '0 12px', fontFamily: 'Manrope, sans-serif',
    fontSize: 14, color: '#1A1A1A', outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: 'Manrope, sans-serif', fontSize: 13, fontWeight: 500,
    color: '#2D2D2D', marginBottom: 6, display: 'block',
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ width: 512, background: '#FBFAF8', border: '1px solid #E6E2D8', borderRadius: 12, display: 'flex', flexDirection: 'column', maxHeight: '90vh', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #E6E2D8', flexShrink: 0 }}>
          <span style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 18, color: '#1A3C34' }}>Add New Item</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4L12 12" stroke="#7A7A7A" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}>

          {/* Name + Price */}
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Price ($)</label>
              <input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required style={inputStyle} />
            </div>
          </div>

          {/* Category */}
          <div>
            <label style={labelStyle}>Category</label>
            <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="">Select category...</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              rows={3}
              style={{ ...inputStyle, height: 100, padding: '8px 12px', resize: 'none' }}
            />
          </div>

          {/* Image drag-drop */}
          <div>
            <label style={labelStyle}>Image</label>
            {imageFile ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1, height: 36, background: 'white', border: '1px solid #E6E2D8', borderRadius: 6, display: 'flex', alignItems: 'center', paddingLeft: 12, overflow: 'hidden' }}>
                  <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 13, color: '#1A1A1A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{imageFile.name}</span>
                </div>
                <button type="button" onClick={() => { setImageFile(null); if (fileRef.current) fileRef.current.value = ''; }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M12 4L4 12M4 4L12 12" stroke="#7A7A7A" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                style={{ height: 104, border: '1.5px dashed #E6E2D8', borderRadius: 8, background: '#F7F7F7', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: 4 }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="#7A7A7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 13, fontWeight: 500, color: '#2D2D2D' }}>Drag or click here to upload</span>
                <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 12, color: '#7A7A7A' }}>Size must be maximum 2mb. Supported formats: PNG &amp; JPEG</span>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/png,image/jpeg" onChange={handleFileChange} style={{ display: 'none' }} />
          </div>

          {/* Available toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 14, fontWeight: 500, color: '#1A1A1A' }}>Available for Order</span>
            <button
              type="button"
              onClick={() => setForm({ ...form, isAvailable: !form.isAvailable })}
              style={{ width: 40, height: 24, borderRadius: 12, background: form.isAvailable ? '#1A3C34' : '#CFE5E0', border: 'none', cursor: 'pointer', position: 'relative', flexShrink: 0 }}
            >
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'white', position: 'absolute', top: 2, left: form.isAvailable ? 18 : 2, transition: 'left 0.15s' }} />
            </button>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
            <button
              type="button"
              onClick={onClose}
              style={{ width: 126, height: 36, border: '1px solid #1A3C34', borderRadius: 46, fontFamily: 'Manrope, sans-serif', fontSize: 14, fontWeight: 600, color: '#1A3C34', background: 'none', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{ width: 126, height: 36, background: saving ? '#7A7A7A' : '#1A3C34', border: 'none', borderRadius: 46, fontFamily: 'Manrope, sans-serif', fontSize: 14, fontWeight: 600, color: 'white', cursor: saving ? 'not-allowed' : 'pointer' }}
            >
              {saving ? 'Saving...' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
