import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface WeatherCardProps {
  title: string;
  children: React.ReactNode;
  style?: any;
}

export function WeatherCard({ title, children, style }: WeatherCardProps) {
  return (
    <View style={[styles.card, style]}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  );
}

interface WeatherDetailRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}

export function WeatherDetailRow({ icon, label, value }: WeatherDetailRowProps) {
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailLeft}>
        <Ionicons name={icon} size={20} color="#fff" />
        <Text style={styles.detailLabel}>{label}</Text>
      </View>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

interface TomorrowForecastCardProps {
  high: number;
  low: number;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  precipChance: number;
}

export function TomorrowForecastCard({
  high,
  low,
  description,
  icon,
  precipChance,
}: TomorrowForecastCardProps) {
  return (
    <WeatherCard title="Tomorrow's Forecast">
      <View style={styles.tomorrowContent}>
        <View style={styles.tomorrowLeft}>
          <Ionicons name={icon} size={64} color="#fff" />
          <Text style={styles.tomorrowDescription}>{description}</Text>
        </View>
        <View style={styles.tomorrowRight}>
          <Text style={styles.tomorrowTemp}>{high}°</Text>
          <Text style={styles.tomorrowTempLabel}>High</Text>
          <View style={styles.tomorrowDivider} />
          <Text style={styles.tomorrowTemp}>{low}°</Text>
          <Text style={styles.tomorrowTempLabel}>Low</Text>
          {precipChance > 0 && (
            <>
              <View style={styles.tomorrowDivider} />
              <View style={styles.precipRow}>
                <Ionicons name="water" size={16} color="#fff" />
                <Text style={styles.precipText}>{precipChance}%</Text>
              </View>
            </>
          )}
        </View>
      </View>
    </WeatherCard>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 15,
    color: '#fff',
    marginLeft: 10,
    fontWeight: '400',
  },
  detailValue: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '600',
  },
  tomorrowContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tomorrowLeft: {
    alignItems: 'center',
    flex: 1,
  },
  tomorrowDescription: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  tomorrowRight: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tomorrowTemp: {
    fontSize: 36,
    color: '#fff',
    fontWeight: '700',
  },
  tomorrowTempLabel: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '400',
    marginBottom: 8,
  },
  tomorrowDivider: {
    width: 40,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginVertical: 8,
  },
  precipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  precipText: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 6,
    fontWeight: '500',
  },
});
