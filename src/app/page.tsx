'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import AnuncioCard from '@/components/AnuncioCard';
import ChurchFilter from '@/components/ChurchFilter';
import AnuncioModal from '@/components/AnuncioModal';
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

export default function Home() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [churches, setChurches] = useState<Church[]>([]);
  const [selectedChurch, setSelectedChurch] = useState<number | null>(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Recarrega igrejas a cada 10 segundos para sincronizar com novas criadas
    const interval = setInterval(async () => {
      try {
        const churchesRes = await fetch('/api/churches');
        const churchesData = await churchesRes.json();
        setChurches(churchesData || []);
      } catch (error) {
        console.error('Error fetching churches:', error);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const filteredAnnouncements = selectedChurch
    ? announcements.filter((a) => a.church_id === selectedChurch)
    : announcements;

  const selectedChurchName = churches.find((c) => c.id === selectedChurch)?.name;

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(135deg, ${COLORS.light} 0%, white 100%)`,
      }}
    >
      <Header selectedChurchName={selectedChurchName} />

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Filtro */}
        {churches.length > 0 && (
          <ChurchFilter
            churches={churches}
            selectedChurch={selectedChurch}
            setSelectedChurch={setSelectedChurch}
          />
        )}

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center py-20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 border-4 border-gray-200 rounded-full"
              style={{
                borderTopColor: COLORS.primary,
              }}
            />
          </motion.div>
        )}

        {/* Anúncios Grid */}
        {!loading && (
          <>
            {/* Banner PWA Card */}
            <InstallPromptCard />

            {filteredAnnouncements.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <div className="text-5xl mb-4">📭</div>
                <h2 className="text-2xl font-bold text-gray-700 mb-2">
                  Nenhum anúncio disponível
                </h2>
                <p className="text-gray-600">
                  Volte em breve para novidades!
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence>
                  {filteredAnnouncements.map((announcement) => (
                    <AnuncioCard
                      key={announcement.id}
                      {...announcement}
                      onClick={() => setSelectedAnnouncement(announcement)}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </>
        )}
      </main>

      {/* Modal de Anúncio */}
      <AnuncioModal
        announcement={selectedAnnouncement}
        onClose={() => setSelectedAnnouncement(null)}
      />
    </div>
  );
}

function InstallPromptCard() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  if (!showPrompt) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl overflow-hidden shadow-lg mb-6"
    >
      <div
        className="h-2"
        style={{
          background: `linear-gradient(90deg, ${COLORS.secondary}, ${COLORS.accent})`,
        }}
      />
      <div className="p-6">
        <div className="flex items-start gap-4">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-4xl flex-shrink-0"
          >
            📱
          </motion.div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-800">
              ⚡ Instale o Mural OBPC
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Receba atualizações de anúncios direto no seu celular e acesse offline
            </p>
            <div className="flex gap-3 mt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleInstall}
                className="flex-1 px-4 py-2 text-white font-semibold rounded-lg text-sm transition-all"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
                }}
              >
                ✨ Instalar Agora
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowPrompt(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-200 transition-all"
              >
                Depois
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
