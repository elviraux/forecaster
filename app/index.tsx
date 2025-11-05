import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedBackground, getWeatherCondition } from '@/components/AnimatedBackground';
import { WeatherCard, WeatherDetailRow, TomorrowForecastCard } from '@/components/WeatherCard';
import { ClothingModal } from '@/components/ClothingModal';
import { WeatherService } from '@/services/weatherService';
import { NewellService } from '@/services/newellService';
import { WeatherData } from '@/types/weather';

export default function Index() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    loadWeatherData();
  }, []);

  const loadWeatherData = async () => {
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
    } catch (err) {
      console.error('Error loading weather:', err);
      setError(err instanceof Error ? err.message : 'Failed to load weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleAskForClothing = async () => {
    if (!weatherData) return;

    setModalVisible(true);
    setAiLoading(true);
    setAiRecommendation(null);

    try {
      const recommendation = await NewellService.generateClothingRecommendation(
        weatherData
      );
      setAiRecommendation(recommendation);
    } catch (err) {
      console.error('Error getting AI recommendation:', err);
      setAiRecommendation(null);
    } finally {
      setAiLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  // Determine if it's night time (simple check based on hours)
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
        <TouchableOpacity style={styles.retryButton} onPress={loadWeatherData}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
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

  const tomorrowIcon = WeatherService.getWeatherIcon(
    weatherData.tomorrow.weatherCode,
    false
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

        {/* Tomorrow's Forecast Card */}
        <TomorrowForecastCard
          high={weatherData.tomorrow.high}
          low={weatherData.tomorrow.low}
          description={weatherData.tomorrow.description}
          icon={tomorrowIcon}
          precipChance={weatherData.tomorrow.precipitationChance}
        />

        {/* AI Clothing Suggestion Button */}
        <TouchableOpacity
          style={styles.aiButton}
          onPress={handleAskForClothing}
          activeOpacity={0.8}
        >
          <View style={styles.aiButtonContent}>
            <View style={styles.aiButtonIcon}>
              <Ionicons name="sparkles" size={24} color="#4A90E2" />
            </View>
            <View style={styles.aiButtonTextContainer}>
              <Text style={styles.aiButtonTitle}>AI Outfit Assistant</Text>
              <Text style={styles.aiButtonSubtitle}>
                What should my toddler wear tomorrow?
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#4A90E2" />
          </View>
        </TouchableOpacity>

        {/* Refresh Button */}
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={loadWeatherData}
        >
          <Ionicons name="refresh" size={20} color="#fff" />
          <Text style={styles.refreshText}>Refresh Weather</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Powered by Open-Meteo & Newell AI</Text>
        </View>
      </ScrollView>

      {/* AI Clothing Modal */}
      <ClothingModal
        visible={modalVisible}
        onClose={handleCloseModal}
        recommendation={aiRecommendation}
        loading={aiLoading}
      />
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
  retryButton: {
    marginTop: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
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
  aiButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  aiButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiButtonIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiButtonTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  aiButtonTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  aiButtonSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 16,
  },
  refreshText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});
