import { useState } from 'react';
import { Button, Input, Label } from '@mini-apps/ui';
import { useSettlementStore } from '@/store/settlement-store';
import { UserPlus, X, Crown } from 'lucide-react';

export function ParticipantList() {
  const { settlement, addParticipant, removeParticipant, setTreasurer } =
    useSettlementStore();
  const [newName, setNewName] = useState('');

  const handleAdd = () => {
    if (!newName.trim()) return;
    addParticipant(newName.trim());
    setNewName('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  if (!settlement) return null;

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg border">
      <h2 className="text-lg font-semibold">
        참여자 ({settlement.participants.length}명)
      </h2>

      <div className="space-y-2">
        {settlement.participants.map((participant) => (
          <div
            key={participant.id}
            className="flex items-center gap-2 p-2 bg-gray-50 rounded-md"
          >
            <button
              onClick={() => setTreasurer(participant.id)}
              className={`p-1 rounded ${
                participant.isTreasurer
                  ? 'text-yellow-500'
                  : 'text-gray-300 hover:text-yellow-400'
              }`}
              title={participant.isTreasurer ? '총무' : '총무로 설정'}
            >
              <Crown className="w-4 h-4" />
            </button>

            <span className="flex-1">
              {participant.name}
              {participant.isTreasurer && (
                <span className="ml-2 text-xs text-yellow-600">(총무)</span>
              )}
            </span>

            {settlement.participants.length > 2 && (
              <button
                onClick={() => removeParticipant(participant.id)}
                className="p-1 text-gray-400 hover:text-red-500 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="참여자 이름 입력"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <Button onClick={handleAdd} disabled={!newName.trim()}>
          <UserPlus className="w-4 h-4 mr-1" />
          추가
        </Button>
      </div>

      {settlement.participants.length < 2 && (
        <p className="text-sm text-red-500">최소 2명 이상 필요합니다</p>
      )}
    </div>
  );
}
