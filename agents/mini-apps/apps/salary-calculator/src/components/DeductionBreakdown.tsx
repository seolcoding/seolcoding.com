import { useSalaryStore } from '@/hooks/useSalaryStore';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@mini-apps/ui';
import { formatNumber } from '@/utils/salaryCalculator';
import { FileText, Info } from 'lucide-react';

interface DeductionItemProps {
  label: string;
  amount: number;
  tooltip?: string;
  color?: string;
}

function DeductionItem({ label, amount, tooltip, color = 'text-foreground' }: DeductionItemProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        <span className={`font-medium ${color}`}>{label}</span>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <span className={`font-bold ${color}`}>{formatNumber(amount)}원</span>
    </div>
  );
}

export function DeductionBreakdown() {
  const { breakdown } = useSalaryStore();

  if (!breakdown) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          공제 내역
        </CardTitle>
        <CardDescription>4대보험 및 세금 공제 상세 내역</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 4대보험 */}
        <div>
          <h3 className="font-semibold mb-3 text-sm text-muted-foreground">4대보험</h3>
          <div className="space-y-1">
            <DeductionItem
              label="국민연금"
              amount={breakdown.nationalPension}
              tooltip="과세 대상 급여의 4.5% (근로자 부담분)"
              color="text-blue-600"
            />
            <DeductionItem
              label="건강보험"
              amount={breakdown.healthInsurance}
              tooltip="과세 대상 급여의 3.545% (근로자 부담분)"
              color="text-green-600"
            />
            <DeductionItem
              label="장기요양보험"
              amount={breakdown.longTermCare}
              tooltip="건강보험료의 12.95%"
              color="text-purple-600"
            />
            <DeductionItem
              label="고용보험"
              amount={breakdown.employmentInsurance}
              tooltip="과세 대상 급여의 0.9% (근로자 부담분)"
              color="text-amber-600"
            />
          </div>
          <Separator className="my-3" />
          <DeductionItem
            label="4대보험 합계"
            amount={breakdown.totalInsurance}
            color="text-blue-700"
          />
        </div>

        <Separator />

        {/* 세금 */}
        <div>
          <h3 className="font-semibold mb-3 text-sm text-muted-foreground">세금</h3>
          <div className="space-y-1">
            <DeductionItem
              label="소득세"
              amount={breakdown.incomeTax}
              tooltip="간이세액표 기준 (부양가족 수 반영)"
              color="text-red-600"
            />
            <DeductionItem
              label="지방소득세"
              amount={breakdown.localIncomeTax}
              tooltip="소득세의 10%"
              color="text-pink-600"
            />
          </div>
          <Separator className="my-3" />
          <DeductionItem
            label="세금 합계"
            amount={breakdown.totalTax}
            color="text-red-700"
          />
        </div>

        <Separator />

        {/* 총 공제액 */}
        <div className="p-4 bg-destructive/10 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold">총 공제액</span>
            <span className="text-2xl font-bold text-destructive">
              {formatNumber(breakdown.totalInsurance + breakdown.totalTax)}원
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
