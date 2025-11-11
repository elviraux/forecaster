import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPreferences, DEFAULT_PREFERENCES } from '@/types/preferences';

const PREFERENCES_KEY = '@user_preferences';

export class PreferencesStorage {
  /**
   * Get saved user preferences
   */
  static async getPreferences(): Promise<UserPreferences> {
    try {
      const preferencesJson = await AsyncStorage.getItem(PREFERENCES_KEY);

      if (preferencesJson) {
        return JSON.parse(preferencesJson);
      }

      return DEFAULT_PREFERENCES;
    } catch (error) {
      console.error('Error loading preferences:', error);
      return DEFAULT_PREFERENCES;
    }
  }

  /**
   * Save user preferences
   */
  static async savePreferences(preferences: UserPreferences): Promise<void> {
    try {
      const preferencesJson = JSON.stringify(preferences);
      await AsyncStorage.setItem(PREFERENCES_KEY, preferencesJson);
    } catch (error) {
      console.error('Error saving preferences:', error);
      throw error;
    }
  }

  /**
   * Update only specific preference fields
   */
  static async updatePreferences(
    updates: Partial<UserPreferences>
  ): Promise<UserPreferences> {
    try {
      const current = await this.getPreferences();
      const updated = { ...current, ...updates };
      await this.savePreferences(updated);
      return updated;
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  }

  /**
   * Mark setup as completed
   */
  static async completeSetup(
    childAge: number,
    clothingStyle: 'boy' | 'girl' | 'neutral'
  ): Promise<void> {
    await this.savePreferences({
      childAge,
      clothingStyle,
      hasCompletedSetup: true,
    });
  }

  /**
   * Reset preferences (for testing)
   */
  static async resetPreferences(): Promise<void> {
    try {
      await AsyncStorage.removeItem(PREFERENCES_KEY);
    } catch (error) {
      console.error('Error resetting preferences:', error);
      throw error;
    }
  }
}
