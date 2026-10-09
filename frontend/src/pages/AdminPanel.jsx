import React, { useState, useEffect } from 'react';
import { Shield, UserCheck, UserX, Clock, Search, RefreshCw, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  const { getAuthHeaders, handleSessionInvalidated } = useAuth();

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/users', {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.status === 401) {
        handleSessionInvalidated();
        return;
      }
      if (res.ok) {
        setUsers(data);
      } else {
        setError(data.message || 'Failed to load user management list');
      }
    } catch (err) {
      setError('Network error loading users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateStatus = async (userId, newStatus) => {
    setUpdatingId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prevUsers) =>
          prevUsers.map((u) => (u._id === userId ? { ...u, status: newStatus } : u))
        );
      } else {
        alert(data.message || 'Failed to update user status');
      }
    } catch (err) {
      alert('Network error updating status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'all' || u.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const pendingCount = users.filter((u) => u.status === 'pending').length;

  return (
    <div className="page-wrapper" style={{ padding: '1rem 0' }}>
      {/* Admin Banner */}
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <Shield size={20} style={{ color: 'var(--accent-primary)' }} />
              <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                Admin Control Center
              </h1>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Manage user account registrations, approve or revoke access permissions.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div
              style={{
                padding: '0.75rem 1.25rem',
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '14px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--warning)' }}>{pendingCount}</div>
              <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Pending Requests</div>
            </div>

            <button onClick={fetchUsers} className="btn-secondary" style={{ padding: '0.75rem 1.25rem' }}>
              <RefreshCw size={18} className={loading ? 'spin' : ''} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '1.25rem 1.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: '1', minWidth: '280px' }}>
          <div className="input-wrapper" style={{ width: '100%' }}>
            <Search className="input-icon" size={18} />
            <input
              type="text"
              className="glass-input"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['all', 'pending', 'approved', 'rejected'].map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className="btn-secondary"
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.85rem',
                textTransform: 'capitalize',
                background: statusFilter === filter ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.05)',
                color: statusFilter === filter ? '#ffffff' : 'var(--text-secondary)',
                borderColor: statusFilter === filter ? 'var(--accent-primary)' : 'var(--glass-border)',
              }}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={20} />
          <div>{error}</div>
        </div>
      )}

      {/* Users Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <div className="spinner" style={{ width: '36px', height: '36px', margin: '0 auto 1rem auto' }}></div>
            <p style={{ color: 'var(--text-secondary)' }}>Loading user accounts...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No accounts found matching your filters.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr
                  style={{
                    background: 'rgba(0, 0, 0, 0.15)',
                    borderBottom: '1px solid var(--glass-border)',
                    color: 'var(--text-muted)',
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  <th style={{ padding: '1rem 1.5rem' }}>User</th>
                  <th style={{ padding: '1rem 1.5rem' }}>Role</th>
                  <th style={{ padding: '1rem 1.5rem' }}>Status</th>
                  <th style={{ padding: '1rem 1.5rem' }}>Registered Date</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr
                    key={u._id}
                    style={{
                      borderBottom: '1px solid var(--glass-border)',
                      transition: 'background 0.2s ease',
                    }}
                  >
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                        {u.name}
                      </div>
                      <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>{u.email}</div>
                    </td>

                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <span className={`badge ${u.role === 'admin' ? 'badge-admin' : 'badge-approved'}`}>
                        {u.role}
                      </span>
                    </td>

                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <span
                        className={`badge ${
                          u.status === 'approved'
                            ? 'badge-approved'
                            : u.status === 'pending'
                            ? 'badge-pending'
                            : 'badge-rejected'
                        }`}
                      >
                        {u.status === 'pending' && <Clock size={12} />}
                        {u.status}
                      </span>
                    </td>

                    <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                      {new Date(u.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>

                    <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                      {u.role !== 'admin' && (
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          {u.status !== 'approved' && (
                            <button
                              onClick={() => handleUpdateStatus(u._id, 'approved')}
                              disabled={updatingId === u._id}
                              className="btn-success"
                              title="Approve User Account"
                            >
                              <UserCheck size={16} />
                              <span>Approve</span>
                            </button>
                          )}

                          {u.status !== 'rejected' && (
                            <button
                              onClick={() => handleUpdateStatus(u._id, 'rejected')}
                              disabled={updatingId === u._id}
                              className="btn-danger"
                              title="Reject / Revoke Account Access"
                            >
                              <UserX size={16} />
                              <span>Reject</span>
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
