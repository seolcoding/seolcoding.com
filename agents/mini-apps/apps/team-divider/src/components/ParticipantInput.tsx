import { useState } from 'react';
import { useTeamStore } from '@/store/useTeamStore';
import { Button, Input, Card } from '@mini-apps/ui';
import { UserPlus, Users, Upload, X } from 'lucide-react';
import Papa from 'papaparse';

export function ParticipantInput() {
  const [name, setName] = useState('');
  const [bulkText, setBulkText] = useState('');
  const [inputMode, setInputMode] = useState<'single' | 'bulk' | 'csv'>('single');

  const { participants, addParticipant, addBulkParticipants, removeParticipant, clearParticipants } = useTeamStore();

  const handleAddSingle = () => {
    if (name.trim()) {
      addParticipant(name);
      setName('');
    }
  };

  const handleAddBulk = () => {
    const names = bulkText.split('\n').filter(n => n.trim());
    if (names.length > 0) {
      addBulkParticipants(names);
      setBulkText('');
    }
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (results) => {
        const names = results.data
          .flat()
          .filter(n => n && typeof n === 'string')
          .map(n => String(n).trim());

        if (names.length > 0) {
          addBulkParticipants(names);
        }
      },
      skipEmptyLines: true,
    });

    // Reset input
    e.target.value = '';
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">참가자 입력</h2>

      {/* Input Mode Tabs */}
      <div className="flex gap-2 mb-4">
        <Button
          variant={inputMode === 'single' ? 'default' : 'outline'}
          onClick={() => setInputMode('single')}
          size="sm"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          직접 입력
        </Button>
        <Button
          variant={inputMode === 'bulk' ? 'default' : 'outline'}
          onClick={() => setInputMode('bulk')}
          size="sm"
        >
          <Users className="w-4 h-4 mr-2" />
          일괄 입력
        </Button>
        <Button
          variant={inputMode === 'csv' ? 'default' : 'outline'}
          onClick={() => setInputMode('csv')}
          size="sm"
        >
          <Upload className="w-4 h-4 mr-2" />
          CSV 업로드
        </Button>
      </div>

      {/* Single Input */}
      {inputMode === 'single' && (
        <div className="flex gap-2">
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddSingle()}
            placeholder="이름을 입력하세요"
            className="flex-1"
          />
          <Button onClick={handleAddSingle}>추가</Button>
        </div>
      )}

      {/* Bulk Text Input */}
      {inputMode === 'bulk' && (
        <div className="space-y-2">
          <textarea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            placeholder="이름을 한 줄에 하나씩 입력하세요&#10;홍길동&#10;김철수&#10;이영희"
            className="w-full h-32 px-3 py-2 border rounded-md resize-none"
          />
          <Button onClick={handleAddBulk} className="w-full">
            일괄 추가
          </Button>
        </div>
      )}

      {/* CSV Upload */}
      {inputMode === 'csv' && (
        <div className="space-y-2">
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <label className="cursor-pointer">
              <span className="text-gray-900 hover:underline font-medium">CSV 파일 선택</span>
              <input
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
                className="hidden"
              />
            </label>
            <p className="text-sm text-gray-600 mt-2">
              CSV 파일에서 이름을 자동으로 추출합니다
            </p>
          </div>
        </div>
      )}

      {/* Participant List */}
      {participants.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">
              참가자 목록 ({participants.length}명)
            </h3>
            <Button variant="outline" size="sm" onClick={clearParticipants}>
              전체 삭제
            </Button>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-2">
            {participants.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded"
              >
                <span>{p.name}</span>
                <button
                  onClick={() => removeParticipant(p.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
