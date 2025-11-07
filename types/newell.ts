export interface NewellTextRequest {
  project_id: string;
  prompt: string;
  model?: string;
  max_tokens?: number;
  temperature?: number;
  inject_branding?: boolean;
}

export interface NewellTextResponse {
  success: boolean;
  text?: string;
  error?: string;
  model_used?: string;
  project_id?: string;
  timestamp?: string;
}

export interface NewellImageRequest {
  project_id: string;
  prompt: string;
  model?: string;
  width?: number;
  height?: number;
  num_outputs?: number;
}

export interface NewellImageResponse {
  success: boolean;
  images?: string[];
  error?: string;
  model_used: string;
  project_id: string;
  usage: {
    images_generated?: number;
  };
  timestamp: string;
}

export interface ClothingRecommendationStructured {
  summary: string;
  clothing_items: string[];
}
