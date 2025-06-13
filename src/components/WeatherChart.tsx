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
    time: item.japanese_time,
    dt: item.dt,
    value: item[dataKey],
  }));

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <LineChart width={800} height={400} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="dt"
          tickFormatter={(dt) => format(new Date(dt * 1000), 'HH:mm')}
          minTickGap={20}
        />
        <YAxis />
        <Tooltip
          labelFormatter={(dt) =>
            format(new Date(Number(dt) * 1000), 'yyyy/MM/dd HH:mm')
          }
        />
        <Legend />
        <Line type="monotone" dataKey="value" stroke="#8884d8" />
      </LineChart>
    </div>
  );
}
