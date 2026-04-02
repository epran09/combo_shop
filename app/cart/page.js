'use client';

import { useCart } from '@/components/CartProvider';
import Link from 'next/link';
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const { cart, updateQuantity, removeItem, totalItems, totalPrice, totalSavings, loaded } = useCart();

  const formatPrice = (p) => `Rs. ${Number(p).toLocaleString()}`;

  if (!loaded) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-100 rounded w-1/3" />
          <div className="h-32 bg-gray-100 rounded-xl" />
          <div className="h-32 bg-gray-100 rounded-xl" />
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-6">Add some football gear or combo deals to get started!</p>
        <div className="flex gap-4 justify-center">
          <Link href="/products" className="btn-primary">Browse Products</Link>
          <Link href="/combos" className="btn-accent">View Combos</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/products" className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium mb-6">
        <ArrowLeft className="w-4 h-4" /> Continue Shopping
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Your Cart <span className="text-lg font-normal text-gray-500">({totalItems} items)</span>
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={`${item.type}-${item.id}`} className="bg-white rounded-xl border border-gray-100 p-4 flex gap-4">
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-3xl">
                  {item.type === 'combo' ? '🔥' : item.type === 'custom_combo' ? '🛠️' : '⚽'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{item.name}</h3>
                    {item.type === 'combo' && (
                      <span className="badge-discount text-[10px] mt-1 inline-block">
                        COMBO — {item.discount_percent}% OFF
                      </span>
                    )}
                    {item.type === 'custom_combo' && (
                      <span className="badge-discount text-[10px] mt-1 inline-block bg-accent-100 text-accent-700">
                        CUSTOM COMBO — {item.discount_percent}% OFF
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => removeItem(item.type, item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.type, item.id, item.quantity - 1)}
                      className="p-1.5 hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.type, item.id, item.quantity + 1)}
                      className="p-1.5 hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="text-right">
                    {(item.type === 'combo' || item.type === 'custom_combo') && item.original_price && (
                      <span className="text-xs text-gray-400 line-through block">
                        {formatPrice(item.original_price * item.quantity)}
                      </span>
                    )}
                    <span className="font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-24">
            <h2 className="font-bold text-lg text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                <span className="font-medium">{formatPrice(totalPrice + totalSavings)}</span>
              </div>
              {totalSavings > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Combo Savings</span>
                  <span className="font-medium">-{formatPrice(totalSavings)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery</span>
                <span className="text-green-600 font-medium">FREE</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-xl text-primary-700">{formatPrice(totalPrice)}</span>
              </div>
            </div>

            <Link href="/checkout" className="btn-accent w-full text-center block mt-6">
              Proceed to Checkout
            </Link>

            <p className="text-xs text-gray-400 text-center mt-3">
              💵 Cash on Delivery available
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
