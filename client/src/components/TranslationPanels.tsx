import React, { useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Copy,
  Check,
  X,
  ClipboardPaste,
  Sparkles,
  Loader2,
  Share2,
} from 'lucide-react';
import { getLanguageByCode } from '../constants/languages';

interface TranslationPanelsProps {
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  isLoading: boolean;
  onSourceTextChange: (text: string) => void;
  onClearInput: () => void;
  onTranslate: () => void;
  isSpeaking: boolean;
  speakingField: 'source' | 'target' | null;
  onSpeak: (text: string, langCode: string, field: 'source' | 'target') => void;
  onStopSpeak: () => void;
  provider?: 'google' | 'mymemory' | 'mock';
  copied: boolean;
  onCopy: () => void;
}

const SAMPLE_PHRASES = [
  'Hello, how are you today?',
  'Welcome to the Artificial Intelligence internship program!',
  'Machine learning and language processing are transformative technologies.',
  'Thank you for your valuable guidance and mentorship.',
];

export const TranslationPanels: React.FC<TranslationPanelsProps> = ({
  sourceText,
  translatedText,
  sourceLang,
  targetLang,
  isLoading,
  onSourceTextChange,
  onClearInput,
  onTranslate,
  isSpeaking,
  speakingField,
  onSpeak,
  onStopSpeak,
  provider,
  copied,
  onCopy,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const targetLangMeta = getLanguageByCode(targetLang);
  const sourceLangMeta = getLanguageByCode(sourceLang === 'auto' ? 'en' : sourceLang);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl + Enter or Cmd + Enter to translate
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onTranslate();
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onSourceTextChange(text.slice(0, 5000));
        textareaRef.current?.focus();
      }
    } catch (err) {
      console.warn('Clipboard read failed:', err);
    }
  };

  const charCount = sourceText.length;
  const isTargetSpeaking = isSpeaking && speakingField === 'target';
  const isSourceSpeaking = isSpeaking && speakingField === 'source';

  return (
    <div className="translation-panels-grid">
      {/* SOURCE PANEL */}
      <div className="panel source-panel">
        <div className="panel-inner">
          <div className="panel-header">
            <span className="panel-title">Original Text</span>
            {charCount > 0 && (
              <span className={`char-counter ${charCount > 4500 ? 'warning' : ''}`}>
                {charCount.toLocaleString()} / 5,000
              </span>
            )}
          </div>

          <div className="textarea-container">
            <textarea
              ref={textareaRef}
              id="source-text-input"
              value={sourceText}
              onChange={(e) => onSourceTextChange(e.target.value.slice(0, 5000))}
              onKeyDown={handleKeyDown}
              placeholder="Type, paste, or pick a sample text below... (Press Ctrl + Enter to translate)"
              className="translation-textarea"
              rows={7}
            />

            {sourceText && (
              <button
                type="button"
                className="clear-icon-btn"
                onClick={onClearInput}
                title="Clear input text"
                aria-label="Clear input text"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Quick sample chips */}
          {sourceText.length === 0 && (
            <div className="sample-chips-row">
              <span className="sample-label">Try sample:</span>
              <div className="sample-chips">
                {SAMPLE_PHRASES.map((phrase, idx) => (
                  <button
                    key={`phrase-${idx}`}
                    type="button"
                    className="sample-chip"
                    onClick={() => {
                      onSourceTextChange(phrase);
                      textareaRef.current?.focus();
                    }}
                  >
                    "{phrase.length > 25 ? phrase.slice(0, 25) + '...' : phrase}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Source Panel Bottom Toolbar */}
          <div className="panel-footer">
            <div className="footer-left">
              <button
                type="button"
                className="tool-btn"
                onClick={handlePaste}
                title="Paste from clipboard"
              >
                <ClipboardPaste size={16} />
                <span>Paste</span>
              </button>

              {sourceText.trim() && (
                <button
                  type="button"
                  className={`tool-btn ${isSourceSpeaking ? 'active-speaking' : ''}`}
                  onClick={() => {
                    if (isSourceSpeaking) {
                      onStopSpeak();
                    } else {
                      onSpeak(sourceText, sourceLangMeta?.speechCode || 'en-US', 'source');
                    }
                  }}
                  title={isSourceSpeaking ? 'Stop speaking' : 'Listen to source text'}
                >
                  {isSourceSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  <span>{isSourceSpeaking ? 'Stop' : 'Listen'}</span>
                </button>
              )}
            </div>

            <div className="footer-right">
              <span className="shortcut-hint">Ctrl + Enter to translate</span>
            </div>
          </div>
        </div>
      </div>

      {/* TARGET PANEL */}
      <div className="panel target-panel">
        <div className="panel-inner">
          <div className="panel-header">
            <div className="target-header-left">
              <span className="panel-title">
                {targetLangMeta?.name || 'Target'} Translation
              </span>
              {provider && (
                <span className={`provider-tag provider-${provider}`}>
                  {provider === 'google' && 'Google Cloud API'}
                  {provider === 'mymemory' && 'Real Translation Engine'}
                  {provider === 'mock' && 'Offline Fallback'}
                </span>
              )}
            </div>

            {translatedText && (
              <span className="char-counter">{translatedText.length.toLocaleString()} chars</span>
            )}
          </div>

          <div className="target-content-area">
            {isLoading ? (
              <div className="loading-state">
                <Loader2 className="loading-spinner animate-spin" size={36} />
                <p className="loading-text">Translating to {targetLangMeta?.name}...</p>
                <div className="skeleton-lines">
                  <div className="skeleton-line full"></div>
                  <div className="skeleton-line medium"></div>
                  <div className="skeleton-line short"></div>
                </div>
              </div>
            ) : translatedText ? (
              <div id="translation-result" className="result-text" tabIndex={0}>
                {translatedText}
              </div>
            ) : (
              <div className="empty-target-state">
                <Sparkles className="empty-icon" size={32} />
                <p className="empty-title">Translation will appear here</p>
                <p className="empty-desc">
                  Select your target language and click the Translate button or press{' '}
                  <kbd>Ctrl+Enter</kbd>.
                </p>
              </div>
            )}
          </div>

          {/* Target Panel Bottom Toolbar */}
          <div className="panel-footer">
            <div className="footer-left">
              {translatedText && (
                <>
                  {/* Text To Speech Button */}
                  <button
                    id="tts-speaker-btn"
                    type="button"
                    className={`tool-btn ${isTargetSpeaking ? 'active-speaking' : ''}`}
                    onClick={() => {
                      if (isTargetSpeaking) {
                        onStopSpeak();
                      } else {
                        onSpeak(
                          translatedText,
                          targetLangMeta?.speechCode || 'en-US',
                          'target'
                        );
                      }
                    }}
                    title={isTargetSpeaking ? 'Stop speaking' : 'Listen to translation (Web Speech)'}
                    aria-label="Listen to translation"
                  >
                    {isTargetSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    <span>{isTargetSpeaking ? 'Stop' : 'Listen'}</span>
                  </button>

                  {/* Copy Button */}
                  <button
                    id="copy-translation-btn"
                    type="button"
                    className={`tool-btn ${copied ? 'copied-btn' : ''}`}
                    onClick={onCopy}
                    title="Copy translated text to clipboard"
                    aria-label="Copy translated text"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </>
              )}
            </div>

            <div className="footer-right">
              {translatedText && (
                <button
                  type="button"
                  className="tool-btn icon-only"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'AlphaTranslate Result',
                        text: translatedText,
                      }).catch(() => {});
                    } else {
                      onCopy();
                    }
                  }}
                  title="Share translation"
                >
                  <Share2 size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
