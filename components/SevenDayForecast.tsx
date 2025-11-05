import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DailyForecast } from '@/types/weather';
import { WeatherService } from '@/services/weatherService';

interface SevenDayForecastProps {
  dailyData: DailyForecast[];
}

export function SevenDayForecast({ dailyData }: SevenDayForecastProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>7-Day Forecast</Text>
      <View style={styles.forecastList}>
        {dailyData.map((day, index) => (
          <DayForecastItem key={day.date} day={day} index={index} />
        ))}
      </View>
    </View>
  );
}

interface DayForecastItemProps {
  day: DailyForecast;
  index: number;
}

function DayForecastItem({ day, index }: DayForecastItemProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Stagger the animations for each item
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 50,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        delay: index * 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, translateY, index]);

  const icon = WeatherService.getWeatherIcon(
    day.weatherCode,
    false
  ) as keyof typeof Ionicons.glyphMap;

  return (
    <Animated.View
      style={[
        styles.dayItem,
        {
          opacity: fadeAnim,
          transform: [{ translateY }],
        },
      ]}
    >
      <Text style={styles.dayName}>{day.dayName}</Text>
      <View style={styles.dayMiddle}>
        <Ionicons name={icon} size={28} color="#fff" />
        {day.precipitationChance > 0 && (
          <View style={styles.precipBadge}>
            <Ionicons name="water" size={12} color="#fff" />
            <Text style={styles.precipText}>{day.precipitationChance}%</Text>
          </View>
        )}
      </View>
      <View style={styles.dayTemps}>
        <Text style={styles.dayHigh}>{day.high}°</Text>
        <Text style={styles.dayLow}>{day.low}°</Text>
      </View>
    </Animated.View>
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
  forecastList: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 16,
  },
  dayItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  dayName: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '600',
    width: 90,
  },
  dayMiddle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  precipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  precipText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
    marginLeft: 4,
  },
  dayTemps: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 80,
    justifyContent: 'flex-end',
  },
  dayHigh: {
    fontSize: 17,
    color: '#fff',
    fontWeight: '700',
    marginRight: 8,
  },
  dayLow: {
    fontSize: 17,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '600',
  },
});
