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
