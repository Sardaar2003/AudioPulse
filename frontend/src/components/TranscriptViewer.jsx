import React from 'react';
import { FileText } from 'lucide-react';

const TranscriptViewer = ({ transcript, words, matches, keywordGroups, onWordClick }) => {
  if (!transcript) {
    return (
      <div className="glass-panel" style={{ padding: '3rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        No transcript available yet.
      </div>
    );
  }

  // Create lookup for matched keywords to color map
  const keywordColorMap = {};

  // 1. Add matches
  (matches || []).forEach((m) => {
    if (m.keyword) {
      keywordColorMap[m.keyword.toLowerCase()] = m.color || '#6366f1';
    }
  });

  // 2. Add keyword groups
  (keywordGroups || []).forEach((g) => {
    (g.keywords || []).forEach((kw) => {
      if (kw) {
        keywordColorMap[kw.toLowerCase().trim()] = g.color || '#6366f1';
      }
    });
  });

  // Render text with word-level click seeking and color-coded highlight tags
  const renderInteractiveText = () => {
    if (!words || words.length === 0) {
      return transcript;
    }

    return words.map((wObj, idx) => {
      const cleanW = wObj.word.toLowerCase().replace(/[^\w]/g, '');
      const highlightColor = keywordColorMap[cleanW];

      if (highlightColor) {
        return (
          <span
            key={idx}
            onClick={() => onWordClick && onWordClick(wObj.start)}
            style={{
              display: 'inline-block',
              margin: '2px 4px',
              padding: '0.15rem 0.5rem',
              borderRadius: '6px',
              background: `${highlightColor}25`,
              color: highlightColor,
              border: `1px solid ${highlightColor}60`,
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: `0 0 10px ${highlightColor}30`,
              transition: 'all 0.2s ease',
              verticalAlign: 'middle',
            }}
            title={`Click to play audio at ${wObj.start}s`}
          >
            {wObj.word}
          </span>
        );
      }

      return (
        <span
          key={idx}
          onClick={() => onWordClick && onWordClick(wObj.start)}
          style={{
            cursor: 'pointer',
            padding: '1px 3px',
            borderRadius: '4px',
            transition: 'background 0.2s ease',
            display: 'inline',
          }}
          className="transcript-word"
          title={`Click to seek to ${wObj.start}s`}
        >
          {wObj.word}{' '}
        </span>
      );
    });
  };

  return (
    <div className="glass-card" style={{ marginBottom: '1.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <FileText size={20} style={{ color: 'var(--accent-secondary)' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            AI Transcript & Synchronized Word Highlights
          </h3>
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          💡 Click any word to jump audio playback to that exact second
        </div>
      </div>

      <div
        className="inner-text-box"
        style={{
          borderRadius: '14px',
          padding: '1.5rem',
          fontSize: '1rem',
          lineHeight: '2.2',
          maxHeight: '400px',
          overflowY: 'auto',
          overflowX: 'hidden',
          whiteSpace: 'normal',
          wordBreak: 'break-word',
        }}
      >
        {renderInteractiveText()}
      </div>
    </div>
  );
};

export default TranscriptViewer;
