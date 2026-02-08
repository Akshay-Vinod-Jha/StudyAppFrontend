import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import "../styles/Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-brand">
        <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" rx="6" fill="currentColor"/>
          <path d="M10 12C10 10.8954 10.8954 10 12 10H14C15.1046 10 16 10.8954 16 12V20C16 21.1046 15.1046 22 14 22H12C10.8954 22 10 21.1046 10 20V12Z" fill="white"/>
          <path d="M18 14C18 12.8954 18.8954 12 20 12H22C23.1046 12 24 12.8954 24 14V20C24 21.1046 23.1046 22 22 22H20C18.8954 22 18 21.1046 18 20V14Z" fill="white" opacity="0.7"/>
          <circle cx="13" cy="7" r="1.5" fill="white"/>
          <circle cx="21" cy="9" r="1.5" fill="white" opacity="0.7"/>
        </svg>
        <span>StudyFlow</span>
      </Link>
      <div className="navbar-menu">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/subjects">Subjects</Link>
        <Link to="/notes">Notes</Link>
        <Link to="/tracker">Tracker</Link>
        <Link to="/analytics">Analytics</Link>
      </div>
      <div className="navbar-user">
        <button onClick={toggleTheme} className="theme-toggle" title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            {theme === 'light' ? (
              <path d="M8 12a4 4 0 100-8 4 4 0 000 8z" fill="currentColor" opacity="0.3"/>
            ) : (
              <path d="M8 0a8 8 0 108 8c0-4.4-3.6-8-8-8z" fill="currentColor"/>
            )}
          </svg>
        </button>
        <div className="navbar-user-info">
          <div className="navbar-user-avatar">
            {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
          </div>
          <span>{user?.name || user?.email}</span>
        </div>
        <button onClick={handleLogout} className="navbar-logout">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
