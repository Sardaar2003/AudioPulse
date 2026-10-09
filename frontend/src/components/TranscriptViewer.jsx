import React, { useEffect, useRef } from 'react';
import { FileText, Sparkles } from 'lucide-react';

const TranscriptViewer = ({ transcript, words, matches, keywordGroups, currentTime = 0, onWordClick }) => {
  const containerRef = useRef(null);
  const activeWordRef = useRef(null);

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

  // Find index of word currently being spoken based on audio currentTime
  let activeWordIndex = -1;
  if (words && words.length > 0 && currentTime > 0) {
    activeWordIndex = words.findIndex((wObj, idx) => {
      const start = wObj.start;
      const end = wObj.end && wObj.end > start ? wObj.end : (words[idx + 1] ? words[idx + 1].start : start + 0.5);
      return currentTime >= start && currentTime < end;
    });

    // Fallback: if between words, highlight the nearest preceding word
    if (activeWordIndex === -1 && currentTime >= words[0].start) {
      for (let i = words.length - 1; i >= 0; i--) {
        if (currentTime >= words[i].start) {
          activeWordIndex = i;
          break;
        }
      }
    }
  }

  // Smoothly scroll container to keep active word in middle of view
  useEffect(() => {
    if (activeWordRef.current && containerRef.current) {
      activeWordRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    }
  }, [activeWordIndex]);

  // Render text with word-level click seeking, color-coded highlight tags, and live audio playback karaoke
  const renderInteractiveText = () => {
    if (!words || words.length === 0) {
      return transcript;
    }

    return words.map((wObj, idx) => {
      const cleanW = wObj.word.toLowerCase().replace(/[^\w]/g, '');
      const highlightColor = keywordColorMap[cleanW];
      const isCurrentWord = idx === activeWordIndex;

      let bg = 'transparent';
      let textColor = 'var(--text-primary)';
      let border = '1px solid transparent';
      let fontWeight = '500';
      let transform = 'scale(1)';
      let boxShadow = 'none';

      if (highlightColor) {
        bg = `${highlightColor}25`;
        textColor = highlightColor;
        border = `1px solid ${highlightColor}60`;
        fontWeight = '800';
        boxShadow = `0 0 10px ${highlightColor}30`;
      }

      if (isCurrentWord) {
        bg = highlightColor ? highlightColor : 'var(--accent-primary)';
        textColor = '#ffffff';
        border = '1px solid #ffffff';
        fontWeight = '900';
        transform = 'scale(1.18)';
        boxShadow = '0 0 20px var(--accent-glow), 0 0 10px rgba(6, 182, 212, 0.9)';
      }

      return (
        <span
          key={idx}
          ref={isCurrentWord ? activeWordRef : null}
          onClick={() => onWordClick && onWordClick(wObj.start)}
          style={{
            display: 'inline-block',
            cursor: 'pointer',
            padding: isCurrentWord ? '0.2rem 0.6rem' : highlightColor ? '0.15rem 0.5rem' : '2px 4px',
            margin: '2px 3px',
            borderRadius: isCurrentWord ? '8px' : highlightColor ? '6px' : '4px',
            background: bg,
            color: textColor,
            border: border,
            fontWeight: fontWeight,
            transform: transform,
            boxShadow: boxShadow,
            transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
            verticalAlign: 'middle',
            position: isCurrentWord ? 'relative' : 'static',
            zIndex: isCurrentWord ? 10 : 1,
          }}
          className={isCurrentWord ? 'active-spoken-word' : ''}
          title={`[${wObj.start.toFixed(1)}s] Click to seek audio`}
        >
          {wObj.word}
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
            AI Transcript & Live Karaoke Highlights
          </h3>
          {currentTime > 0 && activeWordIndex !== -1 && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.72rem',
                fontWeight: '700',
                padding: '0.2rem 0.6rem',
                borderRadius: '20px',
                background: 'rgba(6, 182, 212, 0.2)',
                color: 'var(--accent-secondary)',
                border: '1px solid rgba(6, 182, 212, 0.4)',
              }}
            >
              <Sparkles size={12} className="spin-slow" /> LIVE SYNCING
            </span>
          )}
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          💡 Words highlight in real-time as spoken • Click any word to jump audio playback
        </div>
      </div>

      <div
        ref={containerRef}
        className="inner-text-box"
        style={{
          borderRadius: '14px',
          padding: '1.5rem',
          fontSize: '1rem',
          lineHeight: '2.4',
          maxHeight: '400px',
          overflowY: 'auto',
          overflowX: 'hidden',
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          position: 'relative',
        }}
      >
        {renderInteractiveText()}
      </div>
    </div>
  );
};

export default TranscriptViewer;
