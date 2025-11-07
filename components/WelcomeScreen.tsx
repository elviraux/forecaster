import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ClothingStyle } from '@/types/preferences';
import { PreferencesStorage } from '@/services/preferencesStorage';

const { width, height } = Dimensions.get('window');
const CARD_SIZE = (width - 80) / 3;

interface WelcomeScreenProps {
  onComplete: () => void;
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
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

  const handleDone = async () => {
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
          <Text style={styles.heading}>
            Picko — the AI that helps parents dress their little ones for the day
          </Text>
        </View>

        {/* Style Cards */}
        <View style={styles.cardsContainer}>
          <TouchableOpacity
            style={[
              styles.card,
              clothingStyle === 'boy' && styles.cardSelected,
            ]}
            onPress={() => setClothingStyle('boy')}
            activeOpacity={0.8}
          >
            <View style={styles.cardImageContainer}>
              <Image
                source={require('@/assets/style-cards/boy.png')}
                style={styles.cardImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.cardLabelContainer}>
              <Text style={styles.cardLabel}>Boy</Text>
            </View>
            {clothingStyle === 'boy' && (
              <View style={styles.checkmark}>
                <Ionicons name="checkmark-circle" size={28} color="#667eea" />
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.card,
              clothingStyle === 'girl' && styles.cardSelected,
            ]}
            onPress={() => setClothingStyle('girl')}
            activeOpacity={0.8}
          >
            <View style={styles.cardImageContainer}>
              <Image
                source={require('@/assets/style-cards/girl.png')}
                style={styles.cardImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.cardLabelContainer}>
              <Text style={styles.cardLabel}>Girl</Text>
            </View>
            {clothingStyle === 'girl' && (
              <View style={styles.checkmark}>
                <Ionicons name="checkmark-circle" size={28} color="#f093fb" />
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.card,
              clothingStyle === 'neutral' && styles.cardSelected,
            ]}
            onPress={() => setClothingStyle('neutral')}
            activeOpacity={0.8}
          >
            <View style={styles.cardImageContainer}>
              <Image
                source={require('@/assets/style-cards/neutral.png')}
                style={styles.cardImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.cardLabelContainer}>
              <Text style={styles.cardLabel}>Neutral</Text>
            </View>
            {clothingStyle === 'neutral' && (
              <View style={styles.checkmark}>
                <Ionicons name="checkmark-circle" size={28} color="#764ba2" />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Age Selector */}
        <View style={styles.ageContainer}>
          <TouchableOpacity
            style={[styles.ageButton, childAge === 1 && styles.ageButtonDisabled]}
            onPress={decrementAge}
            disabled={childAge === 1}
          >
            <Ionicons
              name="remove"
              size={24}
              color={childAge === 1 ? 'rgba(255,255,255,0.3)' : '#fff'}
            />
          </TouchableOpacity>

          <Text style={styles.ageText}>
            {childAge} {childAge === 1 ? 'year' : 'years'} old
          </Text>

          <TouchableOpacity
            style={[styles.ageButton, childAge === 10 && styles.ageButtonDisabled]}
            onPress={incrementAge}
            disabled={childAge === 10}
          >
            <Ionicons
              name="add"
              size={24}
              color={childAge === 10 ? 'rgba(255,255,255,0.3)' : '#fff'}
            />
          </TouchableOpacity>
        </View>

        {/* Done Button */}
        <TouchableOpacity
          style={styles.doneButton}
          onPress={handleDone}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#667eea" />
          ) : (
            <Text style={styles.doneButtonText}>Done</Text>
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
    paddingTop: Math.max(60, height * 0.08),
    paddingBottom: Math.max(40, height * 0.05),
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 34,
    paddingHorizontal: 16,
    letterSpacing: 0.3,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  card: {
    width: CARD_SIZE,
    aspectRatio: 0.8,
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  cardSelected: {
    borderColor: '#fff',
    transform: [{ scale: 1.05 }],
  },
  cardImageContainer: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardLabelContainer: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    alignItems: 'center',
  },
  cardLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  ageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  ageButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ageButtonDisabled: {
    opacity: 0.4,
  },
  ageText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginHorizontal: 24,
    minWidth: 120,
    textAlign: 'center',
  },
  doneButton: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  doneButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#667eea',
  },
});
