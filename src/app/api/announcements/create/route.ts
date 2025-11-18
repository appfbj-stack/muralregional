import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();

    const { title, description, full_content, image_url, church_id } = body;

    if (!title || !description || !church_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = db.prepare(`
      INSERT INTO announcements (title, description, full_content, image_url, church_id)
      VALUES (?, ?, ?, ?, ?)
    `).run(title, description, full_content || null, image_url || null, church_id);

    return NextResponse.json(
      { id: result.lastInsertRowid, message: 'Announcement created' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating announcement:', error);
    return NextResponse.json(
      { error: 'Failed to create announcement' },
      { status: 500 }
    );
  }
}
