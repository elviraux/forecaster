import * as Location from 'expo-location';
import { WeatherData } from '@/types/weather';
import { CitySearchResult } from '@/types/location';

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
      // Use Expo's built-in reverse geocoding
      const geocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (geocode && geocode.length > 0) {
        const location = geocode[0];

        // Build a readable location name
        // Priority: city > subregion > region
        const city = location.city || location.subregion || location.region;
        const state = location.region;

        if (city && state) {
          return `${city}, ${state}`;
        } else if (city) {
          return city;
        } else if (state) {
          return state;
        }
      }

      // Fallback to a friendly message instead of "Unknown Location"
      return 'Current Location';
    } catch (error) {
      console.error('Error fetching location name:', error);
      // Return a user-friendly placeholder instead of an error message
      return 'Current Location';
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
        hourly: 'temperature_2m,weather_code',
        daily:
          'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max',
        temperature_unit: 'fahrenheit',
        wind_speed_unit: 'mph',
        precipitation_unit: 'inch',
        timezone: 'auto',
        forecast_days: '7',
      });

      const response = await fetch(`${WEATHER_API_URL}?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data = await response.json();

      // Get location name
      const locationName = await this.getLocationName(latitude, longitude);

      // Parse hourly forecast (next 24 hours)
      const currentHour = new Date().getHours();
      const hourly = data.hourly.time
        .slice(currentHour, currentHour + 24)
        .map((time: string, index: number) => ({
          time,
          temp: Math.round(data.hourly.temperature_2m[currentHour + index]),
          weatherCode: data.hourly.weather_code[currentHour + index],
        }));

      // Parse daily forecast (7 days)
      const daily = data.daily.time.map((date: string, index: number) => {
        const dateObj = new Date(date);
        const dayNames = [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ];
        const dayName = index === 0 ? 'Today' : dayNames[dateObj.getDay()];

        return {
          date,
          dayName,
          high: Math.round(data.daily.temperature_2m_max[index]),
          low: Math.round(data.daily.temperature_2m_min[index]),
          weatherCode: data.daily.weather_code[index],
          precipitationChance:
            data.daily.precipitation_probability_max[index] || 0,
        };
      });

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
        hourly,
        daily,
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

  static async searchCities(query: string): Promise<CitySearchResult[]> {
    try {
      if (!query || query.trim().length < 2) {
        return [];
      }

      const params = new URLSearchParams({
        name: query.trim(),
        count: '10',
        language: 'en',
        format: 'json',
      });

      const response = await fetch(`${GEOCODING_API_URL}?${params}`);

      if (!response.ok) {
        throw new Error('Failed to search cities');
      }

      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        return [];
      }

      return data.results.map((result: any) => ({
        id: result.id,
        name: result.name,
        latitude: result.latitude,
        longitude: result.longitude,
        country: result.country,
        admin1: result.admin1,
        population: result.population,
      }));
    } catch (error) {
      console.error('Error searching cities:', error);
      return [];
    }
  }
}
