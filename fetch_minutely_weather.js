const axios = require('axios');
const fs = require('fs');

const API_KEY = 'f7be1420d2ab6102535b464beee86321';
const URL = `https://api.openweathermap.org/data/3.0/onecall?lat=35.656&lon=139.324&appid=${API_KEY}&lang=ja&units=metric&exclude=hourly,daily,alerts`;

// UNIXタイムスタンプを日本時間の文字列に変換する関数
function convertToJapaneseTime(timestamp) {
  const date = new Date(timestamp * 1000); // ミリ秒に変換
  return date.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
}

async function fetchMinutelyWeatherData() {
  try {
    const response = await axios.get(URL);
    const data = response.data;

    // 現在の天気と1分単位の予報を抽出
    const currentWeather = data.current;
    const minutelyForecast = data.minutely.slice(0, 30); // 30分先までの予報を取得

    const weatherInfo = {
      current: {
        temp: currentWeather.temp,
        feels_like: currentWeather.feels_like,
        humidity: currentWeather.humidity,
        pressure: currentWeather.pressure,
        wind_speed: currentWeather.wind_speed,
        weather: currentWeather.weather[0],
        dt: currentWeather.dt,
        japanese_time: convertToJapaneseTime(currentWeather.dt),
      },
      minutely: minutelyForecast.map((forecast) => ({
        dt: forecast.dt,
        japanese_time: convertToJapaneseTime(forecast.dt),
        precipitation: forecast.precipitation,
      })),
    };

    // 結果をJSONファイルに保存
    fs.writeFileSync(
      'minutely_weather_data.json',
      JSON.stringify(weatherInfo, null, 2)
    );
    console.log(
      '1分単位の天気データを minutely_weather_data.json に保存しました。'
    );
  } catch (error) {
    console.error('エラーが発生しました:', error.message);
    if (error.response) {
      console.error('レスポンスデータ:', error.response.data);
    }
  }
}

fetchMinutelyWeatherData();
