import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';

export type DayOption = 'today' | 'tomorrow';

interface DaySelectorProps {
  selectedDay: DayOption;
  onSelectDay: (day: DayOption) => void;
}

export function DaySelector({ selectedDay, onSelectDay }: DaySelectorProps) {
  return (
    <View style={styles.container}>
      <BlurView intensity={30} style={styles.blurContainer} tint="light">
        <View style={styles.segmentedControl}>
          <TouchableOpacity
            style={[
              styles.segment,
              selectedDay === 'today' && styles.segmentActive,
            ]}
            onPress={() => onSelectDay('today')}
            activeOpacity={0.7}
          >
            {selectedDay === 'today' && (
              <BlurView intensity={80} style={styles.activeBlur} tint="light" />
            )}
            <Text
              style={[
                styles.segmentText,
                selectedDay === 'today' && styles.segmentTextActive,
              ]}
            >
              Today
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.segment,
              selectedDay === 'tomorrow' && styles.segmentActive,
            ]}
            onPress={() => onSelectDay('tomorrow')}
            activeOpacity={0.7}
          >
            {selectedDay === 'tomorrow' && (
              <BlurView intensity={80} style={styles.activeBlur} tint="light" />
            )}
            <Text
              style={[
                styles.segmentText,
                selectedDay === 'tomorrow' && styles.segmentTextActive,
              ]}
            >
              Tomorrow
            </Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 16,
  },
  blurContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  segmentedControl: {
    flexDirection: 'row',
    padding: 4,
  },
  segment: {
    paddingVertical: 10,
    paddingHorizontal: 32,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 12,
  },
  segmentActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activeBlur: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  segmentText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    zIndex: 1,
  },
  segmentTextActive: {
    color: 'rgba(0, 0, 0, 0.8)',
    fontWeight: '700',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
  },
});
