import type { TranslationResult, ServerHealth } from '../types';

const API_BASE_URL = ''; // Uses Vite proxy in development or relative path in production

export async function requestTranslation(
  text: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<TranslationResult> {
  const response = await fetch(`${API_BASE_URL}/api/translate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      text,
      sourceLanguage,
      targetLanguage,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message =
      errorData?.error || errorData?.details || `Translation failed with status: ${response.status}`;
    throw new Error(message);
  }

  return response.json();
}

export async function checkServerHealth(): Promise<ServerHealth | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`, {
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) {
      return res.json();
    }
    return null;
  } catch {
    return null;
  }
}
