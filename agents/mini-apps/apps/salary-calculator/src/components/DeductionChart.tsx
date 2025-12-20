import { useSalaryStore } from '@/hooks/useSalaryStore';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@mini-apps/ui';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';

const COLORS = {
  nationalPension: '#3b82f6',  // blue
  healthInsurance: '#10b981',  // green
  longTermCare: '#8b5cf6',     // purple
  employmentInsurance: '#f59e0b', // amber
  incomeTax: '#ef4444',        // red
  localIncomeTax: '#ec4899',   // pink
  netPay: '#22c55e',           // green (실수령액)
};

export function DeductionChart() {
  const { breakdown } = useSalaryStore();

  if (!breakdown) {
    return null;
  }

  const chartData = [
    { name: '국민연금', value: breakdown.nationalPension, color: COLORS.nationalPension },
    { name: '건강보험', value: breakdown.healthInsurance, color: COLORS.healthInsurance },
    { name: '장기요양', value: breakdown.longTermCare, color: COLORS.longTermCare },
    { name: '고용보험', value: breakdown.employmentInsurance, color: COLORS.employmentInsurance },
    { name: '소득세', value: breakdown.incomeTax, color: COLORS.incomeTax },
    { name: '지방소득세', value: breakdown.localIncomeTax, color: COLORS.localIncomeTax },
    { name: '실수령액', value: breakdown.netPay, color: COLORS.netPay },
  ];

  const renderCustomLabel = (entry: any) => {
    const percent = ((entry.value / breakdown.monthlyGross) * 100).toFixed(1);
    return `${percent}%`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="w-5 h-5" />
          급여 구성 비율
        </CardTitle>
        <CardDescription>총 급여 대비 공제 항목별 비율</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => `${value.toLocaleString()}원`}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => <span className="text-sm">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
