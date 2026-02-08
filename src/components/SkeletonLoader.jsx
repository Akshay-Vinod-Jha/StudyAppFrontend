import React from "react";
import "../styles/SkeletonLoader.css";

export const SkeletonText = ({ width = "100%", height = "1rem" }) => (
  <div className="skeleton skeleton-text" style={{ width, height }}></div>
);

export const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton skeleton-title"></div>
    <div className="skeleton skeleton-line"></div>
    <div className="skeleton skeleton-line" style={{ width: "80%" }}></div>
  </div>
);

export const SkeletonStatCard = () => (
  <div className="skeleton-stat-card">
    <div className="skeleton skeleton-label"></div>
    <div className="skeleton skeleton-number"></div>
    <div className="skeleton skeleton-subtitle"></div>
  </div>
);

export const SkeletonNumber = ({ size = "large" }) => (
  <div className={`skeleton skeleton-number skeleton-number-${size}`}></div>
);
