export interface SavedLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  isCurrentLocation?: boolean;
}

export interface CitySearchResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string; // State/region
  population?: number;
}
