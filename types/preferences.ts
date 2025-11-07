export type ClothingStyle = 'boy' | 'girl' | 'neutral';

export interface UserPreferences {
  childAge: number;
  clothingStyle: ClothingStyle;
  hasCompletedSetup: boolean;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  childAge: 2,
  clothingStyle: 'neutral',
  hasCompletedSetup: false,
};
