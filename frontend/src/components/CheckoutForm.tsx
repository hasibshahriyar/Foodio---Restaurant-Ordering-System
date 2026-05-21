'use client';
import { useState } from 'react';
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';

const elementStyle = {
  style: {
    base: { fontSize: '16px', color: '#424770', '::placeholder': { color: '#aab7c4' } },
  },
};

export default function CheckoutForm({ amount, orderId, onSuccess }: { amount: number; orderId?: string; onSuccess?: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/create-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount, currency: 'usd', orderId }),
      });

      if (!res.ok) {
        const err = await res.text();
        setMessage(`Backend error: ${err}`);
        return;
      }

      const data = await res.json();
      console.log('Backend response:', data);

      if (!data.clientSecret) {
        setMessage('No clientSecret received from backend');
        return;
      }

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement)!,
        },
      });

      if (result.error) {
        setMessage(result.error.message || 'Payment failed');
      } else if (result.paymentIntent?.status === 'succeeded') {
        setMessage('🎉 Payment successful!');
        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-8 border-2 border-gray-200 rounded-xl w-[480px] shadow-lg bg-white">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
        <div className="p-4 border-2 border-gray-300 rounded-lg">
          <CardNumberElement options={elementStyle} />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
          <div className="p-4 border-2 border-gray-300 rounded-lg">
            <CardExpiryElement options={elementStyle} />
          </div>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">CVC</label>
          <div className="p-4 border-2 border-gray-300 rounded-lg">
            <CardCvcElement options={elementStyle} />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="bg-orange-500 text-white py-4 text-lg font-semibold rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors mt-2"
      >
        {loading ? 'Processing...' : `Pay $${amount / 100}`}
      </button>

      {message && <p className="text-center text-lg font-semibold">{message}</p>}
    </form>
  );
}