export interface TranslateRequest {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export interface TranslateResponse {
  translatedText: string;
  detectedSourceLanguage?: string;
  provider: 'google' | 'mymemory' | 'mock';
  timestamp: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export interface ErrorResponse {
  error: string;
  details?: string;
}
