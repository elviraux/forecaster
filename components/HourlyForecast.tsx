import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HourlyForecast as HourlyData } from '@/types/weather';
import { WeatherService } from '@/services/weatherService';

interface HourlyForecastProps {
  hourlyData: HourlyData[];
}

export function HourlyForecast({ hourlyData }: HourlyForecastProps) {
  const formatTime = (isoTime: string): string => {
    const date = new Date(isoTime);
    const hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours} ${ampm}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Next 24 Hours</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {hourlyData.map((hour, index) => {
          const icon = WeatherService.getWeatherIcon(
            hour.weatherCode,
            false
          ) as keyof typeof Ionicons.glyphMap;

          return (
            <View key={index} style={styles.hourItem}>
              <Text style={styles.hourTime}>{formatTime(hour.time)}</Text>
              <Ionicons name={icon} size={32} color="#fff" />
              <Text style={styles.hourTemp}>{hour.temp}°</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
    paddingHorizontal: 4,
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingHorizontal: 4,
    paddingVertical: 12,
  },
  hourItem: {
    alignItems: 'center',
    marginRight: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    minWidth: 70,
  },
  hourTime: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '500',
    marginBottom: 8,
  },
  hourTemp: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
    marginTop: 8,
  },
});
