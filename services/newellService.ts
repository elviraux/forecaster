import { NewellTextRequest } from '@/types/newell';
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
}
