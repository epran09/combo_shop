'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/CartProvider';
import Link from 'next/link';
import { ArrowLeft, Loader2, CheckCircle } from 'lucide-react';

const NEPAL_DISTRICTS = [
  'Achham', 'Arghakhanchi', 'Baglung', 'Baitadi', 'Bajhang', 'Bajura', 'Banke', 'Bara',
  'Bardiya', 'Bhaktapur', 'Bhojpur', 'Chitwan', 'Dadeldhura', 'Dailekh', 'Dang', 'Darchula',
  'Dhading', 'Dhankuta', 'Dhanusa', 'Dolakha', 'Dolpa', 'Doti', 'Gorkha', 'Gulmi', 'Humla',
  'Ilam', 'Jajarkot', 'Jhapa', 'Jumla', 'Kailali', 'Kalikot', 'Kanchanpur', 'Kapilvastu',
  'Kaski', 'Kathmandu', 'Kavrepalanchok', 'Khotang', 'Lalitpur', 'Lamjung', 'Mahottari',
  'Makwanpur', 'Manang', 'Morang', 'Mugu', 'Mustang', 'Myagdi', 'Nawalparasi', 'Nuwakot',
  'Okhaldhunga', 'Palpa', 'Panchthar', 'Parbat', 'Parsa', 'Pyuthan', 'Ramechhap', 'Rasuwa',
  'Rautahat', 'Rolpa', 'Rukum', 'Rupandehi', 'Salyan', 'Sankhuwasabha', 'Saptari', 'Sarlahi',
  'Sindhuli', 'Sindhupalchok', 'Siraha', 'Solukhumbu', 'Sunsari', 'Surkhet', 'Syangja',
  'Tanahu', 'Taplejung', 'Terhathum', 'Udayapur',
];

export default function CheckoutPage() {
  const { cart, totalPrice, totalSavings, clearCart } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    city: '',
    district: 'Kathmandu',
    payment_method: 'cod',
  });

  const formatPrice = (p) => `Rs. ${Number(p).toLocaleString()}`;

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const items = cart.map((item) => ({
      type: item.type,
      id: item.id,
      quantity: item.quantity,
      ...(item.type === 'custom_combo' ? { productIds: item.items.map((p) => p.id) } : {}),
    }));

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, items }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        setSubmitting(false);
        return;
      }

      setOrderResult(data);
      clearCart();
    } catch {
      setError('Network error. Please try again.');
    }
    setSubmitting(false);
  };

  if (orderResult) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed! 🎉</h1>
        <p className="text-gray-600 mb-2">Thank you for shopping with ComboShop Nepal.</p>
        <div className="bg-green-50 rounded-xl p-6 mt-6 text-left space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Order Number</span>
            <span className="font-bold text-gray-900">{orderResult.order_number}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total</span>
            <span className="font-bold">{formatPrice(orderResult.total_amount)}</span>
          </div>
          {orderResult.discount_amount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>You Saved</span>
              <span className="font-bold">{formatPrice(orderResult.discount_amount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">Payment</span>
            <span>Cash on Delivery</span>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          We&apos;ll contact you on your phone to confirm the order. 📞
        </p>
        <Link href="/" className="btn-primary inline-block mt-6">Continue Shopping</Link>
      </div>
    );
  }

  if (cart.length === 0 && !orderResult) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 text-lg mb-4">Your cart is empty.</p>
        <Link href="/products" className="btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/cart" className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Cart
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-bold text-lg mb-4">📋 Your Details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text" name="customer_name" required value={form.customer_name} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="Ram Bahadur"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="tel" name="customer_phone" required value={form.customer_phone} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="98XXXXXXXX"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email (optional)</label>
                <input
                  type="email" name="customer_email" value={form.customer_email} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="you@example.com"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-bold text-lg mb-4">📍 Shipping Address</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                <input
                  type="text" name="shipping_address" required value={form.shipping_address} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="Thamel, near Himalayan Java"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <input
                  type="text" name="city" required value={form.city} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="Kathmandu"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                <select
                  name="district" value={form.district} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                >
                  {NEPAL_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-bold text-lg mb-4">💳 Payment Method</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="radio" name="payment_method" value="cod" checked={form.payment_method === 'cod'} onChange={handleChange} className="text-primary-600" />
                <div>
                  <span className="font-medium">💵 Cash on Delivery</span>
                  <p className="text-xs text-gray-500">Pay when you receive your order</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="radio" name="payment_method" value="esewa" checked={form.payment_method === 'esewa'} onChange={handleChange} className="text-primary-600" />
                <div>
                  <span className="font-medium">📱 eSewa</span>
                  <p className="text-xs text-gray-500">Pay via eSewa mobile wallet</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="radio" name="payment_method" value="khalti" checked={form.payment_method === 'khalti'} onChange={handleChange} className="text-primary-600" />
                <div>
                  <span className="font-medium">📲 Khalti</span>
                  <p className="text-xs text-gray-500">Pay via Khalti digital wallet</p>
                </div>
              </label>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 rounded-lg p-3 text-sm">{error}</div>
          )}

          <button
            type="submit" disabled={submitting}
            className="btn-accent w-full text-lg py-3 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {submitting ? 'Placing Order...' : `Place Order — ${formatPrice(totalPrice)}`}
          </button>
        </form>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border p-6 sticky top-24">
            <h2 className="font-bold text-lg mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              {cart.map((item) => (
                <div key={`${item.type}-${item.id}`} className="flex justify-between items-center">
                  <div className="flex-1 min-w-0">
                    <span className="text-gray-700 line-clamp-1">{item.name}</span>
                    <span className="text-gray-400 text-xs"> ×{item.quantity}</span>
                  </div>
                  <span className="font-medium ml-2">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="border-t pt-3 space-y-2">
                {totalSavings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Combo Savings</span>
                    <span>-{formatPrice(totalSavings)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary-700">{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
