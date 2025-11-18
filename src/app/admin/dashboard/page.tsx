'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { COLORS } from '@/lib/constants';

interface Announcement {
  id: number;
  title: string;
  description: string;
  full_content?: string;
  image_url?: string;
  church: string;
  church_id: number;
  created_at: string;
}

interface Church {
  id: number;
  name: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [churches, setChurches] = useState<Church[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showChurchForm, setShowChurchForm] = useState(false);
  const [newChurchName, setNewChurchName] = useState('');
  const [churchLoading, setChurchLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    full_content: '',
    image_url: '',
    church_id: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin');
      return;
    }

    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const [announcementsRes, churchesRes] = await Promise.all([
        fetch('/api/announcements'),
        fetch('/api/churches'),
      ]);

      const announcementsData = await announcementsRes.json();
      const churchesData = await churchesRes.json();

      setAnnouncements(announcementsData || []);
      setChurches(churchesData || []);
      
      if (churchesData.length > 0 && !formData.church_id) {
        setFormData(prev => ({ ...prev, church_id: churchesData[0].id }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.church_id) {
      alert('Preencha os campos obrigatórios');
      return;
    }

    try {
      if (editingId) {
        // Editar
        const response = await fetch(`/api/announcements/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error('Erro ao editar');
        setEditingId(null);
      } else {
        // Criar
        const response = await fetch('/api/announcements/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error('Erro ao criar');
      }

      setFormData({
        title: '',
        description: '',
        full_content: '',
        image_url: '',
        church_id: churches[0]?.id || 0,
      });
      setShowForm(false);
      fetchData();
    } catch (error) {
      alert('Erro ao salvar anúncio');
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setFormData({
      title: announcement.title,
      description: announcement.description,
      full_content: announcement.full_content || '',
      image_url: announcement.image_url || '',
      church_id: announcement.church_id,
    });
    setEditingId(announcement.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar este anúncio?')) return;

    try {
      const response = await fetch(`/api/announcements/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erro ao deletar');
      fetchData();
    } catch (error) {
      alert('Erro ao deletar anúncio');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      full_content: '',
      image_url: '',
      church_id: churches[0]?.id || 0,
    });
  };

  const handleCreateChurch = async (e: React.FormEvent) => {
    e.preventDefault();

    const churchNameToCreate = newChurchName.trim();

    if (!churchNameToCreate) {
      alert('Digite o nome da igreja');
      return;
    }

    setChurchLoading(true);

    try {
      const response = await fetch('/api/churches/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: churchNameToCreate }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao criar igreja');
      }

      const newChurch = await response.json();
      const updatedChurches = [...churches, { id: newChurch.id, name: newChurch.name }];
      setChurches(updatedChurches);
      setFormData(prev => ({ ...prev, church_id: newChurch.id }));
      setNewChurchName('');
      setShowChurchForm(false);
      alert('✅ Igreja "' + newChurch.name + '" criada com sucesso!');
    } catch (error: any) {
      console.error('Error:', error);
      alert('❌ ' + (error.message || 'Erro ao criar igreja'));
    } finally {
      setChurchLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(135deg, ${COLORS.light} 0%, white 100%)`,
      }}
    >
      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-40 backdrop-blur-md bg-opacity-80"
        style={{
          background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">🎛️ Painel Admin</h1>
          <div className="flex gap-3">
            <motion.a
              href="/"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg font-medium transition-all"
            >
              🏠 Mural
            </motion.a>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg font-medium transition-all"
            >
              Sair
            </motion.button>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6">
        {/* Botão Novo */}
        {!showForm && (
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="mb-8 px-6 py-3 text-white font-semibold rounded-lg"
            style={{
              background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
            }}
          >
            ➕ Novo Anúncio
          </motion.button>
        )}

        {/* Formulário */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-lg p-6 mb-8"
            >
              <h2 className="text-2xl font-bold mb-6">
                {editingId ? '✏️ Editar Anúncio' : '📝 Novo Anúncio'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Título *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Igreja *
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={formData.church_id}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            church_id: parseInt(e.target.value),
                          })
                        }
                        className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                        required
                      >
                        {churches.map((church) => (
                          <option key={church.id} value={church.id}>
                            {church.name}
                          </option>
                        ))}
                      </select>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowChurchForm(!showChurchForm)}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold text-sm hover:bg-green-600"
                      >
                        ➕
                      </motion.button>
                    </div>
                    
                    {/* Formulário de Nova Igreja */}
                    <AnimatePresence>
                      {showChurchForm && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 p-3 bg-green-50 border-2 border-green-200 rounded-lg"
                        >
                          <label className="block text-xs font-semibold text-gray-700 mb-2">
                            Nome da Nova Igreja
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newChurchName}
                              onChange={(e) => setNewChurchName(e.target.value)}
                              placeholder="Ex: Igreja Central..."
                              className="flex-1 px-3 py-2 border-2 border-green-300 rounded-lg focus:outline-none focus:border-green-500 text-sm"
                              autoFocus
                            />
                            <motion.button
                              type="button"
                              disabled={churchLoading || !newChurchName.trim()}
                              onClick={(e) => {
                                e.preventDefault();
                                const form = new FormData();
                                handleCreateChurch({ preventDefault: () => {} } as React.FormEvent);
                              }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-3 py-2 bg-green-500 text-white rounded-lg font-semibold text-sm hover:bg-green-600 disabled:opacity-50"
                            >
                              {churchLoading ? '⏳' : '✅'}
                            </motion.button>
                            <motion.button
                              type="button"
                              onClick={() => {
                                setShowChurchForm(false);
                                setNewChurchName('');
                              }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-3 py-2 bg-gray-400 text-white rounded-lg font-semibold text-sm hover:bg-gray-500"
                            >
                              ❌
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Descrição Breve *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Conteúdo Completo
                  </label>
                  <textarea
                    value={formData.full_content}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        full_content: e.target.value,
                      })
                    }
                    rows={6}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    URL da Imagem
                  </label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) =>
                      setFormData({ ...formData, image_url: e.target.value })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>

                <div className="flex gap-3">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 px-6 py-3 text-white font-semibold rounded-lg"
                    style={{
                      background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
                    }}
                  >
                    💾 Salvar
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={handleCancel}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg"
                  >
                    ❌ Cancelar
                  </motion.button>
                  <motion.a
                    href="/"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r text-white font-semibold rounded-lg flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.warning})`,
                    }}
                  >
                    🏠 Voltar para Mural
                  </motion.a>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lista de Anúncios */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center py-20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-12 h-12 border-4 border-gray-200 rounded-full"
              style={{ borderTopColor: COLORS.primary }}
            />
          </motion.div>
        ) : announcements.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white rounded-2xl"
          >
            <div className="text-5xl mb-4">📭</div>
            <p className="text-gray-600">Nenhum anúncio publicado ainda</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {announcements.map((announcement) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white rounded-lg shadow p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800">
                      {announcement.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {announcement.description.substring(0, 100)}...
                    </p>
                    <div className="flex gap-4 mt-2 text-xs text-gray-500">
                      <span>🏘️ {announcement.church}</span>
                      <span>
                        📅{' '}
                        {new Date(announcement.created_at).toLocaleDateString(
                          'pt-BR'
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEdit(announcement)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold"
                    >
                      ✏️ Editar
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(announcement.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold"
                    >
                      🗑️ Deletar
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}
