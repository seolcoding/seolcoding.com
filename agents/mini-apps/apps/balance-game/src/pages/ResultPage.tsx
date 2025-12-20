import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ResultChart from '../components/ResultChart';
import ShareButton from '../components/ShareButton';
import type { Question } from '../types';
import { questionTemplates } from '../data/templates';
import { getQuestionById, getQuestionStats, getVotes } from '../utils/storage';
import { ArrowLeft, RefreshCw } from 'lucide-react';

const ResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [question, setQuestion] = useState<Question | null>(null);
  const [stats, setStats] = useState<{ A: number; B: number } | null>(null);
  const [myChoice, setMyChoice] = useState<'A' | 'B' | undefined>(undefined);

  useEffect(() => {
    if (!id) return;

    // Find question
    let found: Question | null = null;
    for (const category in questionTemplates) {
      const questions = questionTemplates[category as keyof typeof questionTemplates];
      found = questions.find((q) => q.id === id) || null;
      if (found) break;
    }

    if (!found) {
      found = getQuestionById(id);
    }

    setQuestion(found);

    // Get statistics
    if (found) {
      const voteStats = getQuestionStats(found.id);
      setStats(voteStats);

      const votes = getVotes();
      setMyChoice(votes[found.id]);
    }
  }, [id]);

  const handlePlayAgain = () => {
    navigate('/');
  };

  if (!question || !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-2xl font-bold text-gray-600">결과를 불러오는 중...</p>
      </div>
    );
  }

  const totalVotes = stats.A + stats.B;
  const percentageA = (stats.A / totalVotes) * 100;
  const percentageB = (stats.B / totalVotes) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
            돌아가기
          </button>
          <button
            onClick={handlePlayAgain}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
          >
            <RefreshCw size={20} />
            다른 질문 하기
          </button>
        </div>

        {/* Result chart */}
        <ResultChart question={question} stats={stats} myChoice={myChoice} />

        {/* Share buttons */}
        {myChoice && (
          <ShareButton
            imageOptions={{
              question,
              myChoice,
              stats,
              percentageA,
              percentageB,
            }}
            questionId={question.id}
          />
        )}
      </div>
    </div>
  );
};

export default ResultPage;
