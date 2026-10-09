import React, { useState } from 'react';
import { Tag, Plus, Trash2, Check, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const colorOptions = ['#ef4444', '#f59e0b', '#10b981', '#06b6d4', '#6366f1', '#a855f7', '#ec4899'];

const KeywordManager = ({ keywordGroups, onGroupSaved, onGroupDeleted, showAlert, showConfirm }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#6366f1');
  const [keywordsInput, setKeywordsInput] = useState('');
  const [saving, setSaving] = useState(false);

  const { getAuthHeaders } = useAuth();

  const handleSaveGroup = async (e) => {
    e.preventDefault();
    if (!name || !keywordsInput) return;

    const keywords = keywordsInput
      .split(',')
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    setSaving(true);
    try {
      const res = await fetch('/api/keywords', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name, color, keywords }),
      });

      const data = await res.json();
      if (res.ok) {
        setName('');
        setKeywordsInput('');
        setShowAddForm(false);
        if (showAlert) showAlert('success', 'Group Created', `Keyword group "${name}" created successfully.`);
        if (onGroupSaved) onGroupSaved(data);
      } else {
        if (showAlert) showAlert('error', 'Group Creation Failed', data.message || 'Failed to save keyword group.');
      }
    } catch (err) {
      if (showAlert) showAlert('error', 'Error', 'An error occurred while saving group.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGroup = (id, groupName) => {
    const confirmAction = async () => {
      try {
        const res = await fetch(`/api/keywords/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
        });
        if (res.ok) {
          if (showAlert) showAlert('success', 'Group Deleted', 'Keyword group deleted successfully.');
          if (onGroupDeleted) onGroupDeleted(id);
        }
      } catch (err) {
        if (showAlert) showAlert('error', 'Delete Error', 'An error occurred while deleting group.');
      }
    };

    if (showConfirm) {
      showConfirm('Delete Keyword Group', `Are you sure you want to delete the "${groupName}" keyword group?`, confirmAction);
    } else {
      confirmAction();
    }
  };

  return (
    <div className="glass-card" style={{ marginBottom: '1.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Tag size={20} style={{ color: 'var(--accent-primary)' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            Keyword Intelligence Groups & Tagging
          </h3>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-secondary"
          style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}
        >
          <Plus size={16} />
          <span>{showAddForm ? 'Cancel' : 'New Keyword Group'}</span>
        </button>
      </div>

      {/* Add New Group Form */}
      {showAddForm && (
        <form
          onSubmit={handleSaveGroup}
          style={{
            background: 'rgba(0, 0, 0, 0.2)',
            padding: '1.25rem',
            borderRadius: '14px',
            border: '1px solid var(--glass-border)',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="glass-input-group" style={{ marginBottom: 0 }}>
              <label className="glass-label">Group Name</label>
              <input
                type="text"
                className="glass-input"
                style={{ paddingLeft: '1rem' }}
                placeholder="e.g. Critical Risk Terms"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="glass-input-group" style={{ marginBottom: 0 }}>
              <label className="glass-label">Highlight Badge Color</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', height: '44px' }}>
                {colorOptions.map((c) => (
                  <div
                    key={c}
                    onClick={() => setColor(c)}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: c,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: color === c ? '2px solid #ffffff' : 'none',
                      boxShadow: color === c ? `0 0 10px ${c}` : 'none',
                    }}
                  >
                    {color === c && <Check size={14} style={{ color: '#fff' }} />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-input-group" style={{ marginBottom: '1rem' }}>
            <label className="glass-label">Target Keywords (comma-separated)</label>
            <input
              type="text"
              className="glass-input"
              style={{ paddingLeft: '1rem' }}
              placeholder="breach, unauthorized, password, risk, alert"
              value={keywordsInput}
              onChange={(e) => setKeywordsInput(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={saving} style={{ width: 'auto', padding: '0.6rem 1.5rem' }}>
            {saving ? <div className="spinner"></div> : <><Sparkles size={16} /> Save Keyword Group</>}
          </button>
        </form>
      )}

      {/* Groups Display Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        {(keywordGroups || []).map((group) => (
          <div
            key={group._id}
            style={{
              padding: '1rem',
              borderRadius: '14px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: `1px solid ${group.color}40`,
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span
                style={{
                  fontSize: '0.85rem',
                  fontWeight: '800',
                  color: group.color,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                {group.name}
              </span>

              <button
                onClick={() => handleDeleteGroup(group._id, group.name)}
                className="btn-secondary"
                style={{ padding: '0.25rem 0.4rem', border: 'none', background: 'transparent', color: 'var(--text-muted)' }}
                title="Delete Group"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {(group.keywords || []).map((kw, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '0.75rem',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '6px',
                    background: `${group.color}15`,
                    color: group.color,
                    fontWeight: '600',
                  }}
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeywordManager;
