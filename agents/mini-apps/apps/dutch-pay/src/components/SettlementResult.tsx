import { useEffect, useRef } from 'react';
import { Button, Card } from '@mini-apps/ui';
import { useSettlementStore } from '@/store/settlement-store';
import { formatCurrency } from '@/lib/settlement-algorithm';
import {
  ArrowRight,
  Users,
  Receipt,
  Copy,
  Download,
  Share2,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { format } from 'date-fns';

export function SettlementResult() {
  const { settlement, result, calculateResult } = useSettlementStore();
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (settlement && settlement.expenses.length > 0) {
      calculateResult();
    }
  }, [settlement, calculateResult]);

  if (!settlement || !result || result.transactions.length === 0) {
    return null;
  }

  const handleCopyText = async () => {
    const text = generateShareText();
    try {
      await navigator.clipboard.writeText(text);
      alert('정산 내역이 클립보드에 복사되었습니다!');
    } catch (err) {
      console.error('복사 실패:', err);
      alert('복사에 실패했습니다.');
    }
  };

  const handleDownloadImage = async () => {
    if (!resultRef.current) return;

    try {
      const canvas = await html2canvas(resultRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
      });

      const link = document.createElement('a');
      link.download = `${settlement.name}_정산내역_${format(new Date(), 'yyyyMMdd')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('이미지 생성 실패:', err);
      alert('이미지 생성에 실패했습니다.');
    }
  };

  const handleShare = async () => {
    const text = generateShareText();

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${settlement.name} 정산 내역`,
          text,
        });
      } catch (err) {
        console.error('공유 실패:', err);
      }
    } else {
      handleCopyText();
    }
  };

  const generateShareText = () => {
    let text = `📊 [${settlement.name}] 정산 내역\n\n`;
    text += `총 금액: ${formatCurrency(result.totalAmount)}원\n`;
    text += `참여: ${result.participantCount}명 (${settlement.participants.map((p) => p.name).join(', ')})\n\n`;
    text += `💰 송금 안내:\n`;

    result.transactions.forEach((t) => {
      text += `• ${t.fromName} → ${t.toName} ${formatCurrency(t.amount)}원\n`;
    });

    text += `\n📝 상세 내역:\n`;
    settlement.expenses.forEach((e) => {
      const participants = e.participantIds
        .map((id) => settlement.participants.find((p) => p.id === id)?.name)
        .filter(Boolean);
      text += `• ${e.name}: ${formatCurrency(e.amount)}원 (${participants.length}명)\n`;
    });

    text += `\n---\n`;
    text += `정산 일시: ${format(settlement.date, 'yyyy-MM-dd')}\n`;
    const treasurer = settlement.participants.find((p) => p.isTreasurer);
    if (treasurer) {
      text += `총무: ${treasurer.name}\n`;
    }

    return text;
  };

  return (
    <div className="space-y-4">
      <div ref={resultRef} className="space-y-4 p-6 bg-white rounded-lg border">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">📊 정산 결과</h2>
          <p className="text-gray-600">{settlement.name}</p>
          <p className="text-sm text-gray-500">{format(settlement.date, 'yyyy년 MM월 dd일')}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">총 금액</div>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(result.totalAmount)}원
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">참여 인원</div>
            <div className="text-2xl font-bold text-green-600">
              {result.participantCount}명
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <ArrowRight className="w-5 h-5" />
            송금 안내
          </h3>
          {result.transactions.map((transaction, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg"
            >
              <div className="flex-1 flex items-center gap-2">
                <span className="font-medium">{transaction.fromName}</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{transaction.toName}</span>
              </div>
              <span className="font-bold text-blue-600">
                {formatCurrency(transaction.amount)}원
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Users className="w-5 h-5" />
            개인별 내역
          </h3>
          <div className="grid gap-2">
            {result.personalBalances.map((balance) => (
              <div
                key={balance.participantId}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <span className="font-medium">{balance.participantName}</span>
                <div className="text-right">
                  <div className="text-sm text-gray-600">
                    지불: {formatCurrency(balance.totalPaid)}원 | 부담:{' '}
                    {formatCurrency(balance.totalOwed)}원
                  </div>
                  <div
                    className={`font-bold ${
                      balance.balance > 0
                        ? 'text-green-600'
                        : balance.balance < 0
                        ? 'text-red-600'
                        : 'text-gray-600'
                    }`}
                  >
                    {balance.balance > 0 && '+'}
                    {formatCurrency(balance.balance)}원
                    {balance.balance > 0 && ' (받음)'}
                    {balance.balance < 0 && ' (보냄)'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            지출 내역
          </h3>
          <div className="space-y-2">
            {settlement.expenses.map((expense) => {
              const payer = settlement.participants.find(
                (p) => p.id === expense.paidBy
              );
              const participants = expense.participantIds
                .map((id) => settlement.participants.find((p) => p.id === id)?.name)
                .filter(Boolean);

              return (
                <div key={expense.id} className="p-2 bg-gray-50 rounded text-sm">
                  <div className="flex justify-between">
                    <span>{expense.name}</span>
                    <span className="font-semibold">
                      {formatCurrency(expense.amount)}원
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    결제: {payer?.name} | 참여: {participants.join(', ')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleCopyText} variant="outline" className="flex-1">
          <Copy className="w-4 h-4 mr-2" />
          텍스트 복사
        </Button>
        <Button onClick={handleDownloadImage} variant="outline" className="flex-1">
          <Download className="w-4 h-4 mr-2" />
          이미지 저장
        </Button>
        <Button onClick={handleShare} className="flex-1">
          <Share2 className="w-4 h-4 mr-2" />
          공유하기
        </Button>
      </div>
    </div>
  );
}
