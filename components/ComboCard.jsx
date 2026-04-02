'use client';

import Link from 'next/link';
import { useCart } from './CartProvider';
import { ShoppingCart, Percent } from 'lucide-react';

export default function ComboCard({ combo }) {
  const { addCombo } = useCart();

  const formatPrice = (p) => `Rs. ${Number(p).toLocaleString()}`;

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden border-2 border-accent-100 group relative">
      {/* Discount badge */}
      <div className="absolute top-3 right-3 z-10">
        <span className="badge-discount flex items-center gap-1">
          <Percent className="w-3 h-3" />
          {combo.discount_percent}% OFF
        </span>
      </div>

      <Link href={`/combos/${combo.slug}`}>
        <div className="aspect-video bg-gradient-to-br from-primary-50 to-accent-50 relative overflow-hidden flex items-center justify-center">
          <div className="text-5xl flex gap-2">
            {combo.items?.slice(0, 3).map((item, i) => (
              <span key={i} className="group-hover:scale-110 transition-transform duration-300" style={{ transitionDelay: `${i * 50}ms` }}>
                {item.slug?.includes('glove') ? '🧤' : 
                 item.slug?.includes('shin') ? '🛡️' :
                 item.slug?.includes('sock') ? '🧦' :
                 item.slug?.includes('cap') || item.slug?.includes('skull') || item.slug?.includes('headband') ? '🧢' :
                 item.slug?.includes('armband') || item.slug?.includes('sleeve') || item.slug?.includes('wrist') ? '💪' :
                 '🎒'}
              </span>
            ))}
            {(combo.items?.length || 0) > 3 && <span className="text-2xl text-gray-400">+{combo.items.length - 3}</span>}
          </div>
          <div className="absolute bottom-2 left-2 right-2">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 text-xs text-gray-600 text-center">
              {combo.items?.length || 0} items in this combo
            </div>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/combos/${combo.slug}`}>
          <h3 className="font-bold text-gray-900 text-lg group-hover:text-primary-600 transition-colors">
            {combo.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{combo.description}</p>

        <div className="mt-3 flex items-end justify-between">
          <div>
            <span className="text-sm text-gray-400 line-through">{formatPrice(combo.original_price)}</span>
            <span className="block text-xl font-bold text-accent-500">{formatPrice(combo.combo_price)}</span>
            <span className="text-xs text-primary-600 font-medium">
              Save {formatPrice(combo.original_price - combo.combo_price)}
            </span>
          </div>
          <button
            onClick={() => addCombo(combo)}
            className="btn-accent flex items-center gap-2 text-sm py-2 px-4"
          >
            <ShoppingCart className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
