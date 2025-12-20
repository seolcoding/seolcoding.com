import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Volume2, VolumeX } from 'lucide-react';
import { useBingoStore } from '@/stores/useBingoStore';
import { BingoGrid } from './BingoGrid';
import { BingoSuccessModal } from './BingoSuccessModal';
import { generateBingoCard } from '@/utils/shuffleAlgorithm';
import { getBingoCount } from '@/utils/bingoAlgorithm';
import { playSoundEffect } from '@/utils/soundEffects';
import { THEME_PRESETS } from '@/data/themePresets';

export function PlayerScreen() {
  const {
    gameCode,
    config,
    playerCard,
    bingoState,
    initializePlayer,
    markCell,
    currentCall,
    soundEnabled,
    toggleSound,
    showBingoModal,
    setShowBingoModal,
    setGameMode,
  } = useBingoStore();

  // Initialize player card when joining
  useEffect(() => {
    if (!playerCard && config) {
      // For demo, create a default config if not exists
      let items = config.items;
      if (items.length === 0) {
        const theme = THEME_PRESETS[0];
        items = theme.items;
      }

      const card = generateBingoCard(items, config.gridSize, {
        centerFree: config.centerFree,
        seed: gameCode || undefined,
      });
      initializePlayer(card);
    }
  }, [config, playerCard, gameCode, initializePlayer]);

  // Auto-mark when host calls
  useEffect(() => {
    if (currentCall && soundEnabled) {
      playSoundEffect('call');
    }
  }, [currentCall, soundEnabled]);

  const handleCellClick = (row: number, col: number) => {
    markCell(row, col);
    if (soundEnabled) {
      playSoundEffect('mark');
    }
  };

  const bingoCount = bingoState ? getBingoCount(bingoState) : 0;

  if (!bingoState) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">빙고판 생성 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setGameMode('menu')}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>나가기</span>
          </button>

          <div className="flex items-center space-x-4">
            {/* Game Code */}
            <div className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">게임 코드: </span>
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                {gameCode}
              </span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Bingo Count */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6 text-center"
        >
          <div className="inline-flex items-center space-x-3 px-6 py-3 bg-white dark:bg-gray-800 rounded-full shadow-lg">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              빙고: {bingoCount}줄
            </span>
          </div>
        </motion.div>

        {/* Current Call Banner */}
        {currentCall && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-6 p-6 bg-blue-600 text-white rounded-2xl shadow-xl text-center"
          >
            <p className="text-lg font-semibold mb-2">방금 호출됨</p>
            <p className="text-5xl font-bold">{currentCall}</p>
          </motion.div>
        )}

        {/* Bingo Grid */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 mb-6"
        >
          <BingoGrid
            state={bingoState}
            onCellClick={handleCellClick}
          />
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center text-sm text-gray-600 dark:text-gray-400"
        >
          <p>셀을 클릭하여 마킹하세요</p>
          <p className="mt-1">가로, 세로, 대각선으로 한 줄이 완성되면 빙고!</p>
        </motion.div>
      </div>

      {/* Bingo Success Modal */}
      <BingoSuccessModal
        lines={bingoState.completedLines}
        isOpen={showBingoModal}
        onClose={() => {
          setShowBingoModal(false);
          if (soundEnabled) {
            playSoundEffect('bingo');
          }
        }}
      />
    </div>
  );
}
