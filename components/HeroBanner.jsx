import Link from 'next/link';

export default function HeroBanner() {
  return (
    <section className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center bg-white/10 rounded-full px-4 py-1 text-sm mb-4">
              🇳🇵 Made for Nepal&apos;s Football Community
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
              Gear Up.
              <br />
              <span className="text-accent-300">Save More</span> with Combos.
            </h1>
            <p className="mt-4 text-lg text-primary-100 max-w-lg">
              Nepal&apos;s first football accessories store with combo deals. 
              Get gloves, shin guards, socks, and more — bundled at up to <strong className="text-white">25% off</strong>.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/combos" className="bg-accent-500 hover:bg-accent-600 text-white font-bold py-3 px-8 rounded-lg transition-colors text-lg">
                🔥 View Combos
              </Link>
              <Link href="/products" className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-8 rounded-lg transition-colors border border-white/30">
                Browse Products
              </Link>
            </div>
            <div className="mt-6 flex items-center gap-6 text-sm text-primary-200">
              <span>✅ Cash on Delivery</span>
              <span>✅ All over Nepal</span>
              <span>✅ NPR Prices</span>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center">
            <div className="text-9xl animate-bounce" style={{ animationDuration: '3s' }}>⚽</div>
          </div>
        </div>
      </div>
    </section>
  );
}
