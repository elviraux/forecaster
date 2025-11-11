import AsyncStorage from '@react-native-async-storage/async-storage';
import { ClothingRecommendationStructured } from '@/types/newell';

const TODAY_CACHE_KEY = '@picko_today_recommendation';
const TOMORROW_CACHE_KEY = '@picko_tomorrow_recommendation';
const CACHE_DURATION_MS = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

interface CachedRecommendation {
  data: ClothingRecommendationStructured;
  timestamp: number;
}

export class RecommendationCache {
  /**
   * Get cached recommendation for today
   * Returns null if cache is expired or doesn't exist
   */
  static async getTodayRecommendation(): Promise<ClothingRecommendationStructured | null> {
    return this.getCachedRecommendation(TODAY_CACHE_KEY);
  }

  /**
   * Get cached recommendation for tomorrow
   * Returns null if cache is expired or doesn't exist
   */
  static async getTomorrowRecommendation(): Promise<ClothingRecommendationStructured | null> {
    return this.getCachedRecommendation(TOMORROW_CACHE_KEY);
  }

  /**
   * Cache recommendation for today
   */
  static async setTodayRecommendation(
    recommendation: ClothingRecommendationStructured
  ): Promise<void> {
    return this.cacheRecommendation(TODAY_CACHE_KEY, recommendation);
  }

  /**
   * Cache recommendation for tomorrow
   */
  static async setTomorrowRecommendation(
    recommendation: ClothingRecommendationStructured
  ): Promise<void> {
    return this.cacheRecommendation(TOMORROW_CACHE_KEY, recommendation);
  }

  /**
   * Clear all cached recommendations
   */
  static async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([TODAY_CACHE_KEY, TOMORROW_CACHE_KEY]);
    } catch (error) {
      console.error('Error clearing recommendation cache:', error);
      throw error;
    }
  }

  /**
   * Clear today's cached recommendation
   */
  static async clearToday(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TODAY_CACHE_KEY);
    } catch (error) {
      console.error('Error clearing today cache:', error);
      throw error;
    }
  }

  /**
   * Clear tomorrow's cached recommendation
   */
  static async clearTomorrow(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TOMORROW_CACHE_KEY);
    } catch (error) {
      console.error('Error clearing tomorrow cache:', error);
      throw error;
    }
  }

  // Private helper methods

  private static async getCachedRecommendation(
    key: string
  ): Promise<ClothingRecommendationStructured | null> {
    try {
      const cachedJson = await AsyncStorage.getItem(key);
      if (!cachedJson) {
        return null;
      }

      const cached: CachedRecommendation = JSON.parse(cachedJson);
      const now = Date.now();
      const age = now - cached.timestamp;

      // Check if cache is still valid (less than 12 hours old)
      if (age > CACHE_DURATION_MS) {
        // Cache expired, remove it
        await AsyncStorage.removeItem(key);
        return null;
      }

      return cached.data;
    } catch (error) {
      console.error(`Error reading cache for ${key}:`, error);
      return null;
    }
  }

  private static async cacheRecommendation(
    key: string,
    recommendation: ClothingRecommendationStructured
  ): Promise<void> {
    try {
      const cached: CachedRecommendation = {
        data: recommendation,
        timestamp: Date.now(),
      };
      const cachedJson = JSON.stringify(cached);
      await AsyncStorage.setItem(key, cachedJson);
    } catch (error) {
      console.error(`Error caching recommendation for ${key}:`, error);
      throw error;
    }
  }
}
