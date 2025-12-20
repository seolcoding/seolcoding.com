import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { PollResult } from '@/types/poll';

interface ResultChartProps {
  results: PollResult[];
  isRanking?: boolean;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

export function ResultChart({ results, isRanking = false }: ResultChartProps) {
  const chartData = results.map(r => ({
    name: r.option.length > 20 ? r.option.substring(0, 20) + '...' : r.option,
    value: isRanking ? (r.score || 0) : r.count,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <XAxis
          dataKey="name"
          angle={-45}
          textAnchor="end"
          height={100}
          interval={0}
        />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" animationDuration={500} radius={[8, 8, 0, 0]}>
          {chartData.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
