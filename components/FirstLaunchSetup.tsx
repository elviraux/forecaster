import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ClothingStyle } from '@/types/preferences';
import { PreferencesStorage } from '@/services/preferencesStorage';

interface FirstLaunchSetupProps {
  onComplete: () => void;
}

export function FirstLaunchSetup({ onComplete }: FirstLaunchSetupProps) {
  const [childAge, setChildAge] = useState(2);
  const [clothingStyle, setClothingStyle] = useState<ClothingStyle>('neutral');
  const [saving, setSaving] = useState(false);

  const incrementAge = () => {
    if (childAge < 10) {
      setChildAge(childAge + 1);
    }
  };

  const decrementAge = () => {
    if (childAge > 1) {
      setChildAge(childAge - 1);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await PreferencesStorage.completeSetup(childAge, clothingStyle);
      onComplete();
    } catch (error) {
      console.error('Error saving preferences:', error);
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="shirt-outline" size={64} color="#fff" />
          <Text style={styles.title}>Personalize Your Suggestions</Text>
          <Text style={styles.subtitle}>
            Help us provide the best clothing recommendations for your child
          </Text>
        </View>

        {/* Age Selector */}
        <View style={styles.section}>
          <Text style={styles.label}>Child&apos;s Age</Text>
          <View style={styles.ageSelector}>
            <TouchableOpacity
              style={[styles.ageButton, childAge === 1 && styles.ageButtonDisabled]}
              onPress={decrementAge}
              disabled={childAge === 1}
            >
              <Ionicons
                name="remove"
                size={28}
                color={childAge === 1 ? 'rgba(255,255,255,0.3)' : '#fff'}
              />
            </TouchableOpacity>

            <View style={styles.ageDisplay}>
              <Text style={styles.ageNumber}>{childAge}</Text>
              <Text style={styles.ageLabel}>{childAge === 1 ? 'year' : 'years'}</Text>
            </View>

            <TouchableOpacity
              style={[styles.ageButton, childAge === 10 && styles.ageButtonDisabled]}
              onPress={incrementAge}
              disabled={childAge === 10}
            >
              <Ionicons
                name="add"
                size={28}
                color={childAge === 10 ? 'rgba(255,255,255,0.3)' : '#fff'}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Style Selector */}
        <View style={styles.section}>
          <Text style={styles.label}>Clothing Style Preference</Text>
          <View style={styles.styleSelector}>
            <TouchableOpacity
              style={[
                styles.styleButton,
                clothingStyle === 'boy' && styles.styleButtonSelected,
              ]}
              onPress={() => setClothingStyle('boy')}
            >
              <Ionicons
                name="male"
                size={32}
                color={clothingStyle === 'boy' ? '#667eea' : '#fff'}
              />
              <Text
                style={[
                  styles.styleButtonText,
                  clothingStyle === 'boy' && styles.styleButtonTextSelected,
                ]}
              >
                Boy
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.styleButton,
                clothingStyle === 'girl' && styles.styleButtonSelected,
              ]}
              onPress={() => setClothingStyle('girl')}
            >
              <Ionicons
                name="female"
                size={32}
                color={clothingStyle === 'girl' ? '#f093fb' : '#fff'}
              />
              <Text
                style={[
                  styles.styleButtonText,
                  clothingStyle === 'girl' && styles.styleButtonTextSelected,
                ]}
              >
                Girl
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.styleButton,
                clothingStyle === 'neutral' && styles.styleButtonSelected,
              ]}
              onPress={() => setClothingStyle('neutral')}
            >
              <Ionicons
                name="people"
                size={32}
                color={clothingStyle === 'neutral' ? '#764ba2' : '#fff'}
              />
              <Text
                style={[
                  styles.styleButtonText,
                  clothingStyle === 'neutral' && styles.styleButtonTextSelected,
                ]}
              >
                Neutral
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#667eea" />
          ) : (
            <>
              <Text style={styles.saveButtonText}>Save & Continue</Text>
              <Ionicons name="arrow-forward" size={24} color="#667eea" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  ageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 20,
  },
  ageButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ageButtonDisabled: {
    opacity: 0.4,
  },
  ageDisplay: {
    alignItems: 'center',
    marginHorizontal: 40,
  },
  ageNumber: {
    fontSize: 64,
    fontWeight: '200',
    color: '#fff',
    letterSpacing: -2,
  },
  ageLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
    marginTop: -8,
  },
  styleSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  styleButton: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  styleButtonSelected: {
    backgroundColor: '#fff',
    borderColor: 'rgba(255,255,255,0.5)',
  },
  styleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginTop: 8,
  },
  styleButtonTextSelected: {
    color: '#764ba2',
  },
  saveButton: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#667eea',
    marginRight: 8,
  },
});
