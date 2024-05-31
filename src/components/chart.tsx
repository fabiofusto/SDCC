'use client';

import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface ChartProps {
  score: {
    [key: string]: number;
  };
}

export const Chart = ({ score}: ChartProps) => {
  const data = Object.entries(score).map(([key, score]) => ({
    name: key,
    score: score * 100,
  }));

  const colors = ["rgb(22 163 74)", 'rgb(239 68 68)', 'rgb(234 179 8)', 'rgb(59 130 246)'];

  return (
    <ResponsiveContainer
        width="100%"
        height="100%"
    >
      <BarChart
        data={data}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={"name"} />
        <YAxis scale={'linear'} domain={[0,100]} />
        <Tooltip />
        <Bar dataKey="score">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
