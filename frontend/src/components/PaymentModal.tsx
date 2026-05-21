'use client';
import { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripe';
import CheckoutForm from './CheckoutForm';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  orderId: string;
  onSuccess: () => void;
}

const stripeAppearance = {
  theme: 'stripe' as const,
  variables: {
    colorPrimary: '#f97316',
    colorBackground: '#ffffff',
    colorText: '#1f2937',
    colorDanger: '#ef4444',
    fontFamily: 'Inter, system-ui, sans-serif',
    borderRadius: '8px',
    spacingUnit: '4px',
  },
  rules: {
    '.Input': { border: '1.5px solid #e5e7eb', padding: '12px' },
    '.Input:focus': { border: '1.5px solid #f97316', boxShadow: '0 0 0 3px rgba(249,115,22,0.15)' },
    '.Label': { fontWeight: '500', marginBottom: '6px', color: '#374151' },
  },
};

export default function PaymentModal({ isOpen, onClose, amount, orderId, onSuccess }: PaymentModalProps) {
  const [clientSecret, setClientSecret] = useState('');
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setClientSecret('');
    setFetchError('');

    const token = localStorage.getItem('token');
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/create-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount, currency: 'usd', orderId }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setFetchError(data?.message || `Server error (${res.status}). Please try again.`);
          return;
        }
        if (data.clientSecret) setClientSecret(data.clientSecret);
        else setFetchError('Could not initialize payment. Please try again.');
      })
      .catch(() => setFetchError('Network error. Please check your connection.'));
  }, [isOpen, amount, orderId]);

  if (!isOpen) return null;

  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop — pointer-events handled by parent */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-none" />

      {/* Modal — stopPropagation prevents backdrop click from firing */}
      <div
        className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Complete Payment</h2>
            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Secured by Stripe
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors text-lg"
          >
            ✕
          </button>
        </div>

        {/* Amount banner */}
        <div className="px-6 py-4 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100 flex items-center justify-between">
          <span className="text-sm text-gray-500 font-medium">Order Total</span>
          <span className="text-2xl font-bold text-orange-500">${(amount / 100).toFixed(2)}</span>
        </div>

        {/* Form area */}
        <div className="px-6 py-6">
          {fetchError ? (
            <div className="flex items-center gap-3 bg-red-50 text-red-600 text-sm rounded-lg p-4 border border-red-100">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {fetchError}
            </div>
          ) : !clientSecret ? (
            <div className="flex items-center justify-center py-10 gap-3">
              <div className="w-5 h-5 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-400 text-sm">Initializing secure payment...</span>
            </div>
          ) : (
            <Elements
              stripe={stripePromise}
              options={{ clientSecret, appearance: stripeAppearance }}
            >
              <CheckoutForm amount={amount} onSuccess={handleSuccess} />
            </Elements>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex items-center justify-center gap-4 text-xs text-gray-300">
          <span>256-bit SSL</span>
          <span>·</span>
          <span>PCI DSS Compliant</span>
          <span>·</span>
          <span>Powered by Stripe</span>
        </div>
      </div>
    </div>
  );
}
