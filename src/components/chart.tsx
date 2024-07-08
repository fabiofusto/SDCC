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
  const data = Object.entries(score)
    .filter(([key, score]) => score !== 0)
    .map(([key, score]) => ({
      name: key,
      score: (score * 100),
    }));

  const colors: {[key: string]: string} = {
    Positive: 'rgb(22 163 74)',
    Negative: 'rgb(239 68 68)',
    Mixed: 'rgb(234 179 8)',
    Neutral: 'rgb(59 130 246)',
  };

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
              fill={colors[entry.name]}
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};
