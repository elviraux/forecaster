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
