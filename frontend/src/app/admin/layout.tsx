'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/auth/signin');
    }
  }, [user, loading, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (loading || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FBFAF8', fontFamily: 'Manrope, sans-serif', color: '#7A7A7A' }}>
        Loading...
      </div>
    );
  }

  const navLinks = [
    {
      href: '/admin',
      label: 'Menu Items',
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M9 2C9 2 5 4.5 5 8.5C5 10.985 6.567 13.096 8.75 13.85V16H9.25V13.85C11.433 13.096 13 10.985 13 8.5C13 4.5 9 2 9 2Z" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 13.85V16" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      href: '/admin/categories',
      label: 'Categories',
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="2" y="2" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.33"/>
          <rect x="10" y="2" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.33"/>
          <rect x="2" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.33"/>
          <rect x="10" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.33"/>
        </svg>
      ),
    },
    {
      href: '/admin/orders',
      label: 'Orders',
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="2.5" y="2.5" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.33"/>
          <path d="M5.5 6H12.5M5.5 9H12.5M5.5 12H9.5" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round"/>
        </svg>
      ),
    },
  ];

  const pageTitle = pathname === '/admin'
    ? 'Menu Items'
    : pathname === '/admin/categories'
    ? 'Categories'
    : pathname === '/admin/orders'
    ? 'Orders'
    : 'Admin';

  return (
    <div className="min-h-screen flex" style={{ background: '#F2EFE9' }}>
      {/* Sidebar */}
      <aside
        className="flex flex-col fixed h-full z-40"
        style={{ width: 256, background: '#FBFAF8', borderRight: '1px solid #E6E2D8' }}
      >
        {/* Logo */}
        <div
          className="flex items-center"
          style={{ height: 60, paddingLeft: 24, borderBottom: '1px solid #E6E2D8' }}
        >
          <Link href="/" style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: 26, color: '#1A3C34', textDecoration: 'none' }}>
            Foodio.
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-4 flex flex-col gap-1">
          {navLinks.map(({ href, label, icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 transition-colors"
                style={{
                  width: 223,
                  height: 36,
                  borderRadius: 8,
                  background: active ? '#1A3C34' : 'transparent',
                  color: active ? 'white' : '#7A7A7A',
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: 500,
                  fontSize: 14,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {icon}
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Sign Out */}
        <div style={{ borderTop: '1px solid #E6E2D8', padding: '12px 16px' }}>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 w-full transition-colors"
            style={{ height: 36, borderRadius: 8, background: 'transparent', border: 'none', fontFamily: 'Manrope, sans-serif', fontWeight: 500, fontSize: 14, color: '#D64045', cursor: 'pointer' }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M7 16H3C2.448 16 2 15.552 2 15V3C2 2.448 2.448 2 3 2H7" stroke="#D64045" strokeWidth="1.33" strokeLinecap="round"/>
              <path d="M12 13L16 9L12 5" stroke="#D64045" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 9H7" stroke="#D64045" strokeWidth="1.33" strokeLinecap="round"/>
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1" style={{ marginLeft: 256 }}>
        {/* Top header bar */}
        <div
          className="flex items-center sticky top-0 z-30"
          style={{ height: 60, background: 'white', borderBottom: '1px solid #E6E2D8', paddingLeft: 32 }}
        >
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: 26, color: '#1A3C34' }}>
            {pageTitle}
          </h1>
        </div>
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
}
