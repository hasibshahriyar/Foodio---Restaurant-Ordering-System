import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartModalWrapper from '@/components/CartModalWrapper';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartModalWrapper />
    </div>
  );
}
