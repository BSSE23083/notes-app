// notes-app/src/components/NoteForm.jsx

import React, { useState } from 'react';

const NoteForm = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!content.trim()) {
      setError('Note content is required');
      return;
    }

    setLoading(true);

    try {
      await onSubmit({
        title: title.trim() || 'Untitled',
        content: content.trim(),
      });

      setTitle('');
      setContent('');
      setError('');

    } catch (err) {
      const msg = typeof err === 'string' ? err : err?.message || 'Error creating note';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="note-form" onSubmit={handleSubmit}>
      <h2>Create Note</h2>

      {error && <div className="alert alert-error">⚠️ {error}</div>}

      <div className="form-group">
        <label htmlFor="note-title" className="form-label">Title (Optional)</label>
        <input
          id="note-title"
          type="text"
          className="form-control"
          placeholder="Note title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="note-content" className="form-label">Content *</label>
        <textarea
          id="note-content"
          className="form-control"
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="6"
          disabled={loading}
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Creating...' : 'Create Note'}
      </button>
    </form>
  );
};

export default NoteForm;
