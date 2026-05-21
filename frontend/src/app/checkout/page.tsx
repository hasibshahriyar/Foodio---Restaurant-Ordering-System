'use client';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripe';
import CheckoutForm from '@/components/CheckoutForm';

export default function CheckoutPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div>
        <h1 className="text-4xl font-bold mb-8 text-center">Checkout</h1>
        <Elements stripe={stripePromise}>
          <CheckoutForm amount={5000} /> {/* $50.00 */}
        </Elements>
      </div>
    </main>
  );
}