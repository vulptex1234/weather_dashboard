import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function saveWeatherData(data: any) {
  try {
    const { error } = await supabase.from('weather_data').insert([
      {
        timestamp: new Date().toISOString(),
        data: data,
      },
    ]);

    if (error) {
      console.error('Error saving weather data:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in saveWeatherData:', error);
    throw error;
  }
}

export async function getLatestWeatherData() {
  try {
    const { data, error } = await supabase
      .from('weather_data')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }

    // データが存在しない場合はnullを返す
    if (!data || data.length === 0) {
      return null;
    }

    return data[0];
  } catch (error) {
    console.error('Error in getLatestWeatherData:', error);
    throw error;
  }
}
