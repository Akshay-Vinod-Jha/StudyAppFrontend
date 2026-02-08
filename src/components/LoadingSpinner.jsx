import React from 'react';
import '../styles/LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="loading-overlay">
        <div className={`spinner spinner-${size}`}>
          <div className="spinner-circle"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="loading-container">
      <div className={`spinner spinner-${size}`}>
        <div className="spinner-circle"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
