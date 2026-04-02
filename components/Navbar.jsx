'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from './CartProvider';
import { ShoppingCart, Menu, X, Search } from 'lucide-react';

export default function Navbar() {
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">⚽</span>
            <div>
              <span className="text-xl font-bold text-primary-700">Combo</span>
              <span className="text-xl font-bold text-accent-500">Shop</span>
              <span className="hidden sm:inline text-xs text-gray-400 ml-1">Nepal</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Home
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Products
            </Link>
            <Link href="/combos" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Combo Deals
            </Link>
            <Link href="/build-combo" className="text-accent-500 hover:text-accent-600 font-semibold transition-colors">
              🛠️ Build Combo
            </Link>
          </div>

          {/* Cart + Mobile Toggle */}
          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              className="md:hidden p-2 text-gray-700"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t py-4 space-y-3">
            <Link href="/" className="block text-gray-700 hover:text-primary-600 font-medium" onClick={() => setMobileOpen(false)}>
              Home
            </Link>
            <Link href="/products" className="block text-gray-700 hover:text-primary-600 font-medium" onClick={() => setMobileOpen(false)}>
              Products
            </Link>
            <Link href="/combos" className="block text-gray-700 hover:text-primary-600 font-medium" onClick={() => setMobileOpen(false)}>
              Combo Deals
            </Link>
            <Link href="/build-combo" className="block text-accent-500 hover:text-accent-600 font-semibold" onClick={() => setMobileOpen(false)}>
              🛠️ Build Combo
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
