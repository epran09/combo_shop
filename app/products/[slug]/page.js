'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useCart } from '@/components/CartProvider';
import Link from 'next/link';
import { ShoppingCart, Minus, Plus, ArrowLeft } from 'lucide-react';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { addProduct } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then((r) => r.json())
      .then(setProduct)
      .catch(() => {});
  }, [slug]);

  const formatPrice = (p) => `Rs. ${Number(p).toLocaleString()}`;

  const handleAdd = () => {
    addProduct(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const emojiMap = {
    gloves: '🧤', 'shin-guards': '🛡️', socks: '🧦',
    'caps-headbands': '🧢', 'arm-sleeves-bands': '💪', 'bags-accessories': '🎒',
  };

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="animate-pulse grid md:grid-cols-2 gap-8">
          <div className="bg-gray-100 rounded-xl aspect-square" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-100 rounded w-3/4" />
            <div className="h-4 bg-gray-100 rounded w-1/2" />
            <div className="h-20 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/products" className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Products
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="bg-gray-100 rounded-2xl aspect-square flex items-center justify-center">
          <span className="text-9xl">{emojiMap[product.category_slug] || '⚽'}</span>
        </div>

        {/* Details */}
        <div>
          <span className="bg-primary-100 text-primary-700 text-sm font-medium px-3 py-1 rounded-full">
            {product.category_name}
          </span>
          <h1 className="mt-3 text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="mt-3 text-gray-600 leading-relaxed">{product.description}</p>

          <div className="mt-6">
            <span className="text-3xl font-bold text-primary-700">{formatPrice(product.price)}</span>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            {product.stock > 10 ? (
              <span className="text-green-600">✅ In Stock</span>
            ) : product.stock > 0 ? (
              <span className="text-amber-600">⚠️ Only {product.stock} left</span>
            ) : (
              <span className="text-red-600">❌ Out of Stock</span>
            )}
          </div>

          {/* Quantity */}
          <div className="mt-6 flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Quantity:</span>
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 hover:bg-gray-100 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 hover:bg-gray-100 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            className={`mt-6 w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-semibold text-lg transition-all ${
              added
                ? 'bg-green-500 text-white'
                : 'bg-primary-600 hover:bg-primary-700 text-white'
            } disabled:bg-gray-300 disabled:cursor-not-allowed`}
          >
            <ShoppingCart className="w-5 h-5" />
            {added ? 'Added to Cart ✓' : `Add to Cart — ${formatPrice(product.price * quantity)}`}
          </button>

          {/* Info */}
          <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-gray-600">
            <div className="bg-gray-50 rounded-lg p-3">🚚 Delivery across Nepal</div>
            <div className="bg-gray-50 rounded-lg p-3">💵 Cash on Delivery</div>
            <div className="bg-gray-50 rounded-lg p-3">📦 Easy Returns</div>
            <div className="bg-gray-50 rounded-lg p-3">📞 WhatsApp Support</div>
          </div>
        </div>
      </div>
    </div>
  );
}
