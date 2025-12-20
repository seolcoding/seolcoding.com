import { useState } from 'react';
import { Button, Input, Label } from '@mini-apps/ui';
import { useSettlementStore } from '@/store/settlement-store';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';

export function BasicInfoForm() {
  const { settlement, updateSettlement } = useSettlementStore();
  const [name, setName] = useState(settlement?.name || '');
  const [date, setDate] = useState(
    settlement?.date ? format(settlement.date, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
  );

  const handleSave = () => {
    if (!settlement) return;
    updateSettlement({
      name,
      date: new Date(date),
    });
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg border">
      <h2 className="text-lg font-semibold">정산 기본 정보</h2>

      <div className="space-y-2">
        <Label htmlFor="settlement-name">모임 이름</Label>
        <Input
          id="settlement-name"
          type="text"
          placeholder="예: 2025 연말 회식"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleSave}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="settlement-date">정산 날짜</Label>
        <div className="relative">
          <Input
            id="settlement-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            onBlur={handleSave}
          />
          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
