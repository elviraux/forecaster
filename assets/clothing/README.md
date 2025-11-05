# Clothing Image Assets

This directory contains the local image library for clothing recommendations.

## Current Implementation ✅

The app now uses **AI-generated illustrated images** created with FLUX Schnell (Replicate's fastest image generation model). These high-quality PNG files provide instant display without any loading delays.

### Available Images (Generated with AI)

All 16 core images have been generated and are ready to use:
- ✅ `tshirt.png` - Toddler's t-shirt (207 KB)
- ✅ `shirt.png` - Long-sleeved shirt (294 KB)
- ✅ `sweater.png` - Warm sweater (373 KB)
- ✅ `hoodie.png` - Comfortable hoodie (451 KB)
- ✅ `pants.png` - Toddler's pants (254 KB)
- ✅ `shorts.png` - Toddler's shorts (219 KB)
- ✅ `jeans.png` - Toddler's jeans (378 KB)
- ✅ `light-jacket.png` - Light windbreaker/jacket (336 KB)
- ✅ `warm-coat.png` - Warm winter coat (406 KB)
- ✅ `rain-jacket.png` - Raincoat, vibrant yellow (321 KB)
- ✅ `sun-hat.png` - Sun hat (242 KB)
- ✅ `warm-hat.png` - Winter beanie (327 KB)
- ✅ `sunglasses.png` - Sunglasses (184 KB)
- ✅ `gloves.png` - Gloves/mittens (286 KB)
- ✅ `boots.png` - General purpose boots (199 KB)
- ✅ `rain-boots.png` - Rain boots, yellow/red (223 KB)

**Total Library Size**: ~4.7 MB

## How It Works

The images are now **fully integrated** into the app:

1. **Static Assets**: All PNG images are imported as static assets in `/workspace/services/clothingImageLibrary.ts`
2. **Type Safety**: TypeScript declarations in `/workspace/types/images.d.ts` provide proper typing for image imports
3. **Instant Display**: Images are bundled with the app and display immediately - no API calls or loading delays
4. **Smart Mapping**: The library maps multiple keywords to each image:
   - Example: "jacket", "light-jacket", "windbreaker" → `light-jacket.png`
   - Example: "hat", "beanie", "warm-hat", "winter-hat" → `warm-hat.png`

## Image Details

- **Format**: PNG (1024x1024px)
- **Style**: Cute, illustrated product-style suitable for toddler clothing
- **Generation**: Created using FLUX Schnell model via Replicate API
- **Prompt Template**: `"cute illustrated toddler's [ITEM], simple clean style, centered on transparent background, bright colorful, product illustration, flat design, no shadows, children's clothing, vibrant colors"`

## Fallback Mappings

Some clothing items use fallback images when exact matches aren't available:
- `scarf` → uses `warm-hat.png`
- `umbrella` → uses `rain-jacket.png`
- `vest` → uses `light-jacket.png`
- `dress` → uses `tshirt.png`
- `cardigan` → uses `sweater.png`
- `socks` → uses `gloves.png`
- `shoes/sneakers` → use `boots.png`

## Adding More Images

To add new clothing items or replace existing ones:

### Method 1: Use Replicate MCP (Recommended)

The images were generated using Replicate's MCP integration:
- **Model**: `black-forest-labs/flux-schnell`
- **Settings**: `aspect_ratio: "1:1"`, `output_format: "png"`, `output_quality: 90`

### Method 2: Manual Generation

1. Generate images at [Replicate FLUX Schnell](https://replicate.com/black-forest-labs/flux-schnell)
2. Download and place in `/workspace/assets/clothing/`
3. Update imports in `/workspace/services/clothingImageLibrary.ts`
4. Add new mappings to the `clothingImages` object

### Method 3: Use Other AI Tools

- **DALL-E 3** (high quality)
- **Midjourney** (artistic style)
- **Stable Diffusion** (open source)

## Performance

- **Load Time**: 0ms (images bundled with app)
- **Display Time**: Instant when AI text recommendation loads
- **Animation**: Smooth staggered fade-in for visual appeal
- **Bundle Size**: ~4.7MB for 16 images (well optimized)
