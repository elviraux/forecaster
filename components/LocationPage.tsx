import React from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WeatherData } from '@/types/weather';
import { WeatherCard, WeatherDetailRow, TomorrowForecastCard } from './WeatherCard';
import { HourlyForecast } from './HourlyForecast';
import { SevenDayForecast } from './SevenDayForecast';
import { WeatherService } from '@/services/weatherService';

const { width } = Dimensions.get('window');

interface LocationPageProps {
  weatherData: WeatherData;
  isNight: boolean;
}

export function LocationPage({ weatherData, isNight }: LocationPageProps) {
  const weatherIcon = WeatherService.getWeatherIcon(
    weatherData.current.weatherCode,
    isNight
  ) as keyof typeof Ionicons.glyphMap;

  const tomorrowIcon = WeatherService.getWeatherIcon(
    weatherData.tomorrow.weatherCode,
    false
  ) as keyof typeof Ionicons.glyphMap;

  return (
    <View style={styles.pageContainer}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header - Location */}
        <View style={styles.header}>
          <Ionicons name="location" size={20} color="#fff" />
          <Text style={styles.location}>{weatherData.location}</Text>
        </View>

        {/* Current Weather */}
        <View style={styles.currentWeather}>
          <Ionicons name={weatherIcon} size={100} color="#fff" />
          <Text style={styles.currentTemp}>{weatherData.current.temp}°</Text>
          <Text style={styles.currentDescription}>
            {weatherData.current.description}
          </Text>
        </View>

        {/* Today's Details Card */}
        <WeatherCard title="Today's Details">
          <WeatherDetailRow
            icon="thermometer"
            label="Feels Like"
            value={`${weatherData.current.feelsLike}°`}
          />
          <WeatherDetailRow
            icon="arrow-up"
            label="High"
            value={`${weatherData.today.high}°`}
          />
          <WeatherDetailRow
            icon="arrow-down"
            label="Low"
            value={`${weatherData.today.low}°`}
          />
          <WeatherDetailRow
            icon="flag"
            label="Wind"
            value={`${weatherData.current.windSpeed} mph`}
          />
        </WeatherCard>

        {/* Hourly Forecast */}
        <HourlyForecast hourlyData={weatherData.hourly} />

        {/* Tomorrow's Forecast Card */}
        <TomorrowForecastCard
          high={weatherData.tomorrow.high}
          low={weatherData.tomorrow.low}
          description={weatherData.tomorrow.description}
          icon={tomorrowIcon}
          precipChance={weatherData.tomorrow.precipitationChance}
        />

        {/* 7-Day Forecast */}
        <SevenDayForecast dailyData={weatherData.daily} />

        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    width,
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  location: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
  currentWeather: {
    alignItems: 'center',
    marginBottom: 40,
  },
  currentTemp: {
    fontSize: 80,
    color: '#fff',
    fontWeight: '300',
    marginTop: 16,
    marginBottom: 8,
  },
  currentDescription: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '500',
  },
  spacer: {
    height: 120,
  },
});
