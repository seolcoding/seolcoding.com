import { clsx } from 'clsx';
import type { BingoState } from '@/types/bingo.types';
import { BingoCell } from './BingoCell';

interface BingoGridProps {
  state: BingoState;
  onCellClick: (row: number, col: number) => void;
  disabled?: boolean;
}

export function BingoGrid({ state, onCellClick, disabled = false }: BingoGridProps) {
  const { cells, completedLines } = state;
  const gridSize = state.gridSize;

  // 빙고 라인에 포함되는 셀 찾기
  const bingoLineSet = new Set<string>();
  completedLines.forEach(line => {
    line.cells.forEach(([row, col]) => {
      bingoLineSet.add(`${row}-${col}`);
    });
  });

  const isPartOfBingo = (row: number, col: number): boolean => {
    return bingoLineSet.has(`${row}-${col}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div
        className={clsx(
          'grid gap-1 sm:gap-2',
          {
            'grid-cols-3': gridSize === 3,
            'grid-cols-4': gridSize === 4,
            'grid-cols-5': gridSize === 5,
          }
        )}
      >
        {cells.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <BingoCell
              key={`${rowIndex}-${colIndex}`}
              cell={cell}
              isPartOfBingo={isPartOfBingo(rowIndex, colIndex)}
              onClick={() => onCellClick(rowIndex, colIndex)}
              disabled={disabled}
            />
          ))
        )}
      </div>
    </div>
  );
}
