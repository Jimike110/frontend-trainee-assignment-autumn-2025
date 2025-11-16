import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { Stats } from '../types';

interface DecisionsChartProps {
  data: Stats['decisionsChart'];
}

const COLORS = {
  approved: '#82ca9d',
  rejected: '#ff6961',
  requestChanges: '#ffc658',
};

export const DecisionsChart = ({ data }: DecisionsChartProps) => {
  if (!data) return null;

  const chartData = Object.entries(data).map(([key, value]) => ({
    name: key.charAt(0) + key.slice(1),
    value: Number(value.toFixed(1)),
  }));

  return (
    <ResponsiveContainer width={'100%'} height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx={'50%'}
          cy={'50%'}
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey={'value'}
          nameKey={'name'}
          label={({ name, percent }) =>
            `${name} ${(percent! * 100).toFixed(0)}%`
          }
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[entry.name as keyof typeof COLORS]}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};
