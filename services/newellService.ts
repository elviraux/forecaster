import { NewellTextRequest, NewellImageRequest, NewellImageResponse } from '@/types/newell';
import { WeatherData } from '@/types/weather';

const NEWELL_API_URL =
  process.env.EXPO_PUBLIC_NEWELL_API_URL || 'https://newell.fastshot.ai';
const PROJECT_ID =
  process.env.EXPO_PUBLIC_PROJECT_ID || '70f2e5c3-28e1-4e0a-88de-548110d8b628';

export class NewellService {
  static async generateClothingRecommendation(
    weather: WeatherData
  ): Promise<string> {
    try {
      const prompt = this.buildClothingPrompt(weather);

      const requestBody: NewellTextRequest = {
        project_id: PROJECT_ID,
        prompt,
        max_tokens: 300,
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
      return text;
    } catch (error) {
      console.error('Error generating clothing recommendation:', error);
      throw error;
    }
  }

  private static buildClothingPrompt(weather: WeatherData): string {
    const { tomorrow } = weather;

    const prompt = `You are a helpful weather assistant. Based on tomorrow's weather forecast, provide a brief, friendly clothing recommendation for a toddler (ages 1-3).

Weather forecast for tomorrow:
- Temperature: High of ${tomorrow.high}°F, Low of ${tomorrow.low}°F
- Conditions: ${tomorrow.description}
- Wind: ${tomorrow.windSpeed} mph
- Chance of precipitation: ${tomorrow.precipitationChance}%

Please provide a short, practical recommendation (2-3 sentences) that mentions specific clothing items appropriate for a toddler. Be warm and helpful in your tone. Focus on layers, comfort, and weather protection.`;

    return prompt;
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
