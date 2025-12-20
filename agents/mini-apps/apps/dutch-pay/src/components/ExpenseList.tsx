import { useState } from 'react';
import { Button } from '@mini-apps/ui';
import { useSettlementStore } from '@/store/settlement-store';
import { formatCurrency } from '@/lib/settlement-algorithm';
import { Plus, Trash2, Receipt } from 'lucide-react';
import { ExpenseForm } from './ExpenseForm';

export function ExpenseList() {
  const { settlement, removeExpense } = useSettlementStore();
  const [isFormOpen, setIsFormOpen] = useState(false);

  if (!settlement) return null;

  const totalAmount = settlement.expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg border">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          지출 항목 ({settlement.expenses.length})
        </h2>
        <Button onClick={() => setIsFormOpen(true)} size="sm">
          <Plus className="w-4 h-4 mr-1" />
          항목 추가
        </Button>
      </div>

      {settlement.expenses.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <Receipt className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>지출 항목을 추가해주세요</p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {settlement.expenses.map((expense) => {
              const payer = settlement.participants.find((p) => p.id === expense.paidBy);
              const participantCount = expense.participantIds.length;
              const perPerson = expense.amount / participantCount;

              return (
                <div
                  key={expense.id}
                  className="p-3 bg-gray-50 rounded-md space-y-1"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium">{expense.name}</h3>
                      <p className="text-sm text-gray-600">
                        결제: {payer?.name} | 참여: {participantCount}명
                      </p>
                      <p className="text-xs text-gray-500">
                        1인당 {formatCurrency(perPerson)}원
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-lg">
                        {formatCurrency(expense.amount)}원
                      </span>
                      <button
                        onClick={() => removeExpense(expense.id)}
                        className="p-1 text-gray-400 hover:text-red-500 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t">
            <div className="flex justify-between items-center">
              <span className="font-semibold">총 금액</span>
              <span className="text-xl font-bold text-blue-600">
                {formatCurrency(totalAmount)}원
              </span>
            </div>
          </div>
        </>
      )}

      <ExpenseForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
}
