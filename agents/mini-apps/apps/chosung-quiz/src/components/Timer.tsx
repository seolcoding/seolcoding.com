import { useEffect, useState } from 'react';

interface TimerProps {
  duration: number;
  onTimeUp: () => void;
  onTick?: (remaining: number) => void;
}

export function Timer({ duration, onTimeUp, onTick }: TimerProps) {
  const [remaining, setRemaining] = useState(duration);

  useEffect(() => {
    setRemaining(duration);
  }, [duration]);

  useEffect(() => {
    if (remaining <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setRemaining((prev) => {
        const newValue = prev - 1;
        if (onTick) onTick(newValue);
        return newValue;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remaining, onTimeUp, onTick]);

  const percentage = (remaining / duration) * 100;
  const isLowTime = remaining <= 10;

  return (
    <div className="relative w-24 h-24">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="48"
          cy="48"
          r="40"
          stroke="#e5e7eb"
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx="48"
          cy="48"
          r="40"
          stroke={isLowTime ? '#ef4444' : '#8b5cf6'}
          strokeWidth="8"
          fill="none"
          strokeDasharray={`${2 * Math.PI * 40}`}
          strokeDashoffset={`${2 * Math.PI * 40 * (1 - percentage / 100)}`}
          className={`transition-all ${isLowTime ? 'animate-pulse' : ''}`}
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={`text-2xl font-bold ${
            isLowTime ? 'text-red-500' : 'text-purple-600'
          }`}
        >
          {remaining}
        </span>
      </div>
    </div>
  );
}
