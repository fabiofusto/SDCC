'use client';

import {
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from 'recharts';

interface ChartProps {
  score: {
    [key: string]: number;
  };
}

export const Chart = ({ score }: ChartProps) => {
  const data = Object.entries(score).map(([key, score]) => ({
    name: key,
    score: score * 100,
  }));

  const colors = [
    'rgb(22 163 74)',
    'rgb(239 68 68)',
    'rgb(234 179 8)',
    'rgb(59 130 246)',
  ];

  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
    >
      <PieChart>
        <Tooltip />
        <Legend align="center" />
        <Pie
          data={data}
          dataKey={'score'}
          nameKey={'name'}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={colors[index % colors.length]}
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};
