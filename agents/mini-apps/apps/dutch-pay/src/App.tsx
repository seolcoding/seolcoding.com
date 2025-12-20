import { useEffect } from 'react';
import { Button } from '@mini-apps/ui';
import { useSettlementStore } from './store/settlement-store';
import { BasicInfoForm } from './components/BasicInfoForm';
import { ParticipantList } from './components/ParticipantList';
import { ExpenseList } from './components/ExpenseList';
import { SettlementResult } from './components/SettlementResult';
import { Calculator, RotateCcw } from 'lucide-react';

function App() {
  const { settlement, createSettlement, reset } = useSettlementStore();

  useEffect(() => {
    // 초기 정산 생성
    if (!settlement) {
      createSettlement('새 정산', new Date(), [
        { id: '1', name: '참여자 1', isTreasurer: true },
        { id: '2', name: '참여자 2', isTreasurer: false },
      ]);
    }
  }, [settlement, createSettlement]);

  const handleReset = () => {
    if (confirm('정산을 초기화하시겠습니까?')) {
      reset();
      createSettlement('새 정산', new Date(), [
        { id: '1', name: '참여자 1', isTreasurer: true },
        { id: '2', name: '참여자 2', isTreasurer: false },
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Calculator className="w-10 h-10 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">더치페이 정산</h1>
          </div>
          <p className="text-gray-600">
            모임 후 정산을 간편하게 처리하세요. 최소 송금 횟수로 최적화합니다.
          </p>
          <div className="mt-4">
            <Button onClick={handleReset} variant="outline" size="sm">
              <RotateCcw className="w-4 h-4 mr-2" />
              초기화
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* 기본 정보 */}
          <BasicInfoForm />

          {/* 참여자 */}
          <ParticipantList />

          {/* 지출 항목 */}
          <ExpenseList />

          {/* 정산 결과 */}
          {settlement && settlement.expenses.length > 0 && (
            <SettlementResult />
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>
            더치페이 정산 계산기 by{' '}
            <a
              href="https://seolcoding.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              SeolCoding
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
