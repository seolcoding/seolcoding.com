import { Button } from '@mini-apps/ui';
import { Card } from '@mini-apps/ui';
import { useGameStore } from '../store/gameStore';
import { categoryLabels } from '../data';
import { Trophy, Target, Clock, Award, RotateCcw, Settings, Share2 } from 'lucide-react';

export function GameResult() {
  const {
    score,
    correctCount,
    questions,
    answers,
    gameConfig,
    resetGame,
    goToSettings
  } = useGameStore();

  const totalQuestions = questions.length;
  const accuracy = Math.round((correctCount / totalQuestions) * 100);
  const avgTime = Math.round(
    answers.reduce((sum, a) => sum + a.timeSpent, 0) / totalQuestions
  );

  const handleShare = async () => {
    const text = `초성 퀴즈 결과\n카테고리: ${categoryLabels[gameConfig?.category || 'movie']}\n최종 점수: ${score}점\n정답: ${correctCount}/${totalQuestions}\n정답률: ${accuracy}%`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: '초성 퀴즈 결과',
          text: text,
          url: window.location.href
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(text);
      alert('결과가 클립보드에 복사되었습니다!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 bg-white shadow-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-400 rounded-full mb-4">
            <Trophy className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-purple-600 mb-2">게임 종료!</h1>
          <p className="text-gray-600">수고하셨습니다</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200">
            <div className="flex items-center gap-2 text-purple-600 mb-2">
              <Award className="w-5 h-5" />
              <span className="text-sm font-semibold">최종 점수</span>
            </div>
            <div className="text-3xl font-bold text-purple-700">{score}점</div>
          </div>

          <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
            <div className="flex items-center gap-2 text-green-600 mb-2">
              <Target className="w-5 h-5" />
              <span className="text-sm font-semibold">정답 개수</span>
            </div>
            <div className="text-3xl font-bold text-green-700">
              {correctCount}/{totalQuestions}
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <Target className="w-5 h-5" />
              <span className="text-sm font-semibold">정답률</span>
            </div>
            <div className="text-3xl font-bold text-blue-700">{accuracy}%</div>
          </div>

          <div className="bg-orange-50 p-6 rounded-lg border-2 border-orange-200">
            <div className="flex items-center gap-2 text-orange-600 mb-2">
              <Clock className="w-5 h-5" />
              <span className="text-sm font-semibold">평균 시간</span>
            </div>
            <div className="text-3xl font-bold text-orange-700">{avgTime}초</div>
          </div>
        </div>

        {/* Answer Review */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4">정답 확인</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {answers.map((answer, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border-2 ${
                  answer.isCorrect
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-gray-700">
                      {index + 1}. {answer.question.chosung}
                    </span>
                    <span className="mx-2 text-gray-400">→</span>
                    <span className={answer.isCorrect ? 'text-green-700' : 'text-red-700'}>
                      {answer.question.word}
                    </span>
                  </div>
                  <div className="text-sm">
                    {answer.isCorrect ? (
                      <span className="text-green-600 font-semibold">
                        +{answer.scoreEarned}점
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">✗</span>
                    )}
                  </div>
                </div>
                {!answer.isCorrect && answer.userAnswer && (
                  <div className="text-sm text-gray-600 mt-1">
                    입력: {answer.userAnswer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <Button
            onClick={resetGame}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            다시 하기
          </Button>

          <Button onClick={goToSettings} variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            설정
          </Button>

          <Button onClick={handleShare} variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            공유
          </Button>
        </div>
      </Card>
    </div>
  );
}
