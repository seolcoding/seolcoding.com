import type { Hint } from '../types';
import { Lock, LockOpen } from 'lucide-react';

interface HintSectionProps {
  hints: Hint[];
  onUseHint: (level: number) => void;
  usedHints: number[];
}

export function HintSection({ hints, onUseHint, usedHints }: HintSectionProps) {
  return (
    <div className="flex flex-col gap-3 my-6">
      {hints.map((hint) => {
        const isUsed = usedHints.includes(hint.level);

        return (
          <button
            key={hint.level}
            onClick={() => !isUsed && onUseHint(hint.level)}
            disabled={isUsed}
            className={`px-4 py-3 rounded-lg font-semibold transition-all text-left ${
              isUsed
                ? 'bg-green-50 border-2 border-green-500 text-green-700 cursor-default'
                : 'bg-yellow-400 hover:bg-yellow-500 text-gray-800 border-2 border-yellow-500 hover:shadow-md'
            }`}
          >
            <div className="flex items-center gap-3">
              {isUsed ? (
                <LockOpen className="w-5 h-5 flex-shrink-0" />
              ) : (
                <Lock className="w-5 h-5 flex-shrink-0" />
              )}
              <div className="flex-1">
                {isUsed ? (
                  <span>{hint.content}</span>
                ) : (
                  <span>힌트 {hint.level} 보기 (-50점)</span>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
