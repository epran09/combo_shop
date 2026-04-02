import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export async function GET(request) {
  const db = getDB();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');

  let query = `
    SELECT p.*, c.name as category_name, c.slug as category_slug
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.is_active = 1
  `;
  const params = [];

  if (category) {
    query += ' AND c.slug = ?';
    params.push(category);
  }

  if (search) {
    query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  query += ' ORDER BY p.created_at DESC';

  const products = db.prepare(query).all(...params);
  return NextResponse.json(products);
}
