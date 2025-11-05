import * as Location from 'expo-location';
import { WeatherData } from '@/types/weather';

// Using Open-Meteo API (free, no API key required)
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';

export class WeatherService {
  static async requestLocationPermission(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  }

  static async getCurrentLocation(): Promise<Location.LocationObject | null> {
    try {
      const hasPermission = await this.requestLocationPermission();
      if (!hasPermission) {
        throw new Error('Location permission not granted');
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      return location;
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  }

  static async getLocationName(
    latitude: number,
    longitude: number
  ): Promise<string> {
    try {
      const response = await fetch(
        `${GEOCODING_API_URL}?latitude=${latitude}&longitude=${longitude}&count=1&language=en&format=json`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch location name');
      }

      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        return result.name || 'Unknown Location';
      }

      return 'Unknown Location';
    } catch (error) {
      console.error('Error fetching location name:', error);
      return 'Unknown Location';
    }
  }

  static async getWeatherData(
    latitude: number,
    longitude: number
  ): Promise<WeatherData> {
    try {
      const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        current:
          'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m',
        daily:
          'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max',
        temperature_unit: 'fahrenheit',
        wind_speed_unit: 'mph',
        precipitation_unit: 'inch',
        timezone: 'auto',
        forecast_days: '2',
      });

      const response = await fetch(`${WEATHER_API_URL}?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data = await response.json();

      // Get location name
      const locationName = await this.getLocationName(latitude, longitude);

      // Parse weather data
      const weatherData: WeatherData = {
        location: locationName,
        current: {
          temp: Math.round(data.current.temperature_2m),
          feelsLike: Math.round(data.current.apparent_temperature),
          description: this.getWeatherDescription(data.current.weather_code),
          weatherCode: data.current.weather_code,
          windSpeed: Math.round(data.current.wind_speed_10m),
          humidity: data.current.relative_humidity_2m,
        },
        today: {
          high: Math.round(data.daily.temperature_2m_max[0]),
          low: Math.round(data.daily.temperature_2m_min[0]),
        },
        tomorrow: {
          high: Math.round(data.daily.temperature_2m_max[1]),
          low: Math.round(data.daily.temperature_2m_min[1]),
          description: this.getWeatherDescription(data.daily.weather_code[1]),
          weatherCode: data.daily.weather_code[1],
          precipitationChance: data.daily.precipitation_probability_max[1] || 0,
          windSpeed: Math.round(data.daily.wind_speed_10m_max[1]),
        },
      };

      return weatherData;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }

  static getWeatherDescription(code: number): string {
    // WMO Weather interpretation codes
    const descriptions: { [key: number]: string } = {
      0: 'Clear',
      1: 'Mainly Clear',
      2: 'Partly Cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Foggy',
      51: 'Light Drizzle',
      53: 'Drizzle',
      55: 'Heavy Drizzle',
      61: 'Light Rain',
      63: 'Rain',
      65: 'Heavy Rain',
      71: 'Light Snow',
      73: 'Snow',
      75: 'Heavy Snow',
      77: 'Snow Grains',
      80: 'Light Showers',
      81: 'Showers',
      82: 'Heavy Showers',
      85: 'Light Snow Showers',
      86: 'Snow Showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with Hail',
      99: 'Thunderstorm with Hail',
    };

    return descriptions[code] || 'Unknown';
  }

  static getWeatherIcon(code: number, isNight: boolean = false): string {
    // Returns Ionicons name for weather icon
    if (code === 0 || code === 1) {
      return isNight ? 'moon' : 'sunny';
    } else if (code === 2) {
      return isNight ? 'cloudy-night' : 'partly-sunny';
    } else if (code === 3) {
      return 'cloudy';
    } else if (code >= 45 && code <= 48) {
      return 'cloud';
    } else if (code >= 51 && code <= 65) {
      return 'rainy';
    } else if (code >= 71 && code <= 86) {
      return 'snow';
    } else if (code >= 95) {
      return 'thunderstorm';
    }
    return 'partly-sunny';
  }
}
