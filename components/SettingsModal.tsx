import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Alert,
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
  onReset: () => void;
}

export function SettingsModal({ visible, onClose, onSave, onReset }: SettingsModalProps) {
  const [childAge, setChildAge] = useState('2');
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
      setChildAge(prefs.childAge.toString());
      setClothingStyle(prefs.clothingStyle);
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAgeChange = (text: string) => {
    // Only allow numeric input
    const numericValue = text.replace(/[^0-9]/g, '');
    setChildAge(numericValue);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const age = parseInt(childAge) || 2;
      // Validate age between 1-10
      const validatedAge = Math.max(1, Math.min(10, age));
      await PreferencesStorage.updatePreferences({
        childAge: validatedAge,
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

  const handleResetProfile = () => {
    Alert.alert(
      'Are you sure?',
      "This will clear the current child's age and style. You will be returned to the welcome screen to set up a new profile.",
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await PreferencesStorage.resetPreferences();
              onClose();
              onReset();
            } catch (error) {
              console.error('Error resetting profile:', error);
            }
          },
        },
      ]
    );
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

                {/* Reset Profile Link */}
                <TouchableOpacity
                  style={styles.resetLink}
                  onPress={handleResetProfile}
                >
                  <Text style={styles.resetLinkText}>Reset Child&apos;s Profile</Text>
                </TouchableOpacity>
              </View>

              {/* Age Input */}
              <View style={styles.section}>
                <Text style={styles.label}>Child&apos;s Age</Text>
                <View style={styles.ageInputContainer}>
                  <TextInput
                    style={styles.ageInput}
                    value={childAge}
                    onChangeText={handleAgeChange}
                    keyboardType="number-pad"
                    maxLength={2}
                    placeholder="2"
                    placeholderTextColor="#ccc"
                    returnKeyType="done"
                  />
                  <Text style={styles.ageUnit}>years old</Text>
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
  resetLink: {
    marginTop: 20,
    alignItems: 'center',
    paddingVertical: 8,
  },
  resetLinkText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.status.error,
    textDecorationLine: 'underline',
  },
  ageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 12,
  },
  ageInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    fontSize: 24,
    fontWeight: '600',
    color: Colors.sky.main,
    textAlign: 'center',
    minWidth: 70,
    borderWidth: 2,
    borderColor: Colors.ui.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  ageUnit: {
    fontSize: 15,
    fontWeight: '500',
    color: '#666',
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
