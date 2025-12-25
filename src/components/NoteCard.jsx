import React from 'react';

const NoteCard = ({ note, onDelete, onEdit }) => {
  return (
    <div className="card">
      <h3>{note.title || 'Untitled'}</h3>
      <p>{note.content}</p>
      
      <div className="card-meta">
        📅 {new Date(note.createdAt).toLocaleDateString()}
      </div>

      <div className="card-actions">
        <button
          className="btn btn-sm btn-primary"
          onClick={() => onEdit(note)}
        >
          ✏️ Edit
        </button>
        <button
          className="btn btn-sm btn-danger"
          onClick={() => onDelete(note.id)}
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};

export default NoteCard;
