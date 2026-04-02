'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/CartProvider';
import { formatNPR, getCustomComboDiscount, CUSTOM_COMBO_TIERS } from '@/lib/utils';
import { Plus, Minus, ShoppingCart, ArrowRight, Sparkles, X, Check } from 'lucide-react';

export default function BuildComboPage() {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const { addCustomCombo } = useCart();
  const router = useRouter();

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category_name))];
    return ['all', ...cats];
  }, [products]);

  const filteredProducts = categoryFilter === 'all'
    ? products
    : products.filter((p) => p.category_name === categoryFilter);

  const originalPrice = selected.reduce((s, p) => s + p.price, 0);
  const discount = getCustomComboDiscount(selected.length);
  const comboPrice = Math.round(originalPrice * (1 - discount / 100));
  const savings = originalPrice - comboPrice;

  const nextTier = CUSTOM_COMBO_TIERS.find((t) => t.min > selected.length);
  const currentTier = [...CUSTOM_COMBO_TIERS].reverse().find((t) => t.min <= selected.length);

  const toggleProduct = (product) => {
    setAdded(false);
    setSelected((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id);
      if (idx >= 0) return prev.filter((_, i) => i !== idx);
      return [...prev, product];
    });
  };

  const removeSelected = (productId) => {
    setAdded(false);
    setSelected((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleAddToCart = () => {
    if (selected.length < 2) return;
    addCustomCombo(selected);
    setAdded(true);
    setSelected([]);
  };

  const isSelected = (id) => selected.some((p) => p.id === id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-accent-500 to-accent-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">🛠️ Build Your Own Combo</h1>
          <p className="text-accent-100 text-lg">
            Pick your favourite products — the more you add, the bigger your discount!
          </p>
          {/* Tier badges */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {CUSTOM_COMBO_TIERS.map((tier) => (
              <div
                key={tier.min}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  discount >= tier.discount
                    ? 'bg-white text-accent-600 shadow-lg scale-105'
                    : 'bg-accent-400/30 text-accent-100'
                }`}
              >
                {tier.min}+ items → {tier.discount}% OFF
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Product Selection */}
          <div className="lg:col-span-2">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    categoryFilter === cat
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border'
                  }`}
                >
                  {cat === 'all' ? 'All Products' : cat}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-white rounded-xl p-4 h-48" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {filteredProducts.map((product) => {
                  const sel = isSelected(product.id);
                  return (
                    <button
                      key={product.id}
                      onClick={() => toggleProduct(product)}
                      className={`relative bg-white rounded-xl p-4 text-left transition-all border-2 hover:shadow-md ${
                        sel
                          ? 'border-accent-500 ring-2 ring-accent-200 shadow-md'
                          : 'border-transparent hover:border-primary-200'
                      }`}
                    >
                      {sel && (
                        <div className="absolute top-2 right-2 bg-accent-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                      <div className="text-4xl mb-3 text-center">
                        {product.image_url || '⚽'}
                      </div>
                      <span className="text-[10px] font-medium text-primary-600 bg-primary-50 rounded-full px-2 py-0.5">
                        {product.category_name}
                      </span>
                      <h3 className="font-semibold text-gray-900 text-sm mt-1 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="font-bold text-primary-700 mt-1 text-sm">
                        {formatNPR(product.price)}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Combo Builder Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-24">
              <h2 className="font-bold text-lg text-gray-900 mb-1 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent-500" />
                Your Custom Combo
              </h2>
              <p className="text-xs text-gray-500 mb-4">
                Select at least 2 products to unlock discounts
              </p>

              {/* Progress toward next tier */}
              {selected.length > 0 && selected.length < 5 && nextTier && (
                <div className="bg-accent-50 rounded-lg p-3 mb-4 text-sm">
                  <p className="text-accent-700 font-medium">
                    {nextTier.min - selected.length === 1
                      ? `Add 1 more item for ${nextTier.discount}% off!`
                      : `Add ${nextTier.min - selected.length} more items for ${nextTier.discount}% off!`}
                  </p>
                  <div className="mt-2 h-2 bg-accent-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent-500 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, (selected.length / nextTier.min) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}
              {selected.length >= 5 && (
                <div className="bg-green-50 rounded-lg p-3 mb-4 text-sm">
                  <p className="text-green-700 font-semibold">🎉 Maximum 20% discount unlocked!</p>
                </div>
              )}

              {/* Selected items */}
              {selected.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Plus className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Click products to add them</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
                  {selected.map((p) => (
                    <div key={p.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-2 text-sm">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-lg flex-shrink-0">{p.image_url || '⚽'}</span>
                        <span className="text-gray-700 line-clamp-1">{p.name}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="font-medium text-gray-900">{formatNPR(p.price)}</span>
                        <button
                          onClick={() => removeSelected(p.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pricing summary */}
              {selected.length > 0 && (
                <div className="border-t pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Original ({selected.length} items)</span>
                    <span>{formatNPR(originalPrice)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>Discount ({discount}%)</span>
                      <span>-{formatNPR(savings)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg pt-1 border-t">
                    <span>Combo Price</span>
                    <span className="text-primary-700">{formatNPR(comboPrice)}</span>
                  </div>
                </div>
              )}

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={selected.length < 2}
                className="btn-accent w-full mt-4 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-4 h-4" />
                {selected.length < 2
                  ? `Select ${2 - selected.length} more product${selected.length === 0 ? 's' : ''}`
                  : 'Add Combo to Cart'}
              </button>

              {added && (
                <div className="mt-3 text-center">
                  <p className="text-green-600 text-sm font-medium mb-2">✅ Custom combo added!</p>
                  <button
                    onClick={() => router.push('/cart')}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium inline-flex items-center gap-1"
                  >
                    Go to Cart <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
