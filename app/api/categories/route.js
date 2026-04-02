import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export async function GET() {
  const db = getDB();
  const categories = db.prepare('SELECT * FROM categories ORDER BY name').all();
  return NextResponse.json(categories);
}
