import axios from 'axios';
import { saveWeatherData } from './supabase';
import { WeatherResponse } from '@/types/weather';

const API_KEY = process.env.OPENWEATHER_API_KEY;
const LAT = 35.656;
const LON = 139.324;

export async function fetchWeatherData(): Promise<WeatherResponse> {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${LAT}&lon=${LON}&appid=${API_KEY}&lang=ja&units=metric`
    );

    const data = response.data;
    await saveWeatherData(data);
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

export function convertToJapaneseTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
}
