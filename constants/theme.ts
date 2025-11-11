/**
 * Picko App - Precise Color Palette
 * Professional, high-contrast color system
 */

export const Colors = {
  // Primary Backgrounds
  backgrounds: {
    primary: '#BEE3F8',      // Main light blue background
    secondary: '#E3F2FD',    // Settings/modal background
    white: '#FFFFFF',        // Pure white
  },

  // Primary Sky Blue Palette (for gradients and UI accents)
  sky: {
    lightest: '#E0F4FF',   // Very light sky blue
    lighter: '#B8E6FF',    // Light sky blue
    light: '#87CEEB',      // Classic sky blue (primary)
    main: '#2196F3',       // Bright blue (primary actions)
    medium: '#1565C0',     // Info blue
    dark: '#0D47A1',       // Deep blue (temperature)
    darker: '#2A6B8E',     // Darker sky blue
  },

  // Accent Colors
  accents: {
    boy: '#2196F3',        // Bright blue for boy style
    girl: '#D4A5E8',       // Soft lavender-pink (harmonizes with sky)
    neutral: '#FFC107',    // Rich gold (selection highlight)
  },

  // Weather-based gradients (using new primary background base)
  weather: {
    clearDay: ['#BEE3F8', '#87CEEB', '#B8E6FF'],           // Light blue gradient
    clearNight: ['#2A4A6E', '#3D6B99', '#1565C0'],        // Night sky blues
    cloudy: ['#A8CFDF', '#BEE3F8', '#E0F4FF'],            // Cloudy blues
    rainy: ['#5A8FA8', '#7AAFCA', '#BEE3F8'],             // Rainy blues
    snowy: ['#D4E8F0', '#E8F4F8', '#F5FAFC'],             // Snowy whites
    stormy: ['#4A6B7A', '#608AA0', '#7AAFCA'],            // Stormy blues
    foggy: ['#B8D4E0', '#BEE3F8', '#E8F4F8'],             // Foggy blues
  },

  // UI Elements
  ui: {
    background: '#BEE3F8',         // Primary background
    surface: '#FFFFFF',            // White surface
    surfaceLight: '#E3F2FD',       // Secondary background
    border: 'rgba(33, 150, 243, 0.2)',     // Blue border
    borderLight: 'rgba(190, 227, 248, 0.3)', // Light border
    overlay: 'rgba(0, 0, 0, 0.4)',   // Dark overlay
    glass: 'rgba(255, 255, 255, 0.35)',    // Glass effect
    glassBorder: 'rgba(255, 255, 255, 0.6)', // Glass border
  },

  // Text Colors
  text: {
    primary: '#1A1A1A',            // Dark primary text
    secondary: '#4A4A4A',          // Secondary gray text
    input: '#1E1E1E',              // Input field text
    inverse: '#FFFFFF',            // White text
    temperature: '#0D47A1',        // Deep blue for temperature
    weatherInfo: '#1565C0',        // Info blue for weather description
    onAnimatedBg: '#1A1A1A',       // High contrast text for animated backgrounds
  },

  // Status Colors
  status: {
    success: '#4EC9B0',            // Teal-cyan
    warning: '#FFC107',            // Golden yellow
    error: '#D32F2F',              // Functional red
    info: '#2196F3',               // Bright blue
  },

  // Button Colors
  buttons: {
    primary: '#2196F3',            // Bright blue
    primaryText: '#FFFFFF',        // White text
    secondary: '#E3F2FD',          // Light blue
    secondaryText: '#1A1A1A',      // Dark text
  },

  // Shadows (subtle blue-tinted shadows)
  shadows: {
    light: 'rgba(95, 185, 232, 0.1)',
    medium: 'rgba(95, 185, 232, 0.2)',
    strong: 'rgba(53, 129, 168, 0.3)',
  },

  // Text Shadows for readability on animated backgrounds
  textShadows: {
    subtle: {
      shadowColor: 'rgba(0, 0, 0, 0.3)',
      shadowOffset: { width: 0, height: 1 },
      shadowRadius: 3,
    },
    medium: {
      shadowColor: 'rgba(0, 0, 0, 0.4)',
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
    },
    strong: {
      shadowColor: 'rgba(0, 0, 0, 0.5)',
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 6,
    },
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
