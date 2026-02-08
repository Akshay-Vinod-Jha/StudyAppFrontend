import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import { studyLogsAPI, subjectsAPI } from '../services/api';
import '../styles/Tracker.css';

const Tracker = () => {
  const [logs, setLogs] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    subject_id: '',
    hours_studied: '',
    notes: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    loadSubjects();
    loadLogs();
  }, []);

  const loadSubjects = async () => {
    try {
      const response = await subjectsAPI.getAll();
      setSubjects(response.data.subjects || []);
    } catch (error) {
      console.error('Error loading subjects:', error);
    }
  };

  const loadLogs = async () => {
    try {
      setLoading(true);
      const response = await studyLogsAPI.getAll(30);
      setLogs(response.data.logs || []);
    } catch (error) {
      console.error('Error loading logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await studyLogsAPI.create(
        formData.subject_id,
        parseFloat(formData.hours_studied),
        formData.notes
      );
      toast.success('Study time logged successfully!');
      setFormData({ subject_id: '', hours_studied: '', notes: '' });
      setShowForm(false);
      loadLogs();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to log study time');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this log?')) {
      try {
        await studyLogsAPI.delete(id);
        toast.success('Study log deleted successfully!');
        loadLogs();
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to delete log');
      }
    }
  };

  const getSubjectName = (subjectId) => {
    const subject = subjects.find((s) => s._id === subjectId);
    return subject ? subject.name : 'Unknown';
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1>Study Tracker</h1>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            {showForm ? 'Cancel' : '+ Log Study Time'}
          </button>
        </div>

        {showForm && (
          <div className="card form-card">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Subject</label>
                <select
                  value={formData.subject_id}
                  onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })}
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
                <label>Hours Studied</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  value={formData.hours_studied}
                  onChange={(e) => setFormData({ ...formData, hours_studied: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Notes (optional)</label>
                <textarea
                  rows="3"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="What did you study today?"
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Logging...' : 'Log Study Time'}
              </button>
            </form>
          </div>
        )}

        <div className="logs-container">
          {loading ? (
            <LoadingSpinner size="large" />
          ) : logs.length === 0 ? (
            <p className="text-muted">No study sessions recorded. Log your study time to track progress.</p>
          ) : (
            <div className="logs-list">
              {logs.map((log) => (
                <div key={log._id} className="log-card">
                  <div className="log-main">
                    <div className="log-subject">
                      <strong>{getSubjectName(log.subject_id)}</strong>
                    </div>
                    <div className="log-hours">{log.hours_studied} hrs</div>
                  </div>
                  <div className="log-date">
                    {new Date(log.date).toLocaleDateString()} at{' '}
                    {new Date(log.date).toLocaleTimeString()}
                  </div>
                  {log.notes && <p className="log-notes">{log.notes}</p>}
                  <button 
                    onClick={() => handleDelete(log._id)} 
                    className="btn-icon delete-btn"
                    aria-label="Delete log"
                    title="Delete"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tracker;
