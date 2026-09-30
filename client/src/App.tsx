import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { LanguageSelector } from './components/LanguageSelector';
import { TranslationPanels } from './components/TranslationPanels';
import { ControlsBar } from './components/ControlsBar';
import { HistoryDrawer } from './components/HistoryDrawer';
import { ToastContainer } from './components/Toast';
import type { ToastMessage } from './components/Toast';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { requestTranslation, checkServerHealth } from './services/api';
import type { HistoryItem, ServerHealth } from './types';

import { AlertCircle, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';

const LOCAL_STORAGE_HISTORY_KEY = 'alphatranslate_history';
const LOCAL_STORAGE_SOURCE_LANG = 'alphatranslate_source_lang';
const LOCAL_STORAGE_TARGET_LANG = 'alphatranslate_target_lang';

export const App: React.FC = () => {
  // State
  const [sourceText, setSourceText] = useState<string>('');
  const [translatedText, setTranslatedText] = useState<string>('');
  const [sourceLang, setSourceLang] = useState<string>(() => {
    return localStorage.getItem(LOCAL_STORAGE_SOURCE_LANG) || 'auto';
  });
  const [targetLang, setTargetLang] = useState<string>(() => {
    return localStorage.getItem(LOCAL_STORAGE_TARGET_LANG) || 'ta';
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<'google' | 'mymemory' | 'mock' | undefined>(undefined);
  const [copied, setCopied] = useState<boolean>(false);
  const [serverHealth, setServerHealth] = useState<ServerHealth | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [speakingField, setSpeakingField] = useState<'source' | 'target' | null>(null);

  // History state
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Speech synthesis hook
  const { speak, stop, isSpeaking } = useSpeechSynthesis();

  // Reset speaking field if speech ended
  useEffect(() => {
    if (!isSpeaking) {
      setSpeakingField(null);
    }
  }, [isSpeaking]);

  // Persist languages
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_SOURCE_LANG, sourceLang);
  }, [sourceLang]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_TARGET_LANG, targetLang);
  }, [targetLang]);

  // Persist history
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  // Check backend server health on mount
  useEffect(() => {
    checkServerHealth().then((health) => {
      setServerHealth(health);
    });

    const interval = setInterval(() => {
      checkServerHealth().then((health) => {
        setServerHealth(health);
      });
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Toast helper
  const addToast = useCallback((text: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, text, type }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Translation Handler
  const handleTranslate = async () => {
    const trimmed = sourceText.trim();
    if (!trimmed) {
      setError('Please enter some text to translate.');
      addToast('Please enter text before translating.', 'error');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await requestTranslation(trimmed, sourceLang, targetLang);
      setTranslatedText(result.translatedText);
      setProvider(result.provider);

      // Save to history
      const newItem: HistoryItem = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        sourceText: trimmed,
        translatedText: result.translatedText,
        sourceLang: result.detectedSourceLanguage || sourceLang,
        targetLang,
        timestamp: Date.now(),
        provider: result.provider,
      };

      setHistory((prev) => [newItem, ...prev.filter((i) => i.sourceText !== trimmed)].slice(0, 50));
    } catch (err: any) {
      const msg = err.message || 'Translation service failed. Please check your connection.';
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Language Swap
  const handleSwap = () => {
    if (sourceLang === 'auto') {
      addToast('Cannot swap while Auto Detect is active. Choose a specific source language.', 'info');
      return;
    }

    const prevSourceLang = sourceLang;
    const prevTargetLang = targetLang;
    const prevSourceText = sourceText;
    const prevTranslatedText = translatedText;

    setSourceLang(prevTargetLang);
    setTargetLang(prevSourceLang);

    if (prevTranslatedText) {
      setSourceText(prevTranslatedText);
      setTranslatedText(prevSourceText);
    }

    addToast(`Swapped: ${prevTargetLang.toUpperCase()} ⇄ ${prevSourceLang.toUpperCase()}`, 'info');
  };

  // Copy Translation
  const handleCopy = async () => {
    if (!translatedText) return;
    try {
      await navigator.clipboard.writeText(translatedText);
      setCopied(true);
      addToast('Copied translated text to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      addToast('Failed to copy to clipboard', 'error');
    }
  };

  // Clear All
  const handleClearAll = () => {
    setSourceText('');
    setTranslatedText('');
    setError(null);
    setProvider(undefined);
    stop();
    setSpeakingField(null);
    addToast('Cleared all translation fields', 'info');
  };

  // Clear Input Only
  const handleClearInput = () => {
    setSourceText('');
    setError(null);
    stop();
  };

  // Text to Speech
  const handleSpeak = (text: string, speechCode: string, field: 'source' | 'target') => {
    setSpeakingField(field);
    speak(text, speechCode);
  };

  const handleStopSpeak = () => {
    stop();
    setSpeakingField(null);
  };

  // Restore history item
  const handleSelectHistoryItem = (item: HistoryItem) => {
    setSourceText(item.sourceText);
    setTranslatedText(item.translatedText);
    setSourceLang(item.sourceLang);
    setTargetLang(item.targetLang);
    setIsHistoryOpen(false);
    addToast('Restored translation from history', 'info');
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearHistory = () => {
    setHistory([]);
    addToast('Cleared translation history', 'info');
  };

  return (
    <div className="app-layout">
      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Header */}
      <Header
        serverHealth={serverHealth}
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      <main className="main-content">
        <div className="container">
          {/* Hero Banner / Quick Feature Tagline */}
          <div className="hero-section">
            <h2 className="hero-title">Translate instantly across 16+ global & Indian languages</h2>
            <p className="hero-subtitle">
              Empowered with dual neural fallback engines, real-time Web Speech articulation, and clipboard integration.
            </p>
          </div>

          {/* Error Banner if error occurred */}
          {error && (
            <div className="error-banner" role="alert">
              <AlertCircle size={20} className="error-icon" />
              <div className="error-content">
                <strong>Translation Notice:</strong>
                <span>{error}</span>
              </div>
              <button
                type="button"
                className="retry-btn"
                onClick={handleTranslate}
                disabled={isLoading}
              >
                <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
                <span>Retry</span>
              </button>
            </div>
          )}

          {/* Translation Workspace Card */}
          <div className="translation-card">
            {/* Language Selection Header */}
            <LanguageSelector
              sourceLang={sourceLang}
              targetLang={targetLang}
              onSourceChange={setSourceLang}
              onTargetChange={setTargetLang}
              onSwap={handleSwap}
              disabled={isLoading}
            />

            {/* Split Input & Output Panels */}
            <TranslationPanels
              sourceText={sourceText}
              translatedText={translatedText}
              sourceLang={sourceLang}
              targetLang={targetLang}
              isLoading={isLoading}
              onSourceTextChange={(text) => {
                setSourceText(text);
                if (error) setError(null);
              }}
              onClearInput={handleClearInput}
              onTranslate={handleTranslate}
              isSpeaking={isSpeaking}
              speakingField={speakingField}
              onSpeak={handleSpeak}
              onStopSpeak={handleStopSpeak}
              provider={provider}
              copied={copied}
              onCopy={handleCopy}
            />

            {/* Bottom Controls Bar */}
            <ControlsBar
              onTranslate={handleTranslate}
              onClearAll={handleClearAll}
              onSwap={handleSwap}
              isLoading={isLoading}
              canTranslate={Boolean(sourceText.trim())}
              canSwap={sourceLang !== 'auto'}
              canClear={Boolean(sourceText || translatedText)}
            />
          </div>

          {/* Feature Showcase Highlights */}
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-badge">
                <Sparkles size={20} />
              </div>
              <h3>Indian & Global Languages</h3>
              <p>Specialized high-accuracy support for Tamil, Telugu, Hindi, Malayalam, Kannada, French, German, Spanish, Japanese, and Chinese.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-badge">
                <CheckCircle2 size={20} />
              </div>
              <h3>Hybrid Translation Engine</h3>
              <p>Seamlessly integrates Google Cloud Translation API with automatic fallback to high-availability real translation endpoints.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-badge">
                <RefreshCw size={20} />
              </div>
              <h3>Text-To-Speech Synthesis</h3>
              <p>Listen to authentic native speech pronunciations powered by browser-native Web Speech API with adjustable pacing.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="container footer-content">
          <p>© {new Date().getFullYear()} AlphaTranslate • CodeAlpha Artificial Intelligence Internship (Task-1)</p>
          <div className="footer-links">
            <span className="tech-tag">React 19</span>
            <span className="tech-tag">TypeScript</span>
            <span className="tech-tag">Node / Express</span>
            <span className="tech-tag">Web Speech API</span>
          </div>
        </div>
      </footer>

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelect={handleSelectHistoryItem}
        onDelete={handleDeleteHistoryItem}
        onClear={handleClearHistory}
      />
    </div>
  );
};

export default App;
