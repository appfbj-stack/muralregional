'use client';

import { motion } from 'framer-motion';
import { COLORS } from '@/lib/constants';

interface HeaderProps {
  selectedChurchName?: string;
}

export default function Header({ selectedChurchName }: HeaderProps) {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 backdrop-blur-md bg-opacity-80"
      style={{
        background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-2xl font-bold text-white"
          >
            📢 Mural OBPC
          </motion.div>
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-xs sm:text-sm text-white font-medium text-center flex-1 mx-4"
          >
            {selectedChurchName ? (
              <motion.div
                key={selectedChurchName}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="inline-block px-3 py-1 bg-white bg-opacity-20 rounded-full"
              >
                {selectedChurchName}
              </motion.div>
            ) : (
              <span>Regional Sorocaba</span>
            )}
          </motion.div>

          <motion.a
            href="/admin"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg font-medium transition-all text-xs sm:text-sm"
          >
            Admin
          </motion.a>
        </div>
      </div>
    </motion.header>
  );
}
