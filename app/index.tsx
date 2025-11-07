import React, { useState, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  StatusBar,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedBackground, getWeatherCondition } from '@/components/AnimatedBackground';
import { ClothingAdvice } from '@/components/ClothingAdvice';
import { FirstLaunchSetup } from '@/components/FirstLaunchSetup';
import { SettingsModal } from '@/components/SettingsModal';
import { WeatherService } from '@/services/weatherService';
import { NewellService } from '@/services/newellService';
import { PreferencesStorage } from '@/services/preferencesStorage';
import { WeatherData } from '@/types/weather';
import { ClothingRecommendationStructured } from '@/types/newell';
import { UserPreferences } from '@/types/preferences';

const { height } = Dimensions.get('window');

export default function Index() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clothingAdvice, setClothingAdvice] = useState<ClothingRecommendationStructured | null>(null);
  const [adviceLoading, setAdviceLoading] = useState(false);

  // Personalization state
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [showSetup, setShowSetup] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [checkingSetup, setCheckingSetup] = useState(true);

  // Check if first launch on mount
  useEffect(() => {
    checkFirstLaunch();
  }, []);

  // Load weather and AI advice on focus
  useFocusEffect(
    useCallback(() => {
      if (preferences?.hasCompletedSetup) {
        loadWeatherAndAdvice();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [preferences])
  );

  const checkFirstLaunch = async () => {
    try {
      const prefs = await PreferencesStorage.getPreferences();
      setPreferences(prefs);

      if (!prefs.hasCompletedSetup) {
        setShowSetup(true);
      }
    } catch (error) {
      console.error('Error checking first launch:', error);
    } finally {
      setCheckingSetup(false);
    }
  };

  const handleSetupComplete = async () => {
    setShowSetup(false);
    const prefs = await PreferencesStorage.getPreferences();
    setPreferences(prefs);
    loadWeatherAndAdvice();
  };

  const handleSettingsSave = async () => {
    const prefs = await PreferencesStorage.getPreferences();
    setPreferences(prefs);
    // Reload AI advice with new preferences
    if (weatherData) {
      loadClothingAdvice(weatherData);
    }
  };

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

      // Use user preferences for personalized recommendations
      const childAge = preferences?.childAge || 2;
      const clothingStyle = preferences?.clothingStyle || 'neutral';

      const recommendation = await NewellService.generateClothingRecommendation(
        weather,
        childAge,
        clothingStyle
      );
      setClothingAdvice(recommendation);
    } catch (err) {
      console.error('Error getting AI recommendation:', err);
      // Provide fallback structured recommendation
      setClothingAdvice({
        summary: 'A comfortable outfit with layers is always a good choice!',
        clothing_items: ['shirt', 'pants', 'light-jacket'],
      });
    } finally {
      setAdviceLoading(false);
    }
  };

  // Determine if it's night time
  const currentHour = new Date().getHours();
  const isNight = currentHour < 6 || currentHour > 20;

  // Show first-launch setup if not completed
  if (showSetup) {
    return <FirstLaunchSetup onComplete={handleSetupComplete} />;
  }

  // Show loading while checking setup status
  if (checkingSetup) {
    return (
      <View style={styles.loadingContainer}>
        <AnimatedBackground condition="clear-day" />
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

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

      {/* Settings Gear Icon */}
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => setShowSettings(true)}
      >
        <Ionicons name="settings-outline" size={24} color="rgba(255,255,255,0.9)" />
      </TouchableOpacity>

      <View style={styles.content}>
        {/* Location */}
        <View style={styles.locationContainer}>
          <Ionicons name="location" size={16} color="rgba(255,255,255,0.9)" />
          <Text style={styles.locationText}>{weatherData.location}</Text>
        </View>

        {/* Today's Weather - Compact Top Section */}
        <View style={styles.todaySection}>
          <Ionicons name={weatherIcon} size={80} color="#fff" />
          <Text style={styles.currentTemp}>{weatherData.current.temp}°</Text>
          <Text style={styles.currentDescription}>
            {weatherData.current.description}
          </Text>

          {/* Inline Today's Stats */}
          <View style={styles.todayStats}>
            <View style={styles.statItem}>
              <Ionicons name="arrow-up" size={16} color="#fff" />
              <Text style={styles.statValue}>{weatherData.today.high}°</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Ionicons name="arrow-down" size={16} color="#fff" />
              <Text style={styles.statValue}>{weatherData.today.low}°</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Ionicons name="flag" size={16} color="#fff" />
              <Text style={styles.statValue}>
                {weatherData.current.windSpeed} mph
              </Text>
            </View>
          </View>
        </View>

        {/* Divider Line */}
        <View style={styles.divider} />

        {/* Tomorrow's Clothing Advice - Bottom Section */}
        <View style={styles.adviceSection}>
          <Text style={styles.adviceTitle}>Tomorrow&apos;s Outfit</Text>

          {clothingAdvice ? (
            <ClothingAdvice
              recommendation={clothingAdvice}
              tomorrowWeather={weatherData.tomorrow}
              clothingStyle={preferences?.clothingStyle || 'neutral'}
              compact={true}
            />
          ) : adviceLoading ? (
            <View style={styles.adviceLoading}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.adviceLoadingText}>
                Getting recommendations...
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* Settings Modal */}
      <SettingsModal
        visible={showSettings}
        onClose={() => setShowSettings(false)}
        onSave={handleSettingsSave}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  settingsButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: height > 700 ? 60 : 50,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  locationText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    marginLeft: 6,
  },
  todaySection: {
    alignItems: 'center',
  },
  currentTemp: {
    fontSize: 72,
    color: '#fff',
    fontWeight: '200',
    marginTop: 4,
    marginBottom: 2,
    letterSpacing: -2,
  },
  currentDescription: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '500',
    marginBottom: 16,
  },
  todayStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  statValue: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginLeft: 6,
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 20,
    marginHorizontal: 40,
  },
  adviceSection: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  adviceTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  adviceLoading: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  adviceLoadingText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 12,
  },
});
