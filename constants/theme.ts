/**
 * Sky Light Blue Theme - Color System
 * Primary theme color: Sky Light Blue (#87CEEB)
 */

export const Colors = {
  // Primary Sky Blue Palette
  sky: {
    lightest: '#E0F4FF',   // Very light sky blue
    lighter: '#B8E6FF',    // Light sky blue
    light: '#87CEEB',      // Classic sky blue (primary)
    main: '#5FB9E8',       // Main sky blue
    medium: '#4A9FCC',     // Medium sky blue
    dark: '#3581A8',       // Dark sky blue
    darker: '#2A6B8E',     // Darker sky blue
  },

  // Accent Colors (harmonizing with sky blue)
  accents: {
    boy: '#5FB9E8',        // Sky blue for boy style
    girl: '#D4A5E8',       // Soft lavender-pink (harmonizes with sky)
    neutral: '#F9D67A',    // Warm golden yellow (complements sky)
  },

  // Weather-based gradients (all incorporate sky blue theme)
  weather: {
    clearDay: ['#87CEEB', '#B8E6FF', '#E0F4FF'],           // Sky blue gradient
    clearNight: ['#2A4A6E', '#3D6B99', '#5FB9E8'],        // Night sky to sky blue
    cloudy: ['#A8CFDF', '#C5DFE8', '#E0F4FF'],            // Cloudy sky blues
    rainy: ['#5A8FA8', '#7AAFCA', '#A8CFDF'],             // Rainy sky blues
    snowy: ['#D4E8F0', '#E8F4F8', '#F5FAFC'],             // Snowy sky whites
    stormy: ['#4A6B7A', '#608AA0', '#7AAFCA'],            // Stormy sky blues
    foggy: ['#B8D4E0', '#D0E5ED', '#E8F4F8'],             // Foggy sky blues
  },

  // UI Elements
  ui: {
    background: '#E0F4FF',         // Very light sky blue background
    surface: '#FFFFFF',            // White surface
    surfaceLight: '#F5FAFC',       // Very light blue-white
    border: 'rgba(95, 185, 232, 0.2)',     // Sky blue border
    borderLight: 'rgba(135, 206, 235, 0.15)', // Lighter sky border
    overlay: 'rgba(135, 206, 235, 0.1)',   // Sky blue overlay
    glass: 'rgba(255, 255, 255, 0.35)',    // Glass effect (more opaque on sky)
    glassBorder: 'rgba(255, 255, 255, 0.6)', // Glass border
  },

  // Text Colors
  text: {
    primary: '#1A3D52',            // Dark blue-grey (excellent contrast)
    secondary: '#2A5670',          // Medium blue-grey
    tertiary: '#5A8FA8',           // Light blue-grey
    inverse: '#FFFFFF',            // White text
    link: '#3581A8',               // Sky blue link
  },

  // Status Colors (sky-themed)
  status: {
    success: '#4EC9B0',            // Teal-cyan (harmonizes)
    warning: '#F9D67A',            // Golden yellow
    error: '#E88A8A',              // Soft coral red
    info: '#5FB9E8',               // Sky blue
  },

  // Shadows (subtle blue-tinted shadows)
  shadows: {
    light: 'rgba(95, 185, 232, 0.1)',
    medium: 'rgba(95, 185, 232, 0.2)',
    strong: 'rgba(53, 129, 168, 0.3)',
  },
};

/**
 * Get weather-specific gradient colors
 */
export function getWeatherGradient(condition: string): string[] {
  const gradients: Record<string, string[]> = {
    'clear-day': Colors.weather.clearDay,
    'clear-night': Colors.weather.clearNight,
    'cloudy': Colors.weather.cloudy,
    'rainy': Colors.weather.rainy,
    'snowy': Colors.weather.snowy,
    'stormy': Colors.weather.stormy,
    'foggy': Colors.weather.foggy,
  };

  return gradients[condition] || Colors.weather.clearDay;
}

/**
 * Get style-specific accent color
 */
export function getStyleAccentColor(style: 'boy' | 'girl' | 'neutral'): string {
  return Colors.accents[style];
}
