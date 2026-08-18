import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await db.query('SELECT DISTINCT institution as name FROM submissions WHERE institution IS NOT NULL AND institution != ""');
    return NextResponse.json(rows.map(r => r.name));
  } catch (error) {
    console.error('Error fetching schools:', error);
    return NextResponse.json({ error: 'Failed to fetch schools' }, { status: 500 });
  }
}
