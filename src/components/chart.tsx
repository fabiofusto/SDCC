'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
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
  type: 'pie' | 'bar';
  height?: number;
  width?: number;
}

export const Chart = ({ score, type, height=350, width=350 }: ChartProps) => {
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
    <div className={`w-[${width}px] h-[${height}px]`}>
    <ResponsiveContainer
      width="100%"
      height="100%"
    >
      {type === 'bar' ? (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={'name'} />
          <YAxis
            scale={'linear'}
            domain={[0, 100]}
          />
          <Tooltip />
          <Bar dataKey="score">
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Bar>
        </BarChart>
      ) : (
        <PieChart>
          <Tooltip />
          <Legend align='center'/>
          <Pie
            data={data}
            dataKey={'score'}
            nameKey={'name'}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
        </PieChart>
      )}
    </ResponsiveContainer>
    </div>
  );
};
