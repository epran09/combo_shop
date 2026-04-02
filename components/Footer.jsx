import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">⚽</span>
              <div>
                <span className="text-xl font-bold text-primary-400">Combo</span>
                <span className="text-xl font-bold text-accent-400">Shop</span>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              Nepal&apos;s #1 football accessories store. Gear up with combo deals and save big on every match day.
            </p>
            <p className="text-xs text-gray-500 mt-2">📍 Kathmandu, Nepal</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-primary-400 transition-colors">All Products</Link></li>
              <li><Link href="/combos" className="hover:text-primary-400 transition-colors">Combo Deals</Link></li>
              <li><Link href="/cart" className="hover:text-primary-400 transition-colors">My Cart</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-white mb-3">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products?category=gloves" className="hover:text-primary-400 transition-colors">Gloves</Link></li>
              <li><Link href="/products?category=shin-guards" className="hover:text-primary-400 transition-colors">Shin Guards</Link></li>
              <li><Link href="/products?category=socks" className="hover:text-primary-400 transition-colors">Socks</Link></li>
              <li><Link href="/products?category=caps-headbands" className="hover:text-primary-400 transition-colors">Caps & Headbands</Link></li>
              <li><Link href="/products?category=arm-sleeves-bands" className="hover:text-primary-400 transition-colors">Arm Sleeves</Link></li>
              <li><Link href="/products?category=bags-accessories" className="hover:text-primary-400 transition-colors">Bags & Accessories</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-3">Contact Us</h4>
            <ul className="space-y-2 text-sm">
              <li>📞 +977 9800000000</li>
              <li>📧 hello@comboshop.com.np</li>
              <li>📍 Thamel, Kathmandu</li>
              <li className="text-gray-500 text-xs pt-2">Delivery across Nepal 🇳🇵</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} ComboShop Nepal. All rights reserved. 🇳🇵
        </div>
      </div>
    </footer>
  );
}
