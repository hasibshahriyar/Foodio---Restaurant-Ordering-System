'use client';
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

export default function PaymentModal({ isOpen, onClose, amount, orderId, onSuccess }: PaymentModalProps) {
  if (!isOpen) return null;

  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Complete Payment</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none"
          >
            ×
          </button>
        </div>

        <p className="text-gray-500 mb-6 text-center">
          Total: <span className="text-xl font-bold text-orange-500">${(amount / 100).toFixed(2)}</span>
        </p>

        <Elements stripe={stripePromise}>
          <CheckoutForm amount={amount} orderId={orderId} onSuccess={handleSuccess} />
        </Elements>
      </div>
    </div>
  );
}
