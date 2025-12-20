import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import type { BingoCell as BingoCellType } from '@/types/bingo.types';

interface BingoCellProps {
  cell: BingoCellType;
  isPartOfBingo: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function BingoCell({ cell, isPartOfBingo, onClick, disabled = false }: BingoCellProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled || cell.value === 'FREE'}
      className={clsx(
        'relative h-16 sm:h-20 md:h-24',
        'flex items-center justify-center',
        'border-2 rounded-lg font-bold',
        'transition-all duration-200',
        'text-sm sm:text-base md:text-lg lg:text-xl',
        {
          // FREE 칸
          'bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 cursor-default':
            cell.value === 'FREE',

          // 마킹되지 않은 칸
          'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600':
            !cell.isMarked && cell.value !== 'FREE',

          // 마킹된 칸 (빙고 라인 아님)
          'bg-blue-500 text-white border-blue-600':
            cell.isMarked && !isPartOfBingo && cell.value !== 'FREE',

          // 빙고 라인의 일부
          'bg-yellow-400 dark:bg-yellow-500 text-gray-900 border-yellow-600 animate-pulse':
            isPartOfBingo,

          // 호버 효과
          'hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-105 active:scale-95':
            !cell.isMarked && !disabled && cell.value !== 'FREE',
        }
      )}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      animate={{
        scale: cell.isMarked && !isPartOfBingo ? [1, 1.1, 1] : 1,
      }}
      transition={{ duration: 0.2 }}
    >
      <span className="break-words px-1 text-center">{cell.value}</span>

      {cell.isMarked && cell.value !== 'FREE' && (
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className="w-full h-full flex items-center justify-center">
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </motion.div>
      )}
    </motion.button>
  );
}
