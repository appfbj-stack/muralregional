'use client';

import { motion } from 'framer-motion';
import { Dispatch, SetStateAction } from 'react';
import { COLORS } from '@/lib/constants';

interface FilterProps {
  churches: Array<{ id: number; name: string }>;
  selectedChurch: number | null;
  setSelectedChurch: Dispatch<SetStateAction<number | null>>;
}

export default function ChurchFilter({
  churches,
  selectedChurch,
  setSelectedChurch,
}: FilterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-2xl shadow-lg p-5 mb-6"
    >
      <label className="text-sm font-bold text-gray-700 mb-3 block">
        🏘️ Filtrar por Igreja
      </label>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {/* Botão "Todas" */}
        <motion.button
          onClick={() => setSelectedChurch(null)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
            selectedChurch === null
              ? 'text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          style={{
            background:
              selectedChurch === null
                ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`
                : undefined,
          }}
        >
          Todas
        </motion.button>

        {/* Botões de igrejas */}
        {churches.map((church) => (
          <motion.button
            key={church.id}
            onClick={() => setSelectedChurch(church.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap overflow-hidden text-ellipsis ${
              selectedChurch === church.id
                ? 'text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title={church.name}
            style={{
              background:
                selectedChurch === church.id
                  ? `linear-gradient(135deg, ${COLORS.secondary}, ${COLORS.accent})`
                  : undefined,
            }}
          >
            {church.name}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
