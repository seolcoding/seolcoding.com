import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import type { Question } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  onSelect: (choice: 'A' | 'B') => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onSelect }) => {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handlers = useSwipeable({
    onSwiping: (eventData) => {
      setSwipeOffset(eventData.deltaX);
    },
    onSwipedLeft: () => {
      setIsAnimating(true);
      setSwipeOffset(-500);
      setTimeout(() => {
        onSelect('B');
        setSwipeOffset(0);
        setIsAnimating(false);
      }, 300);
    },
    onSwipedRight: () => {
      setIsAnimating(true);
      setSwipeOffset(500);
      setTimeout(() => {
        onSelect('A');
        setSwipeOffset(0);
        setIsAnimating(false);
      }, 300);
    },
    trackMouse: true,
    preventScrollOnSwipe: true,
  });

  const cardStyle: React.CSSProperties = {
    transform: `translateX(${swipeOffset}px) rotate(${swipeOffset / 20}deg)`,
    transition: isAnimating ? 'transform 0.3s ease-out' : 'none',
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Swipe hints */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-16 text-blue-500 opacity-50">
        <ChevronLeft size={48} />
        <span className="text-sm font-bold">A</span>
      </div>
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-16 text-pink-500 opacity-50">
        <ChevronRight size={48} />
        <span className="text-sm font-bold">B</span>
      </div>

      {/* Question card */}
      <div
        {...handlers}
        style={cardStyle}
        className="bg-white rounded-2xl shadow-2xl p-8 cursor-grab active:cursor-grabbing"
      >
        {/* Question title */}
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          {question.title}
        </h2>

        {/* Options container */}
        <div className="grid grid-cols-2 gap-4">
          {/* Option A */}
          <button
            onClick={() => onSelect('A')}
            className="group relative overflow-hidden rounded-xl border-4 border-blue-500 hover:border-blue-600 transition-all hover:scale-105 active:scale-95"
          >
            {question.imageA && (
              <img
                src={question.imageA}
                alt={question.optionA}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="bg-blue-600 hover:bg-blue-700 p-6">
              <p className="text-white text-xl font-bold text-center">
                {question.optionA}
              </p>
            </div>
            <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity" />
          </button>

          {/* Option B */}
          <button
            onClick={() => onSelect('B')}
            className="group relative overflow-hidden rounded-xl border-4 border-pink-500 hover:border-pink-600 transition-all hover:scale-105 active:scale-95"
          >
            {question.imageB && (
              <img
                src={question.imageB}
                alt={question.optionB}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="bg-pink-600 hover:bg-pink-700 p-6">
              <p className="text-white text-xl font-bold text-center">
                {question.optionB}
              </p>
            </div>
            <div className="absolute inset-0 bg-pink-500 opacity-0 group-hover:opacity-10 transition-opacity" />
          </button>
        </div>

        {/* Mobile swipe guide */}
        <p className="text-center text-gray-500 text-sm mt-6 md:hidden">
          왼쪽 스와이프: B 선택 | 오른쪽 스와이프: A 선택
        </p>
      </div>
    </div>
  );
};

export default QuestionCard;
