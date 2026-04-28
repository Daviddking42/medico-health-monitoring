import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import './DoctorDashboard.css';

const DoctorDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="doctor-dashboard">
      <h1>Doctor Dashboard 👨‍⚕️</h1>
      <p>Welcome, Dr. {user?.name}!</p>
      
      <section className="dashboard-section">
        <h2>Patient Monitoring</h2>
        <p>View all assigned patients and their health metrics.</p>
        <div className="feature-list">
          <div className="feature-item">
            <span>📊</span>
            <h3>Patient Lists</h3>
            <p>View all your assigned patients</p>
          </div>
          <div className="feature-item">
            <span>🚨</span>
            <h3>Critical Alerts</h3>
            <p>Receive real-time alerts for abnormal readings</p>
          </div>
          <div className="feature-item">
            <span>📈</span>
            <h3>Health Trends</h3>
            <p>Analyze patient health trends over time</p>
          </div>
          <div className="feature-item">
            <span>🔔</span>
            <h3>Notifications</h3>
            <p>WebSocket-based real-time notifications</p>
          </div>
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Features Coming Soon</h2>
        <ul>
          <li>✅ Patient management system</li>
          <li>✅ Real-time alert management</li>
          <li>✅ Historical data analysis</li>
          <li>✅ Geolocation tracking</li>
          <li>✅ Device alert rules configuration</li>
        </ul>
      </section>
    </div>
  );
};

export default DoctorDashboard;
