import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { Category, Stats } from '../types';

interface CategoriesChartProps {
  data: Stats['categoriesChart'];
}

const COLORS: Record<Category, string> = {
  Электроника: '#8884d8',
  Недвижимость: '#82ca9d',
  Транспорт: '#ffc658',
  Работа: '#ff8042',
  Услуги: '#00C49F',
  Животные: '#AF19FF',
  Мода: '#FF81C0',
  Детское: '#0088FE',
};

export const CategoriesChart = ({ data }: CategoriesChartProps) => {
  if (!data) return null;

  const chartData = Object.entries(data).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
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
