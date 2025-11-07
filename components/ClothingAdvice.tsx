import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated, Image, ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ClothingImageLibrary } from '@/services/clothingImageLibrary';
import { ClothingRecommendationStructured } from '@/types/newell';
import { ClothingStyle } from '@/types/preferences';

interface ClothingAdviceProps {
  recommendation: ClothingRecommendationStructured;
  tomorrowWeather: {
    high: number;
    low: number;
    description: string;
    precipitationChance: number;
  };
  clothingStyle?: ClothingStyle;
  compact?: boolean;
}

export function ClothingAdvice({
  recommendation,
  tomorrowWeather,
  clothingStyle = 'neutral',
  compact = false,
}: ClothingAdviceProps) {
  // Extract clothing items and summary from structured recommendation
  const { clothing_items, summary } = recommendation;

  // Get local images instantly - now style-specific!
  const clothingImages = ClothingImageLibrary.getImages(clothing_items, clothingStyle);

  return (
    <View style={styles.container}>
      {/* AI-Generated Clothing Images - Now with Real Illustrations! */}
      {clothingImages.size > 0 && (
        <View style={styles.imagesGrid}>
          {Array.from(clothingImages.entries()).map(([item, imageSource], index) => (
            <ClothingImage
              key={item}
              imageSource={imageSource}
              label={item.charAt(0).toUpperCase() + item.slice(1)}
              index={index}
            />
          ))}
        </View>
      )}

      {/* AI-Generated Weather Summary */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>{summary}</Text>
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
  imageSource: ImageSourcePropType;
  label: string;
  index: number;
}

function ClothingImage({ imageSource, label, index }: ClothingImageProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Stagger the fade-in animation - triggers immediately with real PNG images!
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
          source={imageSource}
          style={styles.clothingImage}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.imageLabel}>{label}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
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
    width: '80%',
    height: '80%',
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
