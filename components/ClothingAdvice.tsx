import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, Animated, Image, ActivityIndicator } from 'react-native';
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
  compact?: boolean;
}

export function ClothingAdvice({
  recommendation,
  tomorrowWeather,
  compact = false,
}: ClothingAdviceProps) {
  const [clothingImages, setClothingImages] = useState<Map<string, string>>(
    new Map()
  );
  const [imagesLoading, setImagesLoading] = useState(true);

  // Parse clothing items from recommendation
  const clothingItems = NewellService.parseClothingItems(recommendation);

  // Generate images when component mounts
  useEffect(() => {
    generateImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recommendation]);

  const generateImages = async () => {
    try {
      setImagesLoading(true);
      const images = await NewellService.generateClothingImages(clothingItems);
      setClothingImages(images);
    } catch (error) {
      console.error('Error generating clothing images:', error);
    } finally {
      setImagesLoading(false);
    }
  };

  // Create summary sentence about tomorrow's weather
  const weatherSummary = generateWeatherSummary(tomorrowWeather);

  return (
    <View style={styles.container}>
      {/* Loading State for Images */}
      {imagesLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Generating outfit images...</Text>
        </View>
      ) : (
        <>
          {/* AI-Generated Clothing Images */}
          {clothingImages.size > 0 && (
            <View style={styles.imagesGrid}>
              {Array.from(clothingImages.entries()).map(
                ([item, imageUrl], index) => (
                  <ClothingImage
                    key={item}
                    imageUrl={imageUrl}
                    label={item.charAt(0).toUpperCase() + item.slice(1)}
                    index={index}
                  />
                )
              )}
            </View>
          )}
        </>
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

interface ClothingImageProps {
  imageUrl: string;
  label: string;
  index: number;
}

function ClothingImage({ imageUrl, label, index }: ClothingImageProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Stagger the fade-in animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: index * 150,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        delay: index * 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim, index]);

  return (
    <Animated.View
      style={[
        styles.imageContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.clothingImage}
          resizeMode="cover"
        />
      </View>
      <Text style={styles.imageLabel}>{label}</Text>
    </Animated.View>
  );
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
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  loadingText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 12,
    fontWeight: '500',
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
    maxWidth: '100%',
  },
  imageContainer: {
    alignItems: 'center',
    margin: 6,
    minWidth: 80,
  },
  imageWrapper: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  clothingImage: {
    width: '100%',
    height: '100%',
  },
  imageLabel: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  summaryContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 20,
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
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    marginLeft: 4,
  },
  tempDivider: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    marginHorizontal: 10,
  },
});
