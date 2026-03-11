import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { Toaster } from 'react-hot-toast';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  title: 'Foodio - Restaurant Ordering System',
  description: 'Premium flavors, delivered.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            {children}
            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
            <SpeedInsights />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
