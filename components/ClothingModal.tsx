import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { NewellService } from '@/services/newellService';
import { Colors } from '@/constants/theme';

interface ClothingModalProps {
  visible: boolean;
  onClose: () => void;
  recommendation: string | null;
  loading: boolean;
}

export function ClothingModal({
  visible,
  onClose,
  recommendation,
  loading,
}: ClothingModalProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0);
      fadeAnim.setValue(0);
    }
  }, [visible, scaleAnim, fadeAnim]);

  const clothingItems = recommendation
    ? NewellService.parseClothingItems(recommendation)
    : [];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <BlurView intensity={40} style={StyleSheet.absoluteFillObject} />

        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerIcon}>
                <Ionicons name="shirt" size={28} color={Colors.sky.main} />
              </View>
              <Text style={styles.headerTitle}>Toddler Outfit Suggestion</Text>
              <TouchableOpacity
                onPress={onClose}
                style={styles.closeButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={28} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView
              style={styles.contentScroll}
              showsVerticalScrollIndicator={false}
            >
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={Colors.sky.main} />
                  <Text style={styles.loadingText}>
                    Getting AI recommendations...
                  </Text>
                </View>
              ) : recommendation ? (
                <>
                  <Text style={styles.recommendationText}>{recommendation}</Text>

                  {clothingItems.length > 0 && (
                    <View style={styles.clothingItems}>
                      <Text style={styles.itemsTitle}>Suggested Items:</Text>
                      <View style={styles.itemsGrid}>
                        {clothingItems.map((item, index) => (
                          <View key={index} style={styles.clothingItem}>
                            <View style={styles.itemIconContainer}>
                              <Ionicons
                                name={NewellService.getClothingIcon(
                                  item
                                ) as keyof typeof Ionicons.glyphMap}
                                size={24}
                                color={Colors.sky.main}
                              />
                            </View>
                            <Text style={styles.itemText}>
                              {item.charAt(0).toUpperCase() + item.slice(1)}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </>
              ) : (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={48} color="#FF6B6B" />
                  <Text style={styles.errorText}>
                    Unable to generate recommendation. Please try again.
                  </Text>
                </View>
              )}
            </ScrollView>

            {/* Footer */}
            <TouchableOpacity style={styles.doneButton} onPress={onClose}>
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.ui.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginLeft: 12,
  },
  closeButton: {
    padding: 4,
  },
  contentScroll: {
    maxHeight: 400,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  recommendationText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    padding: 20,
  },
  clothingItems: {
    padding: 20,
    paddingTop: 0,
  },
  itemsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  clothingItem: {
    alignItems: 'center',
    margin: 8,
    minWidth: 80,
  },
  itemIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.ui.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  itemText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  errorContainer: {
    padding: 40,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
  },
  doneButton: {
    margin: 20,
    marginTop: 0,
    backgroundColor: Colors.sky.main,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
