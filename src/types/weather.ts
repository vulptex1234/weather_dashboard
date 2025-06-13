export interface WeatherData {
  dt: number;
  japanese_time: string;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  };
  pop?: number;
  rain?: number;
  snow?: number;
  precipitation?: number;
}

export interface WeatherResponse {
  current: WeatherData;
  hourly: WeatherData[];
  minutely: WeatherData[];
}
