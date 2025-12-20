import { useState } from 'react';
import { useProfileStore } from '@/store/profileStore';
import { useIcebreakerStore } from '@/store/icebreakerStore';
import { ICEBREAKER_QUESTIONS } from '@/constants/icebreakers';
import { Button, Card } from '@mini-apps/ui';
import { Dices, Send, RefreshCw } from 'lucide-react';
import type { IcebreakerAnswer } from '@/types';

interface IcebreakerViewProps {
  roomId: string;
}

export const IcebreakerView: React.FC<IcebreakerViewProps> = ({ roomId }) => {
  const { profile, getProfileById } = useProfileStore();
  const { addAnswer, getAnswersByRoom } = useIcebreakerStore();

  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [myAnswer, setMyAnswer] = useState('');

  const roomAnswers = getAnswersByRoom(roomId);

  const generateRandomQuestion = () => {
    const randomIndex = Math.floor(Math.random() * ICEBREAKER_QUESTIONS.length);
    setCurrentQuestion(ICEBREAKER_QUESTIONS[randomIndex]);
    setMyAnswer('');
  };

  const handleSubmitAnswer = () => {
    if (!currentQuestion || !myAnswer.trim() || !profile) return;

    const answer: IcebreakerAnswer = {
      id: Date.now().toString(),
      questionId: currentQuestion,
      question: currentQuestion,
      answer: myAnswer,
      profileId: profile.id,
      roomId,
      createdAt: new Date().toISOString()
    };

    addAnswer(answer);
    setMyAnswer('');
    setCurrentQuestion('');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-6">
      {/* 랜덤 질문 생성기 */}
      <Card className="p-8 bg-purple-50">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">🎲 아이스브레이킹 질문</h2>

        {!currentQuestion ? (
          <Button
            onClick={generateRandomQuestion}
            className="w-full py-4 bg-purple-600 hover:bg-purple-700
                       text-white text-lg font-bold hover:shadow-xl
                       transform hover:scale-105 transition-all"
          >
            <Dices className="w-6 h-6 mr-2" />
            랜덤 질문 뽑기
          </Button>
        ) : (
          <div className="space-y-4">
            <Card className="p-6 bg-white">
              <p className="text-xl font-medium text-gray-800">
                {currentQuestion}
              </p>
            </Card>

            <textarea
              value={myAnswer}
              onChange={(e) => setMyAnswer(e.target.value)}
              placeholder="답변을 입력해주세요..."
              rows={4}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500
                         resize-none"
            />

            <div className="flex gap-3">
              <Button
                onClick={handleSubmitAnswer}
                disabled={!myAnswer.trim()}
                className="flex-1 bg-purple-500 hover:bg-purple-600"
              >
                <Send className="w-4 h-4 mr-2" />
                답변 공유하기
              </Button>
              <Button
                onClick={generateRandomQuestion}
                variant="outline"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                다른 질문
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* 다른 사람들의 답변 */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">💬 모두의 답변</h2>

        {roomAnswers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            아직 답변이 없습니다. 첫 답변을 남겨보세요!
          </div>
        ) : (
          <div className="space-y-6">
            {roomAnswers.map(answer => {
              const answerProfile = getProfileById(answer.profileId);
              if (!answerProfile) return null;

              return (
                <div
                  key={answer.id}
                  className="p-5 border-2 border-gray-100 rounded-xl"
                >
                  {/* 프로필 정보 */}
                  <div className="flex items-center gap-3 mb-3">
                    {answerProfile.avatarUrl ? (
                      <img
                        src={answerProfile.avatarUrl}
                        alt={answerProfile.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-purple-100
                                      flex items-center justify-center text-xl text-purple-600">
                        {answerProfile.name[0]}
                      </div>
                    )}
                    <div>
                      <p className="font-bold">{answerProfile.name}</p>
                      <p className="text-sm text-gray-500">{answerProfile.field}</p>
                    </div>
                  </div>

                  {/* 질문 */}
                  <p className="text-sm font-medium text-purple-700 mb-2">
                    Q. {answer.question}
                  </p>

                  {/* 답변 */}
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                    {answer.answer}
                  </p>

                  {/* 시간 */}
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(answer.createdAt).toLocaleString('ko-KR')}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};
