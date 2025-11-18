import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { initializeAdminUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Inicializa o usuário admin
    await initializeAdminUser();
    
    return NextResponse.json(
      { message: 'Admin user initialized' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error initializing admin:', error);
    return NextResponse.json(
      { error: 'Failed to initialize admin' },
      { status: 500 }
    );
  }
}
