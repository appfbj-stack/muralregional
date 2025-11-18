import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDb();
    const { id } = await params;
    const idNum = parseInt(id);

    db.prepare('DELETE FROM announcements WHERE id = ?').run(idNum);

    return NextResponse.json({ message: 'Announcement deleted' });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    return NextResponse.json(
      { error: 'Failed to delete announcement' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDb();
    const { id } = await params;
    const idNum = parseInt(id);
    const body = await request.json();

    const { title, description, full_content, image_url, church_id } = body;

    db.prepare(`
      UPDATE announcements 
      SET title = ?, description = ?, full_content = ?, image_url = ?, church_id = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(title, description, full_content || null, image_url || null, church_id, idNum);

    return NextResponse.json({ message: 'Announcement updated' });
  } catch (error) {
    console.error('Error updating announcement:', error);
    return NextResponse.json(
      { error: 'Failed to update announcement' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDb();
    const { id } = await params;
    const idNum = parseInt(id);

    const announcement = db.prepare(`
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
      WHERE a.id = ?
    `).get(idNum);

    if (!announcement) {
      return NextResponse.json(
        { error: 'Announcement not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(announcement);
  } catch (error) {
    console.error('Error fetching announcement:', error);
    return NextResponse.json(
      { error: 'Failed to fetch announcement' },
      { status: 500 }
    );
  }
}
