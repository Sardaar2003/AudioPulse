import React, { useState, useEffect } from 'react';
import { Terminal, Search, Trash2, ChevronLeft, ChevronRight, RefreshCw, CheckCircle, AlertTriangle, Eye, X, FileJson, Server, User, Clock, ShieldCheck, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ApiLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Pagination state
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalLogs, setTotalLogs] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Selected Log for Eye Modal Inspection
  const [selectedLog, setSelectedLog] = useState(null);

  const { getAuthHeaders, handleSessionInvalidated } = useAuth();

  // Fetch real logs from MongoDB via backend API
  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        category: categoryFilter,
        status: statusFilter,
        search: searchTerm,
      });

      const res = await fetch(`/api/logs?${params.toString()}`, {
        headers: getAuthHeaders(),
      });

      const data = await res.json();

      if (res.status === 401) {
        handleSessionInvalidated();
        return;
      }

      if (res.ok) {
        setLogs(data.logs || []);
        setTotalLogs(data.totalLogs || 0);
        setTotalPages(data.totalPages || 1);
      } else {
        setError(data.message || 'Failed to retrieve API logs from database');
      }
    } catch (err) {
      console.error('Error fetching logs:', err);
      setError('Network error connecting to logs database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [currentPage, itemsPerPage, categoryFilter, statusFilter]);

  // Debounced search trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLogs();
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const clearAllLogs = async () => {
    if (!window.confirm('Are you sure you want to permanently clear all API logs from MongoDB?')) return;
    try {
      const res = await fetch('/api/logs', {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        fetchLogs();
      } else {
        alert('Failed to clear database logs');
      }
    } catch (err) {
      alert('Error connecting to backend');
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;

  // Format response data for clean single-record view
  const formatResponseData = (data) => {
    if (!data) return { status: 'No payload data' };
    if (data.logs && Array.isArray(data.logs)) {
      return {
        summary: 'Log Query Executed',
        recordsRetrieved: data.logs.length,
        totalLogsInDB: data.totalLogs || data.logs.length,
      };
    }
    return data;
  };

  return (
    <div className="page-wrapper">
      {/* Header Banner */}
      <div className="glass-card" style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(6, 182, 212, 0.15)',
                  color: 'var(--accent-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Terminal size={20} />
              </div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                API & System Request Logs
              </h1>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Select any log entry and click <strong>View</strong> to inspect full payload, parameters, and response details for that record.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={fetchLogs} className="btn-secondary" title="Refresh logs from MongoDB">
              <RefreshCw size={16} className={loading ? 'spin' : ''} />
              <span>Refresh</span>
            </button>
            <button onClick={clearAllLogs} className="btn-secondary" style={{ color: 'var(--danger)' }}>
              <Trash2 size={16} />
              <span>Clear DB Logs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Controls Toolbar */}
      <div
        className="glass-panel"
        style={{
          padding: '1.25rem 1.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Search Input */}
          <div className="input-wrapper" style={{ flex: '1', minWidth: '280px' }}>
            <Search className="input-icon" size={18} />
            <input
              type="text"
              className="glass-input"
              placeholder="Search by endpoint, user email, or category..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Items Per Page Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Show:</span>
            <select
              className="glass-input"
              style={{ width: '90px', padding: '0.45rem 0.75rem' }}
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Category & Status Filter Pills */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
          {/* Category Filter */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Category:</span>
            {['ALL', 'API', 'AUTH', 'ADMIN'].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategoryFilter(cat);
                  setCurrentPage(1);
                }}
                className="btn-secondary"
                style={{
                  padding: '0.35rem 0.8rem',
                  fontSize: '0.8rem',
                  background: categoryFilter === cat ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.05)',
                  color: categoryFilter === cat ? '#fff' : 'var(--text-secondary)',
                  borderColor: categoryFilter === cat ? 'var(--accent-primary)' : 'var(--glass-border)',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Status:</span>
            {[
              { label: 'All Status', val: 'ALL' },
              { label: '2xx Success', val: '2XX' },
              { label: '4xx Warning', val: '4XX' },
              { label: '5xx Error', val: '5XX' },
            ].map((st) => (
              <button
                key={st.val}
                onClick={() => {
                  setStatusFilter(st.val);
                  setCurrentPage(1);
                }}
                className="btn-secondary"
                style={{
                  padding: '0.35rem 0.8rem',
                  fontSize: '0.8rem',
                  background: statusFilter === st.val ? 'var(--accent-secondary)' : 'rgba(255, 255, 255, 0.05)',
                  color: statusFilter === st.val ? '#fff' : 'var(--text-secondary)',
                  borderColor: statusFilter === st.val ? 'var(--accent-secondary)' : 'var(--glass-border)',
                }}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Streamlined API Logs Glass Table */}
      <div className="glass-panel" style={{ overflow: 'hidden', marginBottom: '1.5rem', width: '100%' }}>
        {loading ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <div className="spinner" style={{ width: '36px', height: '36px', margin: '0 auto 1rem auto' }}></div>
            <p style={{ color: 'var(--text-secondary)' }}>Loading log records...</p>
          </div>
        ) : error ? (
          <div style={{ padding: '3rem 2rem', textAlign: 'center', color: 'var(--danger)' }}>
            <AlertTriangle size={32} style={{ margin: '0 auto 0.75rem auto' }} />
            <p>{error}</p>
          </div>
        ) : logs.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Terminal size={36} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
            <p style={{ fontSize: '1rem', fontWeight: '600' }}>No log entries found matching your search filter.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.85rem' }}>
              <thead>
                <tr
                  style={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderBottom: '1px solid var(--glass-border)',
                    color: 'var(--text-muted)',
                    fontSize: '0.78rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  <th style={{ padding: '1rem 1.25rem' }}>Method & Endpoint</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Category</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Status</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Timestamp</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Inspect Record</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => {
                  const isError = log.statusCode >= 400;
                  const isSuccess = log.statusCode >= 200 && log.statusCode < 300;
                  const cleanUrl = log.url ? log.url.split('?')[0] : '';

                  return (
                    <tr
                      key={log._id}
                      style={{
                        borderBottom: '1px solid var(--glass-border)',
                        background: isError ? 'rgba(239, 68, 68, 0.04)' : 'transparent',
                        transition: 'background 0.2s ease',
                      }}
                    >
                      {/* Method & Clean Endpoint */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <span
                            style={{
                              padding: '0.15rem 0.45rem',
                              borderRadius: '4px',
                              fontSize: '0.72rem',
                              fontWeight: '800',
                              background:
                                log.method === 'GET'
                                  ? 'rgba(6, 182, 212, 0.2)'
                                  : log.method === 'POST'
                                  ? 'rgba(99, 102, 241, 0.2)'
                                  : log.method === 'PATCH'
                                  ? 'rgba(245, 158, 11, 0.2)'
                                  : 'rgba(239, 68, 68, 0.2)',
                              color:
                                log.method === 'GET'
                                  ? 'var(--accent-secondary)'
                                  : log.method === 'POST'
                                  ? 'var(--accent-primary)'
                                  : log.method === 'PATCH'
                                  ? 'var(--warning)'
                                  : 'var(--danger)',
                            }}
                          >
                            {log.method}
                          </span>
                          <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{cleanUrl}</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span className="badge badge-approved" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}>
                          {log.category}
                        </span>
                      </td>

                      {/* Status Code */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            background: isError
                              ? 'rgba(239, 68, 68, 0.15)'
                              : isSuccess
                              ? 'rgba(16, 185, 129, 0.15)'
                              : 'rgba(99, 102, 241, 0.15)',
                            color: isError ? 'var(--danger)' : isSuccess ? 'var(--success)' : 'var(--accent-primary)',
                            border: `1px solid ${
                              isError
                                ? 'rgba(239, 68, 68, 0.3)'
                                : isSuccess
                                ? 'rgba(16, 185, 129, 0.3)'
                                : 'rgba(99, 102, 241, 0.3)'
                            }`,
                          }}
                        >
                          {isSuccess && <CheckCircle size={12} />}
                          {isError && <AlertTriangle size={12} />}
                          {log.statusCode}
                        </span>
                      </td>

                      {/* Timestamp */}
                      <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                        {new Date(log.createdAt || log.timestamp).toLocaleString()}
                      </td>

                      {/* View Action Button */}
                      <td style={{ padding: '1rem 1.25rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="btn-secondary"
                          style={{ padding: '0.4rem 0.85rem', borderRadius: '8px', fontSize: '0.8rem' }}
                          title="View Single Record Details"
                        >
                          <Eye size={16} style={{ color: 'var(--accent-primary)' }} />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div
        className="glass-panel"
        style={{
          padding: '0.85rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          Showing <strong>{totalLogs > 0 ? startIndex + 1 : 0}</strong> to{' '}
          <strong>{Math.min(startIndex + itemsPerPage, totalLogs)}</strong> of{' '}
          <strong>{totalLogs}</strong> database records
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="btn-secondary"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </button>

          <span style={{ fontSize: '0.88rem', fontWeight: '700', padding: '0 0.5rem', color: 'var(--text-primary)' }}>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="btn-secondary"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
          >
            <span>Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Single Record Detail Modal */}
      {selectedLog && (
        <div className="modal-overlay">
          <div
            className="glass-card modal-content"
            style={{ maxWidth: '750px', width: '92%', maxHeight: '88vh', overflowY: 'auto', padding: '2rem' }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    padding: '0.6rem',
                    borderRadius: '12px',
                    background: 'rgba(99, 102, 241, 0.15)',
                    color: 'var(--accent-primary)',
                  }}
                >
                  <Eye size={24} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                    Single Record Details
                  </h2>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Log ID: {selectedLog._id}
                  </div>
                </div>
              </div>

              <button onClick={() => setSelectedLog(null)} className="btn-secondary" style={{ padding: '0.4rem', borderRadius: '50%' }}>
                <X size={18} />
              </button>
            </div>

            {/* Single Record Properties */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1rem',
                marginBottom: '1.5rem',
              }}
            >
              <div style={{ padding: '0.85rem 1rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600' }}>HTTP METHOD & ENDPOINT</div>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '0.2rem', wordBreak: 'break-all' }}>
                  {selectedLog.method} {selectedLog.url}
                </div>
              </div>

              <div style={{ padding: '0.85rem 1rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600' }}>STATUS CODE</div>
                <div style={{ fontSize: '0.95rem', fontWeight: '700', color: selectedLog.statusCode >= 400 ? 'var(--danger)' : 'var(--success)', marginTop: '0.2rem' }}>
                  HTTP {selectedLog.statusCode}
                </div>
              </div>

              <div style={{ padding: '0.85rem 1rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600' }}>USER / CLIENT IP</div>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                  {selectedLog.userEmail || 'Anonymous'} ({selectedLog.ip})
                </div>
              </div>

              <div style={{ padding: '0.85rem 1rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600' }}>EXECUTION DURATION & TIME</div>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                  {selectedLog.durationMs}ms — {new Date(selectedLog.createdAt || selectedLog.timestamp).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Request Body Details */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FileJson size={16} />
                <span>REQUEST BODY / PARAMETERS</span>
              </div>
              <pre
                style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  padding: '1rem',
                  borderRadius: '10px',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--text-primary)',
                  fontSize: '0.82rem',
                  overflowX: 'auto',
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {JSON.stringify(selectedLog.requestBody || {}, null, 2)}
              </pre>
            </div>

            {/* Response Payload Details */}
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Server size={16} />
                <span>RESPONSE PAYLOAD SUMMARY</span>
              </div>
              <pre
                style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  padding: '1rem',
                  borderRadius: '10px',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--text-primary)',
                  fontSize: '0.82rem',
                  overflowX: 'auto',
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {JSON.stringify(formatResponseData(selectedLog.responseData), null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiLogs;
