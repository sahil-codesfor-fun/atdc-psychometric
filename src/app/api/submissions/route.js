import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { ensureSchema } from '@/lib/schema';

export async function GET() {
  try {
    await ensureSchema();
    const [rows] = await db.query('SELECT * FROM submissions ORDER BY timestamp DESC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json({ error: 'Failed to fetch submissions', details: error.message }, { status: 500 });
  }
}
