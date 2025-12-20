import React from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { Question } from '../types';

interface ResultChartProps {
  question: Question;
  stats: { A: number; B: number };
  myChoice?: 'A' | 'B';
}

const COLORS = {
  A: '#0088FE',
  B: '#FF8042',
};

const ResultChart: React.FC<ResultChartProps> = ({ question, stats, myChoice }) => {
  const totalVotes = stats.A + stats.B;
  const percentageA = ((stats.A / totalVotes) * 100).toFixed(1);
  const percentageB = ((stats.B / totalVotes) * 100).toFixed(1);

  const barData = [
    {
      name: question.optionA,
      votes: stats.A,
      percentage: percentageA,
      fill: COLORS.A,
    },
    {
      name: question.optionB,
      votes: stats.B,
      percentage: percentageB,
      fill: COLORS.B,
    },
  ];

  const pieData = [
    { name: question.optionA, value: stats.A },
    { name: question.optionB, value: stats.B },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-center mb-6">투표 결과</h2>

      {/* My choice */}
      {myChoice && (
        <div className="text-center mb-6">
          <p className="text-gray-600 mb-2">나의 선택</p>
          <div
            className="inline-block px-6 py-3 rounded-full font-bold text-white"
            style={{ backgroundColor: COLORS[myChoice] }}
          >
            {myChoice === 'A' ? question.optionA : question.optionB}
          </div>
        </div>
      )}

      {/* Percentage display */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">{question.optionA}</p>
          <p className="text-4xl font-bold text-blue-600">{percentageA}%</p>
          <p className="text-xs text-gray-500 mt-1">{stats.A.toLocaleString()}명</p>
        </div>
        <div className="text-center p-4 bg-pink-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">{question.optionB}</p>
          <p className="text-4xl font-bold text-pink-600">{percentageB}%</p>
          <p className="text-xs text-gray-500 mt-1">{stats.B.toLocaleString()}명</p>
        </div>
      </div>

      {/* Bar chart */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-center">비교 차트</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              formatter={(value: number) => [`${value.toLocaleString()}명`, '투표 수']}
            />
            <Bar dataKey="votes" radius={[8, 8, 0, 0]}>
              {barData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={barData[index].fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie chart */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-center">비율</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === 0 ? COLORS.A : COLORS.B}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `${value.toLocaleString()}명`} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Total votes */}
      <p className="text-center text-gray-500 text-sm mt-6">
        총 {totalVotes.toLocaleString()}명이 참여했습니다
      </p>
    </div>
  );
};

export default ResultChart;
