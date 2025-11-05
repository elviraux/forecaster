export interface HourlyForecast {
  time: string; // ISO timestamp
  temp: number;
  weatherCode: number;
}

export interface DailyForecast {
  date: string; // ISO date
  dayName: string;
  high: number;
  low: number;
  weatherCode: number;
  precipitationChance: number;
}

export interface WeatherData {
  location: string;
  current: {
    temp: number;
    feelsLike: number;
    description: string;
    weatherCode: number;
    windSpeed: number;
    humidity: number;
  };
  today: {
    high: number;
    low: number;
  };
  tomorrow: {
    high: number;
    low: number;
    description: string;
    weatherCode: number;
    precipitationChance: number;
    windSpeed: number;
  };
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}

export type WeatherCondition =
  | 'clear-day'
  | 'clear-night'
  | 'cloudy'
  | 'rainy'
  | 'snowy'
  | 'stormy'
  | 'foggy';

export interface WeatherColors {
  gradientStart: string;
  gradientEnd: string;
}
