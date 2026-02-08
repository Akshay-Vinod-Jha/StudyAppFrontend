import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { SkeletonStatCard } from "../components/SkeletonLoader";
import AnimatedNumber from "../components/AnimatedNumber";
import { analyticsAPI, studyLogsAPI } from "../services/api";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalHours: 0,
    subjectsCount: 0,
    logsCount: 0,
    avgHours: 0,
  });
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const analyticsRes = await analyticsAPI.getOverview(30);
      const logsRes = await studyLogsAPI.getAll(7);

      setStats({
        totalHours: analyticsRes.data.total_hours || 0,
        subjectsCount: analyticsRes.data.subjects_count || 0,
        logsCount: analyticsRes.data.logs_count || 0,
        avgHours: analyticsRes.data.average_per_day || 0,
      });

      setRecentLogs(logsRes.data.logs || []);
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Study metrics and activity overview</p>
        </div>

        <div className="stats-grid">
          {loading ? (
            <>
              <SkeletonStatCard />
              <SkeletonStatCard />
              <SkeletonStatCard />
              <SkeletonStatCard />
            </>
          ) : (
            <>
              <div className="stat-card">
                <span className="stat-badge">HR</span>
                <span className="stat-label">Total Study Hours</span>
                <div className="stat-content">
                  <h3><AnimatedNumber value={stats.totalHours} decimals={1} /></h3>
                  <p>Hours recorded</p>
                </div>
              </div>

              <div className="stat-card">
                <span className="stat-badge">SB</span>
                <span className="stat-label">Active Subjects</span>
                <div className="stat-content">
                  <h3><AnimatedNumber value={stats.subjectsCount} /></h3>
                  <p>Current subjects</p>
                </div>
              </div>

              <div className="stat-card">
                <span className="stat-badge">SS</span>
                <span className="stat-label">Study Sessions</span>
                <div className="stat-content">
                  <h3><AnimatedNumber value={stats.logsCount} /></h3>
                  <p>Total sessions</p>
                </div>
              </div>

              <div className="stat-card">
                <span className="stat-badge">AV</span>
                <span className="stat-label">Daily Average</span>
                <div className="stat-content">
                  <h3><AnimatedNumber value={stats.avgHours} decimals={1} /></h3>
                  <p>Hours per day</p>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="dashboard-content">
          <div className="recent-activity">
            <h2>Recent Activity</h2>
            {recentLogs.length === 0 ? (
              <p className="text-muted">No study sessions recorded</p>
            ) : (
              <div>
                {recentLogs.slice(0, 5).map((log) => (
                  <div key={log._id} className="log-item">
                    <div className="log-info">
                      <span className="log-subject">
                        {log.subject_name || "Study Session"}
                      </span>
                      <span className="log-duration">{log.hours_studied}h</span>
                    </div>
                    <span className="log-date">
                      {new Date(log.date).toLocaleDateString()}
                    </span>
                    {log.notes && <p className="log-notes">{log.notes}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="quick-actions">
            <div className="quick-actions-card">
              <h2>Quick Actions</h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <Link to="/subjects" className="quick-action-btn">
                  <span>Add Subject</span>
                  <span>→</span>
                </Link>
                <Link to="/notes" className="quick-action-btn">
                  <span>Create Note</span>
                  <span>→</span>
                </Link>
                <Link to="/tracker" className="quick-action-btn">
                  <span>Log Study Time</span>
                  <span>→</span>
                </Link>
                <Link to="/analytics" className="quick-action-btn">
                  <span>View Analytics</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
