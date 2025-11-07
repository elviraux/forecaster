import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { ClothingStyle } from '@/types/preferences';
import { PreferencesStorage } from '@/services/preferencesStorage';

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
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#667eea" />
            </View>
          ) : (
            <>
              {/* Age Selector */}
              <View style={styles.section}>
                <Text style={styles.label}>Child&apos;s Age</Text>
                <View style={styles.ageSelector}>
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
                      size={24}
                      color={childAge === 1 ? '#ccc' : '#667eea'}
                    />
                  </TouchableOpacity>

                  <View style={styles.ageDisplay}>
                    <Text style={styles.ageNumber}>{childAge}</Text>
                    <Text style={styles.ageLabel}>
                      {childAge === 1 ? 'year' : 'years'}
                    </Text>
                  </View>

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
                      size={24}
                      color={childAge === 10 ? '#ccc' : '#667eea'}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Style Selector */}
              <View style={styles.section}>
                <Text style={styles.label}>Clothing Style</Text>
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
                      size={28}
                      color={clothingStyle === 'boy' ? '#667eea' : '#999'}
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
                      size={28}
                      color={clothingStyle === 'girl' ? '#f093fb' : '#999'}
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
                      size={28}
                      color={clothingStyle === 'neutral' ? '#764ba2' : '#999'}
                    />
                    <Text
                      style={[
                        styles.styleButtonText,
                        clothingStyle === 'neutral' &&
                          styles.styleButtonTextSelected,
                      ]}
                    >
                      Neutral
                    </Text>
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
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
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
    maxWidth: 400,
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
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  ageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 16,
  },
  ageButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  ageButtonDisabled: {
    opacity: 0.4,
  },
  ageDisplay: {
    alignItems: 'center',
    marginHorizontal: 32,
  },
  ageNumber: {
    fontSize: 48,
    fontWeight: '300',
    color: '#333',
    letterSpacing: -1,
  },
  ageLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginTop: -4,
  },
  styleSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  styleButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  styleButtonSelected: {
    backgroundColor: '#fff',
    borderColor: '#667eea',
  },
  styleButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#999',
    marginTop: 6,
  },
  styleButtonTextSelected: {
    color: '#333',
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
