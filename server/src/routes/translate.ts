import { Router, Request, Response } from 'express';
import { executeTranslation } from '../services/translationService';
import { TranslateRequest } from '../types';

export const translateRouter = Router();

// POST /api/translate
translateRouter.post('/translate', async (req: Request, res: Response): Promise<void> => {
  try {
    const { text, sourceLanguage = 'auto', targetLanguage } = req.body as Partial<TranslateRequest>;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      res.status(400).json({ error: 'Text to translate is required and cannot be empty.' });
      return;
    }

    if (!targetLanguage || typeof targetLanguage !== 'string') {
      res.status(400).json({ error: 'Target language code is required.' });
      return;
    }

    if (text.length > 5000) {
      res.status(400).json({ error: 'Text exceeds maximum limit of 5,000 characters.' });
      return;
    }

    const result = await executeTranslation({
      text: text.trim(),
      sourceLanguage: sourceLanguage || 'auto',
      targetLanguage: targetLanguage.trim(),
    });

    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error in /api/translate:', error);
    res.status(500).json({
      error: 'Translation processing failed',
      details: error.message || 'An unexpected error occurred while translating.',
    });
  }
});
