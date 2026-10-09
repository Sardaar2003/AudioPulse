import React from 'react';
import { Play, ShieldCheck, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const ProofEvidenceTable = ({ matches, onJumpToTimestamp }) => {
  if (!matches || matches.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '3rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <CheckCircle2 size={36} style={{ margin: '0 auto 1rem auto', color: 'var(--success)', opacity: 0.8 }} />
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
          No Risk / Flagged Keywords Detected
        </h3>
        <p style={{ fontSize: '0.88rem' }}>
          The audio transcript was scanned against all configured keyword groups and returned clean results.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ overflow: 'hidden', marginBottom: '1.75rem' }}>
      <div
        style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--glass-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <ShieldCheck size={20} style={{ color: 'var(--accent-primary)' }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            Keyword Proof Evidence & Timestamp Matches ({matches.length})
          </h3>
        </div>
        <span className="badge badge-approved" style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-primary)' }}>
          Timestamp Verified
        </span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr
              className="glass-table-header"
              style={{
                borderBottom: '1px solid var(--glass-border)',
                fontSize: '0.78rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              <th style={{ padding: '1rem 1.25rem' }}>Keyword Group</th>
              <th style={{ padding: '1rem 1.25rem' }}>Matched Keyword</th>
              <th style={{ padding: '1rem 1.25rem' }}>Timestamp Proof</th>
              <th style={{ padding: '1rem 1.25rem' }}>Context Evidence Snippet</th>
              <th style={{ padding: '1rem 1.25rem' }}>Confidence</th>
              <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Audio Proof Jump</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match, idx) => (
              <tr
                key={idx}
                style={{
                  borderBottom: '1px solid var(--glass-border)',
                  transition: 'background 0.2s ease',
                }}
              >
                {/* Group Badge */}
                <td style={{ padding: '1.1rem 1.25rem' }}>
                  <span
                    style={{
                      padding: '0.3rem 0.7rem',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      background: `${match.color}20`,
                      color: match.color,
                      border: `1px solid ${match.color}50`,
                      textTransform: 'uppercase',
                    }}
                  >
                    {match.groupName}
                  </span>
                </td>

                {/* Matched Keyword */}
                <td style={{ padding: '1.1rem 1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                  "{match.keyword}"
                </td>

                {/* Formatted Timestamp */}
                <td style={{ padding: '1.1rem 1.25rem', fontFamily: "'JetBrains Mono', monospace", fontWeight: '700', color: 'var(--accent-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Clock size={14} />
                    <span>{match.formattedTime}</span>
                  </div>
                </td>

                {/* Context Snippet */}
                <td style={{ padding: '1.1rem 1.25rem', color: 'var(--text-secondary)', maxWidth: '320px' }}>
                  <div style={{ fontSize: '0.84rem', lineHeight: '1.5' }}>
                    {match.contextSnippet}
                  </div>
                </td>

                {/* Confidence */}
                <td style={{ padding: '1.1rem 1.25rem' }}>
                  <span style={{ fontWeight: '700', color: 'var(--success)' }}>
                    {match.confidence}%
                  </span>
                </td>

                {/* Jump to Proof Button */}
                <td style={{ padding: '1.1rem 1.25rem', textAlign: 'right' }}>
                  <button
                    onClick={() => onJumpToTimestamp && onJumpToTimestamp(match.startTime)}
                    className="btn-primary"
                    style={{
                      width: 'auto',
                      padding: '0.45rem 0.9rem',
                      fontSize: '0.8rem',
                      background: `linear-gradient(135deg, ${match.color}, var(--accent-secondary))`,
                    }}
                    title={`Jump audio to ${match.formattedTime}`}
                  >
                    <Play size={14} />
                    <span>Jump to Audio</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProofEvidenceTable;
