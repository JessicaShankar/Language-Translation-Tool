import React from 'react';
import { ArrowLeftRight, ChevronDown } from 'lucide-react';
import { SUPPORTED_LANGUAGES, SOURCE_LANGUAGES } from '../constants/languages';

interface LanguageSelectorProps {
  sourceLang: string;
  targetLang: string;
  onSourceChange: (lang: string) => void;
  onTargetChange: (lang: string) => void;
  onSwap: () => void;
  disabled?: boolean;
}

const QUICK_LANGS = ['en', 'ta', 'hi', 'fr', 'es', 'de', 'ja'];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  sourceLang,
  targetLang,
  onSourceChange,
  onTargetChange,
  onSwap,
  disabled = false,
}) => {
  return (
    <div className="language-selector-bar">
      {/* Source Language Column */}
      <div className="lang-col source-lang-col">
        <div className="lang-header">
          <label htmlFor="source-language-select" className="lang-label">
            Source Language
          </label>
        </div>

        <div className="select-wrapper">
          <select
            id="source-language-select"
            value={sourceLang}
            onChange={(e) => onSourceChange(e.target.value)}
            disabled={disabled}
            className="lang-select"
          >
            {SOURCE_LANGUAGES.map((lang) => (
              <option key={`src-${lang.code}`} value={lang.code}>
                {lang.flag} {lang.name} {lang.nativeName !== lang.name ? `(${lang.nativeName})` : ''}
              </option>
            ))}
          </select>
          <ChevronDown className="select-chevron" size={16} />
        </div>

        {/* Quick select pills */}
        <div className="quick-pills">
          <button
            type="button"
            className={`pill-btn ${sourceLang === 'auto' ? 'active' : ''}`}
            onClick={() => onSourceChange('auto')}
            disabled={disabled}
          >
            Auto Detect
          </button>
          {QUICK_LANGS.slice(0, 4).map((code) => {
            const l = SUPPORTED_LANGUAGES.find((item) => item.code === code);
            if (!l) return null;
            return (
              <button
                key={`src-pill-${code}`}
                type="button"
                className={`pill-btn ${sourceLang === code ? 'active' : ''}`}
                onClick={() => onSourceChange(code)}
                disabled={disabled}
              >
                {l.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Swap Button */}
      <div className="swap-btn-container">
        <button
          id="swap-languages-btn"
          type="button"
          className="swap-button"
          onClick={onSwap}
          disabled={disabled || sourceLang === 'auto'}
          title={
            sourceLang === 'auto'
              ? 'Select a specific source language to swap'
              : 'Swap source and target languages'
          }
          aria-label="Swap source and target languages"
        >
          <ArrowLeftRight size={20} className="swap-icon" />
        </button>
      </div>

      {/* Target Language Column */}
      <div className="lang-col target-lang-col">
        <div className="lang-header">
          <label htmlFor="target-language-select" className="lang-label">
            Target Language
          </label>
        </div>

        <div className="select-wrapper">
          <select
            id="target-language-select"
            value={targetLang}
            onChange={(e) => onTargetChange(e.target.value)}
            disabled={disabled}
            className="lang-select"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={`tgt-${lang.code}`} value={lang.code}>
                {lang.flag} {lang.name} {lang.nativeName !== lang.name ? `(${lang.nativeName})` : ''}
              </option>
            ))}
          </select>
          <ChevronDown className="select-chevron" size={16} />
        </div>

        {/* Quick select pills */}
        <div className="quick-pills">
          {QUICK_LANGS.map((code) => {
            const l = SUPPORTED_LANGUAGES.find((item) => item.code === code);
            if (!l) return null;
            return (
              <button
                key={`tgt-pill-${code}`}
                type="button"
                className={`pill-btn ${targetLang === code ? 'active' : ''}`}
                onClick={() => onTargetChange(code)}
                disabled={disabled}
              >
                {l.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
