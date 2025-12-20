import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Sparkles, X } from 'lucide-react';
import type { BingoLine } from '@/types/bingo.types';
import { getBingoCount } from '@/utils/bingoAlgorithm';
import { useBingoStore } from '@/stores/useBingoStore';

interface BingoSuccessModalProps {
  lines: BingoLine[];
  isOpen: boolean;
  onClose: () => void;
}

export function BingoSuccessModal({ lines, isOpen, onClose }: BingoSuccessModalProps) {
  const bingoCount = lines.length;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, y: -100, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.5, y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: 'easeInOut',
              }}
              className="mb-6 flex justify-center"
            >
              <div className="relative">
                <Trophy className="w-24 h-24 text-yellow-500" />
                <motion.div
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Sparkles className="w-12 h-12 text-yellow-400" />
                </motion.div>
              </div>
            </motion.div>

            <motion.h1
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
              }}
              className="text-5xl font-bold text-yellow-500 mb-4"
            >
              BINGO!
            </motion.h1>

            <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
              {bingoCount}줄 완성!
            </p>

            <div className="space-y-2 mb-6">
              {lines.map((line, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-gray-600 dark:text-gray-400"
                >
                  {line.type === 'row' && `가로 ${(line.index ?? 0) + 1}줄`}
                  {line.type === 'column' && `세로 ${(line.index ?? 0) + 1}줄`}
                  {line.type === 'diagonal' && '대각선'}
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              계속하기
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
