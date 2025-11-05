import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WeatherCondition, WeatherColors } from '@/types/weather';

interface AnimatedBackgroundProps {
  condition: WeatherCondition;
}

const { width, height } = Dimensions.get('window');

export function AnimatedBackground({ condition }: AnimatedBackgroundProps) {
  const colors = getWeatherColors(condition);
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Create a looping animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 8000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animatedValue]);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.6, 0.3],
  });

  return (
    <>
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Animated overlay for subtle movement */}
      <Animated.View
        style={[
          styles.animatedOverlay,
          {
            opacity,
            transform: [{ translateY }],
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.1)', 'transparent']}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>
    </>
  );
}

function getWeatherColors(condition: WeatherCondition): WeatherColors {
  const colorMap: Record<WeatherCondition, WeatherColors> = {
    'clear-day': {
      gradientStart: '#4A90E2',
      gradientEnd: '#87CEEB',
    },
    'clear-night': {
      gradientStart: '#1A237E',
      gradientEnd: '#283593',
    },
    cloudy: {
      gradientStart: '#78909C',
      gradientEnd: '#B0BEC5',
    },
    rainy: {
      gradientStart: '#455A64',
      gradientEnd: '#607D8B',
    },
    snowy: {
      gradientStart: '#B0BEC5',
      gradientEnd: '#ECEFF1',
    },
    stormy: {
      gradientStart: '#37474F',
      gradientEnd: '#546E7A',
    },
    foggy: {
      gradientStart: '#90A4AE',
      gradientEnd: '#CFD8DC',
    },
  };

  return colorMap[condition] || colorMap['clear-day'];
}

export function getWeatherCondition(
  weatherCode: number,
  isNight: boolean = false
): WeatherCondition {
  if (weatherCode === 0 || weatherCode === 1) {
    return isNight ? 'clear-night' : 'clear-day';
  } else if (weatherCode === 2 || weatherCode === 3) {
    return 'cloudy';
  } else if (weatherCode >= 45 && weatherCode <= 48) {
    return 'foggy';
  } else if (weatherCode >= 51 && weatherCode <= 82) {
    return 'rainy';
  } else if (weatherCode >= 85 && weatherCode <= 86) {
    return 'snowy';
  } else if (weatherCode >= 95) {
    return 'stormy';
  }
  return 'clear-day';
}

const styles = StyleSheet.create({
  animatedOverlay: {
    ...StyleSheet.absoluteFillObject,
    width: width * 1.5,
    height: height * 1.5,
  },
});
