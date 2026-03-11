'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      router.push('/');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full h-[36px] px-3 bg-white border border-[#E6E2D8] rounded-[6px] text-[14px] font-['Manrope'] text-[#1A1A1A] placeholder-[#7A7A7A] focus:outline-none focus:ring-2 focus:ring-[#1A3C34]/20";

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div
        className="w-[448px] bg-[#FBFAF8] border border-[#E6E2D8] rounded-[12px] p-[25px]"
        style={{ boxShadow: '0px 21.7716px 54.4291px rgba(26,60,52,0.1)' }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center gap-1 mb-5">
          <Link href="/" className="flex items-center gap-2">
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
              <path d="M10.5 3.5C10.5 3.5 9 6 9 9.5C9 13 11 15 11 15H15C15 15 17 13 17 9.5C17 6 15.5 3.5 15.5 3.5H10.5Z" fill="#1A3C34"/>
              <path d="M4 14C4 14 4 22 13 22C22 22 22 14 22 14H4Z" fill="#1A3C34"/>
            </svg>
            <span style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: 26, letterSpacing: '-0.05em', color: '#1A3C34', lineHeight: 1 }}>Foodio.</span>
          </Link>
          <p style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 500, fontSize: 14, color: '#7A7A7A' }}>Premium flavors, delivered.</p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center justify-center px-1 h-[36px] rounded-[16px] mb-5" style={{ background: '#F2EFE9' }}>
          <Link href="/auth/signin" className="flex items-center justify-center flex-1 h-[29px] rounded-[12px]" style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 500, fontSize: 14, color: '#1A1A1A', textAlign: 'center' }}>
            Sign in
          </Link>
          <div className="flex items-center justify-center h-[29px] rounded-[12px] bg-white flex-1" style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 500, fontSize: 14, color: '#1A1A1A', textAlign: 'center' }}>
            Register
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <label style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 500, fontSize: 14, color: '#1A1A1A' }}>Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 500, fontSize: 14, color: '#1A1A1A' }}>Email</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 500, fontSize: 14, color: '#1A1A1A' }}>Address</label>
            <input
              type="text"
              placeholder="e.g. House:23, Road:23, Jamaica, USA"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 500, fontSize: 14, color: '#1A1A1A' }}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={6}
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full h-[36px] text-white disabled:opacity-60 transition-colors mt-1"
            style={{ background: '#1A3C34', borderRadius: 56, fontFamily: 'Manrope, sans-serif', fontWeight: 500, fontSize: 14 }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-4" style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 500, fontSize: 14, color: '#7A7A7A' }}>
          For accessing Admin Panel press A from your keyboard.
        </p>
      </div>
    </div>
  );
}
