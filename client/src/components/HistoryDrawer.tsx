import React from 'react';
import { X, Trash2, Clock, ArrowRight, Copy, Check, CornerDownLeft } from 'lucide-react';
import type { HistoryItem } from '../types';
import { getLanguageByCode } from '../constants/languages';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelect,
  onDelete,
  onClear,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (id: string, text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <aside
        className="drawer-content"
        onClick={(e) => e.stopPropagation()}
        aria-label="Translation History Drawer"
      >
        <div className="drawer-header">
          <div className="drawer-title-group">
            <Clock size={20} className="drawer-clock-icon" />
            <h2 className="drawer-title">Translation History</h2>
            <span className="drawer-count">({history.length})</span>
          </div>

          <div className="drawer-header-actions">
            {history.length > 0 && (
              <button
                type="button"
                className="drawer-clear-btn"
                onClick={onClear}
                title="Clear all translation history"
              >
                <Trash2 size={16} />
                <span>Clear All</span>
              </button>
            )}
            <button
              type="button"
              className="drawer-close-btn"
              onClick={onClose}
              title="Close history panel"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="drawer-body">
          {history.length === 0 ? (
            <div className="drawer-empty-state">
              <Clock size={40} className="empty-clock" />
              <h3>No translations yet</h3>
              <p>Your recent translations will automatically appear here so you can revisit them anytime.</p>
            </div>
          ) : (
            <div className="history-list">
              {history.map((item) => {
                const src = getLanguageByCode(item.sourceLang);
                const tgt = getLanguageByCode(item.targetLang);
                const isCopied = copiedId === item.id;

                return (
                  <div
                    key={item.id}
                    className="history-card"
                    onClick={() => onSelect(item)}
                    role="button"
                    tabIndex={0}
                    title="Click to restore this translation"
                  >
                    <div className="history-card-header">
                      <div className="lang-pair-badge">
                        <span>{src?.flag || '🌐'} {src?.name || item.sourceLang}</span>
                        <ArrowRight size={14} className="pair-arrow" />
                        <span>{tgt?.flag || '🌐'} {tgt?.name || item.targetLang}</span>
                      </div>
                      <span className="history-timestamp">{formatTime(item.timestamp)}</span>
                    </div>

                    <p className="history-source-text">{item.sourceText}</p>
                    <p className="history-target-text">{item.translatedText}</p>

                    <div className="history-card-footer">
                      <span className="restore-hint">
                        <CornerDownLeft size={13} /> Click to restore
                      </span>
                      <div className="card-actions">
                        <button
                          type="button"
                          className="card-action-btn"
                          onClick={(e) => handleCopy(item.id, item.translatedText, e)}
                          title="Copy translated text"
                        >
                          {isCopied ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                        <button
                          type="button"
                          className="card-action-btn delete-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(item.id);
                          }}
                          title="Remove from history"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};
