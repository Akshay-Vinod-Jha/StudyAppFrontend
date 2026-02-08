import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";
import { useToast } from "../context/ToastContext";
import { subjectsAPI } from "../services/api";
import "../styles/Subjects.css";

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", color: "#3498db" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      const response = await subjectsAPI.getAll();
      setSubjects(response.data.subjects || []);
    } catch (error) {
      console.error("Error loading subjects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (editingId) {
        await subjectsAPI.update(editingId, formData);
        toast.success('Subject updated successfully!');
      } else {
        await subjectsAPI.create(formData.name, formData.color);
        toast.success('Subject created successfully!');
      }
      setFormData({ name: "", color: "#3498db" });
      setEditingId(null);
      setShowForm(false);
      loadSubjects();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to save subject");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (subject) => {
    setFormData({ name: subject.name, color: subject.color });
    setEditingId(subject._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this subject?")) {
      try {
        await subjectsAPI.delete(id);
        toast.success('Subject deleted successfully!');
        loadSubjects();
      } catch (error) {
        toast.error(error.response?.data?.error || "Failed to delete subject");
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1>My Subjects</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary"
          >
            {showForm ? "Cancel" : "+ Add Subject"}
          </button>
        </div>

        {showForm && (
          <div className="card form-card">
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Subject Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Color</label>
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : (editingId ? "Update" : "Add")} {submitting ? '' : 'Subject'}
              </button>
            </form>
          </div>
        )}

        <div className="subjects-grid">
          {loading ? (
            <LoadingSpinner size="large" />
          ) : subjects.length === 0 ? (
            <p className="text-muted">
              No subjects available. Create a new subject to begin.
            </p>
          ) : (
            subjects.map((subject) => (
              <div
                key={subject._id}
                className="subject-card"
                style={{ borderLeft: `4px solid ${subject.color}` }}
              >
                <div className="subject-header">
                  <h3>{subject.name}</h3>
                  <div className="subject-actions">
                    <button
                      onClick={() => handleEdit(subject)}
                      className="btn-icon"
                      aria-label="Edit subject"
                      title="Edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(subject._id)}
                      className="btn-icon"
                      aria-label="Delete subject"
                      title="Delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div
                  className="subject-color"
                  style={{ backgroundColor: subject.color }}
                ></div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Subjects;
