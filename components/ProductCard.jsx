'use client';

import Link from 'next/link';
import { useCart } from './CartProvider';
import { ShoppingCart } from 'lucide-react';

export default function ProductCard({ product }) {
  const { addProduct } = useCart();

  const formatPrice = (p) => `Rs. ${Number(p).toLocaleString()}`;

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
      <Link href={`/products/${product.slug}`}>
        <div className="aspect-square bg-gray-100 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-6xl text-gray-300 group-hover:scale-110 transition-transform duration-300">
            {product.category_slug === 'gloves' && '🧤'}
            {product.category_slug === 'shin-guards' && '🛡️'}
            {product.category_slug === 'socks' && '🧦'}
            {product.category_slug === 'caps-headbands' && '🧢'}
            {product.category_slug === 'arm-sleeves-bands' && '💪'}
            {product.category_slug === 'bags-accessories' && '🎒'}
          </div>
          <div className="absolute top-2 left-2">
            <span className="bg-primary-100 text-primary-700 text-xs font-medium px-2 py-1 rounded-full">
              {product.category_name}
            </span>
          </div>
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-primary-700">{formatPrice(product.price)}</span>
          <button
            onClick={() => addProduct(product)}
            className="bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-lg transition-colors"
            title="Add to cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
