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
    time: item.japanese_time,
    value: item[dataKey],
  }));

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <LineChart width={800} height={400} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="value" stroke="#8884d8" />
      </LineChart>
    </div>
  );
}
