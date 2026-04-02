import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export async function GET(request, { params }) {
  const db = getDB();
  const { slug } = params;

  const combo = db.prepare('SELECT * FROM combos WHERE slug = ? AND is_active = 1').get(slug);

  if (!combo) {
    return NextResponse.json({ error: 'Combo not found' }, { status: 404 });
  }

  const items = db.prepare(`
    SELECT ci.quantity, p.id as product_id, p.name, p.slug, p.price, p.image_url, p.description
    FROM combo_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.combo_id = ?
  `).all(combo.id);

  const originalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const comboPrice = Math.round(originalPrice * (1 - combo.discount_percent / 100));

  return NextResponse.json({ ...combo, items, original_price: originalPrice, combo_price: comboPrice });
}
