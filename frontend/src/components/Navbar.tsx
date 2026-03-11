'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { ShoppingCart, ChevronDown, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount, openCart } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    router.push('/');
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/menu', label: 'Food Menu' },
    ...(user ? [{ href: '/my-orders', label: 'My Orders' }] : []),
  ];

  return (
    <nav className="bg-white border-b border-[#E6E2D8] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 2v20M18 2c-2 1.5-4 4-4 7s2 5.5 4 7" stroke="#1A3C34" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 2v5a3 3 0 0 0 6 0V2M9 10v12" stroke="#1A3C34" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-cormorant font-semibold text-[26px] leading-none tracking-[-0.05em] text-primary-500">
              Foodio.
            </span>
          </Link>

          {/* Center nav links */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-[10px] py-[6px] rounded-[30px] text-[14px] font-medium leading-5 tracking-[-0.01em] transition-colors ${
                    isActive
                      ? 'bg-[#FEF7EA] border border-primary-500 text-primary-500'
                      : 'text-[#7A7A7A] hover:text-primary-500'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Cart — outline pill */}
            <button
              onClick={openCart}
              className="flex items-center gap-1.5 border border-primary-500 rounded-[230px] px-3 h-8 text-primary-500 hover:bg-[#FEF7EA] transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart size={16} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="text-[14px] font-semibold text-primary-500 leading-none">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth */}
            {!user ? (
              <Link
                href="/auth/signin"
                className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white text-[14px] font-semibold px-3 h-8 rounded-[230px] transition-colors"
              >
                Sign in
                <ArrowRight size={16} strokeWidth={1.6} />
              </Link>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1.5 bg-primary-500 hover:bg-primary-600 text-white text-[14px] font-semibold px-3 h-8 rounded-[230px] transition-colors"
                >
                  <span>{user.name.split(' ')[0]}</span>
                  <ChevronDown size={14} />
                </button>
                {dropdownOpen && (
                  <div style={{ position: 'absolute', right: 0, marginTop: 8, width: 141, background: 'white', border: '1px solid #E6E2D8', borderRadius: 6, zIndex: 50, overflow: 'hidden' }}>
                    <Link
                      href="/my-orders"
                      onClick={() => setDropdownOpen(false)}
                      style={{ display: 'block', padding: '8px 12px', fontFamily: 'Manrope, sans-serif', fontSize: 13, color: '#7A7A7A', textDecoration: 'none' }}
                    >
                      My Account
                    </Link>
                    <div style={{ borderTop: '1px solid #E6E2D8' }} />
                    <Link
                      href="/my-orders"
                      onClick={() => setDropdownOpen(false)}
                      style={{ display: 'block', padding: '8px 12px', fontFamily: 'Manrope, sans-serif', fontSize: 13, color: '#1A1A1A', background: '#F7F7F7', textDecoration: 'none', borderRadius: 4, margin: '2px 4px' }}
                    >
                      Orders
                    </Link>
                    <div style={{ borderTop: '1px solid #E6E2D8' }} />
                    <button
                      onClick={handleLogout}
                      style={{ width: '100%', display: 'block', padding: '8px 12px', fontFamily: 'Manrope, sans-serif', fontSize: 13, color: '#D64045', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}

