import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QuestionCard from '../components/QuestionCard';
import type { Question } from '../types';
import { questionTemplates } from '../data/templates';
import { getQuestionById, saveVote, incrementVote } from '../utils/storage';
import { ArrowLeft } from 'lucide-react';

const GamePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [question, setQuestion] = useState<Question | null>(null);

  useEffect(() => {
    if (!id) return;

    // Find template question
    let found: Question | null = null;
    for (const category in questionTemplates) {
      const questions = questionTemplates[category as keyof typeof questionTemplates];
      found = questions.find((q) => q.id === id) || null;
      if (found) break;
    }

    // Find custom question
    if (!found) {
      found = getQuestionById(id);
    }

    setQuestion(found);
  }, [id]);

  const handleSelect = (choice: 'A' | 'B') => {
    if (!question) return;

    saveVote(question.id, choice);
    incrementVote(question.id, choice);
    navigate(`/result/${question.id}`);
  };

  if (!question) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-600">질문을 찾을 수 없습니다.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

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
        </div>

        {/* Question card */}
        <QuestionCard question={question} onSelect={handleSelect} />
      </div>
    </div>
  );
};

export default GamePage;
