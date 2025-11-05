import AsyncStorage from '@react-native-async-storage/async-storage';
import { SavedLocation } from '@/types/location';

const STORAGE_KEY = '@forecaster_locations';

export class LocationStorage {
  static async getSavedLocations(): Promise<SavedLocation[]> {
    try {
      const locationsJson = await AsyncStorage.getItem(STORAGE_KEY);
      if (locationsJson) {
        return JSON.parse(locationsJson);
      }
      return [];
    } catch (error) {
      console.error('Error loading saved locations:', error);
      return [];
    }
  }

  static async saveLocations(locations: SavedLocation[]): Promise<void> {
    try {
      const locationsJson = JSON.stringify(locations);
      await AsyncStorage.setItem(STORAGE_KEY, locationsJson);
    } catch (error) {
      console.error('Error saving locations:', error);
      throw error;
    }
  }

  static async addLocation(location: SavedLocation): Promise<void> {
    try {
      const locations = await this.getSavedLocations();

      // Check if location already exists
      const exists = locations.some(
        (loc) =>
          loc.latitude === location.latitude &&
          loc.longitude === location.longitude
      );

      if (!exists) {
        locations.push(location);
        await this.saveLocations(locations);
      }
    } catch (error) {
      console.error('Error adding location:', error);
      throw error;
    }
  }

  static async deleteLocation(locationId: string): Promise<void> {
    try {
      const locations = await this.getSavedLocations();
      const filtered = locations.filter((loc) => loc.id !== locationId);
      await this.saveLocations(filtered);
    } catch (error) {
      console.error('Error deleting location:', error);
      throw error;
    }
  }

  static async reorderLocations(
    reorderedLocations: SavedLocation[]
  ): Promise<void> {
    try {
      await this.saveLocations(reorderedLocations);
    } catch (error) {
      console.error('Error reordering locations:', error);
      throw error;
    }
  }

  static async clearAllLocations(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing locations:', error);
      throw error;
    }
  }
}
