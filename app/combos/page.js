'use client';

import { useEffect, useState } from 'react';
import ComboCard from '@/components/ComboCard';

export default function CombosPage() {
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/combos')
      .then((r) => r.json())
      .then((data) => { setCombos(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent-50 to-primary-50 rounded-2xl p-8 mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">🔥 Combo Deals</h1>
        <p className="text-gray-600 mt-2 max-w-2xl">
          Save up to <strong className="text-accent-500">25%</strong> with our curated combo packs. 
          Bundled for every type of player — from goalkeepers to captains. All prices in NPR.
        </p>
      </div>

      {/* Combos Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl h-96 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {combos.map((combo) => (
            <ComboCard key={combo.id} combo={combo} />
          ))}
        </div>
      )}
    </div>
  );
}
