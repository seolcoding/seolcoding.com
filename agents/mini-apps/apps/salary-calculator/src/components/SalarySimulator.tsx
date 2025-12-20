import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Slider,
  Label,
} from '@mini-apps/ui';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { calculateSalaryRange, formatNumber } from '@/utils/salaryCalculator';
import { useSalaryStore } from '@/hooks/useSalaryStore';
import { TrendingUp } from 'lucide-react';

const MIN_SALARY = 20000000; // 2천만원
const MAX_SALARY = 200000000; // 2억원
const STEP = 5000000; // 500만원

export function SalarySimulator() {
  const { taxFreeAmount, dependents, children, includeRetirement } = useSalaryStore();
  const [simulatedSalary, setSimulatedSalary] = useState(50000000); // 기본 5천만원
  const [chartData, setChartData] = useState<Array<{ salary: number; netPay: number }>>([]);

  useEffect(() => {
    const data = calculateSalaryRange(
      MIN_SALARY,
      MAX_SALARY,
      STEP,
      {
        taxFreeAmount,
        dependents,
        children,
        includeRetirement,
      }
    );
    setChartData(data);
  }, [taxFreeAmount, dependents, children, includeRetirement]);

  const currentData = chartData.find(d => d.salary === simulatedSalary) || chartData[0];
  const takeHomeRate = currentData
    ? ((currentData.netPay / (simulatedSalary / 12)) * 100).toFixed(1)
    : '0';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          연봉 협상 시뮬레이터
        </CardTitle>
        <CardDescription>슬라이더로 연봉을 조정하며 실수령액을 확인하세요</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 슬라이더 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>연봉</Label>
            <span className="text-2xl font-bold text-primary">
              {formatNumber(simulatedSalary)}원
            </span>
          </div>
          <Slider
            value={[simulatedSalary]}
            onValueChange={([value]) => setSimulatedSalary(value)}
            min={MIN_SALARY}
            max={MAX_SALARY}
            step={STEP}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{(MIN_SALARY / 10000).toLocaleString()}만원</span>
            <span>{(MAX_SALARY / 10000).toLocaleString()}만원</span>
          </div>
        </div>

        {/* 실수령액 정보 */}
        {currentData && (
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-primary/10 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">월 실수령액</div>
              <div className="text-xl font-bold text-primary">
                {formatNumber(currentData.netPay)}원
              </div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">실수령 비율</div>
              <div className="text-xl font-bold">
                {takeHomeRate}%
              </div>
            </div>
          </div>
        )}

        {/* 차트 */}
        <div className="pt-4">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="salary"
                tickFormatter={(value) => `${(value / 10000000).toFixed(0)}천만`}
              />
              <YAxis
                tickFormatter={(value) => `${(value / 10000).toFixed(0)}만`}
              />
              <Tooltip
                formatter={(value: number) => `${formatNumber(value)}원`}
                labelFormatter={(value) => `연봉: ${formatNumber(value)}원`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="netPay"
                stroke="#3b82f6"
                strokeWidth={2}
                name="월 실수령액"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
