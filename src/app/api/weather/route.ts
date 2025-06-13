import { NextResponse } from 'next/server';
import { fetchWeatherData } from '@/lib/weather';

export async function GET() {
  try {
    const data = await fetchWeatherData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in weather API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}
