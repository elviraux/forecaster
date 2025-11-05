import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedBackground, getWeatherCondition } from '@/components/AnimatedBackground';
import { ClothingAdvice } from '@/components/ClothingAdvice';
import { WeatherService } from '@/services/weatherService';
import { NewellService } from '@/services/newellService';
import { WeatherData } from '@/types/weather';

export default function Index() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clothingAdvice, setClothingAdvice] = useState<string | null>(null);
  const [adviceLoading, setAdviceLoading] = useState(false);

  // Load weather and AI advice on focus
  useFocusEffect(
    useCallback(() => {
      loadWeatherAndAdvice();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );

  const loadWeatherAndAdvice = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current location
      const location = await WeatherService.getCurrentLocation();
      if (!location) {
        throw new Error('Unable to get location. Please enable location services.');
      }

      // Fetch weather data
      const weather = await WeatherService.getWeatherData(
        location.coords.latitude,
        location.coords.longitude
      );

      setWeatherData(weather);

      // Auto-load AI clothing advice
      loadClothingAdvice(weather);
    } catch (err) {
      console.error('Error loading weather:', err);
      setError(err instanceof Error ? err.message : 'Failed to load weather data');
    } finally {
      setLoading(false);
    }
  };

  const loadClothingAdvice = async (weather: WeatherData) => {
    try {
      setAdviceLoading(true);
      const recommendation = await NewellService.generateClothingRecommendation(
        weather
      );
      setClothingAdvice(recommendation);
    } catch (err) {
      console.error('Error getting AI recommendation:', err);
      setClothingAdvice(
        'A comfortable outfit with layers is always a good choice!'
      );
    } finally {
      setAdviceLoading(false);
    }
  };

  // Determine if it's night time
  const currentHour = new Date().getHours();
  const isNight = currentHour < 6 || currentHour > 20;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <AnimatedBackground condition="clear-day" />
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading weather...</Text>
      </View>
    );
  }

  if (error || !weatherData) {
    return (
      <View style={styles.errorContainer}>
        <AnimatedBackground condition="cloudy" />
        <Ionicons name="alert-circle-outline" size={64} color="#fff" />
        <Text style={styles.errorTitle}>Unable to Load Weather</Text>
        <Text style={styles.errorMessage}>
          {error || 'Please check your internet connection and location permissions.'}
        </Text>
      </View>
    );
  }

  const weatherCondition = getWeatherCondition(
    weatherData.current.weatherCode,
    isNight
  );

  const weatherIcon = WeatherService.getWeatherIcon(
    weatherData.current.weatherCode,
    isNight
  ) as keyof typeof Ionicons.glyphMap;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <AnimatedBackground condition={weatherCondition} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Location */}
        <View style={styles.locationContainer}>
          <Ionicons name="location" size={18} color="rgba(255,255,255,0.9)" />
          <Text style={styles.locationText}>{weatherData.location}</Text>
        </View>

        {/* Today's Weather - Top Section */}
        <View style={styles.todaySection}>
          <Ionicons name={weatherIcon} size={120} color="#fff" />
          <Text style={styles.currentTemp}>{weatherData.current.temp}°</Text>
          <Text style={styles.currentDescription}>
            {weatherData.current.description}
          </Text>

          {/* Inline Today's Stats */}
          <View style={styles.todayStats}>
            <View style={styles.statItem}>
              <Ionicons name="arrow-up" size={18} color="#fff" />
              <Text style={styles.statValue}>{weatherData.today.high}°</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Ionicons name="arrow-down" size={18} color="#fff" />
              <Text style={styles.statValue}>{weatherData.today.low}°</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Ionicons name="flag" size={18} color="#fff" />
              <Text style={styles.statValue}>
                {weatherData.current.windSpeed} mph
              </Text>
            </View>
          </View>
        </View>

        {/* Tomorrow's Clothing Advice - Bottom Section */}
        <View style={styles.adviceSection}>
          <Text style={styles.adviceTitle}>Tomorrow&apos;s Outfit</Text>

          {adviceLoading ? (
            <View style={styles.adviceLoading}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.adviceLoadingText}>
                Getting clothing recommendations...
              </Text>
            </View>
          ) : clothingAdvice ? (
            <ClothingAdvice
              recommendation={clothingAdvice}
              tomorrowWeather={weatherData.tomorrow}
            />
          ) : null}
        </View>

        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#fff',
    marginTop: 16,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.9,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  locationText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    marginLeft: 6,
  },
  todaySection: {
    alignItems: 'center',
    marginBottom: 60,
  },
  currentTemp: {
    fontSize: 96,
    color: '#fff',
    fontWeight: '200',
    marginTop: 8,
    marginBottom: 4,
    letterSpacing: -2,
  },
  currentDescription: {
    fontSize: 26,
    color: '#fff',
    fontWeight: '500',
    marginBottom: 24,
  },
  todayStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 24,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  statValue: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    marginLeft: 6,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  adviceSection: {
    marginTop: 20,
  },
  adviceTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 24,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  adviceLoading: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  adviceLoadingText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 16,
  },
  spacer: {
    height: 40,
  },
});
