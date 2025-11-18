import { initializeAdminUser } from '@/lib/auth';
import { getDb } from '@/lib/db';

// Inicializa banco de dados e admin user
export async function initializeApp() {
  try {
    getDb(); // Inicializa o banco
    await initializeAdminUser(); // Cria usuário admin padrão
    console.log('✅ App initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing app:', error);
  }
}

// Execute na startup
if (typeof window === 'undefined') {
  initializeApp();
}
