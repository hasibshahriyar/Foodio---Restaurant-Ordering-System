import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#E6E2D8] py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-cormorant font-semibold text-[26px] leading-none tracking-[-0.05em] text-primary-500">
              Foodio.
            </span>
            <span className="text-sm text-[#7A7A7A]">© 2026 Foodio Inc.</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-[#7A7A7A]">
            <Link href="#" className="hover:text-primary-500 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-primary-500 transition-colors">Terms</Link>
            <Link href="#" className="hover:text-primary-500 transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

