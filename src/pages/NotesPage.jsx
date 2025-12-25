import React, { useState, useEffect } from 'react';
import NoteForm from '../components/NoteForm';
import NoteCard from '../components/NoteCard';
import EditNoteModal from '../components/EditNoteModal';
import notesApi from '../api/notesApi';
import '../App.css';  // Add this
import '../styles/Modal.css';  // Add this


const NotesPage = ({ onLogout }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Load notes on mount
  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const response = await notesApi.getNotes();
      const notesArray = response.notes || [];
      // Sort by newest first
      setNotes(notesArray.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)));
      setError('');
    } catch (err) {
      setError(err.message || 'Error loading notes');
      console.error('Error loading notes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (noteData) => {
    try {
      await notesApi.createNote(noteData);
      await loadNotes();
      setError('');
    } catch (err) {
      setError(err.message || 'Error creating note');
      console.error('Error creating note:', err);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await notesApi.deleteNote(noteId);
      setNotes(notes.filter((note) => note.id !== noteId));
      setError('');
    } catch (err) {
      setError(err.message || 'Error deleting note');
      console.error('Error deleting note:', err);
    }
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setIsEditModalOpen(true);
  };

  const handleSaveEditNote = async (updates) => {
    try {
      await notesApi.updateNote(editingNote.id, updates);
      await loadNotes();
      setEditingNote(null);
      setIsEditModalOpen(false);
      setError('');
    } catch (err) {
      throw err;
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingNote(null);
  };

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1>📝 Notes</h1>
          <p className="subtitle">Your Notes ({notes.length})</p>
        </div>
        <button
          className="btn btn-logout"
          onClick={onLogout}
          aria-label="Logout"
        >
          Logout
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>⚠️</span>
          {error}
        </div>
      )}

      <div className="notes-container">
        <div className="notes-sidebar">
          <NoteForm onSubmit={handleAddNote} />
        </div>

        <div className="notes-grid">
          {loading ? (
            <p className="loading">Loading notes...</p>
          ) : notes.length === 0 ? (
            <p className="empty-state">No notes yet. Create your first note!</p>
          ) : (
            notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onDelete={handleDeleteNote}
                onEdit={handleEditNote}
              />
            ))
          )}
        </div>
      </div>

      <EditNoteModal
        isOpen={isEditModalOpen}
        note={editingNote}
        onClose={handleCloseEditModal}
        onSave={handleSaveEditNote}
      />
    </div>
  );
};

export default NotesPage;
