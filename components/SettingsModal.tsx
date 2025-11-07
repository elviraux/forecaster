import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { ClothingStyle } from '@/types/preferences';
import { PreferencesStorage } from '@/services/preferencesStorage';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 120) / 3;

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function SettingsModal({ visible, onClose, onSave }: SettingsModalProps) {
  const [childAge, setChildAge] = useState(2);
  const [clothingStyle, setClothingStyle] = useState<ClothingStyle>('neutral');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      loadCurrentPreferences();
    }
  }, [visible]);

  const loadCurrentPreferences = async () => {
    try {
      setLoading(true);
      const prefs = await PreferencesStorage.getPreferences();
      setChildAge(prefs.childAge);
      setClothingStyle(prefs.clothingStyle);
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setLoading(false);
    }
  };

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
      await PreferencesStorage.updatePreferences({
        childAge,
        clothingStyle,
      });
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <BlurView intensity={80} style={StyleSheet.absoluteFillObject} tint="dark" />

        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Settings</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#667eea" />
            </View>
          ) : (
            <ScrollView
              style={styles.scrollContainer}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Style Selector */}
              <View style={styles.section}>
                <Text style={styles.label}>Clothing Style</Text>
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
                        <Ionicons name="checkmark-circle" size={22} color="#667eea" />
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
                        <Ionicons name="checkmark-circle" size={22} color="#f093fb" />
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
                        <Ionicons name="checkmark-circle" size={22} color="#764ba2" />
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Age Selector */}
              <View style={styles.section}>
                <Text style={styles.label}>Child&apos;s Age</Text>
                <View style={styles.ageContainer}>
                  <TouchableOpacity
                    style={[
                      styles.ageButton,
                      childAge === 1 && styles.ageButtonDisabled,
                    ]}
                    onPress={decrementAge}
                    disabled={childAge === 1}
                  >
                    <Ionicons
                      name="remove"
                      size={20}
                      color={childAge === 1 ? '#ccc' : '#667eea'}
                    />
                  </TouchableOpacity>

                  <Text style={styles.ageText}>
                    {childAge} {childAge === 1 ? 'year' : 'years'} old
                  </Text>

                  <TouchableOpacity
                    style={[
                      styles.ageButton,
                      childAge === 10 && styles.ageButtonDisabled,
                    ]}
                    onPress={incrementAge}
                    disabled={childAge === 10}
                  >
                    <Ionicons
                      name="add"
                      size={20}
                      color={childAge === 10 ? '#ccc' : '#667eea'}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={onClose}
                  disabled={saving}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.saveButtonText}>Save</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '85%',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    paddingVertical: 80,
    alignItems: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 8,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    width: CARD_SIZE,
    aspectRatio: 0.8,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  cardSelected: {
    borderColor: '#667eea',
    borderWidth: 3,
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
    paddingVertical: 8,
    alignItems: 'center',
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
  },
  checkmark: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#fff',
    borderRadius: 11,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  ageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  ageButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  ageButtonDisabled: {
    opacity: 0.4,
  },
  ageText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 20,
    minWidth: 100,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#667eea',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
