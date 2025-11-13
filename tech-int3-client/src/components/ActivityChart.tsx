import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Stats } from '../types';

interface ActivityChartProps {
    data: Stats['activityChart'];
}

export const ActivityChart = ({ data }: ActivityChartProps) => {
    return (
        <ResponsiveContainer width={'100%'} height={300}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray={"3 3"} />
                <XAxis dataKey={'date'} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey={'approved'} fill='#82ca9d' />
                <Bar dataKey={'rejected'} fill='#ff6961' />
            </BarChart>
        </ResponsiveContainer>
    )
}