import Link from 'next/link';
import HeroBanner from '@/components/HeroBanner';
import FeaturedCombos from '@/components/FeaturedCombos';
import FeaturedProducts from '@/components/FeaturedProducts';
import { ArrowRight, Truck, ShieldCheck, BadgePercent, Headphones } from 'lucide-react';

export default function HomePage() {
  return (
    <>
      <HeroBanner />

      {/* Trust Badges */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center gap-2">
              <Truck className="w-6 h-6 text-primary-600" />
              <span className="text-sm font-medium text-gray-700">All Nepal Delivery</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-primary-600" />
              <span className="text-sm font-medium text-gray-700">Quality Guaranteed</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <BadgePercent className="w-6 h-6 text-primary-600" />
              <span className="text-sm font-medium text-gray-700">Up to 25% Off Combos</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Headphones className="w-6 h-6 text-primary-600" />
              <span className="text-sm font-medium text-gray-700">WhatsApp Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Combos */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">🔥 Combo Deals</h2>
            <p className="text-gray-500 mt-1">Bundle & save — curated packs for every player</p>
          </div>
          <Link href="/combos" className="hidden sm:flex items-center gap-1 text-primary-600 hover:text-primary-700 font-semibold">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <FeaturedCombos />
        <div className="sm:hidden mt-4 text-center">
          <Link href="/combos" className="text-primary-600 font-semibold">View All Combos →</Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">⚡ Popular Products</h2>
              <p className="text-gray-500 mt-1">Top-selling football accessories</p>
            </div>
            <Link href="/products" className="hidden sm:flex items-center gap-1 text-primary-600 hover:text-primary-700 font-semibold">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <FeaturedProducts />
          <div className="sm:hidden mt-4 text-center">
            <Link href="/products" className="text-primary-600 font-semibold">View All Products →</Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">🏷️ Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: 'Gloves', slug: 'gloves', emoji: '🧤' },
            { name: 'Shin Guards', slug: 'shin-guards', emoji: '🛡️' },
            { name: 'Socks', slug: 'socks', emoji: '🧦' },
            { name: 'Caps & Headbands', slug: 'caps-headbands', emoji: '🧢' },
            { name: 'Arm Sleeves', slug: 'arm-sleeves-bands', emoji: '💪' },
            { name: 'Bags & More', slug: 'bags-accessories', emoji: '🎒' },
          ].map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="bg-white rounded-xl p-4 text-center hover:shadow-md transition-shadow border border-gray-100 group"
            >
              <span className="text-4xl block mb-2 group-hover:scale-110 transition-transform">{cat.emoji}</span>
              <span className="text-sm font-medium text-gray-700">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-accent-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-3xl font-bold mb-2">Ready to gear up? 🏆</h2>
          <p className="text-accent-100 mb-6">Build your own combo or pick from our curated deals. Cash on Delivery available.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/build-combo" className="inline-block bg-white text-accent-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors">
              🛠️ Build Your Own Combo
            </Link>
            <Link href="/combos" className="inline-block border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white/10 transition-colors">
              Explore Combo Deals
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
