import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    
    const churches = db.prepare(`
      SELECT id, name FROM churches ORDER BY name ASC
    `).all();

    return NextResponse.json(churches);
  } catch (error) {
    console.error('Error fetching churches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch churches' },
      { status: 500 }
    );
  }
}
