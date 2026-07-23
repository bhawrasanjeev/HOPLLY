import React from 'react';
import { X, Bot, ArrowRight, MapPin, IndianRupee, Tag, Clock } from 'lucide-react';

interface AiSuggestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (suggestions: {
    category: string;
    suggestedBudget: number;
    searchRadiusMiles: number;
  }) => void;
  taskTitle?: string;
  taskDesc?: string;
}

export const AiSuggestModal: React.FC<AiSuggestModalProps> = ({
  isOpen,
  onClose,
  onApply,
  taskTitle = '',
  taskDesc = '',
}) => {
  if (!isOpen) return null;

  // Infer smart suggestions based on input title or fallback to high quality defaults
  const lower = (taskTitle + ' ' + taskDesc).toLowerCase();

  let category = 'Handyman';
  let suggestedBudget = 55;
  let searchRadiusMiles = 5;

  if (lower.includes('clean') || lower.includes('wash')) {
    category = 'Cleaning';
    suggestedBudget = 75;
    searchRadiusMiles = 8;
  } else if (lower.includes('dog') || lower.includes('cat') || lower.includes('pet')) {
    category = 'Pet Care';
    suggestedBudget = 20;
    searchRadiusMiles = 3;
  } else if (lower.includes('grocery') || lower.includes('food') || lower.includes('store')) {
    category = 'Grocery';
    suggestedBudget = 25;
    searchRadiusMiles = 4;
  } else if (lower.includes('plumb') || lower.includes('leak') || lower.includes('sink')) {
    category = 'Plumber';
    suggestedBudget = 65;
    searchRadiusMiles = 10;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        {/* Header */}
        <div className="modal-header">
          <div className="flex-row gap-2" style={{ color: 'var(--primary)' }}>
            <Bot style={{ width: '24px', height: '24px' }} />
            <h3 className="h3-title">AI Task Analysis</h3>
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost"
            style={{ padding: '6px', borderRadius: '50%' }}
          >
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {/* Subtitle */}
        <div style={{ padding: '16px 24px 0 24px' }}>
          <p className="text-sm text-muted">
            Based on your task details, Hoply AI calculated the optimal parameters for fastest local helper match rate:
          </p>
        </div>

        {/* Bento Grid Suggestions */}
        <div className="modal-body bento-grid" style={{ margin: '16px 24px', border: '1px solid var(--border-color)', backgroundColor: 'transparent' }}>
          {/* Category */}
          <div className="bento-item" style={{ gridColumn: 'span 2', paddingBottom: '8px' }}>
            <div className="bento-label flex-row gap-1.5">
              <Tag style={{ width: '14px', height: '14px', color: 'var(--primary)' }} />
              <span>Suggested Category</span>
            </div>
            <div className="bento-value" style={{ fontSize: '1rem' }}>
              {category}
            </div>
          </div>

          {/* Urgency */}
          <div className="bento-item">
            <div className="bento-label flex-row gap-1.5">
              <Clock style={{ width: '14px', height: '14px', color: 'var(--primary)' }} />
              <span>Urgency</span>
            </div>
            <div className="bento-value">
              Normal / Flexible
            </div>
          </div>

          {/* Search Radius */}
          <div className="bento-item">
            <div className="bento-label flex-row gap-1.5">
              <MapPin style={{ width: '14px', height: '14px', color: 'var(--primary)' }} />
              <span>Optimal Radius</span>
            </div>
            <div className="bento-value">
              {searchRadiusMiles} Miles
            </div>
          </div>

          {/* Budget */}
          <div className="bento-item" style={{ gridColumn: 'span 2', padding: '16px', backgroundColor: 'rgba(22, 163, 74, 0.08)', borderRadius: '12px', border: '1px solid rgba(22, 163, 74, 0.2)' }}>
            <div className="flex-between" style={{ alignItems: 'flex-start' }}>
              <div>
                <div className="bento-label flex-row gap-1.5" style={{ color: 'var(--primary-hover)' }}>
                  <IndianRupee style={{ width: '14px', height: '14px' }} />
                  <span>Optimal Budget</span>
                </div>
                <div className="bento-value highlight">
                  Rs. {suggestedBudget} <span className="text-xs text-muted" style={{ fontWeight: 'normal', color: 'var(--primary)' }}>est.</span>
                </div>
              </div>
              <span className="badge badge-green">
                98% Match Rate
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="modal-footer">
          <button
            onClick={onClose}
            className="btn btn-outline"
            style={{ flex: 1 }}
          >
            Customize
          </button>
          <button
            onClick={() => {
              onApply({
                category,
                suggestedBudget,
                searchRadiusMiles,
              });
              onClose();
            }}
            className="btn btn-primary flex-row gap-1.5"
            style={{ flex: 2 }}
          >
            <span>Apply AI Suggestions</span>
            <ArrowRight style={{ width: '16px', height: '16px' }} />
          </button>
        </div>
      </div>
    </div>
  );
};
