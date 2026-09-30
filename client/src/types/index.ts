export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  speechCode: string;
}

export interface TranslationResult {
  translatedText: string;
  detectedSourceLanguage?: string;
  provider: 'google' | 'mymemory' | 'mock';
  timestamp: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export interface HistoryItem {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  timestamp: number;
  provider?: string;
}

export interface ServerHealth {
  status: string;
  service: string;
  configuredProvider: string;
}
