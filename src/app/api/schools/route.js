import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { ensureSchema } from '@/lib/schema';

export async function GET() {
  try {
    await ensureSchema();
    const [rows] = await db.query('SELECT DISTINCT institution as name FROM submissions WHERE institution IS NOT NULL AND institution != ""');
    return NextResponse.json(rows.map(r => r.name));
  } catch (error) {
    console.error('Error fetching schools:', error);
    return NextResponse.json({ error: 'Failed to fetch schools', details: error.message }, { status: 500 });
  }
}
