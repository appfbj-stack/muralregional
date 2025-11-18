'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { COLORS } from '@/lib/constants';

interface AnuncioCardProps {
  id: number;
  title: string;
  description: string;
  image_url?: string;
  church: string;
  created_at: string;
  onClick: () => void;
}

export default function AnuncioCard({
  id,
  title,
  description,
  image_url,
  church,
  created_at,
  onClick,
}: AnuncioCardProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-lg cursor-pointer transition-all hover:shadow-2xl"
    >
      {/* Imagem */}
      {image_url && (
        <div className="relative w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
          <Image
            src={image_url}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      {/* Conteúdo */}
      <div className="p-5">
        {/* Crachá da Igreja */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-block mb-3 px-3 py-1 rounded-full text-xs font-semibold text-white"
          style={{
            background: `linear-gradient(135deg, ${COLORS.secondary}, ${COLORS.accent})`,
          }}
        >
          {church}
        </motion.div>

        {/* Título */}
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 hover:text-transparent hover:bg-clip-text"
            style={{
              backgroundImage: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
              backgroundClip: 'text',
            }}>
          {title}
        </h3>

        {/* Descrição */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{description}</p>

        {/* Data */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between text-xs text-gray-500"
        >
          <span>📅 {formatDate(created_at)}</span>
          <motion.span
            whileHover={{ x: 5 }}
            className="text-primary font-semibold"
            style={{ color: COLORS.primary }}
          >
            →
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  );
}
