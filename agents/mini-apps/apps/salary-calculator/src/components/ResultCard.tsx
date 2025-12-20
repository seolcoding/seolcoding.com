import { useSalaryStore } from '@/hooks/useSalaryStore';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@mini-apps/ui';
import { formatNumber } from '@/utils/salaryCalculator';
import { TrendingUp, DollarSign } from 'lucide-react';

export function ResultCard() {
  const { breakdown } = useSalaryStore();

  if (!breakdown) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            실수령액
          </CardTitle>
          <CardDescription>급여 정보를 입력하고 계산하기 버튼을 눌러주세요</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const takeHomeRate = ((breakdown.netPay / breakdown.monthlyGross) * 100).toFixed(1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          월 실수령액
        </CardTitle>
        <CardDescription>4대보험 및 세금 공제 후 금액</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 실수령액 */}
        <div className="p-6 bg-primary/10 rounded-lg">
          <div className="text-sm text-muted-foreground mb-2">월 실수령액</div>
          <div className="text-4xl font-bold text-primary">
            {formatNumber(breakdown.netPay)}원
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            세전: {formatNumber(breakdown.monthlyGross)}원
          </div>
        </div>

        {/* 실수령 비율 */}
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span className="font-medium">실수령 비율</span>
          </div>
          <span className="text-xl font-bold">{takeHomeRate}%</span>
        </div>

        {/* 연간 실수령액 */}
        <div className="p-4 border rounded-lg">
          <div className="text-sm text-muted-foreground mb-1">연간 실수령액 (12개월)</div>
          <div className="text-2xl font-bold">
            {formatNumber(breakdown.netPay * 12)}원
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
