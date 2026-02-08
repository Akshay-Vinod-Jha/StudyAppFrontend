import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import AnimatedNumber from '../components/AnimatedNumber';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { analyticsAPI } from '../services/api';
import '../styles/Analytics.css';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [period, setPeriod] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const response = await analyticsAPI.getOverview(period);
      console.log('Analytics API Response:', response.data);
      console.log('by_subject:', response.data?.by_subject);
      console.log('daily_hours:', response.data?.daily_hours);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container">
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div>
        <Navbar />
        <div className="container">
          <h2>No analytics data available</h2>
        </div>
      </div>
    );
  }

  const pieData = {
    labels: analytics.by_subject?.map((s) => s.subject_name) || [],
    datasets: [
      {
        data: analytics.by_subject?.map((s) => s.total_hours) || [],
        backgroundColor: [
          '#3730a3',
          '#0f766e',
          '#059669',
          '#0284c7',
          '#7c3aed',
          '#0891b2',
          '#4338ca',
          '#14b8a6',
        ],
        borderWidth: 1,
        borderColor: '#ffffff',
      },
    ],
  };

  const barData = {
    labels: analytics.daily_hours?.map((d) => new Date(d.date).toLocaleDateString()) || [],
    datasets: [
      {
        label: 'Hours Studied',
        data: analytics.daily_hours?.map((d) => d.total_hours) || [],
        backgroundColor: 'rgba(55, 48, 163, 0.8)',
        borderColor: '#3730a3',
        borderWidth: 0,
        borderRadius: 4,
      },
    ],
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1>Study Analytics</h1>
          <select value={period} onChange={(e) => setPeriod(Number(e.target.value))}>
            <option value={7}>Last 7 Days</option>
            <option value={30}>Last 30 Days</option>
            <option value={90}>Last 90 Days</option>
          </select>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3><AnimatedNumber value={analytics.total_hours || 0} decimals={1} /></h3>
            <p>Total Hours</p>
          </div>
          <div className="stat-card">
            <h3><AnimatedNumber value={analytics.subjects_count || 0} /></h3>
            <p>Subjects</p>
          </div>
          <div className="stat-card">
            <h3><AnimatedNumber value={analytics.logs_count || 0} /></h3>
            <p>Study Sessions</p>
          </div>
          <div className="stat-card">
            <h3><AnimatedNumber value={analytics.average_per_day || 0} decimals={1} /></h3>
            <p>Avg Hours/Day</p>
          </div>
        </div>

        <div className="charts-grid">
          <div className="card chart-card">
            <h2>Study Distribution by Subject</h2>
            {analytics.by_subject?.length > 0 ? (
              <Pie data={pieData} />
            ) : (
              <p className="text-muted">No data available</p>
            )}
          </div>

          <div className="card chart-card">
            <h2>Daily Study Hours</h2>
            {analytics.daily_hours?.length > 0 ? (
              <Bar data={barData} options={{ responsive: true }} />
            ) : (
              <p className="text-muted">No data available</p>
            )}
          </div>
        </div>

        <div className="card">
          <h2>Subject Breakdown</h2>
          {analytics.by_subject?.length > 0 ? (
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Total Hours</th>
                  <th>Sessions</th>
                  <th>Avg per Session</th>
                </tr>
              </thead>
              <tbody>
                {analytics.by_subject.map((subject, index) => (
                  <tr key={index}>
                    <td>{subject.subject_name}</td>
                    <td>{subject.total_hours} hrs</td>
                    <td>{subject.sessions_count}</td>
                    <td>{(subject.total_hours / subject.sessions_count).toFixed(1)} hrs</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-muted">No subject data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
