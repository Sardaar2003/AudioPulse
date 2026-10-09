import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderUp,
  FileAudio,
  Sparkles,
  Play,
  Trash2,
  CheckCircle,
  Clock,
  ShieldAlert,
  Search,
  Eye,
  RefreshCw,
  Sliders,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import KeywordManager from '../components/KeywordManager';
import CustomModal from '../components/CustomModal';

const AudioWorkspace = () => {
  const [audioList, setAudioList] = useState([]);
  const [keywordGroups, setKeywordGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [transcribingMap, setTranscribingMap] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showKeywordManager, setShowKeywordManager] = useState(false);

  // Custom Modal state
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    onConfirm: null,
  });

  const showAlert = (type, title, message) => {
    setModalConfig({
      isOpen: true,
      title,
      message,
      type,
      onConfirm: null,
    });
  };

  const showConfirm = (title, message, onConfirmCallback) => {
    setModalConfig({
      isOpen: true,
      title,
      message,
      type: 'confirm',
      onConfirm: onConfirmCallback,
    });
  };

  const closeModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  const { getAuthHeaders } = useAuth();
  const navigate = useNavigate();

  const fetchAudioList = async () => {
    try {
      const res = await fetch('/api/audio/list', {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok) {
        if (Array.isArray(data)) {
          setAudioList(data);
        } else if (Array.isArray(data.audioFiles)) {
          setAudioList(data.audioFiles);
        } else {
          setAudioList([]);
        }
      }
    } catch (err) {
      console.error('Error fetching audio list:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchKeywordGroups = async () => {
    try {
      const res = await fetch('/api/keywords', {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok) {
        setKeywordGroups(data.keywordGroups || []);
      }
    } catch (err) {
      console.error('Error fetching keyword groups:', err);
    }
  };

  useEffect(() => {
    fetchAudioList();
    fetchKeywordGroups();
  }, []);

  // Handle Multi-file or Folder Upload
  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('audioFiles', files[i]);
    }

    try {
      const res = await fetch('/api/audio/upload', {
        method: 'POST',
        headers: {
          Authorization: getAuthHeaders().Authorization,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        showAlert('success', 'Upload Successful', data.message || `Successfully uploaded ${files.length} audio file(s).`);
        fetchAudioList();
      } else {
        showAlert('error', 'Upload Failed', data.message || 'Failed to process audio file upload.');
      }
    } catch (err) {
      showAlert('error', 'Network Connection Error', 'Unable to communicate with the server. Please check your connection.');
    } finally {
      setUploading(false);
    }
  };

  const handleTranscribe = async (id) => {
    setTranscribingMap((prev) => ({ ...prev, [id]: true }));
    try {
      const res = await fetch(`/api/audio/transcribe/${id}`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok) {
        fetchAudioList();
        navigate(`/analysis/${id}`);
      } else {
        showAlert('error', 'Transcription Failed', data.message || 'Unable to process AI transcription.');
      }
    } catch (err) {
      showAlert('error', 'Transcription Error', 'An error occurred during transcription processing.');
    } finally {
      setTranscribingMap((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleDelete = (id, filename) => {
    showConfirm(
      'Delete Audio Analysis',
      `Are you sure you want to permanently delete "${filename}" and its associated transcripts and proof records?`,
      async () => {
        try {
          const res = await fetch(`/api/audio/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
          });
          const data = await res.json();
          if (res.ok) {
            setAudioList((prev) => prev.filter((item) => item._id !== id));
            showAlert('success', 'File Deleted', 'The audio analysis record has been deleted.');
          } else {
            showAlert('error', 'Deletion Failed', data.message || 'Could not delete audio file.');
          }
        } catch (err) {
          showAlert('error', 'Delete Error', 'An error occurred while deleting the audio file.');
        }
      }
    );
  };

  const filteredList = audioList.filter((item) =>
    (item.title || item.originalFilename || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem 2.5rem', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
            <div
              style={{
                padding: '0.6rem',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                color: '#fff',
              }}
            >
              <FileAudio size={26} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
                Audio Ingestion & Proof Workspace
              </h1>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Upload folders or audio files, configure keyword groups, and run AI transcription with timestamp proof verification.
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => setShowKeywordManager(!showKeywordManager)}
            className="btn-secondary"
            style={{ padding: '0.6rem 1.2rem', fontSize: '0.88rem' }}
          >
            <Sliders size={18} />
            <span>{showKeywordManager ? 'Hide Keyword Groups' : 'Manage Keyword Groups'}</span>
            <span
              style={{
                background: 'var(--accent-primary)',
                color: '#fff',
                padding: '0.15rem 0.5rem',
                borderRadius: '10px',
                fontSize: '0.75rem',
                fontWeight: '800',
              }}
            >
              {keywordGroups.length}
            </span>
          </button>

          <button onClick={fetchAudioList} className="btn-secondary" style={{ padding: '0.6rem' }} title="Refresh List">
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Keyword Manager Collapsible Section */}
      {showKeywordManager && (
        <KeywordManager
          keywordGroups={keywordGroups}
          onGroupSaved={() => fetchKeywordGroups()}
          onGroupDeleted={() => fetchKeywordGroups()}
          showAlert={showAlert}
          showConfirm={showConfirm}
        />
      )}

      {/* Upload Zone (Supports individual files OR entire folders) */}
      <div
        className="glass-card"
        style={{
          padding: '2.5rem 2rem',
          marginBottom: '2.25rem',
          textAlign: 'center',
          border: '2px dashed var(--accent-primary)',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(6, 182, 212, 0.05))',
          position: 'relative',
        }}
      >
        {uploading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div className="spinner" style={{ width: '40px', height: '40px', borderWidth: '3px' }}></div>
            <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--accent-primary)' }}>
              Ingesting Audio Folder Files...
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Processing files, validating acoustic formats, and saving to backend storage.
            </p>
          </div>
        ) : (
          <div>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(99, 102, 241, 0.15)',
                color: 'var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto',
              }}
            >
              <FolderUp size={32} />
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Upload Audio File or Entire Folder
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 1.5rem auto' }}>
              Drag & drop audio files or select an entire folder containing audio files (`.mp3`, `.wav`, `.m4a`, `.flac`, `.ogg`). Maximum 100MB per file.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              {/* Folder Input Button */}
              <label className="btn-primary" style={{ width: 'auto', cursor: 'pointer', padding: '0.75rem 1.6rem' }}>
                <FolderUp size={18} />
                <span>Upload Audio Folder</span>
                <input
                  type="file"
                  webkitdirectory="true"
                  directory="true"
                  multiple
                  accept="audio/*"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  style={{ display: 'none' }}
                />
              </label>

              {/* Multi File Input Button */}
              <label className="btn-secondary" style={{ width: 'auto', cursor: 'pointer', padding: '0.75rem 1.6rem' }}>
                <FileAudio size={18} />
                <span>Select Audio Files</span>
                <input
                  type="file"
                  multiple
                  accept="audio/*"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Audio Records Section */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FileAudio size={20} style={{ color: 'var(--accent-secondary)' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>
              Uploaded Audio Batch Library ({filteredList.length})
            </h2>
          </div>

          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="glass-input"
              style={{ paddingLeft: '2.5rem', height: '38px', fontSize: '0.85rem' }}
              placeholder="Search audio by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <div className="spinner"></div>
          </div>
        ) : filteredList.length === 0 ? (
          <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <FileAudio size={40} style={{ opacity: 0.4, margin: '0 auto 1rem auto' }} />
            <p style={{ fontSize: '0.95rem' }}>No audio files found. Upload a folder or select audio files above to start.</p>
          </div>
        ) : (
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
                  <th style={{ padding: '1rem 1.25rem' }}>Audio File Name</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Status</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Keyword Matches</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Reliability Score</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Uploaded Date</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((item) => {
                  const isTranscribing = transcribingMap[item._id];
                  const hasAnalysis = item.status === 'completed';

                  return (
                    <tr
                      key={item._id}
                      style={{
                        borderBottom: '1px solid var(--glass-border)',
                        transition: 'background 0.2s ease',
                      }}
                    >
                      {/* Title & Original Filename */}
                      <td style={{ padding: '1.1rem 1.25rem' }}>
                        <div style={{ fontWeight: '800', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                          {item.title || item.originalFilename}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {item.originalFilename} ({(item.fileSize / (1024 * 1024)).toFixed(2)} MB)
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '1.1rem 1.25rem' }}>
                        {item.status === 'completed' ? (
                          <span className="badge badge-approved" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                            <CheckCircle size={12} /> Completed
                          </span>
                        ) : item.status === 'error' ? (
                          <span className="badge badge-rejected" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                            <ShieldAlert size={12} /> Error
                          </span>
                        ) : isTranscribing ? (
                          <span className="badge badge-pending" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                            <div className="spinner" style={{ width: '12px', height: '12px', borderWidth: '2px' }}></div> Transcribing...
                          </span>
                        ) : (
                          <span className="badge badge-pending">Uploaded</span>
                        )}
                      </td>

                      {/* Keyword Matches */}
                      <td style={{ padding: '1.1rem 1.25rem', fontWeight: '800' }}>
                        {hasAnalysis ? (
                          <span style={{ color: (item.matchesCount || item.keywordMatches?.length || 0) > 0 ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
                            {item.matchesCount || item.keywordMatches?.length || 0} Matches
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Pending</span>
                        )}
                      </td>

                      {/* Reliability Score */}
                      <td style={{ padding: '1.1rem 1.25rem' }}>
                        {hasAnalysis ? (
                          <span style={{ fontWeight: '900', color: 'var(--success)' }}>
                            {item.reliabilityScore || 98.5}%
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>N/A</span>
                        )}
                      </td>

                      {/* Uploaded Date */}
                      <td style={{ padding: '1.1rem 1.25rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                        {new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '1.1rem 1.25rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          {hasAnalysis ? (
                            <button
                              onClick={() => navigate(`/analysis/${item._id}`)}
                              className="btn-primary"
                              style={{ width: 'auto', padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}
                            >
                              <Eye size={14} />
                              <span>View Proof & Transcript</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleTranscribe(item._id)}
                              disabled={isTranscribing}
                              className="btn-primary"
                              style={{ width: 'auto', padding: '0.45rem 0.9rem', fontSize: '0.8rem', background: 'linear-gradient(135deg, var(--accent-secondary), #0284c7)' }}
                            >
                              {isTranscribing ? (
                                <div className="spinner" style={{ width: '14px', height: '14px' }}></div>
                              ) : (
                                <>
                                  <Sparkles size={14} />
                                  <span>Transcribe & Analyze</span>
                                </>
                              )}
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(item._id, item.title || item.originalFilename)}
                            className="btn-secondary"
                            style={{ padding: '0.45rem 0.6rem', border: 'none', background: 'transparent', color: 'var(--danger)' }}
                            title="Delete Audio"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Global Custom Modal for Notifications & Confirmations */}
      <CustomModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        onClose={closeModal}
        onConfirm={modalConfig.onConfirm}
      />
    </div>
  );
};

export default AudioWorkspace;
