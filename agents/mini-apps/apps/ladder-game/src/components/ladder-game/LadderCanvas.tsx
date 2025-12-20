/**
 * LadderCanvas Component
 *
 * Canvas를 사용한 사다리 렌더링 및 애니메이션
 */

import { useEffect } from 'react';
import { useLadderCanvas } from '../../hooks/useLadderCanvas';
import { usePathAnimation } from '../../hooks/usePathAnimation';
import type { LadderData } from '../../lib/ladder/types';

interface LadderCanvasProps {
  ladder: LadderData | null;
  participants: string[];
  results: string[];
  theme?: 'light' | 'dark' | 'colorful';
  onParticipantClick?: (index: number) => void;
  onAnimationComplete?: (resultColumn: number) => void;
  animationTrigger?: { index: number } | null;
}

export function LadderCanvas({
  ladder,
  participants,
  results,
  theme = 'light',
  onParticipantClick,
  onAnimationComplete,
  animationTrigger
}: LadderCanvasProps) {
  const canvasRef = useLadderCanvas({
    ladder,
    participants,
    results,
    theme
  });

  const { animate, isAnimating } = usePathAnimation({
    canvasRef,
    ladder,
    participants,
    results,
    theme,
    onComplete: onAnimationComplete
  });

  // Trigger animation when animationTrigger changes
  useEffect(() => {
    if (animationTrigger && !isAnimating) {
      animate(animationTrigger.index);
    }
  }, [animationTrigger, animate, isAnimating]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!ladder || !onParticipantClick || isAnimating) return;

    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const padding = 40;
    const usableWidth = rect.width - padding * 2;
    const columnGap = usableWidth / (ladder.columnCount - 1);

    // 상단 참가자 영역 클릭 감지 (y < padding + 40)
    if (y < padding + 40) {
      for (let i = 0; i < ladder.columnCount; i++) {
        const colX = padding + i * columnGap;
        if (Math.abs(x - colX) < columnGap / 3) {
          onParticipantClick(i);
          break;
        }
      }
    }
  };

  if (!ladder) {
    return (
      <div className="flex items-center justify-center h-[500px] bg-gray-50 rounded-lg">
        <p className="text-gray-600">
          참가자와 결과를 입력한 후 '사다리 생성' 버튼을 눌러주세요
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="w-full h-[500px] rounded-lg border border-gray-200 cursor-pointer touch-none bg-white"
        onClick={handleCanvasClick}
      />
      <div className="mt-2 text-sm text-gray-600 text-center">
        참가자 이름을 클릭하면 경로를 확인할 수 있습니다
      </div>
    </div>
  );
}
