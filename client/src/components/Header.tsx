import React from 'react';
import { Languages, History, Sparkles, CheckCircle2 } from 'lucide-react';
import type { ServerHealth } from '../types';

interface HeaderProps {
  serverHealth: ServerHealth | null;
  historyCount: number;
  onOpenHistory: () => void;
}

export const Header: React.FC<HeaderProps> = ({ serverHealth, historyCount, onOpenHistory }) => {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-brand">
          <div className="logo-badge">
            <Languages className="logo-icon" size={24} />
          </div>
          <div>
            <div className="brand-title-wrap">
              <h1 className="brand-title">AlphaTranslate</h1>
              <span className="internship-badge">CodeAlpha AI</span>
            </div>
            <p className="brand-subtitle">Neural Language Translation & Speech Synthesis Platform</p>
          </div>
        </div>

        <div className="header-actions">
          {/* Server Provider Status Indicator */}
          <div className="engine-status-pill" title={serverHealth?.configuredProvider || 'Checking API status...'}>
            {serverHealth ? (
              <>
                <span className="status-dot active"></span>
                <span className="engine-label">
                  {serverHealth.configuredProvider.includes('Google') ? (
                    <>
                      <Sparkles size={14} className="sparkle-icon" /> Google Cloud AI
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={14} className="check-icon" /> Real Translation Engine
                    </>
                  )}
                </span>
              </>
            ) : (
              <>
                <span className="status-dot connecting"></span>
                <span className="engine-label">Connecting Server...</span>
              </>
            )}
          </div>

          {/* History Button */}
          <button
            id="open-history-btn"
            className="history-toggle-btn"
            onClick={onOpenHistory}
            aria-label="View translation history"
            title="Translation History"
          >
            <History size={18} />
            <span className="history-text">History</span>
            {historyCount > 0 && <span className="history-badge">{historyCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
};
