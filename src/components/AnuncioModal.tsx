'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { COLORS } from '@/lib/constants';

interface AnuncioModalProps {
  announcement: any | null;
  onClose: () => void;
}

export default function AnuncioModal({ announcement, onClose }: AnuncioModalProps) {
  if (!announcement) return null;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Imagem */}
          {announcement.image_url && (
            <div className="relative w-full h-64 bg-gradient-to-br from-gray-200 to-gray-300">
              <Image
                src={announcement.image_url}
                alt={announcement.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="p-6">
            {/* Crachá da Igreja */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-block mb-4 px-4 py-2 rounded-full text-sm font-semibold text-white"
              style={{
                background: `linear-gradient(135deg, ${COLORS.secondary}, ${COLORS.accent})`,
              }}
            >
              {announcement.church}
            </motion.div>

            {/* Título */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold mb-4"
              style={{
                backgroundImage: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              {announcement.title}
            </motion.h1>

            {/* Data */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-gray-500 mb-6"
            >
              📅 {formatDate(announcement.created_at)}
            </motion.p>

            {/* Conteúdo */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="prose prose-sm max-w-none"
            >
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {announcement.full_content || announcement.description}
              </p>
            </motion.div>

            {/* Botão Fechar */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="mt-8 w-full px-6 py-3 text-white rounded-lg font-semibold"
              style={{
                background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
              }}
            >
              Fechar
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
