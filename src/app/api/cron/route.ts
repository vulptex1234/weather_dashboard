import { NextResponse } from 'next/server';
import { fetchWeatherData } from '@/lib/weather';

// シンプルな認証トークン
const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request: Request) {
  // 認証ヘッダーをチェック
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await fetchWeatherData();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in cron job:', error);
    return NextResponse.json(
      { error: 'Failed to update weather data' },
      { status: 500 }
    );
  }
}
