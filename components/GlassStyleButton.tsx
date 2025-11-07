import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { ClothingStyle } from '@/types/preferences';

interface GlassStyleButtonProps {
  style: ClothingStyle;
  label: string;
  imageSource: ImageSourcePropType;
  selected: boolean;
  onPress: () => void;
  accentColor: string;
}

export function GlassStyleButton({
  style,
  label,
  imageSource,
  selected,
  onPress,
  accentColor,
}: GlassStyleButtonProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.glassContainer,
          selected && styles.glassContainerSelected,
          selected && { borderColor: accentColor, shadowColor: accentColor },
        ]}
      >
        <BlurView intensity={20} tint="light" style={styles.blurView}>
          <View style={styles.imageContainer}>
            <Image
              source={imageSource}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        </BlurView>

        {/* Selection ring */}
        {selected && (
          <View
            style={[
              styles.selectionRing,
              { borderColor: accentColor, shadowColor: accentColor },
            ]}
          />
        )}
      </View>

      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const BUTTON_SIZE = 100;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  glassContainer: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  glassContainerSelected: {
    borderWidth: 3,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  blurView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '85%',
    height: '85%',
    borderRadius: BUTTON_SIZE / 2,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  selectionRing: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: (BUTTON_SIZE + 8) / 2,
    borderWidth: 3,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 10,
  },
  label: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
