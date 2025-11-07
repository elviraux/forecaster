import { NewellTextRequest, NewellImageRequest, NewellImageResponse, ClothingRecommendationStructured } from '@/types/newell';
import { WeatherData } from '@/types/weather';
import { ClothingStyle } from '@/types/preferences';

const NEWELL_API_URL =
  process.env.EXPO_PUBLIC_NEWELL_API_URL || 'https://newell.fastshot.ai';
const PROJECT_ID =
  process.env.EXPO_PUBLIC_PROJECT_ID || '70f2e5c3-28e1-4e0a-88de-548110d8b628';

export class NewellService {
  /**
   * Generate structured clothing recommendation from AI
   * Returns both a summary sentence and a list of specific clothing items
   */
  static async generateClothingRecommendation(
    weather: WeatherData,
    childAge: number = 2,
    clothingStyle: ClothingStyle = 'neutral'
  ): Promise<ClothingRecommendationStructured> {
    try {
      const prompt = this.buildStructuredClothingPrompt(weather, childAge, clothingStyle);

      const requestBody: NewellTextRequest = {
        project_id: PROJECT_ID,
        prompt,
        max_tokens: 400,
        temperature: 0.7,
      };

      const response = await fetch(`${NEWELL_API_URL}/v1/generate/text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Project validation failed');
        }
        throw new Error(`API error: ${response.status}`);
      }

      const text = await response.text();
      return this.parseStructuredResponse(text, weather);
    } catch (error) {
      console.error('Error generating clothing recommendation:', error);
      throw error;
    }
  }

  /**
   * Build a prompt that requests structured output from the AI
   * Now includes age and style personalization
   */
  private static buildStructuredClothingPrompt(
    weather: WeatherData,
    childAge: number,
    clothingStyle: ClothingStyle
  ): string {
    const { tomorrow } = weather;

    // Customize prompts based on age
    const ageDescription = this.getAgeDescription(childAge);

    // Customize clothing keywords based on style
    const clothingKeywords = this.getStyleKeywords(clothingStyle);

    // Style guidance
    const styleGuidance = this.getStyleGuidance(clothingStyle);

    const prompt = `You are a helpful weather assistant. Analyze tomorrow's weather forecast and provide clothing recommendations for a ${childAge}-year-old child (${ageDescription}).

${styleGuidance}

Weather forecast for tomorrow:
- Temperature: High of ${tomorrow.high}°F, Low of ${tomorrow.low}°F
- Conditions: ${tomorrow.description}
- Wind: ${tomorrow.windSpeed} mph
- Chance of precipitation: ${tomorrow.precipitationChance}%

IMPORTANT: Respond in the following structured format:

SUMMARY: [Write a concise, human-readable summary sentence about tomorrow's weather, e.g., "A chilly and breezy day ahead."]

Respond EXACTLY in the following format:

SUMMARY: [Concise, human-readable summary sentence about tomorrow's weather, e.g., "A chilly and breezy day ahead."]

CLOTHING: [Comma-separated list of items using ONLY these exact keywords:
${clothingKeywords}]

---

CLOTHING LOGIC RULES:

1. Layering consistency:
   - Use light layers only (e.g., tshirt + light-jacket) OR warm layers only (e.g., shirt + sweater + warm-coat).
   - Do NOT combine multiple outer layers (no sweater + hoodie + jacket combos).
   - Choose only ONE from each clothing category:
     - Top: tshirt, shirt, sweater, or hoodie
     - Outerwear: light-jacket, warm-coat, or rain-jacket
     - Bottom: pants, jeans, or shorts
     - Footwear: boots or rain-boots (only if cold or wet)
     - Accessories: weather-based (sun-hat, warm-hat, sunglasses, gloves)

2. Weather adaptation examples:
   - Hot (≥75°F): tshirt, shorts, sun-hat, sunglasses
   - Mild (60–74°F): shirt, pants, light-jacket
   - Cool (45–59°F): sweater, jeans, light-jacket
   - Cold (≤44°F): hoodie, warm-coat, pants, warm-hat, gloves
   - Rainy: replace outerwear with rain-jacket, add rain-boots
   - Windy: prefer light-jacket or warm-coat even if mild

3. Avoid illogical combinations:
   - Never combine: sweater + hoodie
   - Never combine: light-jacket + warm-coat
   - Never combine: shorts + warm-hat or gloves

Example response format:
SUMMARY: A warm and sunny afternoon ahead.
CLOTHING: tshirt, shorts, sun-hat, sunglasses`;

    return prompt;
  }

  /**
   * Get age-appropriate description for the prompt
   */
  private static getAgeDescription(age: number): string {
    if (age <= 1) return 'infant/toddler, needs comfortable easy-to-wear items';
    if (age <= 3) return 'toddler, needs comfortable and practical items';
    if (age <= 5) return 'preschooler, active and playful';
    if (age <= 7) return 'young child, very active';
    return 'child, active and independent';
  }

  /**
   * Get style-specific clothing keywords
   */
  private static getStyleKeywords(style: ClothingStyle): string {
    const baseItems = 'tshirt, shirt, sweater, hoodie, pants, shorts, jeans, light-jacket, warm-coat, rain-jacket, sun-hat, warm-hat, sunglasses, gloves, boots, rain-boots';

    if (style === 'girl') {
      return baseItems + ', dress, skirt, leggings';
    }

    return baseItems;
  }

  /**
   * Get style-specific guidance for the AI
   */
  private static getStyleGuidance(style: ClothingStyle): string {
    switch (style) {
      case 'boy':
        return 'Style preference: Boy - focus on practical, sporty, and comfortable clothing suitable for boys.';
      case 'girl':
        return 'Style preference: Girl - include feminine options like dresses, skirts, and leggings when appropriate, along with practical items.';
      case 'neutral':
      default:
        return 'Style preference: Neutral/Unisex - focus on gender-neutral, practical, and comfortable clothing.';
    }
  }

  /**
   * Parse the AI's structured response into our ClothingRecommendationStructured format
   */
  private static parseStructuredResponse(
    aiResponse: string,
    weather: WeatherData
  ): ClothingRecommendationStructured {
    try {
      // Extract SUMMARY and CLOTHING sections
      const summaryMatch = aiResponse.match(/SUMMARY:\s*(.+?)(?:\n|$)/i);
      const clothingMatch = aiResponse.match(/CLOTHING:\s*(.+?)(?:\n|$)/i);

      let summary = '';
      let clothingItems: string[] = [];

      if (summaryMatch && summaryMatch[1]) {
        summary = summaryMatch[1].trim();
      }

      if (clothingMatch && clothingMatch[1]) {
        // Parse the comma-separated clothing items
        clothingItems = clothingMatch[1]
          .split(',')
          .map(item => item.trim().toLowerCase())
          .filter(item => item.length > 0);
      }

      // Fallback if parsing fails
      if (!summary || clothingItems.length === 0) {
        console.warn('AI response parsing failed, using fallback logic');
        return this.generateFallbackRecommendation(weather);
      }

      return {
        summary,
        clothing_items: clothingItems,
      };
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return this.generateFallbackRecommendation(weather);
    }
  }

  /**
   * Generate a fallback recommendation if AI parsing fails
   */
  private static generateFallbackRecommendation(
    weather: WeatherData
  ): ClothingRecommendationStructured {
    const { tomorrow } = weather;
    const avgTemp = (tomorrow.high + tomorrow.low) / 2;
    const items: string[] = [];
    let summary = '';

    // Temperature-based logic
    if (avgTemp < 40) {
      summary = 'A cold day ahead.';
      items.push('warm-coat', 'sweater', 'pants', 'warm-hat', 'gloves');
    } else if (avgTemp < 55) {
      summary = 'A chilly day ahead.';
      items.push('light-jacket', 'shirt', 'pants', 'warm-hat');
    } else if (avgTemp < 70) {
      summary = 'A mild day ahead.';
      items.push('shirt', 'pants', 'light-jacket');
    } else if (avgTemp < 85) {
      summary = 'A warm day ahead.';
      items.push('tshirt', 'shorts', 'sun-hat');
    } else {
      summary = 'A hot day ahead.';
      items.push('tshirt', 'shorts', 'sun-hat', 'sunglasses');
    }

    // Add rain gear if needed
    if (tomorrow.precipitationChance > 50 || tomorrow.description.toLowerCase().includes('rain')) {
      items.push('rain-jacket', 'rain-boots');
      summary = summary.replace('.', ' with rain expected.');
    }

    return {
      summary,
      clothing_items: items.slice(0, 5), // Limit to 5 items
    };
  }

  static parseClothingItems(recommendation: string): string[] {
    // Extract clothing items from the recommendation
    // This is a simple parser that looks for common clothing items
    const clothingKeywords = [
      'jacket',
      'coat',
      'sweater',
      'shirt',
      'pants',
      'shorts',
      'dress',
      'hat',
      'boots',
      'shoes',
      'socks',
      'mittens',
      'gloves',
      'scarf',
      'raincoat',
      'umbrella',
      't-shirt',
      'hoodie',
      'vest',
      'cardigan',
      'jeans',
      'leggings',
    ];

    const foundItems: string[] = [];
    const lowerRecommendation = recommendation.toLowerCase();

    for (const item of clothingKeywords) {
      if (lowerRecommendation.includes(item)) {
        foundItems.push(item);
      }
    }

    return [...new Set(foundItems)]; // Remove duplicates
  }

  static getClothingIcon(item: string): string {
    // Returns Ionicons name for clothing icon
    const iconMap: { [key: string]: string } = {
      jacket: 'shirt',
      coat: 'shirt',
      sweater: 'shirt',
      shirt: 'shirt',
      't-shirt': 'shirt',
      hoodie: 'shirt',
      pants: 'fitness',
      shorts: 'fitness',
      jeans: 'fitness',
      leggings: 'fitness',
      dress: 'woman',
      hat: 'color-filter',
      boots: 'footsteps',
      shoes: 'footsteps',
      socks: 'footsteps',
      mittens: 'hand-left',
      gloves: 'hand-left',
      scarf: 'remove',
      raincoat: 'umbrella',
      umbrella: 'umbrella',
    };

    return iconMap[item.toLowerCase()] || 'shirt';
  }

  static async generateClothingImage(
    clothingItem: string
  ): Promise<string | null> {
    try {
      const prompt = this.buildClothingImagePrompt(clothingItem);

      const requestBody: NewellImageRequest = {
        project_id: PROJECT_ID,
        prompt,
        width: 512,
        height: 512,
        num_outputs: 1,
      };

      const response = await fetch(`${NEWELL_API_URL}/v1/generate/image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Project validation failed');
        }
        throw new Error(`API error: ${response.status}`);
      }

      const data: NewellImageResponse = await response.json();

      if (data.success && data.images && data.images.length > 0) {
        return data.images[0];
      }

      return null;
    } catch (error) {
      console.error(`Error generating image for ${clothingItem}:`, error);
      return null;
    }
  }

  static async generateClothingImages(
    clothingItems: string[]
  ): Promise<Map<string, string>> {
    const imageMap = new Map<string, string>();

    // Limit to first 6 items to avoid too many API calls
    const itemsToGenerate = clothingItems.slice(0, 6);

    // Generate images in parallel
    const imagePromises = itemsToGenerate.map(async (item) => {
      const imageUrl = await this.generateClothingImage(item);
      return { item, imageUrl };
    });

    const results = await Promise.all(imagePromises);

    // Build map of successful generations
    for (const result of results) {
      if (result.imageUrl) {
        imageMap.set(result.item, result.imageUrl);
      }
    }

    return imageMap;
  }

  private static buildClothingImagePrompt(clothingItem: string): string {
    // Create optimized prompts for clothing item images
    const itemName = clothingItem.toLowerCase();

    // Map items to better prompts
    const promptMap: { [key: string]: string } = {
      jacket: "toddler's colorful jacket",
      coat: "toddler's warm winter coat",
      sweater: "toddler's cozy sweater",
      shirt: "toddler's casual shirt",
      't-shirt': "toddler's t-shirt",
      hoodie: "toddler's comfortable hoodie",
      pants: "toddler's pants",
      shorts: "toddler's shorts",
      jeans: "toddler's jeans",
      leggings: "toddler's leggings",
      dress: "toddler's dress",
      hat: "toddler's winter hat",
      boots: "toddler's boots",
      shoes: "toddler's sneakers",
      socks: "toddler's socks",
      mittens: "toddler's mittens",
      gloves: "toddler's gloves",
      scarf: "toddler's scarf",
      raincoat: "toddler's raincoat",
      umbrella: "toddler's small umbrella",
      vest: "toddler's vest",
      cardigan: "toddler's cardigan",
    };

    const itemPrompt = promptMap[itemName] || `toddler's ${itemName}`;

    return `${itemPrompt}, simple clean product photo style, centered on white background, bright and colorful, high quality`;
  }
}
