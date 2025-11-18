import bcryptjs from 'bcryptjs';
import { getDb } from './db';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export async function initializeAdminUser() {
  const db = getDb();
  
  const adminExists = db.prepare('SELECT id FROM admins WHERE username = ?').get(ADMIN_USERNAME);
  
  if (!adminExists) {
    const hashedPassword = await bcryptjs.hash(ADMIN_PASSWORD, 10);
    db.prepare('INSERT INTO admins (username, password_hash) VALUES (?, ?)').run(
      ADMIN_USERNAME,
      hashedPassword
    );
  }
}

export async function verifyAdminCredentials(username: string, password: string) {
  const db = getDb();
  
  const admin = db.prepare('SELECT id, password_hash FROM admins WHERE username = ?').get(username) as any;
  
  if (!admin) {
    return false;
  }
  
  return await bcryptjs.compare(password, admin.password_hash);
}

export function generateAdminToken(username: string): string {
  // Simple JWT-like token usando Buffer para Node.js
  const payload = Buffer.from(JSON.stringify({
    username,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400 * 7 // 7 days
  })).toString('base64');
  
  return payload;
}

export function verifyAdminToken(token: string): { username: string } | null {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    
    return { username: payload.username };
  } catch (error) {
    return null;
  }
}
