import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { WeatherData } from '@/types/weather';
import { format } from 'date-fns';

interface WeatherChartProps {
  data: WeatherData[];
  dataKey: keyof WeatherData;
  title: string;
}

export default function WeatherChart({
  data,
  dataKey,
  title,
}: WeatherChartProps) {
  const chartData = data.map((item) => ({
    time: format(new Date(item.dt * 1000), 'HH:mm'),
    value: item[dataKey],
  }));

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <LineChart width={800} height={400} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="time"
          label={{
            value: '時間',
            position: 'insideBottomRight',
            offset: -5,
          }}
        />
        <YAxis />
        <Tooltip
          formatter={(value: number) => [`${value}`, '値']}
          labelFormatter={(label) => `時間: ${label}`}
        />
        <Legend />
        <Line type="monotone" dataKey="value" stroke="#8884d8" />
      </LineChart>
    </div>
  );
}
