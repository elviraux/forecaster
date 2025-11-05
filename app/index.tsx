import React, { useState, useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedBackground, getWeatherCondition } from '@/components/AnimatedBackground';
import { LocationPage } from '@/components/LocationPage';
import { ClothingModal } from '@/components/ClothingModal';
import { WeatherService } from '@/services/weatherService';
import { NewellService } from '@/services/newellService';
import { LocationStorage } from '@/services/locationStorage';
import { WeatherData } from '@/types/weather';
import { SavedLocation } from '@/types/location';

interface LocationWeatherData {
  location: SavedLocation;
  weather: WeatherData;
}

export default function Index() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);

  const [locationsWeather, setLocationsWeather] = useState<LocationWeatherData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Reload weather when screen comes into focus (including initial load)
  useFocusEffect(
    useCallback(() => {
      loadAllLocationsWeather();
    }, [])
  );

  const loadAllLocationsWeather = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current location
      const currentLocation = await WeatherService.getCurrentLocation();
      if (!currentLocation) {
        throw new Error('Unable to get location. Please enable location services.');
      }

      // Get location name for current position
      const locationName = await WeatherService.getLocationName(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude
      );

      // Create current location object
      const currentLoc: SavedLocation = {
        id: 'current',
        name: locationName,
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        isCurrentLocation: true,
      };

      // Fetch weather for current location
      const currentWeather = await WeatherService.getWeatherData(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude
      );

      // Get saved locations
      const savedLocations = await LocationStorage.getSavedLocations();

      // Fetch weather for all saved locations
      const weatherPromises = savedLocations.map(async (loc) => {
        try {
          const weather = await WeatherService.getWeatherData(
            loc.latitude,
            loc.longitude
          );
          return { location: loc, weather };
        } catch (err) {
          console.error(`Error fetching weather for ${loc.name}:`, err);
          return null;
        }
      });

      const savedWeatherResults = await Promise.all(weatherPromises);
      const validSavedWeather = savedWeatherResults.filter(
        (result): result is LocationWeatherData => result !== null
      );

      // Combine current location with saved locations
      const allLocationsWeather: LocationWeatherData[] = [
        { location: currentLoc, weather: currentWeather },
        ...validSavedWeather,
      ];

      setLocationsWeather(allLocationsWeather);
    } catch (err) {
      console.error('Error loading weather:', err);
      setError(err instanceof Error ? err.message : 'Failed to load weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleAskForClothing = async () => {
    if (locationsWeather.length === 0) return;

    const currentLocationWeather = locationsWeather[currentIndex];
    if (!currentLocationWeather) return;

    setModalVisible(true);
    setAiLoading(true);
    setAiRecommendation(null);

    try {
      const recommendation = await NewellService.generateClothingRecommendation(
        currentLocationWeather.weather
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

  const handleManageLocations = () => {
    router.push('/manage-locations');
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

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

  if (error || locationsWeather.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <AnimatedBackground condition="cloudy" />
        <Ionicons name="alert-circle-outline" size={64} color="#fff" />
        <Text style={styles.errorTitle}>Unable to Load Weather</Text>
        <Text style={styles.errorMessage}>
          {error || 'Please check your internet connection and location permissions.'}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadAllLocationsWeather}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentLocationWeather = locationsWeather[currentIndex];
  const weatherCondition = currentLocationWeather
    ? getWeatherCondition(currentLocationWeather.weather.current.weatherCode, isNight)
    : 'clear-day';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <AnimatedBackground condition={weatherCondition} />

      {/* Location carousel */}
      <FlatList
        ref={flatListRef}
        data={locationsWeather}
        renderItem={({ item }) => (
          <LocationPage weatherData={item.weather} isNight={isNight} />
        )}
        keyExtractor={(item) => item.location.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        scrollEventThrottle={16}
      />

      {/* Page indicators */}
      {locationsWeather.length > 1 && (
        <View style={styles.pageIndicators}>
          {locationsWeather.map((_, index) => (
            <View
              key={index}
              style={[
                styles.pageIndicator,
                index === currentIndex && styles.pageIndicatorActive,
              ]}
            />
          ))}
        </View>
      )}

      {/* Floating action buttons */}
      <View style={styles.floatingButtons}>
        {/* AI Clothing Button */}
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={handleAskForClothing}
          activeOpacity={0.8}
        >
          <Ionicons name="sparkles" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Refresh Button */}
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={loadAllLocationsWeather}
          activeOpacity={0.8}
        >
          <Ionicons name="refresh" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Manage Locations Button */}
        <TouchableOpacity
          style={[styles.floatingButton, styles.addLocationButton]}
          onPress={handleManageLocations}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

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
  pageIndicators: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 4,
  },
  pageIndicatorActive: {
    width: 24,
    backgroundColor: '#fff',
  },
  floatingButtons: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    alignItems: 'flex-end',
  },
  floatingButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(74, 144, 226, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addLocationButton: {
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
  },
});
