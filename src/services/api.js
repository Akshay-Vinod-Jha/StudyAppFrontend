import axios from "axios";

const API_ORIGIN = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const API_BASE_URL = `${API_ORIGIN.replace(/\/$/, "")}/api`;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("study_buddy_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("study_buddy_token");
      localStorage.removeItem("study_buddy_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  signup: (name, email, password) =>
    api.post("/auth/signup", { name, email, password }),
  getProfile: () => api.get("/auth/profile"),
};

// Subjects API
export const subjectsAPI = {
  getAll: () => api.get("/subjects"),
  create: (name, color) => api.post("/subjects", { name, color }),
  update: (id, data) => api.put(`/subjects/${id}`, data),
  delete: (id) => api.delete(`/subjects/${id}`),
};

// Notes API
export const notesAPI = {
  getAll: (subjectId) =>
    api.get("/notes", { params: { subject_id: subjectId } }),
  create: (subjectId, title, content) =>
    api.post("/notes", { subject_id: subjectId, title, content }),
  update: (id, data) => api.put(`/notes/${id}`, data),
  delete: (id) => api.delete(`/notes/${id}`),
};

// Study Logs API
export const studyLogsAPI = {
  getAll: (days = 30) => api.get("/study-logs", { params: { days } }),
  create: (subjectId, hoursStudied, notes = "") =>
    api.post("/study-logs", {
      subject_id: subjectId,
      hours_studied: hoursStudied,
      notes,
    }),
  getTotalHours: (subjectId) =>
    api.get("/study-logs/total", {
      params: subjectId ? { subject_id: subjectId } : {},
    }),
  delete: (id) => api.delete(`/study-logs/${id}`),
};

// Analytics API
export const analyticsAPI = {
  getOverview: (days = 30) =>
    api.get("/analytics/overview", { params: { days } }),
};

// Chatbot API
export const chatbotAPI = {
  chat: (message, history = []) =>
    api.post("/chatbot/chat", { message, history }),
  health: () => api.get("/chatbot/health"),
};

export default api;
