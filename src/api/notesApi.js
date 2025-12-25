import axios from 'axios';
import authService from '../auth/authService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authService.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const getNotes = async () => {
  const response = await api.get('/notes');
  return response.data;
};

const getNoteById = async (noteId) => {
  const response = await api.get(`/notes/${noteId}`);
  return response.data;
};

const createNote = async (noteData) => {
  try {
    const response = await api.post('/notes', noteData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error creating note' };
  }
};

const updateNote = async (noteId, noteData) => {
  try {
    const response = await api.put(`/notes/${noteId}`, noteData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error updating note' };
  }
};

const deleteNote = async (noteId) => {
  try {
    const response = await api.delete(`/notes/${noteId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error deleting note' };
  }
};

export default {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
};
