// Local clothing image library with style-specific illustrations
import { ImageSourcePropType } from 'react-native';
import { ClothingStyle } from '@/types/preferences';

// Import Boy style images (existing)
import boyTshirt from '@/assets/clothing/tshirt.png';
import boyShirt from '@/assets/clothing/shirt.png';
import boySweater from '@/assets/clothing/sweater.png';
import boyHoodie from '@/assets/clothing/hoodie.png';
import boyPants from '@/assets/clothing/pants.png';
import boyShorts from '@/assets/clothing/shorts.png';
import boyJeans from '@/assets/clothing/jeans.png';
import boyLightJacket from '@/assets/clothing/light-jacket.png';
import boyWarmCoat from '@/assets/clothing/warm-coat.png';
import boyRainJacket from '@/assets/clothing/rain-jacket.png';
import boySunHat from '@/assets/clothing/sun-hat.png';
import boyWarmHat from '@/assets/clothing/warm-hat.png';
import boySunglasses from '@/assets/clothing/sunglasses.png';
import boyGloves from '@/assets/clothing/gloves.png';
import boyBoots from '@/assets/clothing/boots.png';
import boyRainBoots from '@/assets/clothing/rain-boots.png';

// Import Girl style images
import girlTshirt from '@/assets/clothing/girl/tshirt.png';
import girlShirt from '@/assets/clothing/girl/shirt.png';
import girlSweater from '@/assets/clothing/girl/sweater.png';
import girlHoodie from '@/assets/clothing/girl/hoodie.png';
import girlPants from '@/assets/clothing/girl/pants.png';
import girlShorts from '@/assets/clothing/girl/shorts.png';
import girlJeans from '@/assets/clothing/girl/jeans.png';
import girlLightJacket from '@/assets/clothing/girl/light-jacket.png';
import girlWarmCoat from '@/assets/clothing/girl/warm-coat.png';
import girlRainJacket from '@/assets/clothing/girl/rain-jacket.png';
import girlSunHat from '@/assets/clothing/girl/sun-hat.png';
import girlWarmHat from '@/assets/clothing/girl/warm-hat.png';
import girlSunglasses from '@/assets/clothing/girl/sunglasses.png';
import girlGloves from '@/assets/clothing/girl/gloves.png';
import girlBoots from '@/assets/clothing/girl/boots.png';
import girlRainBoots from '@/assets/clothing/girl/rain-boots.png';

// Import Neutral style images
import neutralTshirt from '@/assets/clothing/neutral/tshirt.png';
import neutralShirt from '@/assets/clothing/neutral/shirt.png';
import neutralSweater from '@/assets/clothing/neutral/sweater.png';
import neutralHoodie from '@/assets/clothing/neutral/hoodie.png';
import neutralPants from '@/assets/clothing/neutral/pants.png';
import neutralShorts from '@/assets/clothing/neutral/shorts.png';
import neutralJeans from '@/assets/clothing/neutral/jeans.png';
import neutralLightJacket from '@/assets/clothing/neutral/light-jacket.png';
import neutralWarmCoat from '@/assets/clothing/neutral/warm-coat.png';
import neutralRainJacket from '@/assets/clothing/neutral/rain-jacket.png';
import neutralSunHat from '@/assets/clothing/neutral/sun-hat.png';
import neutralWarmHat from '@/assets/clothing/neutral/warm-hat.png';
import neutralSunglasses from '@/assets/clothing/neutral/sunglasses.png';
import neutralGloves from '@/assets/clothing/neutral/gloves.png';
import neutralBoots from '@/assets/clothing/neutral/boots.png';
import neutralRainBoots from '@/assets/clothing/neutral/rain-boots.png';

export interface ClothingImageMap {
  [key: string]: ImageSourcePropType;
}

interface StyleLibraries {
  boy: ClothingImageMap;
  girl: ClothingImageMap;
  neutral: ClothingImageMap;
}

// Boy style library
const boyClothingImages: ClothingImageMap = {
  'tshirt': boyTshirt,
  't-shirt': boyTshirt,
  'shirt': boyShirt,
  'long-sleeve': boyShirt,
  'sweater': boySweater,
  'hoodie': boyHoodie,
  'pants': boyPants,
  'jeans': boyJeans,
  'shorts': boyShorts,
  'leggings': boyPants,
  'jacket': boyLightJacket,
  'light-jacket': boyLightJacket,
  'coat': boyWarmCoat,
  'warm-coat': boyWarmCoat,
  'rain-jacket': boyRainJacket,
  'raincoat': boyRainJacket,
  'hat': boyWarmHat,
  'sun-hat': boySunHat,
  'warm-hat': boyWarmHat,
  'beanie': boyWarmHat,
  'sunglasses': boySunglasses,
  'gloves': boyGloves,
  'mittens': boyGloves,
  'boots': boyBoots,
  'rain-boots': boyRainBoots,
  'shoes': boyBoots,
  'sneakers': boyBoots,
};

// Girl style library with girl-specific items
const girlClothingImages: ClothingImageMap = {
  'tshirt': girlTshirt,
  't-shirt': girlTshirt,
  'shirt': girlShirt,
  'long-sleeve': girlShirt,
  'sweater': girlSweater,
  'hoodie': girlHoodie,
  'pants': girlPants,
  'jeans': girlJeans,
  'shorts': girlShorts,
  'leggings': girlPants,
  'skirt': girlShorts, // Placeholder
  'dress': girlShirt, // Placeholder
  'jacket': girlLightJacket,
  'light-jacket': girlLightJacket,
  'coat': girlWarmCoat,
  'warm-coat': girlWarmCoat,
  'rain-jacket': girlRainJacket,
  'raincoat': girlRainJacket,
  'hat': girlWarmHat,
  'sun-hat': girlSunHat,
  'warm-hat': girlWarmHat,
  'beanie': girlWarmHat,
  'sunglasses': girlSunglasses,
  'gloves': girlGloves,
  'mittens': girlGloves,
  'boots': girlBoots,
  'rain-boots': girlRainBoots,
  'shoes': girlBoots,
  'sneakers': girlBoots,
};

// Neutral style library
const neutralClothingImages: ClothingImageMap = {
  'tshirt': neutralTshirt,
  't-shirt': neutralTshirt,
  'shirt': neutralShirt,
  'long-sleeve': neutralShirt,
  'sweater': neutralSweater,
  'hoodie': neutralHoodie,
  'pants': neutralPants,
  'jeans': neutralJeans,
  'shorts': neutralShorts,
  'leggings': neutralPants,
  'jacket': neutralLightJacket,
  'light-jacket': neutralLightJacket,
  'coat': neutralWarmCoat,
  'warm-coat': neutralWarmCoat,
  'rain-jacket': neutralRainJacket,
  'raincoat': neutralRainJacket,
  'hat': neutralWarmHat,
  'sun-hat': neutralSunHat,
  'warm-hat': neutralWarmHat,
  'beanie': neutralWarmHat,
  'sunglasses': neutralSunglasses,
  'gloves': neutralGloves,
  'mittens': neutralGloves,
  'boots': neutralBoots,
  'rain-boots': neutralRainBoots,
  'shoes': neutralBoots,
  'sneakers': neutralBoots,
};

// All style libraries
const styleLibraries: StyleLibraries = {
  boy: boyClothingImages,
  girl: girlClothingImages,
  neutral: neutralClothingImages,
};

export class ClothingImageLibrary {
  /**
   * Get the local image for a clothing item based on style preference
   */
  static getImage(
    itemName: string,
    style: ClothingStyle = 'neutral'
  ): ImageSourcePropType | null {
    const normalizedName = itemName.toLowerCase().trim();
    const library = styleLibraries[style];

    // Direct match
    if (library[normalizedName]) {
      return library[normalizedName];
    }

    // Partial match - find if the key is contained in the item name
    for (const [key, image] of Object.entries(library)) {
      if (normalizedName.includes(key) || key.includes(normalizedName)) {
        return image;
      }
    }

    return null;
  }

  /**
   * Get images for multiple clothing items based on style preference
   */
  static getImages(
    items: string[],
    style: ClothingStyle = 'neutral'
  ): Map<string, ImageSourcePropType> {
    const imageMap = new Map<string, ImageSourcePropType>();

    for (const item of items) {
      const image = this.getImage(item, style);
      if (image) {
        imageMap.set(item, image);
      }
    }

    return imageMap;
  }

  /**
   * Check if an image exists for a clothing item
   */
  static hasImage(itemName: string, style: ClothingStyle = 'neutral'): boolean {
    return this.getImage(itemName, style) !== null;
  }

  /**
   * Get all available clothing items for a style
   */
  static getAvailableItems(style: ClothingStyle = 'neutral'): string[] {
    return Object.keys(styleLibraries[style]);
  }
}
