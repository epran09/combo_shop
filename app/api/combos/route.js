import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export async function GET() {
  const db = getDB();

  const combos = db.prepare(`
    SELECT * FROM combos WHERE is_active = 1 ORDER BY discount_percent DESC
  `).all();

  // Attach items to each combo
  const getItems = db.prepare(`
    SELECT ci.quantity, p.id as product_id, p.name, p.slug, p.price, p.image_url
    FROM combo_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.combo_id = ?
  `);

  const result = combos.map((combo) => {
    const items = getItems.all(combo.id);
    const originalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const comboPrice = Math.round(originalPrice * (1 - combo.discount_percent / 100));
    return { ...combo, items, original_price: originalPrice, combo_price: comboPrice };
  });

  return NextResponse.json(result);
}
