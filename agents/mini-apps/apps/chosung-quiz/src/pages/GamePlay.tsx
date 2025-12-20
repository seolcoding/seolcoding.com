import { useState, useEffect, useRef } from 'react';
import { Button } from '@mini-apps/ui';
import { Input } from '@mini-apps/ui';
import { Card } from '@mini-apps/ui';
import { Progress } from '@mini-apps/ui';
import { useGameStore } from '../store/gameStore';
import { Timer } from '../components/Timer';
import { ChosungDisplay } from '../components/ChosungDisplay';
import { HintSection } from '../components/HintSection';
import { categoryLabels } from '../data';
import { ArrowRight, SkipForward, Trophy } from 'lucide-react';

export function GamePlay() {
  const {
    questions,
    currentQuestionIndex,
    score,
    correctCount,
    usedHints,
    gameConfig,
    submitAnswer,
    useHint,
    skipQuestion
  } = useGameStore();

  const [userAnswer, setUserAnswer] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(gameConfig?.timeLimit || 30);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  useEffect(() => {
    // Reset timer when question changes
    setTimeRemaining(gameConfig?.timeLimit || 30);
    setUserAnswer('');
    setShowFeedback(false);
    // Focus input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, [currentQuestionIndex, gameConfig?.timeLimit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim() || showFeedback) return;

    const correct = userAnswer.trim() === currentQuestion.word;
    setIsCorrect(correct);
    setShowFeedback(true);

    setTimeout(() => {
      submitAnswer(userAnswer, timeRemaining);
    }, 1500);
  };

  const handleTimeUp = () => {
    if (!showFeedback) {
      setIsCorrect(false);
      setShowFeedback(true);
      setTimeout(() => {
        skipQuestion();
      }, 1500);
    }
  };

  const handleSkip = () => {
    if (!showFeedback) {
      skipQuestion();
    }
  };

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl p-6 md:p-8 bg-white shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Timer
              duration={gameConfig?.timeLimit || 30}
              onTimeUp={handleTimeUp}
              onTick={setTimeRemaining}
            />
            <div>
              <div className="text-sm text-gray-600">
                {categoryLabels[gameConfig?.category || 'movie']}
              </div>
              <div className="text-2xl font-bold text-purple-600 flex items-center gap-2">
                <Trophy className="w-6 h-6" />
                {score}점
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">문제</div>
            <div className="text-2xl font-bold text-purple-600">
              {currentQuestionIndex + 1} / {questions.length}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <Progress value={progress} className="mb-6" />

        {/* Chosung Display */}
        <ChosungDisplay chosung={currentQuestion.chosung} />

        {/* Feedback */}
        {showFeedback && (
          <div
            className={`text-center py-4 px-6 rounded-lg mb-4 ${
              isCorrect
                ? 'bg-green-100 border-2 border-green-500 text-green-800'
                : 'bg-red-100 border-2 border-red-500 text-red-800'
            }`}
          >
            <div className="text-xl font-bold mb-1">
              {isCorrect ? '정답입니다! 🎉' : '아쉽네요! 😢'}
            </div>
            <div className="text-lg">
              정답: <span className="font-bold">{currentQuestion.word}</span>
            </div>
          </div>
        )}

        {/* Answer Input */}
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="정답을 입력하세요"
              disabled={showFeedback}
              className="flex-1 text-lg py-6"
              autoComplete="off"
            />
            <Button
              type="submit"
              disabled={!userAnswer.trim() || showFeedback}
              className="px-6 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </form>

        {/* Hints */}
        <HintSection
          hints={currentQuestion.hints}
          onUseHint={useHint}
          usedHints={usedHints}
        />

        {/* Skip Button */}
        <Button
          onClick={handleSkip}
          variant="outline"
          disabled={showFeedback}
          className="w-full mt-4"
        >
          <SkipForward className="w-4 h-4 mr-2" />
          패스하기
        </Button>

        {/* Score Info */}
        <div className="mt-6 text-center text-sm text-gray-600">
          정답: {correctCount} / {currentQuestionIndex + 1}
        </div>
      </Card>
    </div>
  );
}
