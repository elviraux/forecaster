import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Dimensions,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ClothingStyle } from '@/types/preferences';
import { PreferencesStorage } from '@/services/preferencesStorage';
import { GlassStyleButton } from '@/components/GlassStyleButton';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { Colors } from '@/constants/theme';

const { height } = Dimensions.get('window');

interface WelcomeScreenProps {
  onComplete: () => void;
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [childAge, setChildAge] = useState('2');
  const [clothingStyle, setClothingStyle] = useState<ClothingStyle>('neutral');
  const [saving, setSaving] = useState(false);

  const handleAgeChange = (text: string) => {
    // Only allow numeric input
    const numericValue = text.replace(/[^0-9]/g, '');
    setChildAge(numericValue);
  };

  const handleDone = async () => {
    try {
      setSaving(true);
      const age = parseInt(childAge) || 2;
      // Validate age between 1-10
      const validatedAge = Math.max(1, Math.min(10, age));
      await PreferencesStorage.completeSetup(validatedAge, clothingStyle);
      onComplete();
    } catch (error) {
      console.error('Error saving preferences:', error);
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" />
      <AnimatedBackground condition="clear-day" />

      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/images/picko-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.subtitle}>
            AI that helps parents dress their little ones for the day
          </Text>
        </View>

        {/* Glass Style Buttons */}
        <View style={styles.styleButtonsContainer}>
          <GlassStyleButton
            style="boy"
            label="Boy"
            imageSource={require('@/assets/face-avatars/boy.png')}
            selected={clothingStyle === 'boy'}
            onPress={() => setClothingStyle('boy')}
            accentColor={Colors.accents.boy}
          />

          <GlassStyleButton
            style="girl"
            label="Girl"
            imageSource={require('@/assets/face-avatars/girl.png')}
            selected={clothingStyle === 'girl'}
            onPress={() => setClothingStyle('girl')}
            accentColor={Colors.accents.girl}
          />

          <GlassStyleButton
            style="neutral"
            label="Neutral"
            imageSource={require('@/assets/face-avatars/neutral.png')}
            selected={clothingStyle === 'neutral'}
            onPress={() => setClothingStyle('neutral')}
            accentColor={Colors.accents.neutral}
          />
        </View>

        {/* Age Input */}
        <View style={styles.ageInputContainer}>
          <Text style={styles.ageLabel}>Child&apos;s Age</Text>
          <TextInput
            style={styles.ageInput}
            value={childAge}
            onChangeText={handleAgeChange}
            keyboardType="number-pad"
            maxLength={2}
            placeholder="2"
            placeholderTextColor="rgba(255,255,255,0.5)"
            returnKeyType="done"
          />
          <Text style={styles.ageUnit}>years old</Text>
        </View>

        {/* Done Button */}
        <TouchableOpacity
          style={styles.doneButton}
          onPress={handleDone}
          disabled={saving || !childAge}
        >
          {saving ? (
            <ActivityIndicator color={Colors.sky.main} />
          ) : (
            <Text style={styles.doneButtonText}>Done</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Math.max(60, height * 0.08),
    paddingBottom: Math.max(40, height * 0.05),
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  logo: {
    width: 220,
    height: 80,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
    letterSpacing: 0.3,
    ...Colors.textShadows.medium,
  },
  styleButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 8,
  },
  ageInputContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  ageLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  ageInput: {
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    fontSize: 32,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    minWidth: 80,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  ageUnit: {
    fontSize: 15,
    fontWeight: '500',
    color: '#fff',
    marginTop: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  doneButton: {
    backgroundColor: Colors.sky.main,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.sky.medium,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  doneButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.inverse,
  },
});
