import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const { name } = await request.json();

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Church name is required' },
        { status: 400 }
      );
    }

    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

    try {
      const result = db.prepare('INSERT INTO churches (name, slug) VALUES (?, ?)').run(name, slug);
      
      return NextResponse.json(
        { 
          id: result.lastInsertRowid, 
          name,
          slug,
          message: 'Church created successfully' 
        },
        { status: 201 }
      );
    } catch (error: any) {
      if (error.message.includes('UNIQUE')) {
        return NextResponse.json(
          { error: 'Church name already exists' },
          { status: 409 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error('Error creating church:', error);
    return NextResponse.json(
      { error: 'Failed to create church' },
      { status: 500 }
    );
  }
}
