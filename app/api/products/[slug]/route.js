import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export async function GET(request, { params }) {
  const db = getDB();
  const { slug } = params;

  const product = db.prepare(`
    SELECT p.*, c.name as category_name, c.slug as category_slug
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.slug = ? AND p.is_active = 1
  `).get(slug);

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json(product);
}
