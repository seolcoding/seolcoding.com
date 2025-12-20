import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import Confetti from 'react-confetti';
import { Check } from 'lucide-react';
import type { Poll, Vote } from '@/types/poll';
import { loadPoll, saveVote } from '@/utils/storage';
import { hasVoted, markAsVoted } from '@/utils/voteValidator';
import { useBroadcastChannel } from '@/hooks/useBroadcastChannel';

export function VoteView() {
  const { pollId } = useParams<{ pollId: string }>();
  const navigate = useNavigate();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [selection, setSelection] = useState<number | number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [rankingOrder, setRankingOrder] = useState<number[]>([]);
  const { broadcast } = useBroadcastChannel(`poll:${pollId}`, () => {});

  useEffect(() => {
    if (!pollId) {
      navigate('/');
      return;
    }

    // 투표 데이터 로드
    const pollData = loadPoll(pollId);
    if (!pollData) {
      alert('투표를 찾을 수 없습니다.');
      navigate('/');
      return;
    }

    setPoll(pollData);

    // 순위 투표 초기화
    if (pollData.type === 'ranking') {
      setRankingOrder(pollData.options.map((_, i) => i));
    }

    // 이미 투표했는지 확인
    if (hasVoted(pollId)) {
      setSubmitted(true);
    }
  }, [pollId, navigate]);

  const handleSingleSelect = (index: number) => {
    setSelection(index);
  };

  const handleMultipleSelect = (index: number) => {
    const sel = selection as number[];
    if (sel.includes(index)) {
      setSelection(sel.filter(i => i !== index));
    } else {
      setSelection([...sel, index]);
    }
  };

  const moveRankingItem = (fromIndex: number, direction: 'up' | 'down') => {
    const newOrder = [...rankingOrder];
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;

    if (toIndex < 0 || toIndex >= newOrder.length) return;

    [newOrder[fromIndex], newOrder[toIndex]] = [newOrder[toIndex], newOrder[fromIndex]];
    setRankingOrder(newOrder);
  };

  const handleSubmit = () => {
    if (!poll || !pollId || hasVoted(pollId)) return;

    let finalSelection: number | number[];

    if (poll.type === 'single') {
      if (selection === undefined || selection === null) {
        alert('선택지를 선택해주세요.');
        return;
      }
      finalSelection = selection as number;
    } else if (poll.type === 'multiple') {
      const sel = selection as number[];
      if (sel.length === 0) {
        alert('최소 1개 이상 선택해주세요.');
        return;
      }
      finalSelection = sel;
    } else {
      // ranking
      finalSelection = rankingOrder;
    }

    const vote: Vote = {
      id: nanoid(),
      pollId: poll.id,
      selection: finalSelection,
      timestamp: new Date(),
    };

    // 투표 저장
    saveVote(vote);

    // 중복 투표 방지 마킹
    markAsVoted(pollId);

    // BroadcastChannel로 호스트에게 알림
    broadcast({ type: 'NEW_VOTE', vote });

    setSubmitted(true);
  };

  if (!poll) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Confetti recycle={false} numberOfPieces={200} />
        <div className="text-center bg-white rounded-2xl p-12 shadow-2xl max-w-md border border-gray-200">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={48} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-gray-900">투표 완료!</h2>
          <p className="text-gray-600 text-lg mb-6">참여해 주셔서 감사합니다.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2">{poll.title}</h1>
        <p className="text-gray-600 mb-6">
          {poll.type === 'single' && '하나를 선택해주세요'}
          {poll.type === 'multiple' && '여러 개를 선택할 수 있습니다'}
          {poll.type === 'ranking' && '순위대로 정렬해주세요 (위로 갈수록 높은 순위)'}
        </p>

        {/* 단일/복수 선택 */}
        {poll.type !== 'ranking' && (
          <div className="space-y-3 mb-6">
            {poll.options.map((option, index) => {
              const isSelected = poll.type === 'single'
                ? selection === index
                : (selection as number[]).includes(index);

              return (
                <button
                  key={index}
                  onClick={() => poll.type === 'single' ? handleSingleSelect(index) : handleMultipleSelect(index)}
                  className={`w-full p-4 border-2 rounded-xl text-left transition text-lg font-medium ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-300 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-400'
                    }`}>
                      {isSelected && <Check size={16} className="text-white" />}
                    </div>
                    {option}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* 순위 투표 */}
        {poll.type === 'ranking' && (
          <div className="space-y-3 mb-6">
            {rankingOrder.map((optionIndex, position) => (
              <div key={optionIndex} className="flex items-center gap-3">
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveRankingItem(position, 'up')}
                    disabled={position === 0}
                    className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveRankingItem(position, 'down')}
                    disabled={position === rankingOrder.length - 1}
                    className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    ↓
                  </button>
                </div>
                <div className="flex-1 p-4 border-2 border-gray-300 rounded-xl bg-white shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                      {position + 1}
                    </div>
                    <span className="text-lg font-medium">{poll.options[optionIndex]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition shadow-lg"
        >
          투표하기
        </button>
      </div>
    </div>
  );
}
