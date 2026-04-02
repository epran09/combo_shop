'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { Filter } from 'lucide-react';

const CATEGORIES = [
  { name: 'All', slug: '' },
  { name: 'Gloves', slug: 'gloves', emoji: '🧤' },
  { name: 'Shin Guards', slug: 'shin-guards', emoji: '🛡️' },
  { name: 'Socks', slug: 'socks', emoji: '🧦' },
  { name: 'Caps & Headbands', slug: 'caps-headbands', emoji: '🧢' },
  { name: 'Arm Sleeves', slug: 'arm-sleeves-bands', emoji: '💪' },
  { name: 'Bags & More', slug: 'bags-accessories', emoji: '🎒' },
];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get('category') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const url = categorySlug ? `/api/products?category=${categorySlug}` : '/api/products';
    fetch(url)
      .then((r) => r.json())
      .then((data) => { setProducts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [categorySlug]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {categorySlug ? CATEGORIES.find(c => c.slug === categorySlug)?.name || 'Products' : 'All Products'}
        </h1>
        <p className="text-gray-500 mt-1">Football accessories — priced in NPR 🇳🇵</p>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={cat.slug ? `/products?category=${cat.slug}` : '/products'}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              categorySlug === cat.slug
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-primary-50 border border-gray-200'
            }`}
          >
            {cat.emoji && <span className="mr-1">{cat.emoji}</span>}
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl h-72 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">😕</p>
          <p className="text-gray-500 text-lg">No products found in this category.</p>
          <Link href="/products" className="text-primary-600 font-medium mt-2 inline-block">View all products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
