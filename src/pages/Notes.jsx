import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";
import { useToast } from "../context/ToastContext";
import { notesAPI, subjectsAPI } from "../services/api";
import "../styles/Notes.css";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    subject_id: "",
    title: "",
    content: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    loadSubjects();
    loadNotes();
  }, [selectedSubject]);

  const loadSubjects = async () => {
    try {
      const response = await subjectsAPI.getAll();
      setSubjects(response.data.subjects || []);
    } catch (error) {
      console.error("Error loading subjects:", error);
    }
  };

  const loadNotes = async () => {
    try {
      setLoading(true);
      const response = await notesAPI.getAll(selectedSubject);
      setNotes(response.data.notes || []);
    } catch (error) {
      console.error("Error loading notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (editingId) {
        await notesAPI.update(editingId, formData);
        toast.success('Note updated successfully!');
      } else {
        await notesAPI.create(
          formData.subject_id,
          formData.title,
          formData.content,
        );
        toast.success('Note created successfully!');
      }
      setFormData({ subject_id: "", title: "", content: "" });
      setEditingId(null);
      setShowForm(false);
      loadNotes();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to save note");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (note) => {
    setFormData({
      subject_id: note.subject_id,
      title: note.title,
      content: note.content,
    });
    setEditingId(note._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this note?")) {
      try {
        await notesAPI.delete(id);
        toast.success('Note deleted successfully!');
        loadNotes();
      } catch (error) {
        toast.error(error.response?.data?.error || "Failed to delete note");
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1>My Notes</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary"
          >
            {showForm ? "Cancel" : "+ Add Note"}
          </button>
        </div>

        <div className="filter-bar">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="">All Subjects</option>
            {subjects.map((subject) => (
              <option key={subject._id} value={subject._id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        {showForm && (
          <div className="card form-card">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Subject</label>
                <select
                  value={formData.subject_id}
                  onChange={(e) =>
                    setFormData({ ...formData, subject_id: e.target.value })
                  }
                  required
                >
                  <option value="">Select Subject</option>
                  {subjects.map((subject) => (
                    <option key={subject._id} value={subject._id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Content</label>
                <textarea
                  rows="6"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : (editingId ? "Update" : "Add")} {submitting ? '' : 'Note'}
              </button>
            </form>
          </div>
        )}

        <div className="notes-grid">
          {loading ? (
            <LoadingSpinner size="large" />
          ) : notes.length === 0 ? (
            <p className="text-muted">
              No notes available. Create a new note to get started.
            </p>
          ) : (
            notes.map((note) => (
              <div key={note._id} className="note-card">
                <div className="note-header">
                  <h3>{note.title}</h3>
                  <div className="note-actions">
                    <button
                      onClick={() => handleEdit(note)}
                      className="btn-icon"
                      aria-label="Edit note"
                      title="Edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(note._id)}
                      className="btn-icon"
                      aria-label="Delete note"
                      title="Delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="note-content">{note.content}</p>
                <div className="note-footer">
                  <small>
                    {new Date(note.created_at).toLocaleDateString()}
                  </small>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notes;
