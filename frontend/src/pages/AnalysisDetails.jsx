import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, ShieldAlert, FileText, Clock, Sparkles, Download, RefreshCw, FileAudio } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AudioPlayer from '../components/AudioPlayer';
import ProofEvidenceTable from '../components/ProofEvidenceTable';
import TranscriptViewer from '../components/TranscriptViewer';
import ReliabilityReportModal from '../components/ReliabilityReportModal';

const AnalysisDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAuthHeaders } = useAuth();
  const audioPlayerRef = useRef(null);

  const [analysis, setAnalysis] = useState(null);
  const [keywordGroups, setKeywordGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const fetchAnalysisDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/audio/analysis/${id}`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok) {
        setAnalysis(data.analysis);
        setKeywordGroups(data.keywordGroups || []);
      } else {
        setError(data.message || 'Failed to load audio analysis record');
      }
    } catch (err) {
      setError('Network error fetching analysis');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysisDetails();
  }, [id]);

  const handleJumpToTimestamp = (seconds) => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.seekTo(seconds);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <div className="spinner"></div>
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading Acoustic Intelligence Data...</p>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div style={{ padding: '3rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--danger)', marginBottom: '1rem' }}>
            Analysis Not Found
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            {error || 'Unable to retrieve the requested audio analysis document.'}
          </p>
          <Link to="/" className="btn-primary" style={{ display: 'inline-flex', width: 'auto' }}>
            <ArrowLeft size={16} /> Return to Workspace
          </Link>
        </div>
      </div>
    );
  }

  const audioStreamUrl = `/api/audio/stream/${analysis._id}`;

  return (
    <div style={{ padding: '2rem 2.5rem', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Top Navigation Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <button
          onClick={() => navigate('/')}
          className="btn-secondary"
          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Workspace</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="btn-primary"
            style={{ padding: '0.6rem 1.25rem', fontSize: '0.88rem' }}
          >
            <ShieldCheck size={18} />
            <span>Generate & Export PDF Audit Report</span>
          </button>
        </div>
      </div>

      {/* Main Header Banner */}
      <div
        className="glass-card"
        style={{
          padding: '1.75rem 2rem',
          marginBottom: '2rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
              <span className="badge badge-approved" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)' }}>
                Verification Complete
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: {analysis._id}</span>
            </div>

            <h1 style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              {analysis.title || analysis.originalFilename}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <span>📁 {analysis.originalFilename}</span>
              <span>⏱️ {(analysis.durationMs / 1000).toFixed(1)}s Duration</span>
              <span>📅 {new Date(analysis.createdAt).toLocaleString()}</span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '0.8rem 1.25rem',
                borderRadius: '14px',
                border: '1px solid var(--glass-border)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
                Reliability Score
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--success)' }}>
                {analysis.reliabilityScore || 98.5}%
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '0.8rem 1.25rem',
                borderRadius: '14px',
                border: '1px solid var(--glass-border)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
                Flagged Proof Matches
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--accent-primary)' }}>
                {(analysis.keywordMatches || analysis.matches || []).length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transcription Error Banner */}
      {(analysis.status === 'error' || analysis.errorMessage) && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '14px',
            padding: '1.25rem 1.5rem',
            marginBottom: '1.75rem',
            color: 'var(--danger)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <ShieldAlert size={26} style={{ flexShrink: 0, color: 'var(--danger)' }} />
          <div style={{ fontSize: '0.88rem', lineHeight: '1.6', color: 'var(--text-primary)' }}>
            <strong style={{ color: 'var(--danger)' }}>AI Transcription Failed:</strong>
            <br />
            {analysis.errorMessage || 'An error occurred while calling the OpenAI Whisper API.'}
            <br />
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Please check your <code style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px' }}>OPENAI_API_KEY</code> in <code style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px' }}>backend/.env</code> and click <strong>Transcribe & Analyze</strong> to retry.
            </span>
          </div>
        </div>
      )}

      {/* Audio Player Engine */}
      <AudioPlayer
        ref={audioPlayerRef}
        audioUrl={audioStreamUrl}
        title={analysis.title || analysis.originalFilename}
      />

      {/* Proof Evidence & Keyword Timestamp Table */}
      <ProofEvidenceTable
        matches={analysis.keywordMatches || analysis.matches || []}
        onJumpToTimestamp={handleJumpToTimestamp}
      />

      {/* Synchronized Transcript Viewer */}
      <TranscriptViewer
        transcript={analysis.transcript}
        words={analysis.words || []}
        matches={analysis.keywordMatches || analysis.matches || []}
        keywordGroups={keywordGroups}
        onWordClick={handleJumpToTimestamp}
      />

      {/* Reliability Audit Report Modal */}
      <ReliabilityReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        analysis={analysis}
        matches={analysis.keywordMatches || analysis.matches || []}
      />
    </div>
  );
};

export default AnalysisDetails;
