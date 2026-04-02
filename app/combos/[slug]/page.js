'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useCart } from '@/components/CartProvider';
import Link from 'next/link';
import { ShoppingCart, ArrowLeft, Percent, Check } from 'lucide-react';

export default function ComboDetailPage() {
  const { slug } = useParams();
  const { addCombo } = useCart();
  const [combo, setCombo] = useState(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch(`/api/combos/${slug}`)
      .then((r) => r.json())
      .then(setCombo)
      .catch(() => {});
  }, [slug]);

  const formatPrice = (p) => `Rs. ${Number(p).toLocaleString()}`;

  const handleAdd = () => {
    addCombo(combo);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const emojiForSlug = (s) => {
    if (s?.includes('glove')) return '🧤';
    if (s?.includes('shin')) return '🛡️';
    if (s?.includes('sock')) return '🧦';
    if (s?.includes('cap') || s?.includes('skull') || s?.includes('headband')) return '🧢';
    if (s?.includes('armband') || s?.includes('sleeve') || s?.includes('wrist')) return '💪';
    return '🎒';
  };

  if (!combo) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-8 bg-gray-100 rounded w-1/3 mb-4" />
        <div className="h-64 bg-gray-100 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/combos" className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Combos
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Visual */}
        <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-8 flex flex-col items-center justify-center relative">
          <div className="absolute top-4 right-4 badge-discount flex items-center gap-1 text-sm">
            <Percent className="w-3 h-3" /> {combo.discount_percent}% OFF
          </div>
          <div className="flex gap-4 text-6xl mb-6">
            {combo.items?.map((item, i) => (
              <span key={i} className="hover:scale-110 transition-transform">{emojiForSlug(item.slug)}</span>
            ))}
          </div>
          <p className="text-sm text-gray-500">{combo.items?.length} items in this combo</p>
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{combo.name}</h1>
          <p className="mt-3 text-gray-600 leading-relaxed">{combo.description}</p>

          {/* Pricing */}
          <div className="mt-6 bg-gray-50 rounded-xl p-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-accent-500">{formatPrice(combo.combo_price)}</span>
              <span className="text-lg text-gray-400 line-through">{formatPrice(combo.original_price)}</span>
            </div>
            <p className="text-sm text-primary-600 font-medium mt-1">
              🎉 You save {formatPrice(combo.original_price - combo.combo_price)}
            </p>
          </div>

          {/* Items in combo */}
          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 mb-3">What&apos;s Included:</h3>
            <div className="space-y-3">
              {combo.items?.map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-100">
                  <span className="text-2xl">{emojiForSlug(item.slug)}</span>
                  <div className="flex-1">
                    <Link href={`/products/${item.slug}`} className="font-medium text-gray-900 hover:text-primary-600">
                      {item.name}
                    </Link>
                    {item.description && <p className="text-xs text-gray-500 line-clamp-1">{item.description}</p>}
                  </div>
                  <div className="text-right text-sm">
                    <span className="text-gray-500">×{item.quantity}</span>
                    <div className="text-gray-400">{formatPrice(item.price)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAdd}
            className={`mt-6 w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-semibold text-lg transition-all ${
              added ? 'bg-green-500 text-white' : 'btn-accent'
            }`}
          >
            {added ? (
              <><Check className="w-5 h-5" /> Added to Cart</>
            ) : (
              <><ShoppingCart className="w-5 h-5" /> Add Combo to Cart — {formatPrice(combo.combo_price)}</>
            )}
          </button>

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-600">
            <div className="bg-gray-50 rounded-lg p-3">🚚 All Nepal Delivery</div>
            <div className="bg-gray-50 rounded-lg p-3">💵 Cash on Delivery</div>
          </div>
        </div>
      </div>
    </div>
  );
}
