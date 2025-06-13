'use client';

import { useEffect, useState } from 'react';
import { WeatherResponse } from '@/types/weather';
import WeatherChart from '@/components/WeatherChart';
import { getLatestWeatherData } from '@/lib/supabase';
import { format, formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [nextUpdate, setNextUpdate] = useState<Date | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // まずSupabaseからデータを取得
        const data = await getLatestWeatherData();
        if (data) {
          setWeatherData(data.data);
          setLastUpdated(new Date(data.timestamp));
          // 次の更新は1時間後
          setNextUpdate(
            new Date(new Date(data.timestamp).getTime() + 60 * 60 * 1000)
          );
        } else {
          // データが存在しない場合はAPIを呼び出してデータを取得
          const response = await fetch('/api/weather');
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch weather data');
          }
          const newData = await response.json();
          setWeatherData(newData);
          setLastUpdated(new Date());
          setNextUpdate(new Date(new Date().getTime() + 60 * 60 * 1000));
        }
      } catch (err) {
        console.error('Error fetching weather data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-xl">Loading weather data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="min-h-screen p-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          No weather data available. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">天気予報ダッシュボード</h1>
        <div className="text-gray-600 space-y-2">
          <p>
            予報期間:{' '}
            {format(
              new Date(weatherData.hourly[0].dt * 1000),
              'yyyy年MM月dd日 HH:mm'
            )}{' '}
            〜{' '}
            {format(
              new Date(
                weatherData.hourly[weatherData.hourly.length - 1].dt * 1000
              ),
              'yyyy年MM月dd日 HH:mm'
            )}
          </p>
          {lastUpdated && (
            <p>最終更新: {format(lastUpdated, 'yyyy年MM月dd日 HH:mm:ss')}</p>
          )}
          {nextUpdate && (
            <p>
              次の更新まで:{' '}
              {formatDistanceToNow(nextUpdate, { locale: ja, addSuffix: true })}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-8">
        <WeatherChart
          data={weatherData.hourly}
          dataKey="temp"
          title="24時間予報 - 気温"
        />

        <WeatherChart
          data={weatherData.hourly}
          dataKey="humidity"
          title="24時間予報 - 湿度"
        />

        <WeatherChart
          data={weatherData.hourly}
          dataKey="wind_speed"
          title="24時間予報 - 風速"
        />

        {weatherData.minutely && (
          <WeatherChart
            data={weatherData.minutely}
            dataKey="precipitation"
            title="1時間予報 - 降水量"
          />
        )}
      </div>
    </main>
  );
}
