import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SavedLocation, CitySearchResult } from '@/types/location';
import { LocationStorage } from '@/services/locationStorage';
import { WeatherService } from '@/services/weatherService';

export default function ManageLocations() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CitySearchResult[]>([]);
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedLocations();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        performSearch();
      } else {
        setSearchResults([]);
      }
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const loadSavedLocations = async () => {
    try {
      const locations = await LocationStorage.getSavedLocations();
      setSavedLocations(locations);
    } catch (error) {
      console.error('Error loading locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async () => {
    try {
      setSearching(true);
      const results = await WeatherService.searchCities(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching cities:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleAddLocation = async (city: CitySearchResult) => {
    try {
      const newLocation: SavedLocation = {
        id: `${city.latitude}-${city.longitude}`,
        name: `${city.name}, ${city.country}`,
        latitude: city.latitude,
        longitude: city.longitude,
        country: city.country,
        isCurrentLocation: false,
      };

      await LocationStorage.addLocation(newLocation);
      await loadSavedLocations();
      setSearchQuery('');
      setSearchResults([]);

      Alert.alert('Success', `${city.name} has been added to your locations.`);
    } catch (error) {
      console.error('Error adding location:', error);
      Alert.alert('Error', 'Failed to add location. Please try again.');
    }
  };

  const handleDeleteLocation = (location: SavedLocation) => {
    Alert.alert(
      'Delete Location',
      `Are you sure you want to remove ${location.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await LocationStorage.deleteLocation(location.id);
              await loadSavedLocations();
            } catch (error) {
              console.error('Error deleting location:', error);
              Alert.alert('Error', 'Failed to delete location.');
            }
          },
        },
      ]
    );
  };

  const renderSearchResult = ({ item }: { item: CitySearchResult }) => {
    const isAlreadyAdded = savedLocations.some(
      (loc) => loc.latitude === item.latitude && loc.longitude === item.longitude
    );

    return (
      <TouchableOpacity
        style={styles.searchResultItem}
        onPress={() => !isAlreadyAdded && handleAddLocation(item)}
        disabled={isAlreadyAdded}
      >
        <View style={styles.searchResultLeft}>
          <Ionicons
            name="location"
            size={20}
            color={isAlreadyAdded ? '#999' : '#4A90E2'}
          />
          <View style={styles.searchResultText}>
            <Text
              style={[
                styles.searchResultName,
                isAlreadyAdded && styles.disabledText,
              ]}
            >
              {item.name}
            </Text>
            <Text style={styles.searchResultCountry}>
              {item.admin1 ? `${item.admin1}, ${item.country}` : item.country}
            </Text>
          </View>
        </View>
        {isAlreadyAdded ? (
          <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
        ) : (
          <Ionicons name="add-circle-outline" size={24} color="#4A90E2" />
        )}
      </TouchableOpacity>
    );
  };

  const renderSavedLocation = ({ item }: { item: SavedLocation }) => {
    if (item.isCurrentLocation) {
      return (
        <View style={styles.savedLocationItem}>
          <View style={styles.savedLocationLeft}>
            <Ionicons name="navigate" size={20} color="#4A90E2" />
            <View style={styles.savedLocationText}>
              <Text style={styles.savedLocationName}>{item.name}</Text>
              <Text style={styles.currentLocationBadge}>Current Location</Text>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.savedLocationItem}>
        <View style={styles.savedLocationLeft}>
          <Ionicons name="location" size={20} color="#666" />
          <Text style={styles.savedLocationName}>{item.name}</Text>
        </View>
        <TouchableOpacity
          onPress={() => handleDeleteLocation(item)}
          style={styles.deleteButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4A90E2', '#87CEEB']}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Locations</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a city..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="words"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Search Results or Saved Locations */}
      {searchQuery.trim().length >= 2 ? (
        <View style={styles.content}>
          {searching ? (
            <View style={styles.centerContent}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.loadingText}>Searching...</Text>
            </View>
          ) : searchResults.length > 0 ? (
            <FlatList
              data={searchResults}
              renderItem={renderSearchResult}
              keyExtractor={(item) => item.id.toString()}
              style={styles.resultsList}
              contentContainerStyle={styles.resultsContent}
            />
          ) : (
            <View style={styles.centerContent}>
              <Ionicons name="search-outline" size={48} color="rgba(255,255,255,0.5)" />
              <Text style={styles.emptyText}>No cities found</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Saved Locations</Text>
          {loading ? (
            <View style={styles.centerContent}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          ) : savedLocations.length > 0 ? (
            <FlatList
              data={savedLocations}
              renderItem={renderSavedLocation}
              keyExtractor={(item) => item.id}
              style={styles.resultsList}
              contentContainerStyle={styles.resultsContent}
            />
          ) : (
            <View style={styles.centerContent}>
              <Ionicons name="location-outline" size={48} color="rgba(255,255,255,0.5)" />
              <Text style={styles.emptyText}>No saved locations yet</Text>
              <Text style={styles.emptySubtext}>
                Search for a city above to add it
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  headerSpacer: {
    width: 40,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  content: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  resultsList: {
    flex: 1,
  },
  resultsContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchResultLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  searchResultText: {
    marginLeft: 12,
    flex: 1,
  },
  searchResultName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  searchResultCountry: {
    fontSize: 13,
    color: '#666',
  },
  disabledText: {
    color: '#999',
  },
  savedLocationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  savedLocationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  savedLocationText: {
    marginLeft: 12,
    flex: 1,
  },
  savedLocationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 12,
  },
  currentLocationBadge: {
    fontSize: 12,
    color: '#4A90E2',
    fontWeight: '500',
    marginTop: 2,
  },
  deleteButton: {
    padding: 8,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#fff',
    marginTop: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});
