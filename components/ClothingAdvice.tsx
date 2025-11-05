import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NewellService } from '@/services/newellService';

interface ClothingAdviceProps {
  recommendation: string;
  tomorrowWeather: {
    high: number;
    low: number;
    description: string;
    precipitationChance: number;
  };
}

interface ClothingItemIcon {
  name: keyof typeof Ionicons.glyphMap;
  label: string;
}

export function ClothingAdvice({
  recommendation,
  tomorrowWeather,
}: ClothingAdviceProps) {
  // Parse clothing items from recommendation
  const clothingItems = NewellService.parseClothingItems(recommendation);

  // Get icon mappings
  const clothingIcons: ClothingItemIcon[] = clothingItems.map((item) => ({
    name: getEnhancedClothingIcon(item),
    label: item.charAt(0).toUpperCase() + item.slice(1),
  }));

  // Create summary sentence about tomorrow's weather
  const weatherSummary = generateWeatherSummary(tomorrowWeather);

  return (
    <View style={styles.container}>
      {/* Clothing Icons Grid */}
      {clothingIcons.length > 0 && (
        <View style={styles.iconsGrid}>
          {clothingIcons.map((item, index) => (
            <ClothingIcon
              key={index}
              icon={item.name}
              label={item.label}
              index={index}
            />
          ))}
        </View>
      )}

      {/* Weather Summary */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>{weatherSummary}</Text>
      </View>

      {/* Tomorrow's Temp Range */}
      <View style={styles.tempRange}>
        <View style={styles.tempItem}>
          <Ionicons name="arrow-up" size={16} color="rgba(255,255,255,0.9)" />
          <Text style={styles.tempText}>{tomorrowWeather.high}°</Text>
        </View>
        <Text style={styles.tempDivider}>•</Text>
        <View style={styles.tempItem}>
          <Ionicons name="arrow-down" size={16} color="rgba(255,255,255,0.9)" />
          <Text style={styles.tempText}>{tomorrowWeather.low}°</Text>
        </View>
        {tomorrowWeather.precipitationChance > 0 && (
          <>
            <Text style={styles.tempDivider}>•</Text>
            <View style={styles.tempItem}>
              <Ionicons name="water" size={16} color="rgba(255,255,255,0.9)" />
              <Text style={styles.tempText}>
                {tomorrowWeather.precipitationChance}%
              </Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

interface ClothingIconProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  index: number;
}

function ClothingIcon({ icon, label, index }: ClothingIconProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Stagger the fade-in animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim, index]);

  return (
    <Animated.View
      style={[
        styles.iconContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={36} color="#fff" />
      </View>
      <Text style={styles.iconLabel}>{label}</Text>
    </Animated.View>
  );
}

function getEnhancedClothingIcon(
  item: string
): keyof typeof Ionicons.glyphMap {
  const lowerItem = item.toLowerCase();

  const iconMap: { [key: string]: keyof typeof Ionicons.glyphMap } = {
    // Tops
    jacket: 'shirt-outline',
    coat: 'shirt-outline',
    sweater: 'shirt-outline',
    hoodie: 'shirt-outline',
    shirt: 'shirt-outline',
    't-shirt': 'shirt-outline',
    vest: 'shirt-outline',
    cardigan: 'shirt-outline',

    // Bottoms
    pants: 'fitness-outline',
    jeans: 'fitness-outline',
    shorts: 'fitness-outline',
    leggings: 'fitness-outline',

    // Accessories
    hat: 'snow-outline',
    boots: 'footsteps-outline',
    shoes: 'footsteps-outline',
    socks: 'footsteps-outline',
    mittens: 'hand-left-outline',
    gloves: 'hand-left-outline',
    scarf: 'remove-outline',

    // Rain gear
    raincoat: 'umbrella-outline',
    umbrella: 'umbrella-outline',

    // Other
    dress: 'person-outline',
  };

  return iconMap[lowerItem] || 'shirt-outline';
}

function generateWeatherSummary(weather: {
  high: number;
  low: number;
  description: string;
  precipitationChance: number;
}): string {
  const { high, low, description, precipitationChance } = weather;

  // Temperature-based adjectives
  let tempAdjective = '';
  const avgTemp = (high + low) / 2;

  if (avgTemp < 40) {
    tempAdjective = 'cold';
  } else if (avgTemp < 55) {
    tempAdjective = 'chilly';
  } else if (avgTemp < 70) {
    tempAdjective = 'mild';
  } else if (avgTemp < 85) {
    tempAdjective = 'warm';
  } else {
    tempAdjective = 'hot';
  }

  // Build summary
  let summary = `A ${tempAdjective}`;

  // Add weather condition
  const lowerDesc = description.toLowerCase();
  if (lowerDesc.includes('rain') || precipitationChance > 50) {
    summary += ' and rainy';
  } else if (lowerDesc.includes('cloud')) {
    summary += ' and cloudy';
  } else if (lowerDesc.includes('clear') || lowerDesc.includes('sunny')) {
    summary += ' and clear';
  } else if (lowerDesc.includes('snow')) {
    summary += ' and snowy';
  }

  summary += ' day ahead.';

  return summary;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  iconsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 32,
    maxWidth: '100%',
  },
  iconContainer: {
    alignItems: 'center',
    margin: 12,
    minWidth: 80,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  iconLabel: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  summaryContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 17,
    color: '#fff',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 24,
  },
  tempRange: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tempItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tempText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    marginLeft: 4,
  },
  tempDivider: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.5)',
    marginHorizontal: 12,
  },
});
