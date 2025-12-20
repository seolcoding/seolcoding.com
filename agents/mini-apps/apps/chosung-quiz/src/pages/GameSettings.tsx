import { useState } from 'react';
import { Button } from '@mini-apps/ui';
import { Card } from '@mini-apps/ui';
import { useGameStore } from '../store/gameStore';
import type { Category } from '../types';
import { categoryLabels } from '../data';
import { Film, UtensilsCrossed, Music, BookText } from 'lucide-react';

const categoryIcons = {
  movie: Film,
  food: UtensilsCrossed,
  kpop: Music,
  proverb: BookText
};

export function GameSettings() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('movie');
  const [questionCount, setQuestionCount] = useState(10);
  const [timeLimit, setTimeLimit] = useState(30);
  const startGame = useGameStore((state) => state.startGame);

  const handleStart = () => {
    startGame({
      category: selectedCategory,
      questionCount,
      timeLimit
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 bg-white shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-600 mb-2">초성 퀴즈</h1>
          <p className="text-gray-600">초성을 보고 단어를 맞춰보세요!</p>
        </div>

        <div className="space-y-6">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              카테고리 선택
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(categoryLabels) as Category[]).map((category) => {
                const Icon = categoryIcons[category];
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedCategory === category
                        ? 'border-purple-500 bg-purple-50 shadow-md'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`w-8 h-8 mx-auto mb-2 ${
                      selectedCategory === category ? 'text-purple-600' : 'text-gray-600'
                    }`} />
                    <span className={`font-semibold ${
                      selectedCategory === category ? 'text-purple-700' : 'text-gray-700'
                    }`}>
                      {categoryLabels[category]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question Count */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              문제 개수: {questionCount}개
            </label>
            <input
              type="range"
              min="5"
              max="10"
              step="5"
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>5개</span>
              <span>10개</span>
            </div>
          </div>

          {/* Time Limit */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              제한 시간: {timeLimit}초
            </label>
            <input
              type="range"
              min="15"
              max="60"
              step="15"
              value={timeLimit}
              onChange={(e) => setTimeLimit(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>15초</span>
              <span>30초</span>
              <span>45초</span>
              <span>60초</span>
            </div>
          </div>

          {/* Start Button */}
          <Button
            onClick={handleStart}
            className="w-full py-6 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white"
          >
            게임 시작하기
          </Button>
        </div>
      </Card>
    </div>
  );
}
