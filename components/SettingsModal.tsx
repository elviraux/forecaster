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
        {/* Subtle dark overlay for contrast */}
        <View style={styles.darkOverlay} />

        <View style={styles.modalContent}>
          {/* Header with glass effect */}
          <BlurView intensity={100} tint="light" style={styles.headerBlur}>
            <View style={styles.header}>
              <Text style={styles.title}>Settings</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </BlurView>

          {loading ? (
            <BlurView intensity={80} tint="light" style={styles.loadingBlur}>
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#fff" />
              </View>
            </BlurView>
          ) : (
            <ScrollView
              style={styles.scrollContainer}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Style Selector */}
              <BlurView intensity={90} tint="light" style={styles.sectionBlur}>
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
              </BlurView>

              {/* Age Input */}
              <BlurView intensity={90} tint="light" style={styles.sectionBlur}>
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
              </BlurView>

              {/* Action Buttons */}
              <BlurView intensity={90} tint="light" style={styles.actionsBlur}>
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
              </BlurView>
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
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContent: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  headerBlur: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingBlur: {
    padding: 24,
    borderRadius: 24,
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  scrollContainer: {
    maxHeight: 500,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 16,
  },
  sectionBlur: {
    borderRadius: 20,
    padding: 20,
    overflow: 'hidden',
  },
  section: {
    gap: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  styleButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  resetLink: {
    marginTop: 12,
    alignItems: 'center',
    paddingVertical: 8,
  },
  resetLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFB8B8',
    textDecorationLine: 'underline',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  ageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 12,
  },
  ageInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    fontSize: 28,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    minWidth: 80,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  ageUnit: {
    fontSize: 15,
    fontWeight: '500',
    color: '#fff',
    opacity: 0.9,
  },
  actionsBlur: {
    borderRadius: 20,
    padding: 20,
    overflow: 'hidden',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  saveButton: {
    flex: 1,
    backgroundColor: 'rgba(95, 185, 232, 0.9)',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
