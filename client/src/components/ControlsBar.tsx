import React from 'react';
import { ArrowLeftRight, Trash2, Zap, Loader2 } from 'lucide-react';

interface ControlsBarProps {
  onTranslate: () => void;
  onClearAll: () => void;
  onSwap: () => void;
  isLoading: boolean;
  canTranslate: boolean;
  canSwap: boolean;
  canClear: boolean;
}

export const ControlsBar: React.FC<ControlsBarProps> = ({
  onTranslate,
  onClearAll,
  onSwap,
  isLoading,
  canTranslate,
  canSwap,
  canClear,
}) => {
  return (
    <div className="controls-bar">
      <div className="controls-left">
        <button
          type="button"
          className="secondary-btn clear-all-btn"
          onClick={onClearAll}
          disabled={!canClear || isLoading}
          title="Clear both input and output"
        >
          <Trash2 size={16} />
          <span>Clear All</span>
        </button>

        <button
          type="button"
          className="secondary-btn swap-action-btn"
          onClick={onSwap}
          disabled={!canSwap || isLoading}
          title="Swap source and target languages"
        >
          <ArrowLeftRight size={16} />
          <span>Swap</span>
        </button>
      </div>

      <div className="controls-center">
        <button
          id="translate-submit-btn"
          type="button"
          className={`translate-primary-btn ${isLoading ? 'loading' : ''}`}
          onClick={onTranslate}
          disabled={!canTranslate || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="btn-spinner animate-spin" />
              <span>Translating...</span>
            </>
          ) : (
            <>
              <Zap size={20} className="btn-icon" />
              <span>Translate Now</span>
            </>
          )}
        </button>
      </div>

      <div className="controls-right">
        <span className="shortcut-badge">
          <kbd>Ctrl</kbd> + <kbd>Enter</kbd>
        </span>
      </div>
    </div>
  );
};
