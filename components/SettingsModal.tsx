import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { ClothingStyle } from '@/types/preferences';
import { PreferencesStorage } from '@/services/preferencesStorage';
import { GlassStyleButton } from '@/components/GlassStyleButton';
import { Colors } from '@/constants/theme';

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
              <ActivityIndicator size="large" color={Colors.sky.main} />
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
                      color={childAge === 1 ? '#ccc' : Colors.sky.main}
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
                      color={childAge === 10 ? '#ccc' : Colors.sky.main}
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
    maxHeight: '80%',
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
    marginBottom: 28,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  styleButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
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
    marginTop: 12,
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
    backgroundColor: Colors.sky.main,
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
