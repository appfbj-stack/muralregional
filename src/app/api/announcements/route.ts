import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    
    const announcements = db.prepare(`
      SELECT 
        a.id,
        a.title,
        a.description,
        a.full_content,
        a.image_url,
        a.church_id,
        c.name as church,
        a.created_at,
        a.updated_at
      FROM announcements a
      JOIN churches c ON a.church_id = c.id
      ORDER BY a.created_at DESC
      LIMIT 100
    `).all();

    return NextResponse.json(announcements);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch announcements' },
      { status: 500 }
    );
  }
}
