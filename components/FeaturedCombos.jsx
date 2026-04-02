'use client';

import { useEffect, useState } from 'react';
import ComboCard from './ComboCard';

export default function FeaturedCombos() {
  const [combos, setCombos] = useState([]);

  useEffect(() => {
    fetch('/api/combos')
      .then((r) => r.json())
      .then((data) => setCombos(data.slice(0, 3)))
      .catch(() => {});
  }, []);

  if (!combos.length) {
    return (
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl h-80 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {combos.map((combo) => (
        <ComboCard key={combo.id} combo={combo} />
      ))}
    </div>
  );
}
