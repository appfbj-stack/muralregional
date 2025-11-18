import path from 'path';
import fs from 'fs';
import os from 'os';

let db: any;

export function getDb() {
  if (!db) {
    try {
      const Database = require('better-sqlite3');
      
      // Em produção (Vercel), usar /tmp; localmente usar ./data
      let dataDir: string;
      if (process.env.VERCEL || process.env.VERCEL_ENV) {
        // Ambiente Vercel - usar diretório temporário
        dataDir = path.join('/tmp', 'mural-data');
      } else {
        // Desenvolvimento local
        dataDir = path.join(process.cwd(), 'data');
      }
      
      // Criar diretório se não existir
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      
      const dbPath = path.join(dataDir, 'app.db');
      db = new Database(dbPath);
      db.pragma('journal_mode = WAL');
      db.pragma('synchronous = NORMAL');
      initializeDb();
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }
  return db;
}

function initializeDb() {
  const db = getDb();

  // Tabela de igrejas
  db.exec(`
    CREATE TABLE IF NOT EXISTS churches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabela de anúncios
  db.exec(`
    CREATE TABLE IF NOT EXISTS announcements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      full_content TEXT,
      image_url TEXT,
      church_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(church_id) REFERENCES churches(id)
    )
  `);

  // Tabela de admins
  db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Inserir igrejas padrão se não existirem
  const churchCount = db.prepare('SELECT COUNT(*) as count FROM churches').get() as { count: number };
  
  if (churchCount.count === 0) {
    const churches = [
      'Igreja Central Sorocaba',
      'Igreja Av. Brasil',
      'Igreja Vila Santa Rosa',
      'Igreja Região Leste',
      'Igreja Região Oeste',
      'Igreja Região Norte',
      'Igreja Região Sul',
      'Igreja Centro',
      'Igreja Vila Trujillo',
      'Igreja Jardim Paulista',
      'Igreja Vila Santa Barbara',
      'Igreja Embu',
      'Igreja Itu',
      'Igreja Salto',
      'Igreja Capão Bonito',
      'Igreja Araçoiaba',
      'Igreja Piedade'
    ];

    const insertChurch = db.prepare('INSERT INTO churches (name, slug) VALUES (?, ?)');
    churches.forEach(church => {
      const slug = church
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      
      try {
        insertChurch.run(church, slug);
      } catch (e) {
        // Igreja já existe
      }
    });
  }
}

export function closeDb() {
  if (db) {
    db.close();
  }
}
